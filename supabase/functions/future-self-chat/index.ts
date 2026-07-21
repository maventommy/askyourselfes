import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildSystemPrompt } from './prompt.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return new Response('Unauthorized', { status: 401, headers: corsHeaders });

  const { message } = await req.json().catch(() => ({ message: '' }));
  if (!message || typeof message !== 'string') return new Response('Bad request', { status: 400, headers: corsHeaders });

  // user-scoped client → RLS enforces "own rows only"
  const supa = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401, headers: corsHeaders });

  const { data: profile } = await supa.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
  // most recent turns, then flipped back to chronological order for the model
  const { data: recent } = await supa
    .from('messages')
    .select('role, content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(24);
  const history = (recent ?? []).reverse();

  const messages = [
    {
      role: 'system',
      content: buildSystemPrompt(
        profile ?? { display_name: null, current_age: null, future_age: null, profile_json: {} },
      ),
    },
    ...(history ?? []).map((m: { role: string; content: string }) => ({
      role: m.role === 'future_self' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: message },
  ];

  const ai = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
    },
    // gpt-5.6-luna rejects custom temperature (only default 1 supported) — verified 2026-07-19
    body: JSON.stringify({ model: 'gpt-5.6-luna', messages, max_completion_tokens: 600 }),
  });
  if (!ai.ok) {
    console.error('OpenAI error', ai.status, await ai.text());
    return new Response('LLM error', { status: 502, headers: corsHeaders });
  }
  // `|| fallback`, not `??`: the model can return an empty string, which is not nullish
  const reply = ((await ai.json()).choices?.[0]?.message?.content ?? '').trim()
    || '(I went quiet for a moment. Ask me again.)';

  await supa.from('messages').insert([
    { user_id: user.id, role: 'user', content: message },
    { user_id: user.id, role: 'future_self', content: reply },
  ]);

  return new Response(JSON.stringify({ reply }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
