import { supabase } from './supabase';

export type Profile = {
  user_id: string;
  display_name: string | null;
  current_age: number | null;
  future_age: number | null;
  portrait_url?: string | null;
  profile_json: Record<string, string>;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return (data as Profile) ?? null;
}

export async function saveProfile(p: {
  user_id: string;
  display_name: string;
  current_age: number;
  future_age: number;
  profile_json: Record<string, string>;
}): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .upsert({ ...p, updated_at: new Date().toISOString() });
  if (error) throw error;
}
