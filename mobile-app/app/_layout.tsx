import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/theme';

export default function RootLayout() {
  const [showFeatureSheet, setShowFeatureSheet] = useState(true);

  useEffect(() => {
    setShowFeatureSheet(true);
  }, []);

  return (
    <>
      <StatusBar style="dark" backgroundColor={COLORS.bgSecondary} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.bg },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{
            headerShown: true,
            headerTitle: 'BESPOKE SPECIFICATION',
            headerStyle: { backgroundColor: '#000000' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontFamily: 'Cinzel',
              fontSize: 13,
              fontWeight: '900',
            },
            headerBackTitle: 'BACK',
          }}
        />
      </Stack>
      <Modal visible={showFeatureSheet} transparent animationType="fade" onRequestClose={() => setShowFeatureSheet(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.featureSheet}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowFeatureSheet(false)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.sheetEyebrow}>CODED FIT ATELIER OS</Text>
            <Text style={styles.sheetTitle}>ACTIVE CALIBRATION ENGINE</Text>
            {[
              ['60-SEC AI FIT SCANNER', '2 front snaps calibrate 18 biometric nodes.'],
              ['3D BESPOKE STUDIO', 'Tweak sleeve drape, collar spread, and monogram initials.'],
              ['FIRST GARMENT COVENANT', 'Free re-tailoring and remakes at your doorstep.'],
            ].map(([title, body]) => (
              <View key={title} style={styles.featureRow}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureBody}>{body}</Text>
              </View>
            ))}
            <View style={styles.sheetActions}>
              <TouchableOpacity style={styles.primaryAction} onPress={() => setShowFeatureSheet(false)}>
                <Text style={styles.primaryActionText}>EXPLORE WITH MY FIT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dismissAction} onPress={() => setShowFeatureSheet(false)}>
                <Text style={styles.dismissActionText}>DISMISS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(11,11,13,0.42)' },
  featureSheet: { margin: 12, padding: 14, backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 18, elevation: 8 },
  closeButton: { position: 'absolute', right: 12, top: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.cardSecondary, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: COLORS.textPrimary, fontWeight: '800' },
  sheetEyebrow: { color: COLORS.accent, fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
  sheetTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '900', letterSpacing: 0.5, marginBottom: 12 },
  featureRow: { backgroundColor: COLORS.cardSecondary, padding: 10, marginBottom: 6, borderRadius: 6 },
  featureTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '900' },
  featureBody: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  sheetActions: { flexDirection: 'row', gap: 6, marginTop: 8 },
  primaryAction: { flex: 1, backgroundColor: COLORS.accent, paddingVertical: 13, alignItems: 'center', borderRadius: 4 },
  primaryActionText: { color: COLORS.white, fontSize: 12, fontWeight: '900' },
  dismissAction: { backgroundColor: COLORS.cardSecondary, paddingHorizontal: 14, justifyContent: 'center', borderRadius: 4 },
  dismissActionText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '900' },
});
