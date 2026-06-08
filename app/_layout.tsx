import { useEffect } from 'react';
import { Stack } from 'expo-router';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Amiri_400Regular } from '@expo-google-fonts/amiri';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Amiri_400Regular,
  });

  useEffect(() => {
    // Hide splash as soon as the JS layer is ready; don't block on font CDN
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  // IMPORTANT: do not block render on font loading. Fonts will swap in when ready.
  // Previously returning null caused the app to hang if Google Fonts CDN was slow.

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="post/[id]" />
        <Stack.Screen name="post/create" options={{ presentation: 'modal' }} />
        <Stack.Screen name="halaqah/[id]" />
        <Stack.Screen name="halaqah/create" options={{ presentation: 'modal' }} />
        <Stack.Screen name="user/[id]" />
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
      </Stack>
    </AuthProvider>
  );
}
