import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ensureAnonSession } from '../lib/supabase';
import { loadHistory, sendMessage, type Msg } from '../lib/chat';

export default function Chat({ futureAge }: { futureAge: number | null }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<FlatList<Msg>>(null);

  useEffect(() => {
    (async () => {
      const uid = await ensureAnonSession();
      setMsgs(await loadHistory(uid));
    })();
  }, []);

  async function send() {
    const t = text.trim();
    if (!t || busy) return;
    setText('');
    setBusy(true);
    setMsgs((m) => [...m, { role: 'user', content: t }]);
    try {
      const reply = await sendMessage(t);
      setMsgs((m) => [...m, { role: 'future_self', content: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: 'future_self', content: '(I lost my train of thought — try again.)' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={s.bg} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.header}>
        <Text style={s.headerTitle}>You{futureAge ? `, age ${futureAge}` : ''}</Text>
      </View>
      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={s.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={<Text style={s.empty}>Ask yourself anything. It already knows you.</Text>}
        renderItem={({ item }) => (
          <View style={[s.bubble, item.role === 'user' ? s.user : s.future]}>
            <Text style={item.role === 'user' ? s.userText : s.futureText}>{item.content}</Text>
          </View>
        )}
      />
      <View style={s.inputRow}>
        <TextInput style={s.input} value={text} onChangeText={setText} placeholder="Ask yourself…" placeholderTextColor="#998b73" />
        <Pressable style={[s.send, busy && s.dim]} onPress={send} disabled={busy}>
          <Text style={s.sendText}>{busy ? '…' : 'Send'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0d0c0a' },
  header: { paddingTop: 56, paddingBottom: 14, alignItems: 'center', borderBottomColor: '#231f18', borderBottomWidth: 1 },
  headerTitle: { color: '#f4ede0', fontFamily: 'Georgia', fontSize: 18 },
  list: { padding: 16, gap: 10 },
  empty: { color: '#998b73', textAlign: 'center', marginTop: 48, fontStyle: 'italic' },
  bubble: { padding: 12, borderRadius: 16, maxWidth: '82%' },
  user: { alignSelf: 'flex-end', backgroundColor: '#c4a878' },
  future: { alignSelf: 'flex-start', backgroundColor: '#181612' },
  userText: { color: '#0d0c0a', fontSize: 15, lineHeight: 21 },
  futureText: { color: '#f4ede0', fontSize: 15, lineHeight: 21 },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: '#0d0c0a' },
  input: { flex: 1, backgroundColor: '#181612', borderColor: '#3a342b', borderWidth: 1, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, color: '#f4ede0' },
  send: { backgroundColor: '#c4a878', borderRadius: 22, paddingHorizontal: 18, justifyContent: 'center' },
  dim: { opacity: 0.5 },
  sendText: { color: '#0d0c0a', fontWeight: '700' },
});
