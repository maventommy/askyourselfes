import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function err(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return err('method not allowed', 405);

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return err('unauthorized', 401);

  const { text } = await req.json().catch(() => ({ text: '' }));
  if (!text || typeof text !== 'string') return err('bad request', 400);
  // OpenAI TTS accepts up to 4096 chars; truncate rather than reject so replies always speak
  const input = text.length > 4000 ? text.slice(0, 4000) : text;

  const supa = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return err('unauthorized', 401);

  const ai = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice: 'onyx',
      input,
      speed: 0.95,
      instructions: 'A calm older voice, warm and plainspoken, talking to their younger self.',
    }),
  });
  if (!ai.ok) {
    console.error('tts error', ai.status, await ai.text());
    return err('tts error', 502);
  }

  return new Response(ai.body, {
    headers: { ...corsHeaders, 'Content-Type': 'audio/mpeg' },
  });
});
