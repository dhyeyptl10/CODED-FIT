/**
 * CODED FIT [BLR-ATELIER] — Design Studio
 * Spreadshirt-style 3D Garment Customizer
 * Features:
 *  - Product type selector (Tee, Hoodie, Jacket, Cap, Jogger)
 *  - 40+ fabric color swatches
 *  - Front/Back canvas view toggle
 *  - Text layer: add custom text, pick font, color, size, position
 *  - Graphic layer: pick from preset graphic packs (logos, patterns, motifs)
 *  - 3D depth-shadow illusion for real garment feel
 *  - Size picker + Add to Cart
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Modal,
  Alert,
  Animated,
  PanResponder,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { CartService } from '../services/cart';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const { width: W, height: H } = Dimensions.get('window');
const CANVAS_W = W - 32;
const CANVAS_H = CANVAS_W * 1.2;

// ─── Garment Types ───────────────────────────────────────────
const GARMENT_IMAGES: Record<string,string> = {
  tee: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85',
  hoodie: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=85',
  jacket: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900&q=85',
  jogger: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85',
  cap: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=900&q=85',
  tote: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&q=85',
};

const GARMENT_TYPES = [
  { id: 'tee', label: 'T-SHIRT', emoji: '👕', price: 1299 },
  { id: 'hoodie', label: 'HOODIE', emoji: '🧥', price: 2499 },
  { id: 'jacket', label: 'JACKET', emoji: '🥻', price: 3499 },
  { id: 'jogger', label: 'JOGGER', emoji: '👖', price: 1999 },
  { id: 'cap', label: 'CAP', emoji: '🧢', price: 799 },
  { id: 'tote', label: 'TOTE', emoji: '👜', price: 699 },
];

// ─── Fabric Color Swatches ────────────────────────────────────
const FABRIC_COLORS = [
  { id: 'chalk', label: 'Chalk White', hex: '#F8F8F6', pantone: '11-0601' },
  { id: 'obsidian', label: 'Obsidian', hex: '#0B0B0D', pantone: '19-3911' },
  { id: 'crimson', label: 'BLR Crimson', hex: '#D71920', pantone: '19-1664' },
  { id: 'navy', label: 'Navy Ink', hex: '#1B2A4A', pantone: '19-3832' },
  { id: 'slate', label: 'Slate Grey', hex: '#6B7280', pantone: '17-0205' },
  { id: 'sage', label: 'Sage', hex: '#86A789', pantone: '15-0232' },
  { id: 'sand', label: 'Desert Sand', hex: '#D2B48C', pantone: '14-1118' },
  { id: 'rust', label: 'Rust', hex: '#B7410E', pantone: '18-1450' },
  { id: 'forest', label: 'Forest', hex: '#228B22', pantone: '18-0430' },
  { id: 'burgundy', label: 'Burgundy', hex: '#800020', pantone: '19-1629' },
  { id: 'cobalt', label: 'Cobalt', hex: '#0047AB', pantone: '19-4051' },
  { id: 'mustard', label: 'Mustard', hex: '#FFDB58', pantone: '13-0858' },
  { id: 'lavender', label: 'Lavender', hex: '#B57EDC', pantone: '16-3810' },
  { id: 'pink', label: 'Rose Quartz', hex: '#F4A7B9', pantone: '13-2010' },
  { id: 'teal', label: 'Teal', hex: '#008080', pantone: '17-5126' },
  { id: 'graphite', label: 'Graphite', hex: '#2D2D2D', pantone: '19-0201' },
  { id: 'cream', label: 'Ecru Cream', hex: '#F5F0E8', pantone: '11-0907' },
  { id: 'charcoal', label: 'Charcoal', hex: '#444444', pantone: '19-0302' },
  { id: 'olive', label: 'Olive', hex: '#6B6B2A', pantone: '18-0420' },
  { id: 'blush', label: 'Blush', hex: '#FFB6C1', pantone: '13-2000' },
];

// ─── Graphic Packs ─────────────────────────────────────────────
const GRAPHIC_PACKS = {
  atelier: [
    { id: 'cf-logo', label: 'CF MONOGRAM', symbol: 'CF', type: 'mono' },
    { id: 'blr-badge', label: 'BLR BADGE', symbol: 'BLR', type: 'badge' },
    { id: 'atelier-stamp', label: 'ATELIER STAMP', symbol: 'A', type: 'stamp' },
    { id: 'star-motif', label: 'STAR MOTIF', symbol: '✦', type: 'motif' },
  ],
  street: [
    { id: 'barcode', label: 'BARCODE', symbol: '▮▯▮▮▯', type: 'barcode' },
    { id: 'grid', label: 'GRID PATTERN', symbol: '⊞', type: 'pattern' },
    { id: 'slash', label: 'SLASH', symbol: '///', type: 'text' },
    { id: 'scan', label: 'SCAN LINE', symbol: '━━━', type: 'line' },
  ],
  minimal: [
    { id: 'dot', label: 'DOT MATRIX', symbol: '• • •', type: 'dots' },
    { id: 'line-art', label: 'LINE ART', symbol: '|', type: 'line' },
    { id: 'triangle', label: 'TRIANGLE', symbol: '△', type: 'geo' },
    { id: 'circle', label: 'CIRCLE', symbol: '○', type: 'geo' },
  ],
};

// ─── Font Options ─────────────────────────────────────────────
const FONT_OPTIONS = [
  { id: 'serif', label: 'CLASSIC SERIF', style: { fontFamily: 'serif', fontWeight: '900' as const } },
  { id: 'mono', label: 'MONO TECH', style: { fontFamily: 'monospace', fontWeight: '700' as const } },
  { id: 'sans', label: 'BOLD SANS', style: { fontWeight: '900' as const } },
  { id: 'condensed', label: 'CONDENSED', style: { fontWeight: '900' as const, letterSpacing: -1 } },
];

// ─── Sizes ────────────────────────────────────────────────────
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface TextLayer {
  id: string;
  text: string;
  color: string;
  fontId: string;
  size: number;
  x: number;
  y: number;
  face: 'front' | 'back';
}

interface GraphicLayer {
  id: string;
  graphicId: string;
  symbol: string;
  color: string;
  size: number;
  x: number;
  y: number;
  face: 'front' | 'back';
}

export default function StudioScreen() {
  const router = useRouter();

  // ── Core State ──
  const [garmentType, setGarmentType] = useState(GARMENT_TYPES[0]);
  const [fabricColor, setFabricColor] = useState(FABRIC_COLORS[1]); // Obsidian default
  const [face, setFace] = useState<'front' | 'back'>('front');
  const [activeTab, setActiveTab] = useState<'colors' | 'text' | 'graphics' | 'size'>('colors');
  const [selectedSize, setSelectedSize] = useState('M');
  const [qty, setQty] = useState(1);

  // ── Layer State ──
  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    { id: 'l1', text: 'CODED FIT', color: '#111111', fontId: 'serif', size: 22, x: 0.5, y: 0.35, face: 'front' },
    { id: 'l2', text: '[BLR-ATELIER]', color: '#D71920', fontId: 'mono', size: 10, x: 0.5, y: 0.44, face: 'front' },
  ]);
  const [graphicLayers, setGraphicLayers] = useState<GraphicLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  // ── Text Editor State ──
  const [showTextModal, setShowTextModal] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [editingTextColor, setEditingTextColor] = useState('#FFFFFF');
  const [editingFontId, setEditingFontId] = useState('serif');
  const [editingTextSize, setEditingTextSize] = useState(18);

  // ── Graphic Picker State ──
  const [showGraphicModal, setShowGraphicModal] = useState(false);
  const [graphicPack, setGraphicPack] = useState<keyof typeof GRAPHIC_PACKS>('atelier');
  const [graphicColor, setGraphicColor] = useState('#FFFFFF');

  // ── Success State ──
  const [addedToCart, setAddedToCart] = useState(false);

  // ── 3D Tilt Animation ──
  const tiltX = useRef(new Animated.Value(0)).current;
  const tiltY = useRef(new Animated.Value(0)).current;
  const panRef = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        tiltX.setValue(gs.dx / 8);
        tiltY.setValue(-gs.dy / 8);
      },
      onPanResponderRelease: () => {
        Animated.spring(tiltX, { toValue: 0, useNativeDriver: true }).start();
        Animated.spring(tiltY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  // ── Garment SVG-style Shape ──────────────────────────────────
  const renderGarmentShape = () => {
    const baseColor = fabricColor.hex;
    const isDark = isColorDark(baseColor);
    const shadowColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.08)';
    const highlightColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)';
    const stitchColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';

    switch (garmentType.id) {
      case 'tee':
        return (
          <View style={[styles.garmentContainer, { backgroundColor: baseColor }]}>
            {/* Shoulder seams */}
            <View style={[styles.shoulderLeft, { backgroundColor: shadowColor }]} />
            <View style={[styles.shoulderRight, { backgroundColor: shadowColor }]} />
            {/* Collar */}
            <View style={[styles.collarOuter, { borderColor: stitchColor }]}>
              <View style={[styles.collarInner, { backgroundColor: fabricColor.hex }]} />
            </View>
            {/* Sleeve left */}
            <View style={[styles.sleeveLeft, { backgroundColor: baseColor, borderColor: stitchColor }]}>
              <View style={[styles.sleeveHighlight, { backgroundColor: highlightColor }]} />
            </View>
            {/* Sleeve right */}
            <View style={[styles.sleeveRight, { backgroundColor: baseColor, borderColor: stitchColor }]}>
              <View style={[styles.sleeveHighlight, { backgroundColor: highlightColor }]} />
            </View>
            {/* Body fold shadow */}
            <View style={[styles.bodyFoldLeft, { backgroundColor: shadowColor }]} />
            <View style={[styles.bodyFoldRight, { backgroundColor: shadowColor }]} />
            {/* Chest highlight */}
            <View style={[styles.chestHighlight, { backgroundColor: highlightColor }]} />
            {/* Bottom hem */}
            <View style={[styles.hemLine, { borderColor: stitchColor }]} />
            {/* Side stitch lines */}
            <View style={[styles.stitchLeft, { borderColor: stitchColor }]} />
            <View style={[styles.stitchRight, { borderColor: stitchColor }]} />
          </View>
        );
      case 'hoodie':
        return (
          <View style={[styles.garmentContainer, { backgroundColor: baseColor }]}>
            <View style={[styles.shoulderLeft, { backgroundColor: shadowColor }]} />
            <View style={[styles.shoulderRight, { backgroundColor: shadowColor }]} />
            {/* Hood */}
            <View style={[styles.hood, { backgroundColor: baseColor, borderColor: stitchColor }]}>
              <View style={[styles.hoodInner, { backgroundColor: shadowColor }]} />
            </View>
            {/* Kangaroo pocket */}
            <View style={[styles.kangarooPocket, { borderColor: stitchColor, backgroundColor: shadowColor }]} />
            {/* Ribbed hem */}
            <View style={[styles.ribbedHem, { borderColor: stitchColor }]} />
            <View style={[styles.sleeveLeft, { backgroundColor: baseColor, borderColor: stitchColor, top: 110 }]}>
              <View style={[styles.sleeveHighlight, { backgroundColor: highlightColor }]} />
            </View>
            <View style={[styles.sleeveRight, { backgroundColor: baseColor, borderColor: stitchColor, top: 110 }]}>
              <View style={[styles.sleeveHighlight, { backgroundColor: highlightColor }]} />
            </View>
            <View style={[styles.chestHighlight, { backgroundColor: highlightColor, top: 170 }]} />
            <View style={[styles.stitchLeft, { borderColor: stitchColor }]} />
            <View style={[styles.stitchRight, { borderColor: stitchColor }]} />
          </View>
        );
      case 'jacket':
        return (
          <View style={[styles.garmentContainer, { backgroundColor: baseColor }]}>
            {/* Lapels */}
            <View style={[styles.lapelLeft, { backgroundColor: baseColor, borderColor: stitchColor }]}>
              <View style={[styles.lapelHighlight, { backgroundColor: highlightColor }]} />
            </View>
            <View style={[styles.lapelRight, { backgroundColor: baseColor, borderColor: stitchColor }]}>
              <View style={[styles.lapelHighlight, { backgroundColor: highlightColor }]} />
            </View>
            {/* Center button line */}
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={[styles.button, { top: 190 + i * 26, backgroundColor: isDark ? '#888' : '#333' }]} />
            ))}
            <View style={[styles.sleeveLeft, { backgroundColor: baseColor, borderColor: stitchColor, top: 100, height: 170 }]}>
              <View style={[styles.sleeveHighlight, { backgroundColor: highlightColor }]} />
            </View>
            <View style={[styles.sleeveRight, { backgroundColor: baseColor, borderColor: stitchColor, top: 100, height: 170 }]}>
              <View style={[styles.sleeveHighlight, { backgroundColor: highlightColor }]} />
            </View>
            <View style={[styles.chestHighlight, { backgroundColor: highlightColor }]} />
            <View style={[styles.hemLine, { bottom: 20, borderColor: stitchColor }]} />
          </View>
        );
      default:
        return (
          <View style={[styles.garmentContainer, { backgroundColor: baseColor }]}>
            <View style={[styles.chestHighlight, { backgroundColor: highlightColor }]} />
            <View style={[styles.hemLine, { borderColor: stitchColor }]} />
          </View>
        );
    }
  };

  // ── Check if color is dark ──────────────────────────────────
  const isColorDark = (hex: string): boolean => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  };

  // ── Render layers on canvas ──────────────────────────────────
  const renderTextLayers = () =>
    textLayers
      .filter(l => l.face === face)
      .map(layer => {
        const font = FONT_OPTIONS.find(f => f.id === layer.fontId) || FONT_OPTIONS[0];
        const isSelected = selectedLayer === layer.id;
        return (
          <TouchableOpacity
            key={layer.id}
            onPress={() => setSelectedLayer(isSelected ? null : layer.id)}
            onLongPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setTextLayers(prev => prev.filter(l => l.id !== layer.id));
            }}
            style={[
              styles.textLayerPin,
              {
                left: layer.x * CANVAS_W - 60,
                top: layer.y * CANVAS_H - 20,
                borderWidth: isSelected ? 1 : 0,
                borderColor: '#D71920',
                borderStyle: 'dashed',
              },
            ]}
          >
            <Text style={[{ color: layer.color, fontSize: layer.size }, font.style]}>
              {layer.text}
            </Text>
          </TouchableOpacity>
        );
      });

  const renderGraphicLayers = () =>
    graphicLayers
      .filter(l => l.face === face)
      .map(layer => {
        const isSelected = selectedLayer === layer.id;
        return (
          <TouchableOpacity
            key={layer.id}
            onPress={() => setSelectedLayer(isSelected ? null : layer.id)}
            onLongPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setGraphicLayers(prev => prev.filter(l => l.id !== layer.id));
            }}
            style={[
              styles.textLayerPin,
              {
                left: layer.x * CANVAS_W - 30,
                top: layer.y * CANVAS_H - 30,
                borderWidth: isSelected ? 1 : 0,
                borderColor: '#D71920',
                borderStyle: 'dashed',
              },
            ]}
          >
            <Text style={{ color: layer.color, fontSize: layer.size, fontWeight: '900' }}>
              {layer.symbol}
            </Text>
          </TouchableOpacity>
        );
      });

  // ── Add Text Layer ──────────────────────────────────────────
  const addTextLayer = () => {
    if (!editingText.trim()) return;
    const newLayer: TextLayer = {
      id: `tl-${Date.now()}`,
      text: editingText.trim(),
      color: editingTextColor,
      fontId: editingFontId,
      size: editingTextSize,
      x: 0.5,
      y: 0.5,
      face,
    };
    setTextLayers(prev => [...prev, newLayer]);
    setShowTextModal(false);
    setEditingText('');
  };

  // ── Add Graphic Layer ─────────────────────────────────────────
  const addGraphicLayer = (graphic: typeof GRAPHIC_PACKS.atelier[0]) => {
    const newLayer: GraphicLayer = {
      id: `gl-${Date.now()}`,
      graphicId: graphic.id,
      symbol: graphic.symbol,
      color: graphicColor,
      size: 48,
      x: 0.5,
      y: 0.5,
      face,
    };
    setGraphicLayers(prev => [...prev, newLayer]);
    setShowGraphicModal(false);
  };

  // ── Add to Cart ───────────────────────────────────────────────
  const handleAddToCart = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const customProduct = {
      id: `custom-${garmentType.id}-${Date.now()}`,
      name: `Custom ${garmentType.label} — ${fabricColor.label}`,
      category: 'T-Shirts' as const,
      price: garmentType.price + (textLayers.length * 150) + (graphicLayers.length * 100),
      mrp: garmentType.price * 1.5,
      badge: 'BESPOKE OPTION' as const,
      fabric: '280 GSM GOTS Organic Cotton',
      dispatch: 'Ships in 5–7 Days',
      stockLeft: 99,
      hypeRating: 100,
      sizes: SIZES,
      outOfStock: [],
      funnel: 'custom-made' as const,
      gender: 'unisex' as const,
      images: [],
      description: `Bespoke ${garmentType.label} in ${fabricColor.label}. ${textLayers.length} text layers + ${graphicLayers.length} graphic layers. Designed in CODED FIT Design Studio.`,
    };
    await CartService.addItem(customProduct, selectedSize, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Top Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEye}>CODED FIT [BLR-ATELIER]</Text>
          <Text style={styles.headerTitle}>DESIGN STUDIO</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.cartBtn}>
          <Text style={styles.cartBtnText}>BAG</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

        {/* ── Garment Type Selector ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll} contentContainerStyle={styles.typeScrollContent}>
          {GARMENT_TYPES.map(gt => (
            <TouchableOpacity
              key={gt.id}
              onPress={() => { setGarmentType(gt); Haptics.selectionAsync(); }}
              style={[styles.typeChip, garmentType.id === gt.id && styles.typeChipActive]}
            >
              <Text style={[styles.typeLabel, garmentType.id === gt.id && styles.typeLabelActive]}>
                {gt.label}
              </Text>
              <Text style={styles.typePrice}>₹{gt.price.toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Canvas Area ── */}
        <View style={styles.canvasWrapper}>
          {/* Face Toggle */}
          <View style={styles.faceToggle}>
            <TouchableOpacity
              onPress={() => { setFace('front'); Haptics.selectionAsync(); }}
              style={[styles.faceBtn, face === 'front' && styles.faceBtnActive]}
            >
              <Text style={[styles.faceBtnText, face === 'front' && styles.faceBtnTextActive]}>FRONT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setFace('back'); Haptics.selectionAsync(); }}
              style={[styles.faceBtn, face === 'back' && styles.faceBtnActive]}
            >
              <Text style={[styles.faceBtnText, face === 'back' && styles.faceBtnTextActive]}>BACK</Text>
            </TouchableOpacity>
          </View>

          {/* 3D Garment Canvas */}
          <Animated.View
            {...panRef.panHandlers}
            style={[
              styles.canvas,
              {
                transform: [
                  { perspective: 1000 },
                  { rotateY: tiltX.interpolate({ inputRange: [-15, 15], outputRange: ['-8deg', '8deg'] }) },
                  { rotateX: tiltY.interpolate({ inputRange: [-15, 15], outputRange: ['-8deg', '8deg'] }) },
                ],
              },
            ]}
          >
            {/* Garment shape */}
            {renderGarmentShape()}

            {/* Layer overlays */}
            <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
              {renderTextLayers()}
              {renderGraphicLayers()}
            </View>

            {/* Tap hint */}
            {textLayers.filter(l => l.face === face).length === 0 &&
              graphicLayers.filter(l => l.face === face).length === 0 && (
                <View style={styles.canvasHint} pointerEvents="none">
                  <Text style={styles.canvasHintText}>+ ADD TEXT OR GRAPHIC{'\n'}TO THIS SIDE</Text>
                </View>
              )}

            {/* Face label */}
            <View style={styles.faceLabelBadge} pointerEvents="none">
              <Text style={styles.faceLabelText}>{face.toUpperCase()} VIEW</Text>
            </View>
          </Animated.View>

          <Text style={styles.dragHint}>Drag to rotate · Long-press layer to delete</Text>
        </View>

        {/* ── Tool Tabs ── */}
        <View style={styles.toolTabs}>
          {(['colors', 'text', 'graphics', 'size'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => { setActiveTab(tab); Haptics.selectionAsync(); }}
              style={[styles.toolTab, activeTab === tab && styles.toolTabActive]}
            >
              <Text style={[styles.toolTabText, activeTab === tab && styles.toolTabTextActive]}>
                {tab === 'colors' ? 'COLOR' : tab === 'text' ? 'TEXT' : tab === 'graphics' ? 'GRAPHIC' : 'SIZE'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Color Picker Panel ── */}
        {activeTab === 'colors' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>FABRIC COLOR · PANTONE SYSTEM</Text>
            <Text style={styles.panelSub}>Selected: {fabricColor.label} · P{fabricColor.pantone} TPX</Text>
            <View style={styles.colorGrid}>
              {FABRIC_COLORS.map(c => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => { setFabricColor(c); Haptics.selectionAsync(); }}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: c.hex },
                    fabricColor.id === c.id && styles.colorSwatchSelected,
                  ]}
                >
                  {fabricColor.id === c.id && (
                    <Text style={[styles.checkmark, { color: isColorDark(c.hex) ? '#fff' : '#000' }]}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── Text Panel ── */}
        {activeTab === 'text' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>TEXT LAYERS</Text>
            <Text style={styles.panelSub}>Long-press a layer on canvas to delete · Tap to select</Text>
            <TouchableOpacity style={styles.addLayerBtn} onPress={() => setShowTextModal(true)}>
              <Text style={styles.addLayerBtnText}>+ ADD TEXT LAYER</Text>
            </TouchableOpacity>
            <View style={styles.layerList}>
              {textLayers.filter(l => l.face === face).map(l => (
                <View key={l.id} style={styles.layerItem}>
                  <View style={[styles.layerColorDot, { backgroundColor: l.color, borderWidth: 1, borderColor: '#ddd' }]} />
                  <Text style={styles.layerItemText}>{l.text}</Text>
                  <Text style={styles.layerItemMeta}>{l.size}pt</Text>
                  <TouchableOpacity onPress={() => setTextLayers(p => p.filter(x => x.id !== l.id))}>
                    <Text style={styles.deleteLayerBtn}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Graphics Panel ── */}
        {activeTab === 'graphics' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>GRAPHIC LAYERS</Text>
            <Text style={styles.panelSub}>Long-press a layer on canvas to delete</Text>
            <TouchableOpacity style={styles.addLayerBtn} onPress={() => setShowGraphicModal(true)}>
              <Text style={styles.addLayerBtnText}>+ BROWSE GRAPHICS</Text>
            </TouchableOpacity>
            <View style={styles.layerList}>
              {graphicLayers.filter(l => l.face === face).map(l => (
                <View key={l.id} style={styles.layerItem}>
                  <Text style={[styles.layerGraphicSymbol, { color: l.color }]}>{l.symbol}</Text>
                  <Text style={styles.layerItemText}>{l.graphicId}</Text>
                  <TouchableOpacity onPress={() => setGraphicLayers(p => p.filter(x => x.id !== l.id))}>
                    <Text style={styles.deleteLayerBtn}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Size Panel ── */}
        {activeTab === 'size' && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>SIZE SELECTION</Text>
            <View style={styles.sizeGrid}>
              {SIZES.map(s => (
                <TouchableOpacity
                  key={s}
                  onPress={() => { setSelectedSize(s); Haptics.selectionAsync(); }}
                  style={[styles.sizeChip, selectedSize === s && styles.sizeChipActive]}
                >
                  <Text style={[styles.sizeChipText, selectedSize === s && styles.sizeChipTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.panelTitle, { marginTop: 16 }]}>QUANTITY</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity onPress={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity onPress={() => setQty(q => q + 1)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Price Summary ── */}
        <View style={styles.priceBar}>
          <View>
            <Text style={styles.priceLabel}>CUSTOM BUILD PRICE</Text>
            <Text style={styles.priceValue}>
              ₹{(garmentType.price + textLayers.length * 150 + graphicLayers.length * 100).toLocaleString()}
            </Text>
            <Text style={styles.priceSub}>
              Base ₹{garmentType.price.toLocaleString()} + {textLayers.length} text + {graphicLayers.length} graphic layers
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addToCartBtn, addedToCart && styles.addedBtn]}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Text style={styles.addToCartText}>
              {addedToCart ? 'ADDED ✓' : 'ADD TO BAG'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Text Editor Modal ── */}
      <Modal visible={showTextModal} transparent animationType="slide" onRequestClose={() => setShowTextModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>ADD TEXT LAYER</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Enter your text..."
              placeholderTextColor="#999"
              value={editingText}
              onChangeText={setEditingText}
              autoFocus
              maxLength={40}
            />

            <Text style={styles.modalSectionLabel}>FONT STYLE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {FONT_OPTIONS.map(f => (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => setEditingFontId(f.id)}
                  style={[styles.fontChip, editingFontId === f.id && styles.fontChipActive]}
                >
                  <Text style={[styles.fontChipText, f.style, editingFontId === f.id && { color: '#fff' }]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalSectionLabel}>TEXT COLOR</Text>
            <View style={styles.miniColorRow}>
              {['#FFFFFF', '#0B0B0D', '#D71920', '#75C8EE', '#86A789', '#1B2A4A', '#B7410E', '#808080'].map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setEditingTextColor(c)}
                  style={[styles.miniSwatch, { backgroundColor: c }, editingTextColor === c && styles.miniSwatchSelected]}
                />
              ))}
            </View>

            <Text style={styles.modalSectionLabel}>FONT SIZE: {editingTextSize}pt</Text>
            <View style={styles.sizeSliderRow}>
              {[12, 16, 20, 24, 28, 32, 40, 48].map(s => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setEditingTextSize(s)}
                  style={[styles.sizePill, editingTextSize === s && styles.sizePillActive]}
                >
                  <Text style={[styles.sizePillText, editingTextSize === s && { color: '#fff' }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Preview */}
            <View style={[styles.previewBox, { backgroundColor: fabricColor.hex }]}>
              <Text style={[
                { color: editingTextColor, fontSize: editingTextSize },
                FONT_OPTIONS.find(f => f.id === editingFontId)?.style,
              ]}>
                {editingText || 'Preview Text'}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowTextModal(false)} style={styles.modalCancel}>
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addTextLayer} style={styles.modalConfirm}>
                <Text style={styles.modalConfirmText}>ADD TO {face.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Graphic Picker Modal ── */}
      <Modal visible={showGraphicModal} transparent animationType="slide" onRequestClose={() => setShowGraphicModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>GRAPHIC LIBRARY</Text>

            {/* Pack tabs */}
            <View style={styles.packTabs}>
              {(['atelier', 'street', 'minimal'] as const).map(pack => (
                <TouchableOpacity
                  key={pack}
                  onPress={() => setGraphicPack(pack)}
                  style={[styles.packTab, graphicPack === pack && styles.packTabActive]}
                >
                  <Text style={[styles.packTabText, graphicPack === pack && styles.packTabTextActive]}>
                    {pack.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Graphic color */}
            <Text style={styles.modalSectionLabel}>GRAPHIC COLOR</Text>
            <View style={styles.miniColorRow}>
              {['#FFFFFF', '#0B0B0D', '#D71920', '#75C8EE', '#86A789', '#1B2A4A'].map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setGraphicColor(c)}
                  style={[styles.miniSwatch, { backgroundColor: c }, graphicColor === c && styles.miniSwatchSelected]}
                />
              ))}
            </View>

            {/* Graphics grid */}
            <View style={styles.graphicsGrid}>
              {GRAPHIC_PACKS[graphicPack].map(g => (
                <TouchableOpacity
                  key={g.id}
                  onPress={() => addGraphicLayer(g)}
                  style={[styles.graphicTile, { backgroundColor: fabricColor.hex }]}
                >
                  <Text style={[styles.graphicTileSymbol, { color: graphicColor }]}>{g.symbol}</Text>
                  <Text style={styles.graphicTileLabel}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={() => setShowGraphicModal(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerEye: { fontSize: 9, fontWeight: '700', color: COLORS.accent, letterSpacing: 2, textTransform: 'uppercase' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 1 },
  cartBtn: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.textPrimary },
  cartBtnText: { fontSize: 11, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 2 },

  // Garment Type
  typeScroll: { marginTop: 12 },
  typeScrollContent: { paddingHorizontal: 16, gap: 8 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card, marginRight: 8 },
  typeChipActive: { borderColor: COLORS.textPrimary, backgroundColor: COLORS.textPrimary },
  typeLabel: { fontSize: 11, fontWeight: '900', color: COLORS.textSecondary, letterSpacing: 1 },
  typeLabelActive: { color: '#111111' },
  typePrice: { fontSize: 9, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },

  // Canvas
  canvasWrapper: { alignItems: 'center', paddingTop: 16, paddingBottom: 8 },
  faceToggle: { flexDirection: 'row', borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 },
  faceBtn: { paddingHorizontal: 24, paddingVertical: 8 },
  faceBtnActive: { backgroundColor: COLORS.textPrimary },
  faceBtnText: { fontSize: 11, fontWeight: '900', color: COLORS.textMuted, letterSpacing: 2 },
  faceBtnTextActive: { color: '#111111' },

  canvas: {
    width: CANVAS_W,
    height: CANVAS_H,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    position: 'relative',
  },

  // Garment pieces
  garmentContainer: {
    position: 'absolute',
    top: 40,
    left: CANVAS_W * 0.15,
    right: CANVAS_W * 0.15,
    bottom: 40,
    borderRadius: 4,
  },
  shoulderLeft: {
    position: 'absolute', top: 0, left: -CANVAS_W * 0.08, width: CANVAS_W * 0.16, height: 60,
    borderBottomRightRadius: 20,
  },
  shoulderRight: {
    position: 'absolute', top: 0, right: -CANVAS_W * 0.08, width: CANVAS_W * 0.16, height: 60,
    borderBottomLeftRadius: 20,
  },
  collarOuter: { position: 'absolute', top: -16, left: '30%', right: '30%', height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  collarInner: { width: '60%', height: 22, borderRadius: 11 },
  sleeveLeft: { position: 'absolute', top: 0, left: -CANVAS_W * 0.22, width: CANVAS_W * 0.18, height: 150, borderRadius: 4, borderWidth: 1, overflow: 'hidden' },
  sleeveRight: { position: 'absolute', top: 0, right: -CANVAS_W * 0.22, width: CANVAS_W * 0.18, height: 150, borderRadius: 4, borderWidth: 1, overflow: 'hidden' },
  sleeveHighlight: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '35%' },
  bodyFoldLeft: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '12%' },
  bodyFoldRight: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '12%' },
  chestHighlight: { position: 'absolute', top: 10, left: '5%', width: '30%', height: '45%', opacity: 0.6 },
  hemLine: { position: 'absolute', bottom: 10, left: 0, right: 0, height: 6, borderTopWidth: 1 },
  stitchLeft: { position: 'absolute', top: '15%', bottom: '8%', left: 6, borderLeftWidth: 1, borderStyle: 'dotted' },
  stitchRight: { position: 'absolute', top: '15%', bottom: '8%', right: 6, borderRightWidth: 1, borderStyle: 'dotted' },

  // Hoodie-specific
  hood: { position: 'absolute', top: -45, left: '20%', right: '20%', height: 55, borderRadius: 8, borderWidth: 1 },
  hoodInner: { margin: 6, flex: 1, borderRadius: 6 },
  kangarooPocket: { position: 'absolute', bottom: '25%', left: '15%', right: '15%', height: '20%', borderRadius: 4, borderWidth: 1 },
  ribbedHem: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, borderTopWidth: 2, borderStyle: 'dashed' },

  // Jacket-specific
  lapelLeft: { position: 'absolute', top: 0, left: 0, width: '45%', bottom: 0, borderRightWidth: 1 },
  lapelRight: { position: 'absolute', top: 0, right: 0, width: '45%', bottom: 0, borderLeftWidth: 1 },
  lapelHighlight: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '25%' },
  button: { position: 'absolute', left: '50%', marginLeft: -4, width: 8, height: 8, borderRadius: 4 },

  // Layers
  textLayerPin: { position: 'absolute', padding: 4 },

  // Hints
  canvasHint: { position: 'absolute', top: '42%', left: 0, right: 0, alignItems: 'center' },
  canvasHintText: { color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: '700', letterSpacing: 2, textAlign: 'center' },
  faceLabelBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3 },
  faceLabelText: { color: '#fff', fontSize: 8, fontWeight: '800', letterSpacing: 2 },
  dragHint: { fontSize: 9, color: COLORS.textMuted, letterSpacing: 1, marginTop: 6, textTransform: 'uppercase' },

  // Tool Tabs
  toolTabs: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, borderWidth: 1, borderColor: COLORS.border },
  toolTab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  toolTabActive: { backgroundColor: COLORS.textPrimary },
  toolTabText: { fontSize: 9, fontWeight: '900', color: COLORS.textMuted, letterSpacing: 1 },
  toolTabTextActive: { color: '#111111' },

  // Panels
  panel: { marginHorizontal: 16, marginTop: 16, padding: 16, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  panelTitle: { fontSize: 10, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 2, marginBottom: 4 },
  panelSub: { fontSize: 10, color: COLORS.textMuted, marginBottom: 14 },

  // Color Grid
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorSwatch: { width: 40, height: 40, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  colorSwatchSelected: { borderColor: COLORS.accent, borderWidth: 2 },
  checkmark: { fontSize: 18, fontWeight: '900' },

  // Layer list
  addLayerBtn: { borderWidth: 1, borderColor: COLORS.textPrimary, paddingVertical: 12, alignItems: 'center', marginBottom: 12, borderStyle: 'dashed' },
  addLayerBtnText: { fontSize: 11, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 2 },
  layerList: { gap: 8 },
  layerItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  layerColorDot: { width: 16, height: 16, borderRadius: 8 },
  layerItemText: { flex: 1, fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  layerItemMeta: { fontSize: 11, color: COLORS.textMuted },
  deleteLayerBtn: { fontSize: 14, color: COLORS.accent, fontWeight: '900', paddingHorizontal: 8 },
  layerGraphicSymbol: { fontSize: 20, fontWeight: '900', width: 32 },

  // Size
  sizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeChip: { width: 52, height: 52, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  sizeChipActive: { backgroundColor: COLORS.textPrimary, borderColor: COLORS.textPrimary },
  sizeChipText: { fontSize: 13, fontWeight: '900', color: COLORS.textSecondary },
  sizeChipTextActive: { color: '#111111' },

  // Qty
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 12 },
  qtyBtn: { width: 40, height: 40, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 20, fontWeight: '900', color: COLORS.textPrimary },
  qtyValue: { fontSize: 22, fontWeight: '900', color: COLORS.textPrimary, minWidth: 32, textAlign: 'center' },

  // Price bar
  priceBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 16, padding: 16, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  priceLabel: { fontSize: 9, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 2, textTransform: 'uppercase' },
  priceValue: { fontSize: 24, fontWeight: '900', color: COLORS.textPrimary },
  priceSub: { fontSize: 9, color: COLORS.textMuted, marginTop: 2 },
  addToCartBtn: { backgroundColor: COLORS.textPrimary, paddingHorizontal: 20, paddingVertical: 16 },
  addedBtn: { backgroundColor: COLORS.success },
  addToCartText: { fontSize: 11, fontWeight: '900', color: '#111111', letterSpacing: 2 },

  // Modals
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: { backgroundColor: COLORS.card, padding: 20, paddingBottom: 36, maxHeight: H * 0.85 },
  modalTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 2, marginBottom: 16 },
  modalSectionLabel: { fontSize: 9, fontWeight: '900', color: COLORS.textMuted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, marginTop: 12 },
  textInput: { borderWidth: 1, borderColor: COLORS.border, padding: 14, fontSize: 16, color: COLORS.textPrimary, marginBottom: 12, fontWeight: '700' },
  fontChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  fontChipActive: { backgroundColor: COLORS.textPrimary, borderColor: COLORS.textPrimary },
  fontChipText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  miniColorRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  miniSwatch: { width: 32, height: 32, borderWidth: 1, borderColor: COLORS.border },
  miniSwatchSelected: { borderColor: COLORS.accent, borderWidth: 3 },
  sizeSliderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  sizePill: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.border },
  sizePillActive: { backgroundColor: COLORS.textPrimary },
  sizePillText: { fontSize: 11, fontWeight: '800', color: COLORS.textSecondary },
  previewBox: { alignItems: 'center', justifyContent: 'center', height: 80, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancel: { flex: 1, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 14, alignItems: 'center' },
  modalCancelText: { fontSize: 11, fontWeight: '900', color: COLORS.textSecondary, letterSpacing: 2 },
  modalConfirm: { flex: 2, backgroundColor: COLORS.textPrimary, paddingVertical: 14, alignItems: 'center' },
  modalConfirmText: { fontSize: 11, fontWeight: '900', color: '#111111', letterSpacing: 2 },

  // Graphic modal
  packTabs: { flexDirection: 'row', borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 },
  packTab: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  packTabActive: { backgroundColor: COLORS.textPrimary },
  packTabText: { fontSize: 10, fontWeight: '900', color: COLORS.textMuted, letterSpacing: 1 },
  packTabTextActive: { color: '#111111' },
  graphicsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  graphicTile: { width: (W - 80) / 4, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  graphicTileSymbol: { fontSize: 22, fontWeight: '900' },
  graphicTileLabel: { fontSize: 7, color: COLORS.textMuted, marginTop: 4, fontWeight: '700', letterSpacing: 0.5, textAlign: 'center' },
});
