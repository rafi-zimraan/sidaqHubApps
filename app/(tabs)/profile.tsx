import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '@/src/constants/theme';

// ---------- AVATAR ----------
function Avatar({ name, size = 80 }: { name?: string; size?: number }) {
  const initials = (name || '?').split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#E8C84A', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: COLORS.primary, fontSize: size * 0.34, fontFamily: FONTS.bold }}>{initials}</Text>
    </View>
  );
}

// ---------- JUZ GRID ----------
function JuzGrid({ total = 30 }: { total?: number }) {
  const juzes = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <View style={styles.juzGrid}>
      {juzes.map((j) => {
        const hafal = j <= total;
        const sedang = j === total + 1;
        return (
          <View
            key={j}
            style={[
              styles.juzCell,
              hafal ? styles.juzHafal : sedang ? styles.juzSedang : styles.juzBelum,
            ]}
          >
            <Text style={[styles.juzCellText, hafal && styles.juzCellTextHafal]}>{j}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ---------- CIRCULAR PROGRESS ----------
function CircleProgress({ value, max, size = 70 }: { value: number; max: number; size?: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[styles.circleOuter, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={[styles.circleInner, { width: size - 10, height: size - 10, borderRadius: (size - 10) / 2 }]}>
          <Text style={styles.circleValue}>{value}</Text>
          <Text style={styles.circleMax}>/{max}</Text>
          <Text style={styles.circleLabel}>Juz</Text>
        </View>
      </View>
    </View>
  );
}

// ---------- CERT CARD ----------
function CertCard({ title, org, year }: { title: string; org: string; year: string }) {
  return (
    <View style={styles.certCard}>
      <View style={styles.certIcon} />
      <Text style={styles.certTitle} numberOfLines={2}>{title}</Text>
      <Text style={styles.certOrg} numberOfLines={1}>{org}</Text>
      <Text style={styles.certYear}>{year}</Text>
    </View>
  );
}

// ---------- EXPERIENCE ITEM ----------
function ExpItem({ role, place, period }: { role: string; place: string; period: string }) {
  return (
    <View style={styles.expItem}>
      <View style={styles.expIcon} />
      <View style={styles.expInfo}>
        <Text style={styles.expRole}>{role}</Text>
        <Text style={styles.expPlace}>{place}</Text>
        <Text style={styles.expPeriod}>{period}</Text>
      </View>
    </View>
  );
}

// ---------- MAIN SCREEN ----------
export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Keluar Akun',
      'Apakah kamu yakin ingin keluar dari akun?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ],
      { cancelable: true },
    );
  };

  if (!user) return null;

  const juzCount = user.juz_count || 0;
  const isKhatam = juzCount >= 30;

  const skills = [
    { label: 'Tahfidz Quran', highlight: true },
    { label: 'Tilawah Murattal', highlight: false },
    { label: 'Ilmu Tajwid', highlight: false },
    { label: 'Metode Talaqqi', highlight: false },
    { label: 'Bahasa Arab', highlight: false },
    { label: 'Imamah Shalat', highlight: true },
    { label: 'Public Speaking', highlight: false },
    { label: 'Manajemen Kelas', highlight: false },
  ];

  const certs = [
    { title: 'Sanad Quran Riwayat Hafs', org: 'Lembaga Tahfidz Nasional', year: '2023' },
    { title: 'Juara 1 MTQ Provinsi', org: 'Kemenag Jawa Barat', year: '2022' },
    { title: 'Pelatihan TPQ Nasional', org: 'Kemenag RI', year: '2021' },
  ];

  const experiences = [
    { role: 'Pengajar Tahfidz Senior', place: 'Pesantren Al-Hikmah, Bandung', period: 'Jan 2022 – Sekarang · 3 thn' },
    { role: 'Imam Rawatib & Pembina TPQ', place: 'Masjid Al-Ikhlas, Bandung', period: 'Agu 2019 – Des 2021 · 2 thn' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* TOP ACTION BUTTONS */}
      <View style={styles.topActions}>
        <TouchableOpacity style={styles.topIconBtn} onPress={handleLogout} testID="logout-btn">
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topIconBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* COVER + AVATAR */}
        <View style={styles.cover}>
          <View style={styles.avatarWrap}>
            <Avatar name={user.name} size={88} />
            <View style={styles.avatarDot} />
          </View>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          {/* Edit Profil button */}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push('/edit-profile')}
            testID="edit-profile-btn"
          >
            <Text style={styles.editBtnText}>Edit Profil</Text>
          </TouchableOpacity>

          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileUsername}>@{user.name.toLowerCase().replace(/\s+/g, '').slice(0, 14)}.huffadz</Text>

          {/* Badge pill */}
          <View style={styles.badgeRow}>
            <View style={styles.badgePill}>
              <Text style={styles.badgePillText}>
                {isKhatam ? 'Hafidz 30 Juz' : `${juzCount} Juz`} · Murattal Riwayat Hafs
              </Text>
            </View>
          </View>

          {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

          {/* Location & join date */}
          <View style={styles.metaRow}>
            {user.city ? (
              <Text style={styles.metaText}>
                <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} /> {user.city}, Jawa Barat
              </Text>
            ) : null}
            <Text style={styles.metaText}>Pesantren Al-Hikmah</Text>
            <Text style={styles.metaText}>Bergabung Mar 2024</Text>
          </View>

          {/* STATS */}
          <View style={styles.statsRow}>
            {[
              { value: '1.2K', label: 'Pengikut' },
              { value: '384', label: 'Mengikuti' },
              { value: String(juzCount), label: 'Juz' },
              { value: '12', label: 'Sertifikat' },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <View style={styles.statsDivider} />}
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* PROGRES HAFALAN */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PROGRES HAFALAN</Text>
            <Text style={styles.sectionMeta}>Update: 3 hari lalu</Text>
          </View>
          <View style={styles.hafalanCard}>
            <View style={styles.hafalanTop}>
              <CircleProgress value={juzCount} max={30} size={72} />
              <View style={styles.hafalanInfo}>
                <Text style={styles.hafalanName}>Khatam Al-Qur'an</Text>
                <Text style={styles.hafalanRiwayat}>Riwayat Hafs 'an 'Ashim</Text>
                <View style={styles.hafalanPill}>
                  <Text style={styles.hafalanPillText}>Murojaah Rutin · 7x/minggu</Text>
                </View>
              </View>
            </View>
            <JuzGrid total={juzCount} />
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
                <Text style={styles.legendText}>Hafal</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.gold }]} />
                <Text style={styles.legendText}>Sedang Dihafal</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.border }]} />
                <Text style={styles.legendText}>Belum</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SERTIFIKASI & PENCAPAIAN */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SERTIFIKASI & PENCAPAIAN</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.certList}>
            {certs.map((c, i) => <CertCard key={i} {...c} />)}
          </ScrollView>
        </View>

        {/* KEAHLIAN & BAKAT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KEAHLIAN & BAKAT</Text>
          <View style={styles.skillsWrap}>
            {skills.map((s) => (
              <View key={s.label} style={[styles.skillChip, s.highlight && styles.skillChipHL]}>
                <Text style={[styles.skillText, s.highlight && styles.skillTextHL]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* PENGALAMAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PENGALAMAN</Text>
          <View style={styles.expList}>
            {experiences.map((e, i) => <ExpItem key={i} {...e} />)}
          </View>
        </View>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // TOP ACTIONS
  topActions: {
    position: 'absolute', top: 52, right: SPACING.md,
    flexDirection: 'row', gap: 8, zIndex: 10,
  },
  topIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },

  // COVER
  cover: {
    height: 140, backgroundColor: COLORS.primary,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: SPACING.md,
    paddingBottom: 0,
  },
  avatarWrap: {
    marginBottom: -44,
    position: 'relative',
  },
  avatarDot: {
    position: 'absolute', bottom: 4, right: 2,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: COLORS.gold,
    borderWidth: 2, borderColor: '#fff',
  },

  // PROFILE CARD
  profileCard: {
    backgroundColor: COLORS.card,
    paddingTop: 52,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  editBtn: {
    position: 'absolute', top: SPACING.sm, right: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md, paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  editBtnText: { fontFamily: FONTS.semiBold, fontSize: 13, color: '#fff' },
  profileName: { fontFamily: FONTS.bold, fontSize: 20, color: COLORS.text, marginBottom: 2 },
  profileUsername: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', marginBottom: 10 },
  badgePill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgePillText: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.primary },
  bio: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text, lineHeight: 22, marginBottom: 8 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACING.md },
  metaText: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text },
  statLabel: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  statsDivider: { width: 1, backgroundColor: COLORS.border },

  // SECTION
  section: {
    backgroundColor: COLORS.card,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 13, color: COLORS.text, letterSpacing: 0.4, marginBottom: SPACING.sm },
  sectionMeta: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary },
  seeAll: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.primary },

  // HAFALAN CARD
  hafalanCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.md },
  hafalanTop: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  hafalanInfo: { flex: 1, justifyContent: 'center' },
  hafalanName: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: 4 },
  hafalanRiwayat: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  hafalanPill: {
    backgroundColor: COLORS.primaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  hafalanPillText: { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.primary },

  // JUZ GRID
  juzGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: SPACING.sm },
  juzCell: {
    width: '13%', aspectRatio: 1, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
    maxWidth: 38,
  },
  juzHafal: { backgroundColor: COLORS.primary },
  juzSedang: { backgroundColor: COLORS.gold },
  juzBelum: { backgroundColor: COLORS.border },
  juzCellText: { fontFamily: FONTS.semiBold, fontSize: 11, color: COLORS.textSecondary },
  juzCellTextHafal: { color: '#fff' },

  // LEGEND
  legendRow: { flexDirection: 'row', gap: SPACING.md, marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary },

  // CIRCLE PROGRESS
  circleOuter: {
    borderWidth: 5, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  circleInner: {
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  circleValue: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.primary, lineHeight: 20 },
  circleMax: { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textSecondary, lineHeight: 12 },
  circleLabel: { fontFamily: FONTS.regular, fontSize: 9, color: COLORS.textSecondary },

  // CERT
  certList: { gap: SPACING.sm, paddingVertical: 4 },
  certCard: {
    width: 140, backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg, padding: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  certIcon: {
    width: '100%', height: 56, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary, marginBottom: 8,
  },
  certTitle: { fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.text, marginBottom: 4 },
  certOrg: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginBottom: 2 },
  certYear: { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.primary },

  // SKILLS
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  skillChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1, borderColor: COLORS.border,
  },
  skillChipHL: { backgroundColor: '#FFF8E1', borderColor: COLORS.gold },
  skillText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.text },
  skillTextHL: { color: COLORS.gold },

  // EXPERIENCE
  expList: { gap: SPACING.sm, marginTop: 4 },
  expItem: {
    flexDirection: 'row', gap: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  expIcon: {
    width: 40, height: 40, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
  },
  expInfo: { flex: 1 },
  expRole: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text, marginBottom: 2 },
  expPlace: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 },
  expPeriod: { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.primary },
});
