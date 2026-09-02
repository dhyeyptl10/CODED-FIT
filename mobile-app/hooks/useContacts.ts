/**
 * Unit 4 Native Features: 3.Contacts Hook
 * Implements phone contacts integration using expo-contacts
 * Lets users share custom try-on outfits or invite friends with VIP promo credits
 */

import { useState } from 'react';
import * as Contacts from 'expo-contacts';
import * as Haptics from 'expo-haptics';

export interface PhoneContact {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
}

export function useContacts() {
  const [contacts, setContacts] = useState<PhoneContact[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
          sort: Contacts.SortTypes.FirstName,
        });

        if (data.length > 0) {
          const formatted: PhoneContact[] = data
            .filter(c => c.name && (c.phoneNumbers?.length || c.emails?.length))
            .slice(0, 30)
            .map(c => ({
              id: c.id,
              name: c.name || 'Friend',
              phoneNumber: c.phoneNumbers?.[0]?.number || undefined,
              email: c.emails?.[0]?.email || undefined,
            }));
          setContacts(formatted);
        }
      }
    } catch (e) {
      console.error('[useContacts] Error loading contacts:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contacts,
    hasPermission,
    isLoading,
    loadContacts,
  };
}
