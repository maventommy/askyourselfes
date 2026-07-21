// transcribe: audio in (base64), text out. Uses OpenAI transcription.
// OPENAI_API_KEY is a project-level Supabase secret shared by all functions.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return new Response('Unauthorized', { status: 401, headers: corsHeaders });

  const { audio_b64, mime } = await req.json().catch(() => ({ audio_b64: '' }));
  if (!audio_b64 || typeof audio_b64 !== 'string') {
    return new Response('Bad request', { status: 400, headers: corsHeaders });
  }

  // base64 -> bytes
  const binary = atob(audio_b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const type = (typeof mime === 'string' && mime) || 'audio/webm';
  const ext = type.includes('mp4') ? 'mp4' : type.includes('wav') ? 'wav' : type.includes('mpeg') ? 'mp3' : 'webm';

  const form = new FormData();
  form.append('file', new Blob([bytes], { type }), `audio.${ext}`);
  form.append('model', 'gpt-4o-transcribe');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}` },
    body: form,
  });
  if (!res.ok) {
    console.error('transcription error', res.status, await res.text());
    return new Response('Transcription failed', { status: 502, headers: corsHeaders });
  }
  const data = await res.json();
  const text = (data.text ?? '').trim();

  return new Response(JSON.stringify({ text }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
