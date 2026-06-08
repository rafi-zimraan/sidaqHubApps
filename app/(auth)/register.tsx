import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { CURRENT_USER, MOCK_TOKEN } from '../../utils/mock';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface FieldDef {
  label: string;
  placeholder: string;
  value: string;
  setter: (v: string) => void;
  testId: string;
  keyboardType?: any;
  autoCap?: 'words' | 'none';
  secure?: boolean;
}

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Perhatian', 'Nama, email dan kata sandi wajib diisi');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Perhatian', 'Kata sandi minimal 8 karakter');
      return;
    }
    if (password !== confirmPass) {
      Alert.alert('Perhatian', 'Konfirmasi kata sandi tidak cocok');
      return;
    }
    // Tanpa backend: buat user dummy dari input lalu lanjut ke onboarding.
    await login(MOCK_TOKEN, {
      ...(CURRENT_USER as any),
      name: name.trim(),
      city: city.trim(),
      email: email.trim().toLowerCase(),
      profile_completed: false,
    });
    router.replace('/(auth)/onboarding');
  };

  const comingSoon = () =>
    Alert.alert('Segera Hadir', 'Fitur ini akan tersedia di update berikutnya, in syaa Allah 🌙');

  const passwordMismatch = !!confirmPass && password !== confirmPass;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} testID="register-back">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.logoBadge}>
            <View style={styles.logoInner}>
              <Ionicons name="add" size={28} color={COLORS.gold} />
            </View>
          </View>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ</Text>
          <Text style={styles.appName}>Buat Akun</Text>
          <Text style={styles.subtitle}>Bergabunglah bersama Jejaring Huffadz Indonesia</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              testID="register-name-input"
              style={styles.input}
              placeholder="Cth: Ahmad Fauzi Al-Hafiz"
              placeholderTextColor="#C5C5C5"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kota / Kabupaten</Text>
            <TextInput
              testID="register-city-input"
              style={styles.input}
              placeholder="Cth: Bandung, Surabaya, Depok..."
              placeholderTextColor="#C5C5C5"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat Email</Text>
            <TextInput
              testID="register-email-input"
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
                testID="register-password-input"
                style={[styles.input, { paddingRight: 44 }]}
                placeholder="Min. 8 karakter"
                placeholderTextColor="#C5C5C5"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
            <View style={styles.passwordRow}>
              <TextInput
                testID="register-confirm-password-input"
                style={[styles.input, passwordMismatch && styles.inputError, { paddingRight: 44 }]}
                placeholder="Ulangi kata sandi"
                placeholderTextColor="#C5C5C5"
                value={confirmPass}
                onChangeText={setConfirmPass}
                secureTextEntry={!showConfirm}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            {passwordMismatch && <Text style={styles.errorText}>Kata sandi tidak cocok</Text>}
          </View>

          {/* Submit */}
          <TouchableOpacity
            testID="register-submit-button"
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Buat Akun</Text>
            )}
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.termsText}>
            Dengan mendaftar, kamu menyetujui{' '}
            <Text style={styles.termsLink} onPress={comingSoon}>Syarat Penggunaan</Text>
            {' '}dan{' '}
            <Text style={styles.termsLink} onPress={comingSoon}>Kebijakan Privasi</Text>
            {' '}SidaqHub.
          </Text>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau daftar dengan</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              testID="register-google-button"
              style={styles.socialBtn}
              onPress={comingSoon}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="register-facebook-button"
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
          <Text style={styles.footerText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.back()} testID="back-to-login" activeOpacity={0.7}>
            <View style={styles.footerLinkRow}>
              <Text style={styles.footerLink}>Masuk di sini</Text>
              <Ionicons name="create-outline" size={14} color={COLORS.gold} style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flexGrow: 1, paddingBottom: SPACING.xl },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 56,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    position: 'absolute', top: 56, left: 16,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoBadge: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  logoInner: {
    width: 42, height: 42, borderRadius: 12,
    borderWidth: 1.5, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  bismillah: { fontFamily: FONTS.arabic, fontSize: 18, color: COLORS.gold, marginBottom: 6 },
  appName: { fontFamily: FONTS.bold, fontSize: 26, color: '#fff', marginBottom: 4 },
  subtitle: {
    fontFamily: FONTS.regular, fontSize: 13, color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', paddingHorizontal: SPACING.lg,
  },
  form: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  inputGroup: { marginBottom: SPACING.md },
  label: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text, marginBottom: 8 },
  input: {
    backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEEEEE',
    borderRadius: RADIUS.md, paddingHorizontal: SPACING.md,
    height: 52, fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text,
  },
  inputError: { borderColor: COLORS.error },
  passwordRow: { position: 'relative', justifyContent: 'center' },
  eyeBtn: { position: 'absolute', right: 14, padding: 4 },
  errorText: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.error, marginTop: 6 },
  primaryBtn: {
    backgroundColor: COLORS.primary, height: 54,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    marginTop: SPACING.sm,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 12, elevation: 4,
  },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontFamily: FONTS.bold, fontSize: 16, color: '#fff', letterSpacing: 0.3 },
  termsText: {
    fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary,
    textAlign: 'center', marginTop: SPACING.md, lineHeight: 18,
  },
  termsLink: { fontFamily: FONTS.semiBold, color: COLORS.primary },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#EEEEEE' },
  dividerText: {
    fontFamily: FONTS.regular, fontSize: 12,
    color: COLORS.textSecondary, marginHorizontal: SPACING.sm,
  },
  socialRow: { flexDirection: 'row', gap: SPACING.sm },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 52, borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#EEEEEE',
    backgroundColor: '#fff', gap: 8,
  },
  socialBtnText: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text },
  footer: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingTop: SPACING.lg, paddingBottom: SPACING.md,
  },
  footerText: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary },
  footerLinkRow: { flexDirection: 'row', alignItems: 'center' },
  footerLink: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.gold },
});
