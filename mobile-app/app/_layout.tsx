import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={COLORS.bg} />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTintColor: COLORS.textPrimary,
            headerTitleStyle: {
              fontWeight: '800',
              fontSize: 16,
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: COLORS.bg,
            },
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="product/[id]"
            options={{
              title: 'NOVA STREET',
              headerBackTitle: 'Back',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
