import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildSystemPrompt } from './prompt.ts';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return new Response('Unauthorized', { status: 401 });

  const { message } = await req.json().catch(() => ({ message: '' }));
  if (!message || typeof message !== 'string') return new Response('Bad request', { status: 400 });

  // user-scoped client → RLS enforces "own rows only"
  const supa = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { data: profile } = await supa.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
  const { data: history } = await supa
    .from('messages')
    .select('role, content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(12);

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
    body: JSON.stringify({ model: 'gpt-4.1-mini', messages, max_tokens: 300, temperature: 0.8 }),
  });
  if (!ai.ok) return new Response('LLM error', { status: 502 });
  const reply = (await ai.json()).choices?.[0]?.message?.content?.trim() ?? '...';

  await supa.from('messages').insert([
    { user_id: user.id, role: 'user', content: message },
    { user_id: user.id, role: 'future_self', content: reply },
  ]);

  return new Response(JSON.stringify({ reply }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
