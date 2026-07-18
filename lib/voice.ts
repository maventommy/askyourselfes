import { Platform } from 'react-native';
import { supabase } from './supabase';

/** Web-only for now: fetch TTS audio for a reply and play it.
 *  Native playback (expo-audio) is a post-Build-Week follow-up. */
export const voiceSupported = Platform.OS === 'web';

export async function speak(text: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('no session');
  const url = `${(process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').trim()}/functions/v1/speak`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`tts failed (${res.status})`);
  const blob = await res.blob();
  const audio = new Audio(URL.createObjectURL(blob));
  await audio.play();
}
