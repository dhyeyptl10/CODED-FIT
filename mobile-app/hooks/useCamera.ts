/**
 * CODED-FIT / NOVA STREET — Native Camera & Photo Picker Hook
 * Fixes camera access, permissions flow, AR framing, and photo selection
 */

import { useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

export interface CapturedImage {
  uri: string;
  base64?: string;
  width?: number;
  height?: number;
}

export function useCamera() {
  const [permission, requestPermissionNative] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedImage | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  const isPermissionGranted = permission?.granted === true;

  const requestPermission = async (): Promise<boolean> => {
    try {
      setPermissionError(null);
      const res = await requestPermissionNative();
      if (!res.granted) {
        setPermissionError('Camera permission was denied. You can grant access in your device settings or upload a photo.');
        return false;
      }
      return true;
    } catch (err: any) {
      console.warn('[useCamera] Permission request error:', err);
      setPermissionError('Unable to request camera permission. Please verify app permissions in settings.');
      return false;
    }
  };

  const toggleCameraFacing = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    setFlash(current => (current === 'off' ? 'on' : current === 'on' ? 'auto' : 'off'));
  };

  const takePhoto = async (): Promise<CapturedImage | null> => {
    if (!cameraRef.current) return null;
    try {
      setIsProcessing(true);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (_) {}

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: true,
        skipProcessing: false,
      });

      if (photo) {
        const result: CapturedImage = {
          uri: photo.uri,
          base64: photo.base64 ? `data:image/jpeg;base64,${photo.base64}` : undefined,
          width: photo.width,
          height: photo.height,
        };
        setCapturedPhoto(result);
        return result;
      }
      return null;
    } catch (e) {
      console.error('[useCamera] Error taking photo:', e);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const pickImageFromGallery = async (): Promise<CapturedImage | null> => {
    try {
      setIsProcessing(true);
      try {
        Haptics.selectionAsync();
      } catch (_) {}

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access photos is required for AI Clothes Try-On.');
        return null;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.9,
        base64: true,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const asset = pickerResult.assets[0];
        const result: CapturedImage = {
          uri: asset.uri,
          base64: asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : undefined,
          width: asset.width,
          height: asset.height,
        };
        setCapturedPhoto(result);
        return result;
      }
      return null;
    } catch (e) {
      console.error('[useCamera] Error picking image:', e);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const clearPhoto = () => {
    setCapturedPhoto(null);
  };

  return {
    cameraRef,
    permission,
    isPermissionGranted,
    permissionError,
    requestPermission,
    facing,
    flash,
    isProcessing,
    capturedPhoto,
    toggleCameraFacing,
    toggleFlash,
    takePhoto,
    pickImageFromGallery,
    clearPhoto,
  };
}
