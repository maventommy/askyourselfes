import { useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';

type Phase = 'pick' | 'working' | 'reveal' | 'error';

export default function Reveal({ futureAge, onDone }: { futureAge: number | null; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('pick');
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);

  async function startAging(selfieBase64: string) {
    setPhase('working');
    try {
      const { data, error } = await supabase.functions.invoke('age-portrait', {
        body: { selfie_b64: selfieBase64 },
      });
      if (error || !data?.portrait_url) throw error ?? new Error('no portrait');
      setPortraitUrl(data.portrait_url as string);
      setPhase('reveal');
    } catch (e) {
      console.warn('age-portrait failed', e);
      setPhase('error');
    }
  }

  // Native: expo-image-picker.
  async function pickNative() {
    const res = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });
    if (res.canceled || !res.assets?.[0]?.base64) return;
    startAging(res.assets[0].base64);
  }

  // Web / installed PWA: click a real file input SYNCHRONOUSLY within the tap so
  // standalone PWAs do not reject it for losing user activation (the bug where
  // the selfie works in-browser but not in the home-screen app view).
  function pickWeb(useCamera: boolean) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    // capture="user" asks for the front camera directly; without it, installed
    // PWAs on Android often show only the file browser (no camera option).
    if (useCamera) input.setAttribute('capture', 'user');
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const b64 = String(reader.result).split(',')[1] ?? '';
        if (b64) startAging(b64);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  const takeSelfie = Platform.OS === 'web' ? () => pickWeb(true) : pickNative;
  const uploadPhoto = Platform.OS === 'web' ? () => pickWeb(false) : pickNative;
  const pickAndAge = uploadPhoto; // used by the error-phase "Try another photo"

  return (
    <View style={s.bg}>
      <Text style={s.eyebrow}>ASK YOURSELVES</Text>

      {phase === 'pick' && (
        <>
          <Text style={s.h1}>One photo.{'\n'}{futureAge ? `${futureAge} years old.` : 'Thirty years.'}</Text>
          <Text style={s.sub}>Add a selfie and meet the you who already lived it.</Text>
          <View style={s.spacer} />
          {Platform.OS === 'web' ? (
            <>
              <Pressable style={s.btn} onPress={takeSelfie}>
                <Text style={s.btnText}>Take a selfie</Text>
              </Pressable>
              <Pressable onPress={uploadPhoto}>
                <Text style={s.skip}>Upload a photo</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={s.btn} onPress={pickAndAge}>
              <Text style={s.btnText}>Add a selfie</Text>
            </Pressable>
          )}
          <Pressable onPress={onDone}>
            <Text style={s.skip}>Not now</Text>
          </Pressable>
        </>
      )}

      {phase === 'working' && (
        <View style={s.center}>
          <ActivityIndicator color="#c4a878" size="large" />
          <Text style={s.working}>Finding you in the years ahead…</Text>
        </View>
      )}

      {phase === 'reveal' && portraitUrl && (
        <>
          <View style={s.portraitFrame}>
            <Image source={{ uri: portraitUrl }} style={s.portrait} resizeMode="cover" />
          </View>
          <Text style={s.h1}>Meet the you who{'\n'}already lived it.</Text>
          <View style={s.spacer} />
          <Pressable style={s.btn} onPress={onDone}>
            <Text style={s.btnText}>Say hello</Text>
          </Pressable>
        </>
      )}

      {phase === 'error' && (
        <>
          <Text style={s.h1}>The years would not come into focus.</Text>
          <Text style={s.sub}>Try another photo, or come back to this later.</Text>
          <View style={s.spacer} />
          <Pressable style={s.btn} onPress={pickAndAge}>
            <Text style={s.btnText}>Try another photo</Text>
          </Pressable>
          <Pressable onPress={onDone}>
            <Text style={s.skip}>Not now</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0d0c0a', padding: 24, paddingTop: 96 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 },
  eyebrow: { color: '#c4a878', fontSize: 12, letterSpacing: 3, marginBottom: 14 },
  h1: { color: '#f4ede0', fontSize: 32, fontWeight: '500', fontFamily: 'Georgia', lineHeight: 40 },
  sub: { color: '#998b73', fontSize: 15, marginTop: 12, lineHeight: 21 },
  working: { color: '#998b73', fontSize: 15, fontStyle: 'italic' },
  portraitFrame: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 260,
    borderWidth: 1,
    borderColor: '#c4a878',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 22,
    shadowColor: '#c4a878',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  portrait: { width: '100%', aspectRatio: 2 / 3, backgroundColor: '#181612' },
  spacer: { flex: 1 },
  btn: { backgroundColor: '#c4a878', borderRadius: 10, padding: 16 },
  btnText: { color: '#0d0c0a', textAlign: 'center', fontWeight: '700', fontSize: 16 },
  skip: { color: '#998b73', fontSize: 14, textAlign: 'center', padding: 14 },
});
