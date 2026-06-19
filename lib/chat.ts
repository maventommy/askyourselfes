import { supabase } from './supabase';

export type Msg = { role: 'user' | 'future_self'; content: string };

export async function loadHistory(userId: string): Promise<Msg[]> {
  const { data } = await supabase
    .from('messages')
    .select('role, content')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  return (data as Msg[]) ?? [];
}

/** Sends a message to the future-self Edge Function and returns its reply. */
export async function sendMessage(text: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('future-self-chat', {
    body: { message: text },
  });
  if (error) throw error;
  return (data as { reply: string }).reply;
}
