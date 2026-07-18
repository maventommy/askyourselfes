import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { decodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts';
import { buildAgingPrompt } from './prompt.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'unauthorized' }, 401);

  const { selfie_b64 } = await req.json().catch(() => ({ selfie_b64: '' }));
  if (!selfie_b64 || typeof selfie_b64 !== 'string') return json({ error: 'bad request' }, 400);
  if (selfie_b64.length > 8_000_000) return json({ error: 'image too large' }, 413);

  const supa = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return json({ error: 'unauthorized' }, 401);

  const { data: profile } = await supa
    .from('profiles')
    .select('future_age, portrait_url')
    .eq('user_id', user.id)
    .maybeSingle();

  // one portrait per user: free-tier spec + hard cost guard
  if (profile?.portrait_url) return json({ portrait_url: profile.portrait_url });

  const form = new FormData();
  form.append('model', 'gpt-image-2');
  form.append('prompt', buildAgingPrompt(profile?.future_age ?? 55));
  form.append('size', '1024x1536');
  form.append('quality', 'medium');
  form.append('image', new Blob([decodeBase64(selfie_b64)], { type: 'image/png' }), 'selfie.png');

  const ai = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}` },
    body: form,
  });
  if (!ai.ok) {
    console.error('images/edits error', ai.status, await ai.text());
    return json({ error: 'image error' }, 502);
  }
  const png = decodeBase64((await ai.json()).data?.[0]?.b64_json ?? '');
  if (!png.length) return json({ error: 'empty image' }, 502);

  // service client for storage write (bucket insert policy also allows the user's own folder,
  // but the service key avoids multipart/global-header friction)
  const service = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const path = `${user.id}/aged.png`;
  const { error: upErr } = await service.storage
    .from('portraits')
    .upload(path, png, { contentType: 'image/png', upsert: true });
  if (upErr) {
    console.error('storage upload error', upErr.message);
    return json({ error: 'storage error' }, 502);
  }

  const portrait_url = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/portraits/${path}`;
  const { error: updErr } = await supa
    .from('profiles')
    .update({ portrait_url })
    .eq('user_id', user.id);
  if (updErr) {
    console.error('profile update error', updErr.message);
    return json({ error: 'profile error' }, 502);
  }

  return json({ portrait_url });
});
