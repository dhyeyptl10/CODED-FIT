/**
 * CODED FIT — Profile tab
 * Real account state, saved fit measurements, and on-device order history.
 * Nothing here is demo data: empty states say so honestly.
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../hooks/useAuth';
import {
  getOrders,
  getMeasurements,
  OrderRecord,
  BodyMeasurements,
} from '../../services/orders';
import { GoldButton } from '../../components/ui/GoldButton';
import { Badge } from '../../components/ui/Badge';
import { COLORS, RADIUS } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { isSupported, isEnrolled, biometricLabel } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [measurements, setMeasurements] = useState<BodyMeasurements | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setOrders(await getOrders());
        setMeasurements(await getMeasurements());
      })();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eye}>CODED FIT · ACCOUNT</Text>
          <Text style={styles.title}>PROFILE</Text>
        </View>
        <Badge label="MEMBER" variant="dark" size="sm" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {/* Account */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ACCOUNT & SECURITY</Text>
          <Text style={styles.cardSub}>
            {isSupported
              ? `1-touch checkout secured with ${biometricLabel}${isEnrolled ? '' : ' (not enrolled on this device)'}`
              : 'Biometric checkout is unavailable on this device'}
          </Text>
          <GoldButton
            title="SIGN IN / CREATE ACCOUNT"
            onPress={() => router.push('/login' as any)}
            size="md"
            style={{ marginTop: 12 }}
          />
        </View>

        {/* Fit measurements (saved from Bespoke) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>MY FIT MEASUREMENTS</Text>
          {measurements ? (
            <View>
              <View style={styles.measureGrid}>
                <Measure label="Height" value={`${measurements.heightCm} cm`} />
                <Measure label="Weight" value={`${measurements.weightKg} kg`} />
                <Measure label="Chest" value={`${measurements.chestIn}"`} />
                <Measure label="Waist" value={`${measurements.waistIn}"`} />
                <Measure label="Hips" value={`${measurements.hipIn}"`} />
              </View>
              <GoldButton
                title="UPDATE IN BESPOKE STUDIO"
                variant="outline"
                onPress={() => router.push('/(tabs)/bespoke')}
                size="md"
                style={{ marginTop: 12 }}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.emptyText}>
                No measurements saved yet. Complete the Bespoke flow once and your fit profile lives here.
              </Text>
              <GoldButton
                title="START BESPOKE FLOW"
                onPress={() => router.push('/(tabs)/bespoke')}
                size="md"
                style={{ marginTop: 12 }}
              />
            </View>
          )}
        </View>

        {/* Orders */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>MY ORDERS</Text>
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>
              No orders yet. Orders placed from your bag appear here with totals.
            </Text>
          ) : (
            orders.map(o => (
              <TouchableOpacity
                key={o.orderId}
                activeOpacity={0.9}
                onPress={() => {
                  try {
                    Haptics.selectionAsync();
                  } catch (_) {}
                }}
                style={styles.orderCard}
              >
                <View style={styles.orderTop}>
                  <Text style={styles.orderId}>ORDER {o.orderId}</Text>
                  <Text style={styles.orderDate}>{new Date(o.date).toLocaleDateString('en-IN')}</Text>
                </View>
                <Text style={styles.orderItems}>
                  {o.items.map(i => `${i.qty}× ${i.name} (${i.size})`).join(' · ')}
                </Text>
                <Text style={styles.orderTotal}>
                  ₹{o.total.toLocaleString('en-IN')} · {o.itemCount} items
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Support */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SUPPORT</Text>
          {[
            ['Track & shipping', '24H dispatch · free above ₹999'],
            ['Returns', '15-day free returns'],
            ['Atelier', 'Ahmedabad · Bengaluru'],
          ].map(([t, s]) => (
            <View key={t} style={styles.supportRow}>
              <Text style={styles.supportTitle}>{t}</Text>
              <Text style={styles.supportSub}>{s}</Text>
            </View>
          ))}
          <Text style={styles.version}>CODED-FIT v1.0.0 · Expo</Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Measure({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.measureItem}>
      <Text style={styles.measureVal}>{value}</Text>
      <Text style={styles.measureLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  eye: { fontSize: 9, fontWeight: '800', color: '#D71920', letterSpacing: 2 },
  title: { fontSize: 20, fontWeight: '900', color: '#111111', letterSpacing: 1, marginTop: 2 },
  body: { padding: 16, paddingBottom: 8 },
  card: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: { fontSize: 11, fontWeight: '900', color: '#111111', letterSpacing: 1.5, marginBottom: 6 },
  cardSub: { fontSize: 12, color: '#666666', lineHeight: 18 },
  emptyText: { fontSize: 12, color: '#777777', lineHeight: 18 },
  measureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 },
  measureItem: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  measureVal: { fontSize: 16, fontWeight: '900', color: '#111111' },
  measureLabel: { fontSize: 10, color: '#888888', marginTop: 2 },
  orderCard: { borderWidth: 1, borderColor: '#E5E5E5', padding: 12, marginTop: 8 },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  orderId: { fontSize: 11, fontWeight: '900', color: '#111111' },
  orderDate: { fontSize: 10, color: '#888888' },
  orderItems: { fontSize: 11, color: '#555555', lineHeight: 16 },
  orderTotal: { fontSize: 12, fontWeight: '900', color: '#111111', marginTop: 6 },
  supportRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
  supportTitle: { fontSize: 12, fontWeight: '800', color: '#111111' },
  supportSub: { fontSize: 11, color: '#777777', marginTop: 2 },
  version: { fontSize: 10, color: '#AAAAAA', marginTop: 12, textAlign: 'center' },
});
