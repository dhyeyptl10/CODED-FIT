/**
 * CODED-FIT / NOVA STREET — AI Clothes Changer & 3D Body Visualizer Studio
 * Official Perfect Corp YouCam Generative AI Engine Integration + BodyVisualizer.ai Simulator
 * Features: Live AR Camera Try-On, Interactive Morphing Body Visualizer, Supermodels, Before/After Slider
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import {
  YOUCAM_SUPERMODELS,
  YOUCAM_GARMENTS,
  YouCamSupermodel,
  YouCamGarment,
  YouCamService,
} from '../../services/youcam';
import { CartService } from '../../services/cart';
import { useCamera } from '../../hooks/useCamera';
import { useShare } from '../../hooks/useShare';
import { useNotifications } from '../../hooks/useNotifications';
import { GarmentCard } from '../../components/GarmentCard';
import { GoldButton } from '../../components/ui/GoldButton';
import { Badge } from '../../components/ui/Badge';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLOR_SWATCHES = [
  { name: 'Ivory White', hex: '#F5F2E7' },
  { name: 'Royal Purple', hex: '#4C1D95' },
  { name: 'Midnight Navy', hex: '#1c2536' },
  { name: 'Onyx Black', hex: '#18181B' },
  { name: 'Peach Terracotta', hex: '#EECDAF' },
  { name: 'Warm Gold', hex: '#C9A84C' },
  { name: 'Forest Sage', hex: '#4A7C6F' },
  { name: 'Dusty Rose', hex: '#EC4899' },
];

export default function TryOnScreen() {
  const [activeGender, setActiveGender] = useState<'men' | 'women'>('women');
  const [activeTab, setActiveTab] = useState<'clothes' | 'body' | 'camera'>('clothes');
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);
  const [selectedGarmentIdx, setSelectedGarmentIdx] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0]);
  const [sliderSplit, setSliderSplit] = useState<number>(50); // 0-100%
  const [isAIProcessing, setIsAIProcessing] = useState<boolean>(false);
  const [fitScore, setFitScore] = useState<number>(99.4);

  // Body Visualizer Anthropometrics State
  const [heightCm, setHeightCm] = useState<number>(176);
  const [weightKg, setWeightKg] = useState<number>(58);
  const [chestIn, setChestIn] = useState<number>(34);
  const [waistIn, setWaistIn] = useState<number>(25);
  const [hipIn, setHipIn] = useState<number>(36);
  const [bodyShape, setBodyShape] = useState<string>('hourglass');

  // Native Hooks
  const camera = useCamera();
  const { shareOutfitLook } = useShare();
  const { scheduleBespokeMilestoneAlert } = useNotifications();

  const currentModels = YOUCAM_SUPERMODELS.filter(m => m.gender === activeGender);
  const currentGarments = YOUCAM_GARMENTS.filter(g => g.gender === activeGender);
  const currentModel = currentModels[selectedModelIdx] || currentModels[0];
  const currentGarment = currentGarments[selectedGarmentIdx] || currentGarments[0];

  // Calculate live BMI
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  // Recommended Size from BMI & Chest
  const getRecommendedSize = () => {
    if (bmi < 18.5) return 'XS';
    if (bmi < 22) return 'S';
    if (bmi < 25) return 'M';
    if (bmi < 29) return 'L';
    return 'XL / Bespoke';
  };

  const executeAITryOn = async (garment: YouCamGarment) => {
    setIsAIProcessing(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}

    try {
      const result = await YouCamService.executeClothesTryOn({
        modelImageUrl: camera.capturedPhoto?.uri || currentModel.beforeImageUrl,
        garmentImageUrl: garment.imageUrl,
        garmentType: garment.garmentType,
        bodyParameters: { heightCm, weightKg, chestIn, waistIn, hipIn },
      });

      if (result.success) {
        setFitScore(result.fitScore);
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (_) {}
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleSelectModel = (idx: number) => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    setSelectedModelIdx(idx);
    camera.clearPhoto();
    const model = currentModels[idx];
    if (model) {
      setHeightCm(model.heightCm);
      setWeightKg(model.weightKg);
      setChestIn(model.chestIn);
      setWaistIn(model.waistIn);
      setHipIn(model.hipIn);
      setBodyShape(model.bodyShape);
    }
  };

  const handleSelectGarment = (idx: number) => {
    setSelectedGarmentIdx(idx);
    executeAITryOn(currentGarments[idx]);
  };

  const handleShapePreset = (shape: string) => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    setBodyShape(shape);
    if (shape === 'athletic') {
      setChestIn(activeGender === 'women' ? 36 : 42);
      setWaistIn(activeGender === 'women' ? 26 : 30);
      setHipIn(activeGender === 'women' ? 37 : 38);
    } else if (shape === 'hourglass') {
      setChestIn(36);
      setWaistIn(24);
      setHipIn(38);
    } else if (shape === 'rectangle') {
      setChestIn(activeGender === 'women' ? 33 : 38);
      setWaistIn(activeGender === 'women' ? 28 : 32);
      setHipIn(activeGender === 'women' ? 35 : 37);
    } else if (shape === 'pear') {
      setChestIn(activeGender === 'women' ? 33 : 38);
      setWaistIn(activeGender === 'women' ? 27 : 33);
      setHipIn(activeGender === 'women' ? 42 : 40);
    } else if (shape === 'inverted_triangle') {
      setChestIn(activeGender === 'women' ? 38 : 44);
      setWaistIn(activeGender === 'women' ? 27 : 32);
      setHipIn(activeGender === 'women' ? 34 : 37);
    } else if (shape === 'plus') {
      setWeightKg(activeGender === 'women' ? 78 : 95);
      setChestIn(activeGender === 'women' ? 42 : 46);
      setWaistIn(activeGender === 'women' ? 36 : 40);
      setHipIn(activeGender === 'women' ? 46 : 44);
    }
  };

  const handleAddOutfitToBag = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}

    const bespokeItem: any = {
      id: 'bespoke_' + currentGarment.id + '_' + Date.now(),
      name: currentGarment.name + ' (Custom AI Fit)',
      category: currentGarment.category,
      price: currentGarment.price,
      mrp: Math.round(currentGarment.price * 1.35),
      badge: 'BESPOKE OPTION',
      fabric: currentGarment.fabric,
      dispatch: 'Bespoke Made-to-Measure 7-14 Days',
      stockLeft: 10,
      hypeRating: 98,
      sizes: ['Custom 3D'],
      outOfStock: [],
      funnel: 'custom-made',
      gender: activeGender,
      images: [currentGarment.imageUrl],
      description: 'Bespoke tailored outfit using your exact 3D metrics (Height: ' + heightCm + 'cm, Weight: ' + weightKg + 'kg, Chest: ' + chestIn + '", Waist: ' + waistIn + '", Hips: ' + hipIn + '").',
    };

    await CartService.addItem(
      bespokeItem,
      'Custom 3D',
      1,
      selectedColor.name,
      { heightCm, weightKg, bmi, chest: chestIn, waist: waistIn, hip: hipIn }
    );

    scheduleBespokeMilestoneAlert(currentGarment.name);
    Alert.alert(
      '✦ BESPOKE OUTFIT ADDED',
      'Your custom tailored ' + currentGarment.name + ' with ' + selectedColor.name + ' shade and exact 3D anthropometrics has been added to your shopping bag.',
      [{ text: 'CONTINUE SHOPPING' }]
    );
  };

  const handleOpenLiveCamera = async () => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    if (!camera.isPermissionGranted) {
      await camera.requestPermission();
    }
    setActiveTab('camera');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Top Header Bar ── */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>AI TRY-ON STUDIO</Text>
          <Text style={styles.subTitle}>
            Perfect Corp YouCam Generative Engine · 99.4% Fit Accuracy
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => shareOutfitLook(camera.capturedPhoto?.uri, currentGarment.name)}
          style={styles.shareBtn}
        >
          <Text style={{ fontSize: 16 }}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ── MAIN STUDIO VIEWPORT CANVAS ── */}
        <View style={styles.canvasContainer}>
          {activeTab === 'camera' ? (
            /* 1. LIVE AR CAMERA VIEWPORT */
            camera.isPermissionGranted ? (
              <View style={styles.cameraWrap}>
                <CameraView
                  ref={camera.cameraRef}
                  facing={camera.facing}
                  flash={camera.flash}
                  style={StyleSheet.absoluteFillObject}
                />

                {/* AR 3D Body Outline Alignment Frame */}
                <View style={styles.arOverlay}>
                  <View style={styles.arHeadGuide} />
                  <View style={styles.arShoulderGuide} />
                  <View style={styles.arTorsoGuide} />
                  <View style={styles.arHipsGuide} />
                  <Text style={styles.arGuideText}>Align your body within the frame</Text>
                </View>

                {/* Camera Control Bar */}
                <View style={styles.cameraControls}>
                  <TouchableOpacity onPress={camera.toggleCameraFacing} style={styles.camIconBtn}>
                    <Text style={{ color: '#fff', fontSize: 18 }}>🔄</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={async () => {
                      const photo = await camera.takePhoto();
                      if (photo) {
                        setActiveTab('clothes');
                        executeAITryOn(currentGarment);
                      }
                    }}
                    style={styles.camShutterBtn}
                  >
                    <View style={styles.camShutterInner} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={camera.toggleFlash} style={styles.camIconBtn}>
                    <Text style={{ color: '#fff', fontSize: 18 }}>
                      {camera.flash === 'on' ? '⚡' : camera.flash === 'auto' ? '🅰️' : '🚫'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* Camera Permission Request Fallback View */
              <View style={styles.permissionCard}>
                <Text style={{ fontSize: 44, marginBottom: 12 }}>📸</Text>
                <Text style={styles.permissionTitle}>Camera Access Required</Text>
                <Text style={styles.permissionSub}>
                  Allow camera access to try on high-fashion outfits on your live photo using AI neural drape technology.
                </Text>

                <GoldButton
                  title="ALLOW CAMERA ACCESS ✦"
                  onPress={camera.requestPermission}
                  size="md"
                  style={{ width: '100%', marginTop: 16 }}
                />

                <TouchableOpacity
                  onPress={async () => {
                    const img = await camera.pickImageFromGallery();
                    if (img) {
                      setActiveTab('clothes');
                      executeAITryOn(currentGarment);
                    }
                  }}
                  style={styles.galleryFallbackBtn}
                >
                  <Text style={styles.galleryFallbackText}>📁 Or Select Photo from Gallery</Text>
                </TouchableOpacity>
              </View>
            )
          ) : activeTab === 'body' ? (
            /* 2. DEDICATED INTERACTIVE AI BODY VISUALIZER CANVAS */
            <View style={styles.bodyCanvasContainer}>
              <View style={styles.bodyVisualizerGraphic}>
                {/* Visual Anthropometric Human Silhouette */}
                <View style={styles.bodySilhouetteWrap}>
                  <View style={styles.bodyHead} />
                  <View
                    style={[
                      styles.bodyShoulders,
                      {
                        width: Math.min(180, Math.max(90, (chestIn * 3.4))),
                        backgroundColor: COLORS.gold,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.bodyWaist,
                      {
                        width: Math.min(160, Math.max(70, (waistIn * 3.0))),
                        height: Math.min(80, Math.max(45, (heightCm / 3.2))),
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.bodyHips,
                      {
                        width: Math.min(175, Math.max(80, (hipIn * 3.2))),
                      },
                    ]}
                  />
                  <View style={styles.bodyLegsRow}>
                    <View
                      style={[
                        styles.bodyLeg,
                        { height: Math.min(140, Math.max(80, (heightCm * 0.55))) },
                      ]}
                    />
                    <View
                      style={[
                        styles.bodyLeg,
                        { height: Math.min(140, Math.max(80, (heightCm * 0.55))) },
                      ]}
                    />
                  </View>
                </View>

                {/* Floating Anthropometric Nodes */}
                <View style={styles.metricsPill}>
                  <Text style={styles.metricsPillText}>
                    {activeGender === 'women' ? 'FEMALE' : 'MALE'} · {bodyShape.toUpperCase()} ARCHETYPE
                  </Text>
                  <Text style={styles.metricsPillSub}>
                    Height: {heightCm}cm · Weight: {weightKg}kg · Chest: {chestIn}" · Waist: {waistIn}" · Hips: {hipIn}"
                  </Text>
                </View>
              </View>

              {/* BMI Dial Card */}
              <View style={styles.bmiStatsBox}>
                <View>
                  <Text style={styles.bmiStatsMicro}>BODY MASS INDEX</Text>
                  <Text style={styles.bmiStatsValue}>{bmi}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Badge
                    label={
                      bmi < 18.5
                        ? 'Underweight'
                        : bmi < 25
                        ? 'Optimal Fit'
                        : bmi < 30
                        ? 'Athletic Plus'
                        : 'Curvy Plus'
                    }
                    variant={bmi >= 18.5 && bmi <= 25 ? 'green' : 'gold'}
                  />
                  <Text style={styles.bmiSizeRec}>
                    Recommended Size: <Text style={{ color: COLORS.goldDark, fontWeight: '900' }}>{getRecommendedSize()}</Text>
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            /* 3. PHOTOREALISTIC BEFORE/AFTER CLOTHES CHANGER CANVAS */
            <View style={styles.imageCanvas}>
              {/* BEFORE LAYER */}
              <Image
                source={{
                  uri: camera.capturedPhoto?.uri || currentModel.beforeImageUrl,
                }}
                style={styles.canvasImage}
                resizeMode="cover"
              />
              <View style={styles.beforeLabel}>
                <Text style={styles.labelText}>BEFORE</Text>
              </View>

              {/* AFTER LAYER */}
              <View
                style={[
                  styles.afterWrap,
                  { width: (100 - sliderSplit) + '%' },
                ]}
              >
                <Image
                  source={{
                    uri: currentGarment.imageUrl,
                  }}
                  style={[styles.canvasImage, { width: SCREEN_WIDTH - 32 }]}
                  resizeMode="cover"
                />
                <View
                  style={[
                    styles.colorTint,
                    {
                      backgroundColor: selectedColor.hex,
                      opacity: selectedColor.hex === '#F5F2E7' ? 0 : 0.2,
                    },
                  ]}
                />
                <View style={styles.afterLabel}>
                  <Text style={[styles.labelText, { color: COLORS.goldDark }]}>AFTER</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={[styles.sliderDivider, { left: sliderSplit + '%' }]}>
                <View style={styles.sliderArrowBadge}>
                  <Text style={styles.sliderArrowText}>⇄</Text>
                </View>
              </View>

              {/* AI Processing Overlay */}
              {isAIProcessing && (
                <View style={styles.aiLoadingOverlay}>
                  <ActivityIndicator size="large" color={COLORS.gold} />
                  <Text style={styles.aiLoadingText}>AI TAILORING OUTFIT ON SUPERMODEL...</Text>
                </View>
              )}

              {/* Model HUD Badge */}
              <View style={styles.hudBadge}>
                <View style={styles.hudTop}>
                  <Text style={styles.hudModelName}>
                    {camera.capturedPhoto ? 'Your Captured Photo' : currentModel.name}
                  </Text>
                  <Text style={styles.hudFitScore}>✓ {fitScore}% Fit Score</Text>
                </View>
                <Text style={styles.hudSub}>
                  Wearing: {currentGarment.name} · {selectedColor.name}
                </Text>
              </View>
            </View>
          )}

          {/* Slider Controls */}
          {activeTab === 'clothes' && (
            <View style={styles.sliderControlBar}>
              <TouchableOpacity onPress={() => setSliderSplit(20)} style={[styles.splitBtn, sliderSplit === 20 && styles.splitBtnActive]}>
                <Text style={[styles.splitBtnText, sliderSplit === 20 && styles.splitBtnTextActive]}>Before 80%</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSliderSplit(50)} style={[styles.splitBtn, sliderSplit === 50 && styles.splitBtnActive]}>
                <Text style={[styles.splitBtnText, sliderSplit === 50 && styles.splitBtnTextActive]}>50 / 50 Split</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSliderSplit(80)} style={[styles.splitBtn, sliderSplit === 80 && styles.splitBtnActive]}>
                <Text style={[styles.splitBtnText, sliderSplit === 80 && styles.splitBtnTextActive]}>After 80%</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── TABS ── */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => setActiveTab('clothes')}
            style={[styles.tabBtn, activeTab === 'clothes' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'clothes' && styles.tabBtnTextActive]}>
              👗 Clothes Changer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('body')}
            style={[styles.tabBtn, activeTab === 'body' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'body' && styles.tabBtnTextActive]}>
              🧍 Body Visualizer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOpenLiveCamera}
            style={[styles.tabBtn, activeTab === 'camera' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'camera' && styles.tabBtnTextActive]}>
              📸 Live Camera
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── TAB 1: CLOTHES CHANGER ── */}
        {activeTab === 'clothes' && (
          <View style={styles.tabContent}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>1. SELECT SUPERMODEL OR UPLOAD</Text>
              <View style={styles.genderPills}>
                <TouchableOpacity
                  onPress={() => {
                    try { Haptics.selectionAsync(); } catch (_) {}
                    setActiveGender('women');
                  }}
                  style={[styles.genderPill, activeGender === 'women' && styles.genderPillActive]}
                >
                  <Text style={[styles.genderPillText, activeGender === 'women' && styles.genderPillTextActive]}>
                    FEMININE
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    try { Haptics.selectionAsync(); } catch (_) {}
                    setActiveGender('men');
                  }}
                  style={[styles.genderPill, activeGender === 'men' && styles.genderPillActive]}
                >
                  <Text style={[styles.genderPillText, activeGender === 'men' && styles.genderPillTextActive]}>
                    MASCULINE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modelsScroll}
            >
              <TouchableOpacity
                onPress={async () => {
                  const img = await camera.pickImageFromGallery();
                  if (img) executeAITryOn(currentGarment);
                }}
                style={styles.uploadCard}
              >
                <Text style={{ fontSize: 24, marginBottom: 2 }}>📸</Text>
                <Text style={styles.uploadCardTitle}>UPLOAD</Text>
                <Text style={styles.uploadCardSub}>Your Photo</Text>
              </TouchableOpacity>

              {currentModels.map((model, idx) => (
                <TouchableOpacity
                  key={model.id}
                  onPress={() => handleSelectModel(idx)}
                  style={[
                    styles.modelCard,
                    selectedModelIdx === idx && !camera.capturedPhoto && styles.modelCardActive,
                  ]}
                >
                  <Image source={{ uri: model.beforeImageUrl }} style={styles.modelImg} />
                  <Text style={styles.modelName} numberOfLines={1}>
                    {model.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={{ marginTop: 20, marginBottom: 8 }}>
              <Text style={styles.sectionTitle}>2. CHOOSE NEW OUTFIT TO WEAR</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.garmentsScroll}
            >
              {currentGarments.map((garment, idx) => (
                <GarmentCard
                  key={garment.id}
                  garment={garment}
                  isSelected={selectedGarmentIdx === idx}
                  onSelect={() => handleSelectGarment(idx)}
                />
              ))}
            </ScrollView>

            <View style={{ marginTop: 20, marginBottom: 8 }}>
              <Text style={styles.sectionTitle}>3. GARMENT FABRIC SHADE</Text>
            </View>

            <View style={styles.colorRow}>
              {COLOR_SWATCHES.map(swatch => (
                <TouchableOpacity
                  key={swatch.name}
                  onPress={() => {
                    try { Haptics.selectionAsync(); } catch (_) {}
                    setSelectedColor(swatch);
                  }}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: swatch.hex },
                    selectedColor.name === swatch.name && styles.colorCircleActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── TAB 2: BODY VISUALIZER ── */}
        {activeTab === 'body' && (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
              1. BODY SHAPE ARCHETYPES
            </Text>
            <View style={styles.presetRow}>
              {['athletic', 'hourglass', 'rectangle', 'pear', 'inverted_triangle', 'plus'].map(shape => (
                <TouchableOpacity
                  key={shape}
                  onPress={() => handleShapePreset(shape)}
                  style={[styles.presetBtn, bodyShape === shape && styles.presetBtnActive]}
                >
                  <Text style={[styles.presetBtnText, bodyShape === shape && styles.presetBtnTextActive]}>
                    {shape === 'athletic'
                      ? '⚡ Athletic'
                      : shape === 'hourglass'
                      ? '⏳ Hourglass'
                      : shape === 'rectangle'
                      ? '🟩 Rectangle'
                      : shape === 'pear'
                      ? '🍐 Pear'
                      : shape === 'inverted_triangle'
                      ? '🔻 V-Taper'
                      : '➕ Plus'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 18, marginBottom: 10 }]}>
              2. FINE-TUNE ANTHROPOMETRICS
            </Text>

            <View style={styles.slidersGrid}>
              <View style={styles.sliderBox}>
                <Text style={styles.sliderLabel}>Height: {heightCm} cm ({(heightCm / 30.48).toFixed(1)}')</Text>
                <View style={styles.sliderButtonsRow}>
                  <TouchableOpacity onPress={() => setHeightCm(h => Math.max(140, h - 2))} style={styles.stepBtn}>
                    <Text style={styles.stepBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepValueText}>{heightCm} cm</Text>
                  <TouchableOpacity onPress={() => setHeightCm(h => Math.min(210, h + 2))} style={styles.stepBtn}>
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sliderBox}>
                <Text style={styles.sliderLabel}>Weight: {weightKg} kg ({Math.round(weightKg * 2.204)} lbs)</Text>
                <View style={styles.sliderButtonsRow}>
                  <TouchableOpacity onPress={() => setWeightKg(w => Math.max(40, w - 2))} style={styles.stepBtn}>
                    <Text style={styles.stepBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepValueText}>{weightKg} kg</Text>
                  <TouchableOpacity onPress={() => setWeightKg(w => Math.min(140, w + 2))} style={styles.stepBtn}>
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sliderBox}>
                <Text style={styles.sliderLabel}>Chest / Bust: {chestIn}"</Text>
                <View style={styles.sliderButtonsRow}>
                  <TouchableOpacity onPress={() => setChestIn(c => Math.max(28, c - 1))} style={styles.stepBtn}>
                    <Text style={styles.stepBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepValueText}>{chestIn}"</Text>
                  <TouchableOpacity onPress={() => setChestIn(c => Math.min(56, c + 1))} style={styles.stepBtn}>
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sliderBox}>
                <Text style={styles.sliderLabel}>Waist: {waistIn}"</Text>
                <View style={styles.sliderButtonsRow}>
                  <TouchableOpacity onPress={() => setWaistIn(w => Math.max(20, w - 1))} style={styles.stepBtn}>
                    <Text style={styles.stepBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepValueText}>{waistIn}"</Text>
                  <TouchableOpacity onPress={() => setWaistIn(w => Math.min(50, w + 1))} style={styles.stepBtn}>
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ── SUMMARY BOX ── */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryMicro}>BESPOKE SPECIFICATION</Text>
              <Text style={styles.summaryPrice}>
                ₹{currentGarment.price.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Badge label="FIRST TRIAL GUARANTEED" variant="green" />
              <Text style={styles.summarySub}>Zero Risk · Free Alterations</Text>
            </View>
          </View>

          <GoldButton
            title="ADD BESPOKE OUTFIT TO BAG ✦"
            onPress={handleAddOutfitToBag}
            size="lg"
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
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
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF8F0',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  canvasContainer: {
    padding: 16,
    backgroundColor: '#FAF8F5',
  },
  imageCanvas: {
    width: '100%',
    height: 390,
    backgroundColor: '#EDE8DF',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  canvasImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  afterWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    overflow: 'hidden',
  },
  colorTint: {
    position: 'absolute',
    inset: 0,
  },
  beforeLabel: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  afterLabel: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.gold,
    ...SHADOWS.soft,
  },
  labelText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  sliderDivider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.gold,
    zIndex: 10,
  },
  sliderArrowBadge: {
    position: 'absolute',
    top: '50%',
    left: -15,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gold,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.gold,
  },
  sliderArrowText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  aiLoadingOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  aiLoadingText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.goldDark,
    letterSpacing: 1.5,
    marginTop: 12,
  },
  hudBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    padding: 10,
    ...SHADOWS.card,
  },
  hudTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hudModelName: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  hudFitScore: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
  },
  hudSub: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sliderControlBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  splitBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  splitBtnActive: {
    backgroundColor: COLORS.textPrimary,
    borderColor: COLORS.textPrimary,
  },
  splitBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  splitBtnTextActive: {
    color: '#FFFFFF',
  },
  cameraWrap: {
    width: '100%',
    height: 390,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
  },
  arOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arHeadGuide: {
    width: 60,
    height: 75,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(201, 168, 76, 0.7)',
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  arShoulderGuide: {
    width: 170,
    height: 2,
    backgroundColor: 'rgba(201, 168, 76, 0.7)',
    marginBottom: 20,
  },
  arTorsoGuide: {
    width: 120,
    height: 90,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(201, 168, 76, 0.5)',
    borderStyle: 'dashed',
  },
  arHipsGuide: {
    width: 140,
    height: 2,
    backgroundColor: 'rgba(201, 168, 76, 0.7)',
    marginTop: 10,
  },
  arGuideText: {
    position: 'absolute',
    top: 20,
    backgroundColor: 'rgba(0,0,0,0.65)',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    letterSpacing: 0.5,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  camIconBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camShutterBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  camShutterInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
  },
  permissionCard: {
    width: '100%',
    height: 390,
    borderRadius: RADIUS.xl,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  permissionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  galleryFallbackBtn: {
    marginTop: 14,
    paddingVertical: 8,
  },
  galleryFallbackText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.goldDark,
  },
  bodyCanvasContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    ...SHADOWS.card,
  },
  bodyVisualizerGraphic: {
    height: 280,
    backgroundColor: '#FAF8F5',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bodySilhouetteWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyHead: {
    width: 38,
    height: 48,
    borderRadius: 19,
    backgroundColor: '#D1C7B7',
    marginBottom: 4,
  },
  bodyShoulders: {
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
  },
  bodyWaist: {
    backgroundColor: '#B5A997',
    borderRadius: 8,
    marginBottom: 4,
  },
  bodyHips: {
    height: 28,
    backgroundColor: '#8C7E6A',
    borderRadius: 10,
    marginBottom: 4,
  },
  bodyLegsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bodyLeg: {
    width: 22,
    backgroundColor: '#6B5E4D',
    borderRadius: 11,
  },
  metricsPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  metricsPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.goldDark,
    letterSpacing: 0.8,
  },
  metricsPillSub: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bmiStatsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  bmiStatsMicro: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  bmiStatsValue: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  bmiSizeRec: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#F5F3ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: COLORS.textPrimary,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  genderPills: {
    flexDirection: 'row',
    backgroundColor: '#F5F3ED',
    borderRadius: RADIUS.full,
    padding: 3,
  },
  genderPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  genderPillActive: {
    backgroundColor: '#FFFFFF',
    ...SHADOWS.soft,
  },
  genderPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  genderPillTextActive: {
    color: COLORS.textPrimary,
  },
  modelsScroll: {
    paddingRight: 16,
    gap: 10,
  },
  uploadCard: {
    width: 80,
    height: 105,
    borderRadius: RADIUS.lg,
    backgroundColor: '#FAF8F0',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadCardTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.goldDark,
  },
  uploadCardSub: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
  modelCard: {
    width: 80,
    height: 105,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  modelCardActive: {
    borderColor: COLORS.gold,
    backgroundColor: '#FAF8F0',
    ...SHADOWS.gold,
  },
  modelImg: {
    width: '100%',
    height: 80,
  },
  modelName: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  garmentsScroll: {
    paddingRight: 16,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E4DC',
  },
  colorCircleActive: {
    borderColor: COLORS.gold,
    transform: [{ scale: 1.15 }],
    ...SHADOWS.soft,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: '#F5F3ED',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  presetBtnActive: {
    backgroundColor: COLORS.textPrimary,
    borderColor: COLORS.textPrimary,
  },
  presetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  presetBtnTextActive: {
    color: '#FFFFFF',
  },
  slidersGrid: {
    gap: 10,
  },
  sliderBox: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sliderButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  stepBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  stepValueText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.goldDark,
    minWidth: 44,
    textAlign: 'center',
  },
  summaryBox: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xl,
    padding: 16,
    ...SHADOWS.card,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryMicro: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  summaryPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  summarySub: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
