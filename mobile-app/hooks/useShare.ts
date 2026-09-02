/**
 * Unit 4 Native Features: 5.Share & 4.Clipboard Hooks
 * Implements native sharing via expo-sharing + React Native Share and Clipboard integration
 */

import { Share, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

export function useShare() {
  const shareProduct = async (product: { name: string; price: number; url?: string }) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await Share.share({
        title: `${product.name} | NOVA STREET`,
        message: `✦ Check out the ${product.name} (₹${product.price.toLocaleString('en-IN')}) on CODED-FIT! Made from GOTS organic Ahmedabad cotton with 3D AI Try-On. Use code NOVA10 for 10% off!`,
        url: product.url || 'https://novastreet.in',
      });
    } catch (e: any) {
      console.error('[useShare] Error sharing product:', e.message);
    }
  };

  const shareOutfitLook = async (imageUri?: string, lookTitle: string = 'My AI Custom Fit') => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (imageUri && (await Sharing.isAvailableAsync()) && !imageUri.startsWith('http')) {
        await Sharing.shareAsync(imageUri, {
          mimeType: 'image/jpeg',
          dialogTitle: `Share ${lookTitle}`,
        });
      } else {
        await Share.share({
          title: `✦ ${lookTitle} · NOVA STREET`,
          message: `Check out my custom AI Supermodel Look from CODED-FIT! Biometric tailored with 99.4% fit score. ✨ #NovaStreet #CodedFit #AIFashion`,
        });
      }
    } catch (e: any) {
      console.error('[useShare] Error sharing look:', e.message);
    }
  };

  const shareWithFriend = async (friendName: string, promoCode: string = 'NOVA10') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `Hey ${friendName}! I found this insane AI 3D Fashion app CODED-FIT. Use my VIP Code: ${promoCode} for 10% off bespoke clothes! 👕✨`,
      });
    } catch (e) {
      console.error('[useShare] Error:', e);
    }
  };

  return {
    shareProduct,
    shareOutfitLook,
    shareWithFriend,
  };
}

export function useClipboard() {
  const copyToClipboard = async (text: string, successMessage: string = 'Copied to Clipboard!'): Promise<boolean> => {
    try {
      await Clipboard.setStringAsync(text);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return true;
    } catch (e) {
      console.error('[useClipboard] Error copying:', e);
      return false;
    }
  };

  const readFromClipboard = async (): Promise<string> => {
    try {
      return await Clipboard.getStringAsync();
    } catch (e) {
      return '';
    }
  };

  return {
    copyToClipboard,
    readFromClipboard,
  };
}
