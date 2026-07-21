import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ensureAnonSession } from '../lib/supabase';
import { loadHistory, sendMessage, type Msg } from '../lib/chat';
import { speak, transcribe, voiceSupported, micSupported } from '../lib/voice';

type ChatProps = {
  futureAge: number | null;
  currentAge?: number | null;
  displayName?: string | null;
  portraitUrl?: string | null;
};

export default function Chat({ futureAge, currentAge, displayName, portraitUrl }: ChatProps) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const [autoplay, setAutoplay] = useState(() => {
    try { return Platform.OS === 'web' && localStorage.getItem('ay_autoplay') === '1'; } catch { return false; }
  });
  const listRef = useRef<FlatList<Msg>>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  function toggleAutoplay() {
    setAutoplay((v) => {
      const next = !v;
      try { if (Platform.OS === 'web') localStorage.setItem('ay_autoplay', next ? '1' : '0'); } catch {}
      return next;
    });
  }

  async function toggleMic() {
    if (transcribing) return;
    if (recording) { recRef.current?.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
        if (!blob.size) return;
        setTranscribing(true);
        try {
          const t = await transcribe(blob);
          if (t) setText((prev) => (prev ? `${prev} ${t}` : t));
        } catch (e) {
          console.warn('transcribe failed', e);
        } finally {
          setTranscribing(false);
        }
      };
      recRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (e) {
      console.warn('mic failed', e);
    }
  }

  async function hear(index: number, content: string) {
    if (speaking !== null) return;
    setSpeaking(index);
    try {
      await speak(content);
    } catch (e) {
      console.warn('speak failed', e);
    } finally {
      setSpeaking(null);
    }
  }

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
      if (autoplay && voiceSupported && !reply.startsWith('(')) hear(msgs.length + 1, reply);
    } catch {
      setMsgs((m) => [...m, { role: 'future_self', content: '(I lost my train of thought. Try again.)' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={s.bg} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.header}>
        {portraitUrl ? <Image source={{ uri: portraitUrl }} style={s.headerPortrait} /> : null}
        <Text style={s.headerTitle}>You{futureAge ? `, age ${futureAge}` : ''}</Text>
        {voiceSupported && (
          <Pressable onPress={toggleAutoplay} style={s.autoBtn} hitSlop={8}>
            <Text style={s.autoText}>{autoplay ? '◆ Autoplay on' : '◇ Autoplay off'}</Text>
          </Pressable>
        )}
      </View>
      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={s.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View>
            <View style={[s.bubble, s.future]}>
              <Text style={s.futureText}>
                {`Hey${displayName ? ` ${displayName}` : ''}. It's me. Well, you. ${futureAge && currentAge ? futureAge - currentAge : 'Thirty'} years on. I remember being where you're sitting. Ask what you actually want to know.`}
              </Text>
            </View>
            <Text style={s.empty}>It already knows you. You built it.</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={[s.bubble, item.role === 'user' ? s.user : s.future]}>
            <Text style={item.role === 'user' ? s.userText : s.futureText}>{item.content}</Text>
            {item.role === 'future_self' && voiceSupported && !item.content.startsWith('(') && (
              <Pressable style={s.hear} onPress={() => hear(index, item.content)} disabled={speaking !== null}>
                <Text style={s.hearText}>{speaking === index ? '◈ speaking…' : '◇ hear it'}</Text>
              </Pressable>
            )}
          </View>
        )}
      />
      <View style={s.inputRow}>
        {micSupported && (
          <Pressable style={[s.mic, recording && s.micRec]} onPress={toggleMic} disabled={transcribing}>
            <Text style={s.micText}>{transcribing ? '…' : recording ? '◉ stop' : '🎤'}</Text>
          </Pressable>
        )}
        <TextInput style={s.input} value={text} onChangeText={setText} placeholder={recording ? 'Listening…' : 'Ask yourself…'} placeholderTextColor="#998b73" />
        <Pressable style={[s.send, busy && s.dim]} onPress={send} disabled={busy}>
          <Text style={s.sendText}>{busy ? '…' : 'Send'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0d0c0a' },
  header: { paddingTop: 52, paddingBottom: 12, alignItems: 'center', borderBottomColor: '#231f18', borderBottomWidth: 1, gap: 8 },
  headerPortrait: { width: 144, height: 144, borderRadius: 72, borderWidth: 1, borderColor: '#c4a878' },
  headerTitle: { color: '#f4ede0', fontFamily: 'Georgia', fontSize: 18 },
  autoBtn: { marginTop: 2 },
  autoText: { color: '#c4a878', fontSize: 12, letterSpacing: 1 },
  list: { padding: 16, gap: 10 },
  empty: { color: '#998b73', textAlign: 'center', marginTop: 48, fontStyle: 'italic' },
  bubble: { padding: 12, borderRadius: 16, maxWidth: '82%' },
  user: { alignSelf: 'flex-end', backgroundColor: '#c4a878' },
  future: { alignSelf: 'flex-start', backgroundColor: '#181612' },
  userText: { color: '#0d0c0a', fontSize: 15, lineHeight: 21 },
  futureText: { color: '#f4ede0', fontSize: 15, lineHeight: 21 },
  hear: { marginTop: 8, alignSelf: 'flex-start' },
  hearText: { color: '#c4a878', fontSize: 12, letterSpacing: 1 },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: '#0d0c0a' },
  mic: { minWidth: 44, paddingHorizontal: 12, backgroundColor: '#181612', borderColor: '#3a342b', borderWidth: 1, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  micRec: { backgroundColor: '#c0392b', borderColor: '#c0392b' },
  micText: { color: '#f4ede0', fontSize: 14, fontWeight: '600' },
  input: { flex: 1, backgroundColor: '#181612', borderColor: '#3a342b', borderWidth: 1, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, color: '#f4ede0' },
  send: { backgroundColor: '#c4a878', borderRadius: 22, paddingHorizontal: 18, justifyContent: 'center' },
  dim: { opacity: 0.5 },
  sendText: { color: '#0d0c0a', fontWeight: '700' },
});
