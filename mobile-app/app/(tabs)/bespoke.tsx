/**
 * CODED FIT — Bespoke Studio (touch-first 7-step flow)
 * Garment → Fabric → Colour → Fit → Measure → Preview → Try-On
 * Prices mirror the web bespoke catalogue (base + fabric atelier surcharge).
 */
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { PRODUCTS, Product } from '../../services/products';
import { CartService } from '../../services/cart';
import { saveMeasurements } from '../../services/orders';
import { COLORS, RADIUS } from '../../constants/theme';

const { width: W } = Dimensions.get('window');

interface BespokeGarment {
  id: string;
  name: string;
  blurb: string;
  productId: string;
  vtoCategory: string;
}

const GARMENTS: BespokeGarment[] = [
  { id: 'tee', name: 'Classic T-Shirt', blurb: 'Clean everyday block', productId: 'm1', vtoCategory: 'Tops' },
  { id: 'oversized', name: 'Oversized Hoodie', blurb: 'Boxy volume, heavy drape', productId: 'u1', vtoCategory: 'Tops' },
  { id: 'hoodie', name: 'Heavy Hoodie', blurb: 'Double-lined winter weight', productId: 'm4', vtoCategory: 'Tops' },
  { id: 'shirt', name: 'Camp Shirt', blurb: 'Breezy structured collar', productId: 'u2', vtoCategory: 'Tops' },
  { id: 'pants', name: 'Cargo Pants', blurb: 'Relaxed utility taper', productId: 'm2', vtoCategory: 'Bottoms' },
];

const FABRICS = [
  { id: 'gots_cotton', name: 'GOTS Organic Cotton', desc: '280 GSM · soft everyday', add: 0 },
  { id: 'french_terry', name: 'Heavy French Terry', desc: '450 GSM · structured', add: 800 },
  { id: 'selvedge_denim', name: 'Selvedge Denim', desc: '14.5oz Okayama · rigid', add: 1200 },
  { id: 'italian_linen', name: 'Italian Linen', desc: '210 GSM · breathable', add: 1500 },
  { id: 'tencel_blend', name: 'TENCEL Blend', desc: '240 GSM · fluid drape', add: 1000 },
];

const COLOURS = [
  { name: 'Obsidian', hex: '#111215' },
  { name: 'Chalk', hex: '#F4F3EE' },
  { name: 'Olive', hex: '#3B4237' },
  { name: 'Navy', hex: '#1B2232' },
  { name: 'Crimson', hex: '#D71920' },
  { name: 'Sand', hex: '#D4C5B5' },
  { name: 'Sky', hex: '#75C8EE' },
  { name: 'Forest', hex: '#324D3D' },
];

const FITS = [
  { id: 'slim', name: 'SLIM', desc: 'Close through chest and waist' },
  { id: 'regular', name: 'REGULAR', desc: 'Balanced, true to size' },
  { id: 'relaxed', name: 'RELAXED', desc: 'Room to move, soft drape' },
  { id: 'oversized', name: 'OVERSIZED', desc: 'Dropped, boxy volume' },
];

const STEPS = ['Garment', 'Fabric', 'Colour', 'Fit', 'Measure', 'Preview', 'Try-On'];

