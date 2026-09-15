/**
 * CODED FIT — Root Layout
 * Clean white app shell with auth routing
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen
          name="jarvis"
          options={{
            headerShown: true,
            headerTitle: 'JARVIS AI',
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: '#111111',
            headerTitleStyle: { fontSize: 13, fontWeight: '900', letterSpacing: 2 },
            headerShadowVisible: false,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="product/[id]"
          options={{
            headerShown: true,
            headerTitle: 'PRODUCT',
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: '#111111',
            headerTitleStyle: { fontSize: 13, fontWeight: '900', letterSpacing: 2 },
            headerShadowVisible: false,
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </>
  );
}
