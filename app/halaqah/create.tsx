import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, SafeAreaView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiPost } from '@/src/utils/api';
import { COLORS, FONTS, SPACING, RADIUS } from '@/src/constants/theme';

const PLATFORMS = ['Zoom', 'Google Meet', 'Offline'];

export default function CreateHalaqahScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [juzRange, setJuzRange] = useState('');
  const [platform, setPlatform] = useState('Zoom');
  const [platformLink, setPlatformLink] = useState('');
  const [maxSlots, setMaxSlots] = useState('10');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('08:00');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Perhatian', 'Judul halaqah harus diisi');
      return;
    }
    if (!scheduleDate.trim()) {
      Alert.alert('Perhatian', 'Tanggal jadwal harus diisi (format: YYYY-MM-DD)');
      return;
    }

    setLoading(true);
    try {
      const schedule = `${scheduleDate}T${scheduleTime}:00`;
      await apiPost('/api/halaqahs', {
        title: title.trim(),
        description: description.trim(),
        juz_range: juzRange.trim(),
        platform,
        platform_link: platformLink.trim(),
        max_slots: parseInt(maxSlots) || 10,
        schedule,
      });
      Alert.alert('Berhasil!', 'Halaqah berhasil dibuat', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buat Halaqah</Text>
          <TouchableOpacity
            testID="create-halaqah-submit"
            style={[styles.createBtn, loading && styles.btnDisabled]}
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.createBtnText}>Buat</Text>}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.goldBanner}>
            <Text style={styles.goldBannerIcon}>🕌</Text>
            <Text style={styles.goldBannerText}>Buat halaqah dan mulai membimbing santri</Text>
          </View>

          {[
            { label: 'Judul Halaqah *', value: title, setter: setTitle, placeholder: 'Murajaah Juz 1-5 — Sabtu Pagi', testId: 'halaqah-title-input' },
            { label: 'Rentang Juz', value: juzRange, setter: setJuzRange, placeholder: 'Juz 1-5 (opsional)', testId: 'halaqah-juz-input' },
          ].map((f) => (
            <View key={f.testId} style={styles.field}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                testID={f.testId}
                style={styles.input}
                placeholder={f.placeholder}
                placeholderTextColor={COLORS.textSecondary}
                value={f.value}
                onChangeText={f.setter}
              />
            </View>
          ))}

          <View style={styles.field}>
            <Text style={styles.label}>Deskripsi</Text>
            <TextInput
              testID="halaqah-description-input"
              style={[styles.input, styles.textArea]}
              placeholder="Jelaskan tujuan dan materi halaqah ini..."
              placeholderTextColor={COLORS.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Platform</Text>
            <View style={styles.platformRow}>
              {PLATFORMS.map((p) => (
                <TouchableOpacity
                  key={p}
                  testID={`platform-${p}`}
                  style={[styles.platformBtn, platform === p && styles.platformBtnActive]}
                  onPress={() => setPlatform(p)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.platformText, platform === p && styles.platformTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Link {platform} (opsional)</Text>
            <TextInput
              testID="halaqah-link-input"
              style={styles.input}
              placeholder="https://zoom.us/j/..."
              placeholderTextColor={COLORS.textSecondary}
              value={platformLink}
              onChangeText={setPlatformLink}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Tanggal *</Text>
              <TextInput
                testID="halaqah-date-input"
                style={styles.input}
                placeholder="2026-03-15"
                placeholderTextColor={COLORS.textSecondary}
                value={scheduleDate}
                onChangeText={setScheduleDate}
              />
            </View>
            <View style={[styles.field, { width: 110 }]}>
              <Text style={styles.label}>Jam</Text>
              <TextInput
                testID="halaqah-time-input"
                style={styles.input}
                placeholder="08:00"
                placeholderTextColor={COLORS.textSecondary}
                value={scheduleTime}
                onChangeText={setScheduleTime}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Maksimal Peserta</Text>
            <TextInput
              testID="halaqah-slots-input"
              style={styles.input}
              placeholder="10"
              placeholderTextColor={COLORS.textSecondary}
              value={maxSlots}
              onChangeText={setMaxSlots}
              keyboardType="number-pad"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text },
  createBtn: { backgroundColor: COLORS.gold, paddingHorizontal: SPACING.md, height: 36, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.6 },
  createBtnText: { fontFamily: FONTS.semiBold, fontSize: 14, color: '#fff' },
  scroll: { padding: SPACING.md },
  goldBanner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: '#B8860B1A', borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.lg, borderLeftWidth: 4, borderLeftColor: COLORS.gold,
  },
  goldBannerIcon: { fontSize: 24 },
  goldBannerText: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.text, flex: 1 },
  field: { marginBottom: SPACING.md },
  label: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.border, paddingHorizontal: SPACING.md, height: 48,
    fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text,
  },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: SPACING.sm },
  platformRow: { flexDirection: 'row', gap: SPACING.sm },
  platformBtn: {
    flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.md,
    backgroundColor: COLORS.card, borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center',
  },
  platformBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  platformText: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textSecondary },
  platformTextActive: { color: COLORS.primary },
  row: { flexDirection: 'row', gap: SPACING.sm },
});
