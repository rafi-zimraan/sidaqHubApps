import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, Alert, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { apiPut } from '@/src/utils/api';
import { COLORS, FONTS, SPACING, RADIUS } from '@/src/constants/theme';

const ROLES = [
  { id: 'santri', label: 'Santri Huffadz', desc: 'Aktif menghafal Al-Quran', icon: '📚' },
  { id: 'ustadz', label: 'Ustadz/Musyrif', desc: 'Pengajar & pembimbing tahfidz', icon: '🎓' },
  { id: 'huffadz', label: 'Huffadz Dewasa', desc: 'Penghafal Al-Quran dewasa', icon: '🌟' },
];

const JUZ_OPTIONS = [1, 3, 5, 7, 10, 15, 20, 25, 30];

const INTERESTS = ['Tahfidz', 'Tajwid', 'Tafsir', 'Tilawah', 'Qiraah', 'Fiqh', 'Hadits', 'Bahasa Arab'];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');
  const [juzCount, setJuzCount] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleFinish = async () => {
    if (!role) {
      Alert.alert('Perhatian', 'Pilih peranmu terlebih dahulu');
      return;
    }
    setLoading(true);
    try {
      const updated = await apiPut('/api/users/me', {
        role,
        juz_count: juzCount,
        interests,
        profile_completed: true,
      });
      updateUser(updated);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    // Step 0: Role
    <View key="role" style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Siapa kamu?</Text>
      <Text style={styles.stepSubtitle}>Pilih peranmu di komunitas SidaqHub</Text>
      {ROLES.map((r) => (
        <TouchableOpacity
          key={r.id}
          testID={`role-${r.id}`}
          style={[styles.roleCard, role === r.id && styles.roleCardActive]}
          onPress={() => setRole(r.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.roleIcon}>{r.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.roleLabel, role === r.id && styles.roleLabelActive]}>{r.label}</Text>
            <Text style={styles.roleDesc}>{r.desc}</Text>
          </View>
          {role === r.id && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
        </TouchableOpacity>
      ))}
    </View>,

    // Step 1: Juz Count
    <View key="juz" style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Berapa Juz yang sudah kamu hafal?</Text>
      <Text style={styles.stepSubtitle}>Ini akan menentukan badge Juz kamu</Text>
      <View style={styles.juzGrid}>
        <TouchableOpacity
          style={[styles.juzBtn, juzCount === 0 && styles.juzBtnActive]}
          onPress={() => setJuzCount(0)}
        >
          <Text style={[styles.juzBtnText, juzCount === 0 && styles.juzBtnTextActive]}>0</Text>
          <Text style={styles.juzBtnSub}>Mulai hafalan</Text>
        </TouchableOpacity>
        {JUZ_OPTIONS.map((j) => (
          <TouchableOpacity
            key={j}
            testID={`juz-${j}`}
            style={[styles.juzBtn, juzCount === j && styles.juzBtnActive]}
            onPress={() => setJuzCount(j)}
            activeOpacity={0.7}
          >
            <Text style={[styles.juzBtnText, juzCount === j && styles.juzBtnTextActive]}>{j}</Text>
            <Text style={styles.juzBtnSub}>{j === 30 ? '👑 Hafiz' : 'Juz'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>,

    // Step 2: Interests
    <View key="interests" style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Topik yang kamu minati</Text>
      <Text style={styles.stepSubtitle}>Pilih satu atau lebih topik (opsional)</Text>
      <View style={styles.interestGrid}>
        {INTERESTS.map((item) => (
          <TouchableOpacity
            key={item}
            testID={`interest-${item}`}
            style={[styles.interestChip, interests.includes(item) && styles.interestChipActive]}
            onPress={() => toggleInterest(item)}
            activeOpacity={0.7}
          >
            <Text style={[styles.interestText, interests.includes(item) && styles.interestTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>,
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>SidaqHub</Text>
        <View style={styles.progressDots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, step === i && styles.dotActive]} />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg }} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>Selamat datang, {user?.name?.split(' ')[0]}! 🎉</Text>
          <Text style={styles.welcomeSub}>Langkah {step + 1} dari 3 — Lengkapi profilmu</Text>
        </View>

        {steps[step]}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        {step > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>
        )}
        {step < 2 ? (
          <TouchableOpacity
            testID="onboarding-next"
            style={[styles.nextBtn, step === 0 && !role && styles.btnDisabled, step > 0 && { flex: 1 }]}
            onPress={() => setStep(step + 1)}
            disabled={step === 0 && !role}
            activeOpacity={0.8}
          >
            <Text style={styles.nextBtnText}>Lanjut</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            testID="onboarding-finish"
            style={[styles.nextBtn, loading && styles.btnDisabled, { flex: 1 }]}
            onPress={handleFinish}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.nextBtnText}>Mulai Eksplorasi!</Text>
                <Text style={{ fontSize: 18 }}>🚀</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  appName: { fontFamily: FONTS.bold, fontSize: 20, color: COLORS.primary },
  progressDots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.primary, width: 20 },
  welcomeBox: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.lg,
  },
  welcomeText: { fontFamily: FONTS.semiBold, fontSize: 18, color: '#fff' },
  welcomeSub: { fontFamily: FONTS.regular, fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  stepContainer: { gap: SPACING.sm },
  stepTitle: { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.text, marginBottom: 4 },
  stepSubtitle: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.md },
  roleCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 2, borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  roleCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  roleIcon: { fontSize: 28 },
  roleLabel: { fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text },
  roleLabelActive: { color: COLORS.primary },
  roleDesc: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  juzGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  juzBtn: {
    width: '30%', padding: SPACING.md, borderRadius: RADIUS.md,
    backgroundColor: COLORS.card, borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center',
  },
  juzBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  juzBtnText: { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.text },
  juzBtnTextActive: { color: COLORS.primary },
  juzBtnSub: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  interestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  interestChip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, borderWidth: 1.5,
    borderColor: COLORS.border, backgroundColor: COLORS.card,
  },
  interestChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  interestText: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.text },
  interestTextActive: { color: COLORS.primary },
  bottomBar: {
    flexDirection: 'row', gap: SPACING.sm,
    padding: SPACING.lg, backgroundColor: COLORS.card,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  backButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: SPACING.md, height: 52,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.primary,
  },
  backButtonText: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.primary },
  nextBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 52, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  nextBtnText: { fontFamily: FONTS.semiBold, fontSize: 16, color: '#fff' },
  btnDisabled: { opacity: 0.5 },
});
