import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ensureAnonSession } from './lib/supabase';
import { getProfile, type Profile } from './lib/profile';
import Onboarding from './components/Onboarding';
import Chat from './components/Chat';

type Stage = 'loading' | 'onboarding' | 'chat';

export default function App() {
  const [stage, setStage] = useState<Stage>('loading');
  const [profile, setProfile] = useState<Profile | null>(null);

  async function refresh() {
    const uid = await ensureAnonSession();
    const p = await getProfile(uid);
    setProfile(p);
    setStage(p ? 'chat' : 'onboarding');
  }

  useEffect(() => {
    refresh().catch((e) => {
      console.warn('session/profile load failed', e);
      setStage('onboarding');
    });
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {stage === 'loading' && (
        <View style={styles.center}><ActivityIndicator color="#c4a878" /></View>
      )}
      {stage === 'onboarding' && <Onboarding onDone={refresh} />}
      {stage === 'chat' && <Chat futureAge={profile?.future_age ?? null} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0c0a' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
