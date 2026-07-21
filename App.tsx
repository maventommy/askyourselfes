import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ensureAnonSession } from './lib/supabase';
import { getProfile, updateTone, type Profile } from './lib/profile';
import Onboarding from './components/Onboarding';
import Reveal from './components/Reveal';
import MoodPick from './components/MoodPick';
import Chat from './components/Chat';

type Stage = 'loading' | 'onboarding' | 'reveal' | 'mood' | 'chat';
type Tone = 'gentle' | 'blunt' | 'playful';

const asTone = (v: unknown): Tone => (v === 'blunt' || v === 'playful' ? v : 'gentle');

export default function App() {
  const [stage, setStage] = useState<Stage>('loading');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [sessionTone, setSessionTone] = useState<Tone>('gentle');
  const [skippedReveal, setSkippedReveal] = useState(false);

  // fresh = arriving from onboarding/reveal (tone just set); skip the mood step.
  async function refresh(opts?: { skipReveal?: boolean; fresh?: boolean }) {
    if (opts?.skipReveal) setSkippedReveal(true);
    const id = await ensureAnonSession();
    setUid(id);
    const p = await getProfile(id);
    setProfile(p);
    if (!p) { setStage('onboarding'); return; }
    if (!p.portrait_url && !(opts?.skipReveal || skippedReveal)) { setStage('reveal'); return; }
    setSessionTone(asTone(p.profile_json?.tone));
    // Returning user (app just opened) picks their mood; fresh users go straight in.
    setStage(opts?.fresh ? 'chat' : 'mood');
  }

  useEffect(() => {
    refresh().catch((e) => {
      console.warn('session/profile load failed', e);
      setStage('onboarding');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onMood(tone: Tone) {
    setSessionTone(tone);
    setStage('chat');
    if (uid) {
      updateTone(uid, profile?.profile_json ?? {}, tone).catch((e) =>
        console.warn('tone save failed', e),
      );
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {stage === 'loading' && (
        <View style={styles.center}><ActivityIndicator color="#c4a878" /></View>
      )}
      {stage === 'onboarding' && <Onboarding onDone={() => refresh({ fresh: true })} />}
      {stage === 'reveal' && (
        <Reveal
          futureAge={profile?.future_age ?? null}
          onDone={() => refresh({ skipReveal: true, fresh: true })}
        />
      )}
      {stage === 'mood' && (
        <MoodPick
          current={sessionTone}
          displayName={profile?.display_name ?? null}
          onDone={onMood}
        />
      )}
      {stage === 'chat' && (
        <Chat
          futureAge={profile?.future_age ?? null}
          currentAge={profile?.current_age ?? null}
          displayName={profile?.display_name ?? null}
          portraitUrl={profile?.portrait_url ?? null}
          tone={sessionTone}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0c0a' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
