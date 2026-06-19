import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { ensureAnonSession } from '../lib/supabase';
import { saveProfile } from '../lib/profile';

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [proud, setProud] = useState('');
  const [worried, setWorried] = useState('');
  const [decision, setDecision] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      const uid = await ensureAnonSession();
      const a = parseInt(age, 10) || 25;
      await saveProfile({
        user_id: uid,
        display_name: name.trim() || 'friend',
        current_age: a,
        future_age: a + 30,
        profile_json: { proud_of: proud, worried_about: worried, decision },
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
      <Text style={s.h1}>Before we begin</Text>
      <Text style={s.sub}>A few things, so the conversation is actually yours.</Text>

      <TextInput style={s.input} placeholder="Your name" placeholderTextColor="#998b73" value={name} onChangeText={setName} />
      <TextInput style={s.input} placeholder="Your age" placeholderTextColor="#998b73" value={age} onChangeText={setAge} keyboardType="number-pad" />
      <TextInput style={[s.input, s.multi]} placeholder="A time you were proud of how you behaved" placeholderTextColor="#998b73" value={proud} onChangeText={setProud} multiline />
      <TextInput style={[s.input, s.multi]} placeholder="Something you're carrying right now" placeholderTextColor="#998b73" value={worried} onChangeText={setWorried} multiline />
      <TextInput style={[s.input, s.multi]} placeholder="A decision you're weighing" placeholderTextColor="#998b73" value={decision} onChangeText={setDecision} multiline />

      <Pressable style={[s.btn, busy && s.btnDim]} disabled={busy} onPress={submit}>
        <Text style={s.btnText}>{busy ? 'One moment…' : 'Meet your future self'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0d0c0a' },
  wrap: { padding: 24, paddingTop: 72, gap: 14 },
  eyebrow: { color: '#c4a878', fontSize: 12, letterSpacing: 3, marginBottom: 4 },
  h1: { color: '#f4ede0', fontSize: 30, fontWeight: '500', fontFamily: 'Georgia' },
  sub: { color: '#998b73', fontSize: 15, marginBottom: 12, lineHeight: 21 },
  input: { backgroundColor: '#181612', borderColor: '#3a342b', borderWidth: 1, borderRadius: 10, padding: 14, color: '#f4ede0', fontSize: 15 },
  multi: { minHeight: 72, textAlignVertical: 'top' },
  btn: { backgroundColor: '#c4a878', borderRadius: 10, padding: 16, marginTop: 10 },
  btnDim: { opacity: 0.5 },
  btnText: { color: '#0d0c0a', textAlign: 'center', fontWeight: '700', fontSize: 16 },
});
