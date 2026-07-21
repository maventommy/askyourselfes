import { Platform } from 'react-native';
import { supabase } from './supabase';

/** Web-only for now: fetch TTS audio for a reply and play it.
 *  Native playback (expo-audio) is a post-Build-Week follow-up. */
export const voiceSupported = Platform.OS === 'web';

/** Web-only for now: mic capture + transcription. Native (expo-audio) is a follow-up. */
export const micSupported =
  Platform.OS === 'web' &&
  typeof navigator !== 'undefined' &&
  !!navigator.mediaDevices?.getUserMedia &&
  typeof MediaRecorder !== 'undefined';

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => resolve(String(r.result).split(',')[1] ?? '');
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

export async function transcribe(blob: Blob): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('no session');
  const audio_b64 = await blobToBase64(blob);
  const url = `${(process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').trim()}/functions/v1/transcribe`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ audio_b64, mime: blob.type }),
  });
  if (!res.ok) throw new Error(`transcribe failed (${res.status})`);
  return ((await res.json()).text ?? '').trim();
}

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
