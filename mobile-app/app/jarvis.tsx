/**
 * CODED FIT — JARVIS Assistant (mobile)
 * Text concierge backed by the real backend (/api/ai/chat).
 * Honest note: voice typing is not bundled in this build — use your
 * keyboard's dictation mic to speak. No fake voice claims.
 */
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS } from '../constants/theme';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000/api';

interface Msg { from: 'user' | 'ai'; text: string }

const QUICK = ['Men dikhao', 'Kids collection', 'Body Scan kholo', 'Black under 2500', 'Track my order'];

export default function JarvisScreen() {
  const router = useRouter();
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'ai', text: 'Namaste! Main JARVIS hun. Bolo — kapde dhoondhna, Body Scan kholna, ya order track karna. (Is build me voice typing ke liye keyboard ka mic use karo.)' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  function localIntent(t: string): string | null {
    const s = t.toLowerCase();
    if (/body|scan|naap/.test(s) && /kholo|open|start/.test(s)) { router.push('/(tabs)/tryon'); return 'Body Scan studio khol raha hun.'; }
    if (/men/.test(s) && /dikha|kholo|show/.test(s)) { router.push('/(tabs)/shop'); return 'Shop khol raha hun — Men filter laga lo.'; }
    if (/kid|bach/.test(s)) { router.push('/(tabs)/shop'); return 'Shop khol raha hun — Kids filter laga lo.'; }
    if (/women|ladies/.test(s)) { router.push('/(tabs)/shop'); return 'Shop khol raha hun — Women filter laga lo.'; }
    if (/cart|bag/.test(s)) { router.push('/(tabs)/cart'); return 'Bag khol raha hun.'; }
    if (/order|track/.test(s)) { router.push('/(tabs)/dashboard'); return 'Dashboard khol raha hun — wahan tracking milegi.'; }
    return null;
  }

  async function send(text?: string) {
    const message = (text ?? input).trim();
    if (!message || busy) return;
    setInput('');
    setMsgs(m => [...m, { from: 'user', text: message }]);
    const local = localIntent(message);
    if (local) { setMsgs(m => [...m, { from: 'ai', text: local }]); return; }
    setBusy(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25000);
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: [] }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      setMsgs(m => [...m, { from: 'ai', text: data?.response || 'Samajh nahi aaya — phir se bolo.' }]);
    } catch {
      setMsgs(m => [...m, { from: 'ai', text: 'AI offline hai — lekin shop aur try-on studio poori tarah chal rahe hain.' }]);
    } finally {
      setBusy(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>◉ JARVIS</Text>
        <Text style={styles.sub}>VOICE-READY TEXT CONCIERGE · EN · हिंदी</Text>
      </View>
      <ScrollView ref={scrollRef} style={styles.list} contentContainerStyle={styles.listPad}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {msgs.map((m, i) => (
          <View key={i} style={[styles.bubble, m.from === 'user' ? styles.user : styles.ai]}>
            <Text style={[styles.text, m.from === 'user' ? styles.userText : styles.aiText]}>{m.text}</Text>
          </View>
        ))}
        {busy && <ActivityIndicator color={COLORS.accent} style={{ marginVertical: 8 }} />}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRow}>
        {QUICK.map(q => (
          <TouchableOpacity key={q} style={styles.quick} onPress={() => send(q)}>
            <Text style={styles.quickText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.row}>
          <TextInput style={styles.input} value={input} onChangeText={setInput}
            placeholder="Bolo ya likho… (mic = keyboard dictation)" placeholderTextColor="#8A8580"
            onSubmitEditing={() => send()} returnKeyType="send" />
          <TouchableOpacity style={styles.send} onPress={() => send()}>
            <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 20, fontWeight: '900', color: COLORS.textPrimary },
  sub: { fontSize: 10, color: COLORS.textSecondary, letterSpacing: 1, marginTop: 2 },
  list: { flex: 1 },
  listPad: { padding: 14, gap: 10 },
  bubble: { maxWidth: '86%', padding: 10, borderRadius: 10 },
  user: { alignSelf: 'flex-end', backgroundColor: COLORS.accent, borderBottomRightRadius: 3 },
  ai: { alignSelf: 'flex-start', backgroundColor: COLORS.cardSecondary, borderBottomLeftRadius: 3 },
  text: { fontSize: 13, lineHeight: 19 },
  userText: { color: '#fff' },
  aiText: { color: COLORS.textPrimary },
  quickRow: { maxHeight: 44, paddingHorizontal: 12 },
  quick: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  quickText: { fontSize: 11, color: COLORS.textPrimary, fontWeight: '700' },
  row: { flexDirection: 'row', padding: 12, gap: 8, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 12, color: COLORS.textPrimary, backgroundColor: COLORS.card },
  send: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: '#fff', fontSize: 18 },
});
