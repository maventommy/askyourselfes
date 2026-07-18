import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ensureAnonSession } from './lib/supabase';
import { getProfile, type Profile } from './lib/profile';
import Onboarding from './components/Onboarding';
import Reveal from './components/Reveal';
import Chat from './components/Chat';

type Stage = 'loading' | 'onboarding' | 'reveal' | 'chat';

export default function App() {
  const [stage, setStage] = useState<Stage>('loading');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skippedReveal, setSkippedReveal] = useState(false);

  async function refresh(opts?: { skipReveal?: boolean }) {
    if (opts?.skipReveal) setSkippedReveal(true);
    const uid = await ensureAnonSession();
    const p = await getProfile(uid);
    setProfile(p);
    if (!p) setStage('onboarding');
    else if (!p.portrait_url && !(opts?.skipReveal || skippedReveal)) setStage('reveal');
    else setStage('chat');
  }

  useEffect(() => {
    refresh().catch((e) => {
      console.warn('session/profile load failed', e);
      setStage('onboarding');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {stage === 'loading' && (
        <View style={styles.center}><ActivityIndicator color="#c4a878" /></View>
      )}
      {stage === 'onboarding' && <Onboarding onDone={() => refresh()} />}
      {stage === 'reveal' && (
        <Reveal
          futureAge={profile?.future_age ?? null}
          onDone={() => refresh({ skipReveal: true })}
        />
      )}
      {stage === 'chat' && <Chat futureAge={profile?.future_age ?? null} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0c0a' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
