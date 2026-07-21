import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const TONES = ['gentle', 'blunt', 'playful'] as const;
type Tone = (typeof TONES)[number];

/** Shown to returning users on each open: the mood they want this session.
 *  Memory does not change; only how the future self talks this time. */
export default function MoodPick({
  current,
  displayName,
  onDone,
}: {
  current: Tone;
  displayName: string | null;
  onDone: (tone: Tone) => void;
}) {
  const [tone, setTone] = useState<Tone>(current);

  return (
    <View style={s.bg}>
      <Text style={s.eyebrow}>ASK YOURSELVES</Text>
      <View style={s.spacer} />
      <Text style={s.h1}>{displayName ? `Welcome back, ${displayName}.` : 'Welcome back.'}</Text>
      <Text style={s.sub}>How do you want your future self to talk to you today?</Text>
      <View style={s.toneRow}>
        {TONES.map((t) => (
          <Pressable key={t} style={[s.tone, tone === t && s.toneOn]} onPress={() => setTone(t)}>
            <Text style={[s.toneText, tone === t && s.toneTextOn]}>{t.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      <View style={s.spacer} />
      <Pressable style={s.btn} onPress={() => onDone(tone)}>
        <Text style={s.btnText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0d0c0a', padding: 24, paddingTop: 96 },
  eyebrow: { color: '#c4a878', fontSize: 12, letterSpacing: 3 },
  h1: { color: '#f4ede0', fontSize: 32, fontWeight: '500', fontFamily: 'Georgia', lineHeight: 40 },
  sub: { color: '#998b73', fontSize: 15, marginTop: 12, lineHeight: 21 },
  toneRow: { flexDirection: 'row', gap: 10, marginTop: 28 },
  tone: { flex: 1, borderWidth: 1, borderColor: '#3a342b', borderRadius: 10, paddingVertical: 16, alignItems: 'center', backgroundColor: '#181612' },
  toneOn: { borderColor: '#c4a878', backgroundColor: '#1f1b14' },
  toneText: { color: '#998b73', fontSize: 13, letterSpacing: 2 },
  toneTextOn: { color: '#c4a878' },
  spacer: { flex: 1 },
  btn: { backgroundColor: '#c4a878', borderRadius: 10, padding: 16 },
  btnText: { color: '#0d0c0a', textAlign: 'center', fontWeight: '700', fontSize: 16 },
});
