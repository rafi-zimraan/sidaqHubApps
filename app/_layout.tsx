import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ApolloProvider } from '@apollo/client/react';
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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/src/context/AuthContext';
import { AlertProvider } from '@/src/components/AppAlert';
import { apolloClient } from '@/src/graphql/client';

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
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  // Tahan render sampai font siap (splash tetap tampil). Jika render duluan
  // dengan font sistem, Android tidak mengukur ulang lebar teks saat Poppins
  // di-swap sehingga huruf terakhir terpotong ("SidaqH", "Masu", "Googl").
  if (!fontsLoaded && !fontError) return null;

  return (
    <ApolloProvider client={apolloClient}>
    <SafeAreaProvider>
    <AuthProvider>
    <AlertProvider>
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
    </AlertProvider>
    </AuthProvider>
    </SafeAreaProvider>
    </ApolloProvider>
  );
}
