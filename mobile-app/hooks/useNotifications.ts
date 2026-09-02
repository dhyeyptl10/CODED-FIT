/**
 * Unit 4 Native Features: 6.Notifications Hook
 * Implements Local and Push Notifications using expo-notifications
 * Supports Order confirmation alerts, Bespoke tailoring progress, and Drop radar alarms
 */

import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const setupNotifications = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('coded-fit-default', {
        name: 'CODED-FIT VIP Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#C9A84C',
        sound: 'default',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        setExpoPushToken(tokenData.data);
      } catch (e) {
        console.warn('[useNotifications] Could not get push token:', e);
      }
    }
  };

  /**
   * Schedule Order Confirmation Notification
   */
  const notifyOrderConfirmed = async (orderId: string, totalAmount: number) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✦ ORDER CONFIRMED · NOVA STREET',
        body: `Order #${orderId} (₹${totalAmount.toLocaleString('en-IN')}) is being tailored in Ahmedabad. 24h dispatch active!`,
        data: { orderId, screen: 'cart' },
        sound: 'default',
      },
      trigger: null, // trigger immediately
    });
  };

  /**
   * Schedule Bespoke Tailoring Milestone Alert (Simulated 5s delay)
   */
  const scheduleBespokeMilestoneAlert = async (productName: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✂️ BESPOKE CRAFT UPDATE',
        body: `Your custom ${productName} pattern has been cut using your biometric nodes. Moving to master stitching!`,
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 8,
      },
    });
  };

  /**
   * Schedule Limited Drop Radar Notification
   */
  const scheduleDropAlarm = async (productName: string, minutesFromNow: number = 1) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 LIMITED DROP RADAR ACTIVE',
        body: `The limited release of ${productName} drops in ${minutesFromNow} minute! Stock is unit-of-one limited.`,
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: minutesFromNow * 60,
      },
    });
  };

  useEffect(() => {
    setupNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notif => {
      setNotification(notif);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('[useNotifications] Notification clicked:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
    notifyOrderConfirmed,
    scheduleBespokeMilestoneAlert,
    scheduleDropAlarm,
  };
}
