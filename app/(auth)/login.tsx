import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '@/src/context/AuthContext';
import { CURRENT_USER, MOCK_TOKEN } from '@/src/utils/mock';
import { COLORS, FONTS, SPACING, RADIUS } from '@/src/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Perhatian", "Email dan kata sandi harus diisi");
      return;
    }
    // Tanpa backend: langsung masuk dengan user dummy.
    await login(MOCK_TOKEN, CURRENT_USER as any);
    router.replace("/(tabs)/home");
  };

  const comingSoon = () =>
    Alert.alert(
      "Segera Hadir",
      "Fitur ini akan tersedia di update berikutnya, in syaa Allah 🌙",
    );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header (Teal Card with rounded bottom) */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <View style={styles.logoInner}>
              <Ionicons name="add" size={28} color={COLORS.gold} />
            </View>
          </View>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ</Text>
          <Text style={styles.appName}>SidaqHub</Text>
          <Text style={styles.subtitle}>Masuk ke akun Huffadz kamu</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat Email</Text>
            <TextInput
              testID="login-email-input"
              style={styles.input}
              placeholder="email@kamu.com"
              placeholderTextColor="#C5C5C5"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kata Sandi</Text>
            <View style={styles.passwordRow}>
              <TextInput
                testID="login-password-input"
                style={[styles.input, { paddingRight: 44 }]}
                placeholder="Masukkan kata sandi"
                placeholderTextColor="#C5C5C5"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity
                onPress={() => setShowPass(!showPass)}
                style={styles.eyeBtn}
                testID="toggle-password-visibility"
              >
                <Ionicons
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember + Forgot */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              testID="remember-me-checkbox"
              style={styles.checkboxRow}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxActive]}
              >
                {rememberMe && (
                  <Ionicons name="checkmark" size={12} color="#fff" />
                )}
              </View>
              <Text style={styles.optionText}>Ingat saya</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={comingSoon}
              testID="forgot-password-link"
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Lupa kata sandi?</Text>
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity
            testID="login-submit-button"
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Masuk</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau masuk dengan</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              testID="login-google-button"
              style={styles.socialBtn}
              onPress={comingSoon}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="login-facebook-button"
              style={styles.socialBtn}
              onPress={comingSoon}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-facebook" size={22} color="#1877F2" />
              <Text style={styles.socialBtnText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Belum punya akun? </Text>
          <TouchableOpacity
            testID="go-to-register"
            onPress={() => router.push("/(auth)/register")}
            activeOpacity={0.7}
          >
            <View style={styles.footerLinkRow}>
              <Text style={styles.footerLink}>Daftar sekarang</Text>
              <Ionicons
                name="create-outline"
                size={14}
                color={COLORS.gold}
                style={{ marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { flexGrow: 1, paddingBottom: SPACING.xl },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 56,
    paddingBottom: 48,
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  logoInner: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  bismillah: {
    fontFamily: FONTS.arabic,
    fontSize: 22,
    color: COLORS.gold,
    marginBottom: 8,
    letterSpacing: 1,
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: 30,
    color: "#fff",
    letterSpacing: -0.5,
    marginBottom: 4,
    width: "38%",
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
  form: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  inputGroup: { marginBottom: SPACING.md },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 52,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
  },
  passwordRow: { position: "relative", justifyContent: "center" },
  eyeBtn: { position: "absolute", right: 14, padding: 4 },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#CCCCCC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.text },
  forgotText: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.primary,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: "#fff",
    letterSpacing: 0.3,
    width: "17%",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#EEEEEE" },
  dividerText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.sm,
  },
  socialRow: { flexDirection: "row", gap: SPACING.sm },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    backgroundColor: "#fff",
    gap: 8,
  },
  socialBtnText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footerLinkRow: { flexDirection: "row", alignItems: "center" },
  footerLink: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.gold },
});
