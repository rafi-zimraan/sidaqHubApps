import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS } from '@/src/constants/theme';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(tabs)/home');
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>Memproses autentikasi...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  text: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary, marginTop: 16 },
});
