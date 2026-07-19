import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import AgeSlider from './AgeSlider';
import { ensureAnonSession } from '../lib/supabase';
import { saveProfile } from '../lib/profile';

type QuestionStep = {
  kind: 'question';
  key: 'name' | 'age' | 'proud' | 'worried' | 'decision';
  q: string;
  placeholder: string;
  keyboard?: 'number-pad';
  multiline?: boolean;
};
type SliderStep = { kind: 'slider'; q: string };
type ToneStep = { kind: 'tone'; q: string };
type Step = QuestionStep | SliderStep | ToneStep;

const STEPS: Step[] = [
  { kind: 'question', key: 'name', q: 'What should your future self call you?', placeholder: 'Your name' },
  { kind: 'question', key: 'age', q: 'How old are you right now?', placeholder: 'Your age', keyboard: 'number-pad' },
  { kind: 'question', key: 'proud', q: 'When were you proud of how you behaved?', placeholder: 'Share what comes to mind…', multiline: true },
  { kind: 'question', key: 'worried', q: 'What are you carrying right now?', placeholder: 'Share what comes to mind…', multiline: true },
  { kind: 'question', key: 'decision', q: 'What is a decision you are weighing?', placeholder: 'Share what comes to mind…', multiline: true },
  { kind: 'slider', q: 'Choose your future.' },
  { kind: 'tone', q: 'How do you want this to feel?' },
];

const TONES = ['gentle', 'blunt', 'playful'] as const;

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [futureAge, setFutureAge] = useState(0); // 0 = not touched yet; defaulted when slider step opens
  const [tone, setTone] = useState<(typeof TONES)[number]>('gentle');
  const [busy, setBusy] = useState(false);

  const current = STEPS[step];
  const last = step === STEPS.length - 1;
  const progress = step / (STEPS.length - 1);
  const currentAge = parseInt(answers.age ?? '', 10) || 25;
  // locked spec: 5-year increments, 30-80, never at or below current age
  const sliderMin = Math.max(30, Math.ceil((currentAge + 1) / 5) * 5);
  const sliderMax = 80;
  const defaultAge = Math.min(sliderMax, Math.max(sliderMin, Math.round((currentAge + 30) / 5) * 5));
  const sliderValue = futureAge || defaultAge;

  function set(key: string, v: string) {
    setAnswers((a) => ({ ...a, [key]: v }));
  }

  function next() {
    if (!last) setStep(step + 1);
    else void submit();
  }

  async function submit() {
    setBusy(true);
    try {
      const uid = await ensureAnonSession();
      await saveProfile({
        user_id: uid,
        display_name: (answers.name ?? '').trim() || 'friend',
        current_age: currentAge,
        future_age: sliderValue,
        profile_json: {
          proud_of: answers.proud ?? '',
          worried_about: answers.worried ?? '',
          decision: answers.decision ?? '',
          tone,
        },
      });
      onDone();
    } catch (e) {
      console.warn('onboarding save failed', e);
      setBusy(false);
    }
  }

  return (
    <ScrollView style={s.bg} contentContainerStyle={s.wrap}>
      <Text style={s.eyebrow}>ASK YOURSELVES</Text>
      <Text style={s.h1}>{current.q}</Text>

      {current.kind === 'question' && (
        <TextInput
          style={[s.input, current.multiline && s.multi]}
          placeholder={current.placeholder}
          placeholderTextColor="#998b73"
          value={answers[current.key] ?? ''}
          onChangeText={(v) => set(current.key, v)}
          keyboardType={current.keyboard ?? 'default'}
          multiline={current.multiline}
          autoFocus
        />
      )}

      {current.kind === 'slider' && (
        <View style={s.sliderWrap}>
          <Text style={s.futureAge}>{sliderValue}</Text>
          <Text style={s.futureAgeLabel}>YEARS OLD · {sliderValue - currentAge} YEARS FROM NOW</Text>
          <AgeSlider min={sliderMin} max={sliderMax} step={5} value={sliderValue} onChange={setFutureAge} />
          <View style={s.sliderEnds}>
            <Text style={s.sliderEnd}>{sliderMin}</Text>
            <Text style={s.sliderEnd}>{sliderMax}</Text>
          </View>
          <Text style={s.baseline}>you are {currentAge} today</Text>
        </View>
      )}

      {current.kind === 'tone' && (
        <View style={s.toneRow}>
          {TONES.map((t) => (
            <Pressable key={t} style={[s.tone, tone === t && s.toneOn]} onPress={() => setTone(t)}>
              <Text style={[s.toneText, tone === t && s.toneTextOn]}>{t.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={s.formingWrap}>
        <View style={s.track}>
          <View style={[s.fill, { width: `${Math.max(6, progress * 100)}%` }]} />
        </View>
        <Text style={s.formingLabel}>
          {last ? 'Your future self is ready.' : 'Your future self is forming…'}
        </Text>
      </View>

      <Pressable style={[s.btn, busy && s.btnDim]} disabled={busy} onPress={next}>
        <Text style={s.btnText}>
          {busy ? 'One moment…' : last ? 'Meet your future self' : 'Continue'}
        </Text>
      </Pressable>

      {step > 0 && !busy && (
        <Pressable onPress={() => setStep(step - 1)}>
          <Text style={s.back}>‹ Back</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0d0c0a' },
  wrap: { padding: 24, paddingTop: 96, gap: 14, flexGrow: 1 },
  eyebrow: { color: '#c4a878', fontSize: 12, letterSpacing: 3, marginBottom: 4 },
  h1: { color: '#f4ede0', fontSize: 32, fontWeight: '500', fontFamily: 'Georgia', lineHeight: 40, marginBottom: 10 },
  input: { backgroundColor: '#181612', borderColor: '#3a342b', borderWidth: 1, borderRadius: 10, padding: 14, color: '#f4ede0', fontSize: 15 },
  multi: { minHeight: 130, textAlignVertical: 'top' },
  sliderWrap: { alignItems: 'center', paddingVertical: 12, gap: 6 },
  futureAge: { color: '#f4ede0', fontSize: 72, fontFamily: 'Georgia' },
  futureAgeLabel: { color: '#998b73', fontSize: 12, letterSpacing: 2, marginBottom: 10 },
  slider: { width: '100%', height: 40 },
  sliderEnds: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  sliderEnd: { color: '#998b73', fontSize: 13 },
  baseline: { color: '#c4a878', fontSize: 12, letterSpacing: 1, marginTop: 6, fontStyle: 'italic' },
  toneRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  tone: { flex: 1, borderWidth: 1, borderColor: '#3a342b', borderRadius: 10, paddingVertical: 16, alignItems: 'center', backgroundColor: '#181612' },
  toneOn: { borderColor: '#c4a878', backgroundColor: '#1f1b14' },
  toneText: { color: '#998b73', fontSize: 13, letterSpacing: 2 },
  toneTextOn: { color: '#c4a878' },
  formingWrap: { marginTop: 'auto', gap: 8, paddingTop: 18 },
  track: { height: 3, backgroundColor: '#3a342b', borderRadius: 2, overflow: 'hidden' },
  fill: { height: 3, backgroundColor: '#c4a878', borderRadius: 2 },
  formingLabel: { color: '#998b73', fontSize: 13, fontStyle: 'italic' },
  btn: { backgroundColor: '#c4a878', borderRadius: 10, padding: 16, marginTop: 4 },
  btnDim: { opacity: 0.5 },
  btnText: { color: '#0d0c0a', textAlign: 'center', fontWeight: '700', fontSize: 16 },
  back: { color: '#998b73', fontSize: 14, textAlign: 'center', padding: 10 },
});
