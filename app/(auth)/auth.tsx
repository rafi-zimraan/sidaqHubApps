import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { CURRENT_USER, MOCK_TOKEN } from '../../utils/mock';
import { COLORS, FONTS } from '../../constants/theme';

export default function AuthCallback() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    // Tanpa backend: langsung masuk dengan user dummy.
    (async () => {
      await login(MOCK_TOKEN, CURRENT_USER as any);
      router.replace('/(tabs)/home');
    })();
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
