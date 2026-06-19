import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, ActivityIndicator, SafeAreaView, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { apiGet, apiPost, apiDelete } from '@/src/utils/api';
import { COLORS, FONTS, SPACING, RADIUS, formatSchedule, getJuzBadge } from '@/src/constants/theme';

function Avatar({ uri, name, size = 44 }: any) {
  const [err, setErr] = useState(false);
  const initials = (name || '?').split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
  if (uri && !err) return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} onError={() => setErr(true)} />;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: size * 0.35, fontFamily: FONTS.semiBold }}>{initials}</Text>
    </View>
  );
}

export default function HalaqahDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [halaqah, setHalaqah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => { loadHalaqah(); }, [id]);

  const loadHalaqah = async () => {
    try {
      const data = await apiGet(`/api/halaqahs/${id}`);
      setHalaqah(data);
    } catch {}
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!halaqah) return;
    setActionLoading(true);
    try {
      if (halaqah.is_registered) {
        await apiDelete(`/api/halaqahs/${id}/register`);
        setHalaqah({ ...halaqah, is_registered: false, registered_count: halaqah.registered_count - 1 });
        Alert.alert('Berhasil', 'Pendaftaran halaqah dibatalkan');
      } else {
        await apiPost(`/api/halaqahs/${id}/register`);
        setHalaqah({ ...halaqah, is_registered: true, registered_count: halaqah.registered_count + 1 });
        Alert.alert('Berhasil!', `Kamu berhasil mendaftar halaqah "${halaqah.title}". Hadir ya!`);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
    setActionLoading(false);
  };

  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (!halaqah) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loading}><Text>Halaqah tidak ditemukan</Text></View>
    </SafeAreaView>
  );

  const slotLeft = halaqah.max_slots - halaqah.registered_count;
  const isFull = slotLeft <= 0 && !halaqah.is_registered;
  const badge = getJuzBadge(halaqah.ustadz?.juz_count || 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.platformPill, { backgroundColor: halaqah.platform === 'Zoom' ? '#2D8CFF33' : '#00AC4733' }]}>
            <Text style={[styles.platformText, { color: halaqah.platform === 'Zoom' ? '#2D8CFF' : '#00AC47' }]}>
              {halaqah.platform}
            </Text>
          </View>
          <Text style={styles.heroTitle}>{halaqah.title}</Text>
          {halaqah.juz_range && (
            <View style={styles.juzRangePill}>
              <Text style={styles.juzRangeText}>📖 {halaqah.juz_range}</Text>
            </View>
          )}
        </View>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="calendar-outline" size={22} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Jadwal</Text>
            <Text style={styles.infoValue}>{formatSchedule(halaqah.schedule)}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="people-outline" size={22} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Slot</Text>
            <Text style={styles.infoValue}>{halaqah.registered_count}/{halaqah.max_slots} peserta</Text>
          </View>
        </View>

        {/* Slot Bar */}
        <View style={styles.slotSection}>
          <View style={styles.slotBarBg}>
            <View style={[styles.slotBarFill, { width: `${Math.min(100, (halaqah.registered_count / halaqah.max_slots) * 100)}%` as any }]} />
          </View>
          <Text style={styles.slotText}>
            {isFull ? '🔴 Slot penuh' : `🟢 ${slotLeft} slot tersisa`}
          </Text>
        </View>

        {/* Description */}
        {halaqah.description ? (
          <View style={styles.descSection}>
            <Text style={styles.descTitle}>Tentang Halaqah</Text>
            <Text style={styles.descText}>{halaqah.description}</Text>
          </View>
        ) : null}

        {/* Ustadz */}
        {halaqah.ustadz && (
          <View style={styles.ustadzSection}>
            <Text style={styles.descTitle}>Pengajar</Text>
            <TouchableOpacity
              style={styles.ustadzCard}
              onPress={() => router.push(`/user/${halaqah.ustadz.user_id}`)}
              activeOpacity={0.8}
            >
              <Avatar uri={halaqah.ustadz.avatar_url} name={halaqah.ustadz.name} size={52} />
              <View style={{ flex: 1 }}>
                <Text style={styles.ustadzName}>{halaqah.ustadz.name}</Text>
                <Text style={styles.ustadzCity}>{halaqah.ustadz.city}</Text>
                {badge.label ? (
                  <View style={[styles.badge, { backgroundColor: badge.bg, alignSelf: 'flex-start', marginTop: 3 }]}>
                    <Text style={styles.badgeText}>{badge.label}</Text>
                  </View>
                ) : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Link */}
        {halaqah.platform_link && (
          <View style={styles.descSection}>
            <Text style={styles.descTitle}>Link {halaqah.platform}</Text>
            <View style={styles.linkBox}>
              <Ionicons name="link-outline" size={18} color={COLORS.primary} />
              <Text style={styles.linkText} numberOfLines={1}>{halaqah.platform_link}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Register Button */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          testID="register-halaqah-btn"
          style={[
            styles.registerBtn,
            halaqah.is_registered && styles.cancelBtn,
            isFull && styles.fullBtn,
          ]}
          onPress={handleRegister}
          disabled={actionLoading || isFull}
          activeOpacity={0.8}
        >
          {actionLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerBtnText}>
              {halaqah.is_registered ? 'Batalkan Pendaftaran' : isFull ? 'Slot Penuh' : 'Daftar Halaqah'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md,
    paddingTop: 16, paddingBottom: 60,
  },
  backBtn: { padding: 4, alignSelf: 'flex-start' },
  hero: {
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl, marginTop: -44,
  },
  platformPill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full, alignSelf: 'flex-start', marginBottom: SPACING.sm },
  platformText: { fontFamily: FONTS.semiBold, fontSize: 12 },
  heroTitle: { fontFamily: FONTS.bold, fontSize: 24, color: '#fff', lineHeight: 32, marginBottom: SPACING.sm },
  juzRangePill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  juzRangeText: { fontFamily: FONTS.semiBold, fontSize: 13, color: '#fff' },
  infoGrid: { flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md },
  infoCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  infoLabel: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 6 },
  infoValue: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, textAlign: 'center', marginTop: 2 },
  slotSection: { paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  slotBarBg: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  slotBarFill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  slotText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary },
  descSection: { backgroundColor: COLORS.card, marginHorizontal: SPACING.md, marginBottom: SPACING.sm, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  descTitle: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.text, marginBottom: SPACING.sm },
  descText: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text, lineHeight: 22 },
  ustadzSection: { paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  ustadzCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  ustadzName: { fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text },
  ustadzCity: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full },
  badgeText: { fontFamily: FONTS.medium, fontSize: 10, color: '#fff' },
  linkBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.background, borderRadius: RADIUS.sm, padding: SPACING.sm },
  linkText: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.primary, flex: 1 },
  bottomAction: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.md, backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border },
  registerBtn: { backgroundColor: COLORS.primary, height: 52, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: COLORS.error },
  fullBtn: { backgroundColor: COLORS.textSecondary },
  registerBtnText: { fontFamily: FONTS.semiBold, fontSize: 16, color: '#fff' },
});
