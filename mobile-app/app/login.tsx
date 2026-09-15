/**
 * CODED FIT — Login / Sign Up Screen
 * Clean minimal design: white, crisp typography, red accent
 * Supports: Customer login, Admin login, Guest browsing
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Mode = 'login' | 'signup';
type Role = 'customer' | 'admin';

// ── Dummy credentials (replace with real API in prod) ──────────
const ADMIN_CREDS = { email: 'admin@codedfit.com', password: 'admin123' };
const DEMO_CUSTOMER = { email: 'demo@codedfit.com', password: 'demo123', name: 'Dhyey Patel' };

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<Role>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);

    // Simulate API delay
    await new Promise(r => setTimeout(r, 900));

    try {
      if (role === 'admin') {
        if (email.toLowerCase() === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
          await AsyncStorage.setItem('CF_USER', JSON.stringify({ role: 'admin', email, name: 'Admin', loggedIn: true }));
          router.replace('/(tabs)');
        } else {
          Alert.alert('Access Denied', 'Invalid admin credentials.');
        }
      } else {
        // Customer login
        if (mode === 'login') {
          // Accept demo creds or any email/pass combo (demo mode)
          const user = { role: 'customer', email, name: email.split('@')[0], loggedIn: true };
          await AsyncStorage.setItem('CF_USER', JSON.stringify(user));
          router.replace('/(tabs)');
        } else {
          // Sign up
          if (!name.trim()) {
            Alert.alert('Missing Name', 'Please enter your full name.');
            setLoading(false);
            return;
          }
          const user = { role: 'customer', email, name, loggedIn: true };
          await AsyncStorage.setItem('CF_USER', JSON.stringify(user));
          router.replace('/(tabs)');
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  const handleGuestBrowse = async () => {
    await AsyncStorage.setItem('CF_USER', JSON.stringify({ role: 'guest', loggedIn: false }));
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Brand Header */}
          <View style={styles.brandSection}>
            <Text style={styles.brand}>CODED FIT</Text>
            <Text style={styles.brandSub}>[BLR-ATELIER]</Text>
            <Text style={styles.tagline}>India's First AI Fashion Studio</Text>
          </View>

          {/* Role Toggle */}
          <View style={styles.roleToggle}>
            <TouchableOpacity
              onPress={() => setRole('customer')}
              style={[styles.roleBtn, role === 'customer' && styles.roleBtnActive]}
            >
              <Text style={[styles.roleBtnText, role === 'customer' && styles.roleBtnTextActive]}>
                Customer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRole('admin')}
              style={[styles.roleBtn, role === 'admin' && styles.roleBtnActive]}
            >
              <Text style={[styles.roleBtnText, role === 'admin' && styles.roleBtnTextActive]}>
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mode Toggle (only for customer) */}
          {role === 'customer' && (
            <View style={styles.modeToggle}>
              <TouchableOpacity onPress={() => setMode('login')}>
                <Text style={[styles.modeText, mode === 'login' && styles.modeTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <Text style={styles.modeSep}>·</Text>
              <TouchableOpacity onPress={() => setMode('signup')}>
                <Text style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}>Create Account</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Form Card */}
          <View style={styles.formCard}>
            {role === 'admin' && (
              <View style={styles.adminNote}>
                <Text style={styles.adminNoteText}>Admin Portal — Restricted Access</Text>
              </View>
            )}

            {/* Name field (signup only) */}
            {mode === 'signup' && role === 'customer' && (
              <View style={styles.field}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your full name"
                  placeholderTextColor="#BBBBBB"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#BBBBBB"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passWrap}>
                <TextInput
                  style={styles.passInput}
                  placeholder="Enter password"
                  placeholderTextColor="#BBBBBB"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.showPassBtn}>
                  <Text style={styles.showPassText}>{showPass ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {mode === 'login' && role === 'customer' && (
              <TouchableOpacity style={styles.forgotRow}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnLoading]}
              onPress={handleAuth}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitText}>
                  {role === 'admin' ? 'ENTER PORTAL' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Demo hint */}
            {role === 'customer' && (
              <TouchableOpacity
                onPress={() => { setEmail(DEMO_CUSTOMER.email); setPassword(DEMO_CUSTOMER.password); }}
                style={styles.demoBtn}
              >
                <Text style={styles.demoBtnText}>Use demo account</Text>
              </TouchableOpacity>
            )}
            {role === 'admin' && (
              <TouchableOpacity
                onPress={() => { setEmail(ADMIN_CREDS.email); setPassword(ADMIN_CREDS.password); }}
                style={styles.demoBtn}
              >
                <Text style={styles.demoBtnText}>Use demo admin credentials</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Guest Browse */}
          <TouchableOpacity style={styles.guestBtn} onPress={handleGuestBrowse} activeOpacity={0.8}>
            <Text style={styles.guestBtnText}>Browse Without Signing In →</Text>
          </TouchableOpacity>

          <Text style={styles.guestNote}>
            You can browse the app without an account. Sign in to checkout, track orders, and use AI Try-On.
          </Text>

          {/* Footer */}
          <Text style={styles.footer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { padding: 24, paddingBottom: 40 },

  // Brand
  brandSection: { alignItems: 'center', marginBottom: 32, paddingTop: 16 },
  brand: { fontSize: 28, fontWeight: '900', color: '#111111', letterSpacing: 4 },
  brandSub: { fontSize: 11, fontWeight: '700', color: '#DC2626', letterSpacing: 3, marginTop: 2 },
  tagline: { fontSize: 12, color: '#888888', marginTop: 8, letterSpacing: 0.5 },

  // Role Toggle
  roleToggle: {
    flexDirection: 'row', borderWidth: 1, borderColor: '#EEEEEE',
    marginBottom: 20, overflow: 'hidden',
  },
  roleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#FAFAFA' },
  roleBtnActive: { backgroundColor: '#111111' },
  roleBtnText: { fontSize: 13, fontWeight: '700', color: '#888888' },
  roleBtnTextActive: { color: '#FFFFFF' },

  // Mode Toggle
  modeToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 },
  modeText: { fontSize: 14, fontWeight: '600', color: '#AAAAAA' },
  modeTextActive: { color: '#111111', fontWeight: '800', borderBottomWidth: 2, borderBottomColor: '#DC2626' },
  modeSep: { color: '#DDDDDD', fontSize: 16 },

  // Form
  formCard: {
    backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEEEEE',
    padding: 20, marginBottom: 20,
  },
  adminNote: {
    backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA',
    padding: 10, marginBottom: 16,
  },
  adminNoteText: { fontSize: 11, color: '#DC2626', fontWeight: '700', textAlign: 'center', letterSpacing: 1 },

  field: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '800', color: '#444444', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' },
  input: {
    borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#FFFFFF',
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#111111', fontWeight: '500',
  },
  passWrap: { flexDirection: 'row', borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#FFFFFF' },
  passInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#111111' },
  showPassBtn: { paddingHorizontal: 14, justifyContent: 'center' },
  showPassText: { fontSize: 12, color: '#888888', fontWeight: '600' },

  forgotRow: { alignSelf: 'flex-end', marginTop: -8, marginBottom: 16 },
  forgotText: { fontSize: 12, color: '#DC2626', fontWeight: '600' },

  submitBtn: {
    backgroundColor: '#111111', paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  submitBtnLoading: { opacity: 0.7 },
  submitText: { fontSize: 13, fontWeight: '900', color: '#FFFFFF', letterSpacing: 3 },

  demoBtn: { marginTop: 12, alignItems: 'center' },
  demoBtnText: { fontSize: 11, color: '#AAAAAA', fontWeight: '600' },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#EEEEEE' },
  dividerText: { fontSize: 12, color: '#AAAAAA' },

  // Guest
  guestBtn: {
    borderWidth: 1.5, borderColor: '#111111',
    paddingVertical: 14, alignItems: 'center', marginBottom: 12,
  },
  guestBtnText: { fontSize: 13, fontWeight: '800', color: '#111111', letterSpacing: 1 },
  guestNote: { fontSize: 11, color: '#888888', textAlign: 'center', lineHeight: 16, marginBottom: 24 },

  footer: { fontSize: 10, color: '#CCCCCC', textAlign: 'center', lineHeight: 15 },
});
