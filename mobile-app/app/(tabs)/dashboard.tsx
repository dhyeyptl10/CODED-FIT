/**
 * CODED-FIT / NOVA STREET — UR PICKS VIP Dashboard & Tailoring Tracker
 * Haute-Couture White Luxury Theme: Saved 3D Looks, Bespoke Milestones, VIP Pass
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
        <Badge label="VIP MEMBER" variant="gold" size="sm" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* VIP Digital Membership Card */}
        <View style={styles.vipCard}>
          <View style={styles.vipTopRow}>
            <View>
              <Text style={styles.vipTier}>NOVA ATELIER PRIVILEGE</Text>
              <Text style={styles.vipName}>Dhyey Patel</Text>
            </View>
            <Text style={{ fontSize: 28 }}>✦</Text>
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
                <Badge label="AI TRY-ON MATCH" variant="green" size="sm" />
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
                <Badge label="BESPOKE DENIM" variant="gold" size="sm" />
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
                <Badge label="IN TAILORING" variant="gold" size="sm" />
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1.5,
  },
  subTitle: {
    fontSize: 9,
    color: COLORS.goldDark,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  vipCard: {
    margin: 16,
    backgroundColor: '#FAF8F3',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    borderRadius: RADIUS.xl,
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
    color: COLORS.goldDark,
    letterSpacing: 1.5,
  },
  vipName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    fontFamily: 'Cinzel',
    marginTop: 2,
  },
  vipBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGold,
    paddingTop: 12,
  },
  vipStatLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
  vipStatVal: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
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
    borderRadius: RADIUS.md,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  subTabBtnActive: {
    backgroundColor: COLORS.textPrimary,
    borderColor: COLORS.textPrimary,
  },
  subTabText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  subTabTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    padding: 16,
    gap: 12,
  },
  lookCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  lookImage: {
    width: 80,
    height: 110,
    borderRadius: RADIUS.md,
  },
  lookDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  lookTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  lookSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  orderCard: {
    backgroundColor: '#FAF8F5',
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.textPrimary,
  },
  orderItem: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  timeline: {
    gap: 8,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.gold,
    paddingLeft: 12,
    marginLeft: 4,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineDotActive: {
    color: COLORS.goldDark,
    fontSize: 12,
  },
  timelineTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  timelineDot: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  timelineText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  profileCard: {
    backgroundColor: '#FAF8F5',
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  profileItem: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  profileVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.goldDark,
  },
  profileLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