function Stepper({
  label,
  value,
  unit,
  onMinus,
  onPlus,
}: {
  label: string;
  value: number;
  unit: string;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.measureCard}>
      <Text style={styles.measureLabel}>{label}</Text>
      <Text style={styles.measureVal}>
        {value}
        <Text style={styles.measureUnit}> {unit}</Text>
      </Text>
      <View style={styles.stepRow}>
        <TouchableOpacity onPress={onMinus} style={styles.stepBtn} hitSlop={8}>
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPlus} style={styles.stepBtn} hitSlop={8}>
          <Text style={styles.stepBtnText}>＋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function BespokeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ productId?: string }>();

  const initialGarment = useMemo(() => {
    if (params.productId) {
      const hit = GARMENTS.find(g => g.productId === params.productId);
      if (hit) return hit;
    }
    return GARMENTS[0];
  }, []);

  const [step, setStep] = useState(0);
  const [garment, setGarment] = useState<BespokeGarment>(initialGarment);
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [colour, setColour] = useState(COLOURS[0]);
  const [fit, setFit] = useState(FITS[1]);
  const [heightCm, setHeightCm] = useState(172);
  const [weightKg, setWeightKg] = useState(70);
  const [chestIn, setChestIn] = useState(40);
  const [waistIn, setWaistIn] = useState(32);
  const [hipIn, setHipIn] = useState(38);
  const [added, setAdded] = useState(false);

  const product: Product | undefined = PRODUCTS.find(p => p.id === garment.productId) ?? PRODUCTS[0];
  const total = (product?.price ?? 0) + fabric.add;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const tap = () => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
  };

  const next = async () => {
    tap();
    if (step === 4) {
      await saveMeasurements({ heightCm, weightKg, chestIn, waistIn, hipIn });
    }
    setStep(s => Math.min(STEPS.length - 1, s + 1));
  };
  const back = () => {
    tap();
    setStep(s => Math.max(0, s - 1));
  };

  const handleAddToBag = async () => {
    if (!product) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
    await CartService.addItem(
      product,
      'M',
      1,
      colour.name,
      { heightCm, weightKg, chest: chestIn, waist: waistIn }
    );
    await saveMeasurements({ heightCm, weightKg, chestIn, waistIn, hipIn });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const openTryOn = () => {
    tap();
    router.push({
      pathname: '/(tabs)/tryon',
      params: {
        heightCm: String(heightCm),
        weightKg: String(weightKg),
        chestIn: String(chestIn),
        waistIn: String(waistIn),
        hipIn: String(hipIn),
        vtoCategory: garment.vtoCategory,
      },
    } as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eye}>CODED FIT · BESPOKE STUDIO</Text>
          <Text style={styles.title}>MAKE IT YOURS</Text>
        </View>
        <Text style={styles.stepCount}>
          {step + 1} / {STEPS.length}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progress}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.progressSeg}>
            <View style={[styles.progressDot, i <= step && styles.progressDotOn]} />
            <Text style={[styles.progressLabel, i === step && styles.progressLabelOn]}>{s}</Text>
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {step === 0 && (
          <View>
            <Text style={styles.h2}>01 · Choose your garment</Text>
            {GARMENTS.map(g => {
              const p = PRODUCTS.find(x => x.id === g.productId);
              const sel = garment.id === g.id;
              return (
                <TouchableOpacity
                  key={g.id}
                  onPress={() => {
                    tap();
                    setGarment(g);
                  }}
                  style={[styles.gCard, sel && styles.gCardSel]}
                  activeOpacity={0.9}
                >
                  <Image source={{ uri: p?.images[0] }} style={styles.gImg} />
                  <View style={styles.gInfo}>
                    <Text style={styles.gName}>{g.name}</Text>
                    <Text style={styles.gBlurb}>{g.blurb}</Text>
                    <Text style={styles.gPrice}>From ₹{(p?.price ?? 0).toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={[styles.tick, sel && styles.tickOn]}>
                    <Text style={[styles.tickText, sel && styles.tickTextOn]}>✓</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.h2}>02 · Choose fabric</Text>
            <Text style={styles.sub}>Only cloths tailored for the {garment.name}.</Text>
            {FABRICS.map(f => {
              const sel = fabric.id === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => {
                    tap();
                    setFabric(f);
                  }}
                  style={[styles.optCard, sel && styles.optCardSel]}
                  activeOpacity={0.9}
                >
                  <View style={styles.optInfo}>
                    <Text style={styles.optName}>{f.name}</Text>
                    <Text style={styles.optDesc}>{f.desc}</Text>
                  </View>
                  <Text style={[styles.optPrice, f.add === 0 && styles.optFree]}>
                    {f.add === 0 ? 'INCLUDED' : '+₹' + f.add.toLocaleString('en-IN')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.h2}>03 · Choose colour</Text>
            <Text style={styles.sub}>
              Selected: <Text style={{ fontWeight: '900', color: '#111' }}>{colour.name}</Text>
            </Text>
            <View style={styles.swatchGrid}>
              {COLOURS.map(c => {
                const sel = colour.name === c.name;
                return (
                  <TouchableOpacity
                    key={c.name}
                    onPress={() => {
                      tap();
                      setColour(c);
                    }}
                    style={[styles.swatch, { backgroundColor: c.hex }, sel && styles.swatchSel]}
                    activeOpacity={0.85}
                  >
                    {sel && <Text style={styles.swatchCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
            <Image source={{ uri: product?.images[0] }} style={styles.previewImg} />
            <Text style={styles.caption}>Preview shows the {garment.name} block — colour applies at tailoring.</Text>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.h2}>04 · Choose fit</Text>
            <View style={styles.fitGrid}>
              {FITS.map(f => {
                const sel = fit.id === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    onPress={() => {
                      tap();
                      setFit(f);
                    }}
                    style={[styles.fitCard, sel && styles.fitCardSel]}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.fitName}>{f.name}</Text>
                    <Text style={styles.fitDesc}>{f.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {step === 4 && (
          <View>
            <Text style={styles.h2}>05 · Your measurements</Text>
            <Text style={styles.sub}>Saved to your fit profile. Edit anytime.</Text>
            <View style={styles.measureGrid}>
              <Stepper label="Height" value={heightCm} unit="cm" onMinus={() => setHeightCm(v => clamp(v - 1, 140, 210))} onPlus={() => setHeightCm(v => clamp(v + 1, 140, 210))} />
              <Stepper label="Weight" value={weightKg} unit="kg" onMinus={() => setWeightKg(v => clamp(v - 1, 40, 150))} onPlus={() => setWeightKg(v => clamp(v + 1, 40, 150))} />
              <Stepper label="Chest" value={chestIn} unit="in" onMinus={() => setChestIn(v => clamp(v - 0.5, 28, 56))} onPlus={() => setChestIn(v => clamp(v + 0.5, 28, 56))} />
              <Stepper label="Waist" value={waistIn} unit="in" onMinus={() => setWaistIn(v => clamp(v - 0.5, 20, 50))} onPlus={() => setWaistIn(v => clamp(v + 0.5, 20, 50))} />
              <Stepper label="Hips" value={hipIn} unit="in" onMinus={() => setHipIn(v => clamp(v - 0.5, 30, 56))} onPlus={() => setHipIn(v => clamp(v + 0.5, 30, 56))} />
            </View>
          </View>
        )}

        {step === 5 && (
          <View>
            <Text style={styles.h2}>06 · Preview</Text>
            <Image source={{ uri: product?.images[0] }} style={styles.previewImg} />
            <View style={styles.specBox}>
              <SpecRow k="Garment" v={garment.name} />
              <SpecRow k="Fabric" v={`${fabric.name}${fabric.add ? ` (+₹${fabric.add.toLocaleString('en-IN')})` : ''}`} />
              <SpecRow k="Colour" v={colour.name} />
              <SpecRow k="Fit" v={fit.name} />
              <SpecRow k="Chest / Waist / Hips" v={`${chestIn}" / ${waistIn}" / ${hipIn}"`} />
            </View>
          </View>
        )}

        {step === 6 && (
          <View>
            <Text style={styles.h2}>07 · Try it on</Text>
            <Text style={styles.sub}>Your spec travels with you — nothing is faked.</Text>
            <TouchableOpacity style={styles.ctaDark} onPress={openTryOn} activeOpacity={0.9}>
              <Text style={styles.ctaDarkText}>OPEN PHOTO TRY-ON →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctaLight}
              onPress={() => router.push('/design-studio' as any)}
              activeOpacity={0.9}
            >
              <Text style={styles.ctaLightText}>OPEN DESIGN STUDIO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctaRed, added && styles.ctaDone]}
              onPress={handleAddToBag}
              activeOpacity={0.9}
            >
              <Text style={styles.ctaRedText}>{added ? 'ADDED TO BAG ✓' : `ADD TO BAG · ₹${total.toLocaleString('en-IN')}`}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={styles.bottomBar}>
        {step > 0 ? (
          <TouchableOpacity onPress={back} style={styles.backBtn} activeOpacity={0.85}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 84 }} />
        )}
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>TOTAL</Text>
          <Text style={styles.priceVal}>₹{total.toLocaleString('en-IN')}</Text>
        </View>
        {step < STEPS.length - 1 ? (
          <TouchableOpacity onPress={next} style={styles.nextBtn} activeOpacity={0.85}>
            <Text style={styles.nextText}>NEXT →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.nextBtn} activeOpacity={0.85}>
            <Text style={styles.nextText}>BAG →</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.specRow}>
      <Text style={styles.specK}>{k}</Text>
      <Text style={styles.specV}>{v}</Text>
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
  stepCount: { fontSize: 12, fontWeight: '900', color: '#111111' },
  progress: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  progressSeg: { flex: 1, alignItems: 'center' },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E4E4E4', marginBottom: 3 },
  progressDotOn: { backgroundColor: '#D71920' },
  progressLabel: { fontSize: 7, fontWeight: '800', color: '#AAAAAA', letterSpacing: 0.4 },
  progressLabelOn: { color: '#111111' },
  body: { padding: 16, paddingBottom: 8 },
  h2: { fontSize: 16, fontWeight: '900', color: '#111111', letterSpacing: 1, marginBottom: 4 },
  sub: { fontSize: 12, color: '#777777', marginBottom: 12, lineHeight: 18 },
  gCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 10,
    minHeight: 84,
  },
  gCardSel: { borderColor: '#D71920', borderWidth: 1.5 },
  gImg: { width: 64, height: 80, backgroundColor: '#F1F1F3' },
  gInfo: { flex: 1, marginLeft: 12 },
  gName: { fontSize: 14, fontWeight: '800', color: '#111111' },
  gBlurb: { fontSize: 11, color: '#777777', marginTop: 2 },
  gPrice: { fontSize: 12, fontWeight: '900', color: '#111111', marginTop: 4 },
  tick: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickOn: { backgroundColor: '#D71920', borderColor: '#D71920' },
  tickText: { color: 'transparent', fontSize: 14, fontWeight: '900' },
  tickTextOn: { color: '#FFFFFF' },
  optCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 14,
    marginBottom: 10,
    minHeight: 64,
  },
  optCardSel: { borderColor: '#D71920', borderWidth: 1.5 },
  optInfo: { flex: 1, paddingRight: 10 },
  optName: { fontSize: 13, fontWeight: '800', color: '#111111' },
  optDesc: { fontSize: 11, color: '#777777', marginTop: 2 },
  optPrice: { fontSize: 11, fontWeight: '900', color: '#111111' },
  optFree: { color: '#16A34A' },
  swatchGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  swatch: {
    width: (W - 32 - 24) / 4,
    height: 64,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSel: { borderColor: '#D71920', borderWidth: 2.5 },
  swatchCheck: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 4 },
  fitGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  fitCard: {
    width: (W - 32 - 8) / 2,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 14,
    marginBottom: 8,
    minHeight: 96,
  },
  fitCardSel: { borderColor: '#D71920', borderWidth: 1.5 },
  fitName: { fontSize: 13, fontWeight: '900', color: '#111111', letterSpacing: 1 },
  fitDesc: { fontSize: 11, color: '#777777', marginTop: 4, lineHeight: 16 },
  measureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  measureCard: {
    width: (W - 32 - 8) / 2,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  measureLabel: { fontSize: 9, fontWeight: '800', color: '#888888', letterSpacing: 1, textTransform: 'uppercase' },
  measureVal: { fontSize: 22, fontWeight: '900', color: '#111111', marginVertical: 6 },
  measureUnit: { fontSize: 12, fontWeight: '700', color: '#888888' },
  stepRow: { flexDirection: 'row', width: '100%' },
  stepBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginHorizontal: 2,
  },
  stepBtnText: { fontSize: 18, fontWeight: '900', color: '#111111' },
  previewImg: { width: '100%', height: 320, backgroundColor: '#F1F1F3', marginTop: 8 },
  caption: { fontSize: 11, color: '#888888', marginTop: 6, textAlign: 'center' },
  specBox: { borderWidth: 1, borderColor: '#E5E5E5', marginTop: 12, padding: 12 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
  specK: { fontSize: 10, fontWeight: '800', color: '#888888', letterSpacing: 1 },
  specV: { fontSize: 11, fontWeight: '800', color: '#111111', textAlign: 'right', flex: 1, marginLeft: 12 },
  ctaDark: { backgroundColor: '#111111', paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  ctaDarkText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  ctaLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#111111',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  ctaLightText: { color: '#111111', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  ctaRed: { backgroundColor: '#D71920', paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  ctaDone: { backgroundColor: '#16A34A' },
  ctaRedText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  backBtn: { paddingVertical: 14, paddingHorizontal: 12, minWidth: 84 },
  backText: { fontSize: 11, fontWeight: '900', color: '#555555', letterSpacing: 1 },
  priceBox: { alignItems: 'center' },
  priceLabel: { fontSize: 8, fontWeight: '800', color: '#888888', letterSpacing: 1.5 },
  priceVal: { fontSize: 20, fontWeight: '900', color: '#111111' },
  nextBtn: { backgroundColor: '#111111', paddingVertical: 14, paddingHorizontal: 22, minWidth: 84, alignItems: 'center' },
  nextText: { fontSize: 11, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1 },
});
