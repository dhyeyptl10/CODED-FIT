/**
 * CODED-FIT / NOVA STREET — UR PICKS VIP Dashboard & Tailoring Tracker
 * Haute-Couture Black & White Theme: Sharp Monochrome Architecture
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GoldButton } from '../../components/ui/GoldButton';
import { Badge } from '../../components/ui/Badge';
import { useShare } from '../../hooks/useShare';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const { shareWithFriend } = useShare();
  const [activeSubTab, setActiveSubTab] = useState<'looks' | 'orders' | 'profile'>('looks');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Top Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>UR PICKS & VIP STUDIO</Text>
          <Text style={styles.subTitle}>
            Bespoke Tailoring Ledger · Ahmedabad Atelier No. 042
          </Text>
        </View>
        <Badge label="VIP MEMBER" variant="white" size="sm" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* VIP Digital Membership Card */}
        <View style={styles.vipCard}>
          <View style={styles.vipTopRow}>
            <View>
              <Text style={styles.vipTier}>NOVA ATELIER PRIVILEGE</Text>
              <Text style={styles.vipName}>Dhyey Patel</Text>
            </View>
            <Text style={{ fontSize: 24, color: '#FFFFFF' }}>✦</Text>
          </View>
          <View style={styles.vipBottomRow}>
            <View>
              <Text style={styles.vipStatLabel}>Tailoring Balance</Text>
              <Text style={styles.vipStatVal}>₹1,200 Credits</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.vipStatLabel}>Fit Profile</Text>
              <Text style={styles.vipStatVal}>80 Nodes Verified</Text>
            </View>
          </View>
        </View>

        {/* Sub-Tabs */}
        <View style={styles.subTabBar}>
          <TouchableOpacity
            onPress={() => setActiveSubTab('looks')}
            style={[styles.subTabBtn, activeSubTab === 'looks' && styles.subTabBtnActive]}
          >
            <Text style={[styles.subTabText, activeSubTab === 'looks' && styles.subTabTextActive]}>
              Saved Looks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSubTab('orders')}
            style={[styles.subTabBtn, activeSubTab === 'orders' && styles.subTabBtnActive]}
          >
            <Text style={[styles.subTabText, activeSubTab === 'orders' && styles.subTabTextActive]}>
              Tailoring Tracker
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSubTab('profile')}
            style={[styles.subTabBtn, activeSubTab === 'profile' && styles.subTabBtnActive]}
          >
            <Text style={[styles.subTabText, activeSubTab === 'profile' && styles.subTabTextActive]}>
              3D Body Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: SAVED LOOKS */}
        {activeSubTab === 'looks' && (
          <View style={styles.tabContent}>
            <View style={styles.lookCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85' }}
                style={styles.lookImage}
                resizeMode="cover"
              />
              <View style={styles.lookDetails}>
                <Badge label="AI TRY-ON MATCH" variant="white" size="sm" />
                <Text style={styles.lookTitle}>Gold Fluid Silk Midi</Text>
                <Text style={styles.lookSub}>Fit Confidence: 99.4% · Sized: Custom 3D</Text>
                <GoldButton
                  title="RE-TRY LOOK IN STUDIO ✦"
                  onPress={() => router.push('/tryon')}
                  size="sm"
                  style={{ marginTop: 8 }}
                />
              </View>
            </View>

            <View style={styles.lookCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900&q=85' }}
                style={styles.lookImage}
                resizeMode="cover"
              />
              <View style={styles.lookDetails}>
                <Badge label="BESPOKE DENIM" variant="dark" size="sm" />
                <Text style={styles.lookTitle}>Obsidian Boxy Selvedge</Text>
                <Text style={styles.lookSub}>14.5oz Okayama Selvedge · Tailored Fit</Text>
                <GoldButton
                  title="RE-TRY LOOK IN STUDIO ✦"
                  onPress={() => router.push('/tryon')}
                  size="sm"
                  style={{ marginTop: 8 }}
                />
              </View>
            </View>
          </View>
        )}

        {/* TAB 2: TAILORING TRACKER */}
        {activeSubTab === 'orders' && (
          <View style={styles.tabContent}>
            <View style={styles.orderCard}>
              <View style={styles.orderTop}>
                <Text style={styles.orderNumber}>ORDER #NS-2026-0891</Text>
                <Badge label="IN TAILORING" variant="white" size="sm" />
              </View>
              <Text style={styles.orderItem}>Aether Drop-Shoulder Tee (Custom AI Fit)</Text>

              {/* Milestone Tracker */}
              <View style={styles.timeline}>
                <View style={styles.timelineStep}>
                  <Text style={styles.timelineDotActive}>●</Text>
                  <Text style={styles.timelineTextActive}>1. Fabric Selected (GOTS Cotton)</Text>
                </View>
                <View style={styles.timelineStep}>
                  <Text style={styles.timelineDotActive}>●</Text>
                  <Text style={styles.timelineTextActive}>2. Laser Cutting to 3D Pattern</Text>
                </View>
                <View style={styles.timelineStep}>
                  <Text style={styles.timelineDotActive}>●</Text>
                  <Text style={styles.timelineTextActive}>3. Master Artisan Stitching</Text>
                </View>
                <View style={styles.timelineStep}>
                  <Text style={styles.timelineDot}>○</Text>
                  <Text style={styles.timelineText}>4. Final QC & Express Dispatch</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* TAB 3: 3D BODY PROFILE */}
        {activeSubTab === 'profile' && (
          <View style={styles.tabContent}>
            <View style={styles.profileCard}>
              <Text style={styles.profileTitle}>ANTHROPOMETRIC LEDGER</Text>
              <View style={styles.profileGrid}>
                <View style={styles.profileItem}>
                  <Text style={styles.profileVal}>176 cm</Text>
                  <Text style={styles.profileLabel}>Height</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileVal}>58 kg</Text>
                  <Text style={styles.profileLabel}>Weight</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileVal}>34"</Text>
                  <Text style={styles.profileLabel}>Chest / Bust</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileVal}>25"</Text>
                  <Text style={styles.profileLabel}>Waist</Text>
                </View>
              </View>

              <GoldButton
                title="UPDATE IN BODY VISUALIZER ✦"
                onPress={() => router.push('/tryon')}
                size="md"
                style={{ marginTop: 14 }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: 'Cinzel',
  },
  subTitle: {
    fontSize: 9,
    color: '#A3A3A3',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  vipCard: {
    margin: 16,
    backgroundColor: '#111111',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: RADIUS.sm, // 0 sharp
    padding: 18,
    ...SHADOWS.card,
  },
  vipTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  vipTier: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A3A3A3',
    letterSpacing: 1.5,
  },
  vipName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'Cinzel',
    marginTop: 2,
  },
  vipBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#262626',
    paddingTop: 12,
  },
  vipStatLabel: {
    fontSize: 9,
    color: '#737373',
  },
  vipStatVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  subTabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
  },
  subTabBtnActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  subTabText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#737373',
  },
  subTabTextActive: {
    color: '#000000',
  },
  tabContent: {
    padding: 16,
    gap: 12,
  },
  lookCard: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: RADIUS.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: '#262626',
    ...SHADOWS.card,
  },
  lookImage: {
    width: 80,
    height: 110,
    backgroundColor: '#0D0D0D',
  },
  lookDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  lookTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  lookSub: {
    fontSize: 10,
    color: '#A3A3A3',
  },
  orderCard: {
    backgroundColor: '#111111',
    borderRadius: RADIUS.sm,
    padding: 14,
    borderWidth: 1,
    borderColor: '#262626',
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  orderItem: {
    fontSize: 12,
    color: '#A3A3A3',
    marginBottom: 12,
  },
  timeline: {
    gap: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#FFFFFF',
    paddingLeft: 12,
    marginLeft: 4,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineDotActive: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  timelineTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timelineDot: {
    color: '#404040',
    fontSize: 12,
  },
  timelineText: {
    fontSize: 10,
    color: '#737373',
  },
  profileCard: {
    backgroundColor: '#111111',
    borderRadius: RADIUS.sm,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262626',
  },
  profileTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  profileItem: {
    width: '47%',
    backgroundColor: '#0A0A0A',
    borderRadius: RADIUS.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
  },
  profileVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  profileLabel: {
    fontSize: 10,
    color: '#737373',
    marginTop: 2,
  },
});
