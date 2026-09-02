/**
 * Unit 4 Native Features: 2.Location Hook
 * Implements GPS location detection with expo-location and Ahmedabad Hub shipping ETA calculation
 */

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  city: string;
  region: string;
  country: string;
  postalCode?: string;
  coords: {
    latitude: number;
    longitude: number;
  };
  deliveryEstimate: {
    etaText: string;
    isHyperlocal: boolean;
    dispatchBadge: string;
  };
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const calculateDeliveryETA = (city: string, region: string) => {
    const c = (city || '').toLowerCase();
    const r = (region || '').toLowerCase();

    if (c.includes('ahmedabad') || c.includes('gandhinagar')) {
      return {
        etaText: 'Same-Day Dispatch · Delivery in 24 Hours (Ahmedabad Mill Hub)',
        isHyperlocal: true,
        dispatchBadge: '⚡ 24H DELIVERY',
      };
    } else if (
      c.includes('mumbai') ||
      c.includes('delhi') ||
      c.includes('bangalore') ||
      c.includes('bengaluru') ||
      c.includes('pune') ||
      c.includes('hyderabad') ||
      c.includes('surat') ||
      c.includes('vadodara')
    ) {
      return {
        etaText: 'Express Air Dispatch · Delivery in 1-2 Days',
        isHyperlocal: false,
        dispatchBadge: '✈️ 48H EXPRESS',
      };
    } else {
      return {
        etaText: 'Priority Surface Dispatch · Delivery in 3-4 Days',
        isHyperlocal: false,
        dispatchBadge: '📦 STANDARD FAST',
      };
    }
  };

  const detectLocation = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status !== 'granted') {
        setErrorMsg('Location permission was denied. Defaulting to Ahmedabad HQ.');
        // Fallback default
        setLocation({
          city: 'Ahmedabad',
          region: 'Gujarat',
          country: 'India',
          coords: { latitude: 23.0225, longitude: 72.5714 },
          deliveryEstimate: calculateDeliveryETA('Ahmedabad', 'Gujarat'),
        });
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });

      const city = geocode?.city || geocode?.subregion || 'Ahmedabad';
      const region = geocode?.region || 'Gujarat';
      const country = geocode?.country || 'India';

      setLocation({
        city,
        region,
        country,
        postalCode: geocode?.postalCode || undefined,
        coords: {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        },
        deliveryEstimate: calculateDeliveryETA(city, region),
      });
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to get location');
      setLocation({
        city: 'Mumbai',
        region: 'Maharashtra',
        country: 'India',
        coords: { latitude: 19.076, longitude: 72.8777 },
        deliveryEstimate: calculateDeliveryETA('Mumbai', 'Maharashtra'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return {
    location,
    hasPermission,
    isLoading,
    errorMsg,
    refreshLocation: detectLocation,
  };
}
