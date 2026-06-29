import React, { useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '@/src/constants/theme';

// ---------- AVATAR ----------
function Avatar({ name, size = 88 }: { name?: string; size?: number }) {
  const initials = (name || '?').split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  return (
    <View style={[styles.avatarRing, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 }]}>
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#E8C84A', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: COLORS.primary, fontSize: size * 0.34, fontFamily: FONTS.bold }}>{initials}</Text>
      </View>
    </View>
  );
}

// ---------- JUZ GRID ----------
function JuzGrid({ total = 30 }: { total?: number }) {
  return (
    <View style={styles.juzGrid}>
      {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => {
        const hafal = j <= total;
        const sedang = j === total + 1;
        return (
          <View key={j} style={[styles.juzCell, hafal ? styles.juzHafal : sedang ? styles.juzSedang : styles.juzBelum]}>
            <Text style={[styles.juzCellText, hafal && styles.juzCellTextHafal]}>{j}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ---------- CIRCULAR PROGRESS ----------
function CircleProgress({ value, size = 72 }: { value: number; size?: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[styles.circleOuter, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={[styles.circleInner, { width: size - 12, height: size - 12, borderRadius: (size - 12) / 2 }]}>
          <Text style={styles.circleValue}>{value}</Text>
          <Text style={styles.circleLabel}>Juz</Text>
        </View>
      </View>
    </View>
  );
}

// ---------- CERT CARD ----------
function CertCard({ title, org, year, color }: { title: string; org: string; year: string; color: string }) {
  return (
    <View style={styles.certCard}>
      <View style={[styles.certIcon, { backgroundColor: color }]} />
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
      <View style={styles.expIconWrap}>
        <Ionicons name="briefcase-outline" size={20} color={COLORS.primary} />
      </View>
      <View style={styles.expInfo}>
        <Text style={styles.expRole}>{role}</Text>
        <Text style={styles.expPlace}>{place}</Text>
        <Text style={styles.expPeriod}>{period}</Text>
      </View>
    </View>
  );
}

// ---------- ANIMATED SECTION ----------
function AnimSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

// ---------- MAIN SCREEN ----------
const ROLES = [
  { id: 'santri', label: 'Santri Huffadz' },
  { id: 'ustadz', label: 'Ustadz/Musyrif' },
  { id: 'huffadz', label: 'Huffadz Dewasa' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(useCallback(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fadeAnim]));

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

  const hp = user.huffadzProfile;
  const juzCount = hp?.juzProgress || hp?.verifiedJuz || (user as any).juz_count || 0;
  const isKhatam = juzCount >= 30;

  const skillsList = hp?.skillsList?.length ? hp.skillsList : ['Tahfidz Quran', 'Tilawah', 'Tajwid'];
  const interests = hp?.interests || [];
  const hobbies = hp?.hobbies || [];
  const experiences = hp?.experiences?.length ? hp.experiences : [];
  const certs = hp?.certificationsList?.length ? hp.certificationsList : [];
  const genderLabel = (user as any).gender === 'L' ? 'Laki-laki' : (user as any).gender === 'P' ? 'Perempuan' : null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* ── COVER ── */}
        <LinearGradient
          colors={['#0A2E3A', '#0F3D4C', '#1A5C6B']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.cover, { paddingTop: insets.top + 12 }]}
        >
          {/* Decorative circles — background depth */}
          <View style={styles.decCircle1} />
          <View style={styles.decCircle2} />
          <View style={styles.decCircle3} />
          <View style={styles.decCircle4} />

          {/* Gold accent dots */}
          <View style={styles.decDot1} />
          <View style={styles.decDot2} />
          <View style={styles.decDot3} />

          {/* Top icon buttons */}
          <View style={styles.coverActions}>
            <TouchableOpacity style={styles.coverIconBtn} onPress={handleLogout} testID="logout-btn" activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={19} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.coverIconBtn} onPress={() => router.push('/app-health')} activeOpacity={0.7}>
              <Ionicons name="heart-circle-outline" size={19} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.coverIconBtn} activeOpacity={0.7}>
              <Ionicons name="ellipsis-horizontal" size={19} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>

          {/* Avatar with glow ring */}
          <View style={styles.avatarWrap}>
            {/* Outer glow ring */}
            <View style={styles.avatarGlow} />
            <Avatar name={user.name} size={88} />
            {/* Online dot */}
            <View style={styles.avatarDot} />
          </View>

          {/* Bottom fade into white */}
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.06)']}
            style={styles.coverBottomFade}
          />
        </LinearGradient>

        {/* ── PROFILE CARD ── */}
        <AnimSection delay={60}>
          <View style={styles.profileCard}>
            {/* Edit Profil button */}
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => router.push('/edit-profile')}
              testID="edit-profile-btn"
              activeOpacity={0.85}
            >
              <Text style={styles.editBtnText}>Edit Profil</Text>
            </TouchableOpacity>

            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileUsername}>
              @{user.username || user.name.toLowerCase().replace(/\s+/g, '').slice(0, 14)}.huffadz
            </Text>

            {/* Badge pill */}
            <View style={styles.badgeRow}>
              <View style={styles.badgePill}>
                <Text style={styles.badgePillText}>
                  {isKhatam ? 'Hafidz 30 Juz' : `${juzCount} Juz`} · Murattal Riwayat Hafs
                </Text>
              </View>
            </View>

            {user.bio || hp?.bio ? <Text style={styles.bio}>{user.bio || hp?.bio}</Text> : null}

            {/* Meta row */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{user.city_name || user.city?.name || hp?.city || 'Indonesia'}</Text>
              </View>
              <View style={styles.metaDot} />
              <View style={styles.metaItem}>
                <Ionicons name="call-outline" size={12} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{user.phone || '-'}</Text>
              </View>
              {genderLabel ? (
                <>
                  <View style={styles.metaDot} />
                  <Text style={styles.metaText}>{genderLabel}</Text>
                </>
              ) : null}
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              {[
                { value: '1.2K', label: 'Pengikut' },
                { value: '384', label: 'Mengikuti' },
                { value: String(juzCount), label: 'Juz' },
                { value: '12', label: 'Sertifikat' },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <View style={styles.statsDivider} />}
                  <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
                    <Text style={styles.statValue}>{s.value}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </View>
        </AnimSection>

        {/* ── INFORMASI AKUN ── */}
        <AnimSection delay={100}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMASI AKUN</Text>
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={15} color={COLORS.textSecondary} />
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email || '-'}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={15} color={COLORS.textSecondary} />
                <Text style={styles.infoLabel}>Telepon</Text>
                <Text style={styles.infoValue}>{user.phone || '-'}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={15} color={COLORS.textSecondary} />
                <Text style={styles.infoLabel}>Tanggal Lahir</Text>
                <Text style={styles.infoValue}>{(user as any).birthday || '-'}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={15} color={COLORS.textSecondary} />
                <Text style={styles.infoLabel}>Jenis Kelamin</Text>
                <Text style={styles.infoValue}>{genderLabel || '-'}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Ionicons name="shield-checkmark-outline" size={15} color={COLORS.textSecondary} />
                <Text style={styles.infoLabel}>Peran</Text>
                <Text style={styles.infoValue}>{user.role ? ROLES.find((r: any) => r.id === user.role)?.label || user.role : '-'}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={15} color={COLORS.textSecondary} />
                <Text style={styles.infoLabel}>Lokasi</Text>
                <Text style={styles.infoValue}>{user.city_name || user.city?.name || hp?.city || '-'}</Text>
              </View>
            </View>
          </View>
        </AnimSection>

        {/* ── PROGRES HAFALAN ── */}
        <AnimSection delay={140}>
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>PROGRES HAFALAN</Text>
              <Text style={styles.sectionMeta}>Update: 3 hari lalu</Text>
            </View>
            <View style={styles.hafalanCard}>
              <View style={styles.hafalanTop}>
                <CircleProgress value={juzCount} size={72} />
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
        </AnimSection>

        {/* ── SERTIFIKASI & PENCAPAIAN ── */}
        {certs.length > 0 ? (
          <AnimSection delay={220}>
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>SERTIFIKASI & PENCAPAIAN</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.certList}>
                {certs.map((c: any, i: number) => (
                  <CertCard key={i} title={c.title || c.name || ''} org={c.organization || c.org || ''} year={c.year || c.date || ''} color={c.color || COLORS.primary} />
                ))}
              </ScrollView>
            </View>
          </AnimSection>
        ) : null}

        {/* ── KEAHLIAN & BAKAT ── */}
        <AnimSection delay={300}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>KEAHLIAN & BAKAT</Text>
            {skillsList.length > 0 ? (
              <View style={styles.skillsWrap}>
                {skillsList.map((s: string) => (
                  <View key={s} style={styles.skillChip}>
                    <Text style={styles.skillText}>{s}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            {interests.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { marginTop: SPACING.sm }]}>MINAT</Text>
                <View style={styles.skillsWrap}>
                  {interests.map((i: string) => (
                    <View key={i} style={[styles.skillChip, { backgroundColor: '#FFF8E1', borderColor: COLORS.gold }]}>
                      <Text style={[styles.skillText, { color: COLORS.gold }]}>{i}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : null}
            {hobbies.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { marginTop: SPACING.sm }]}>HOBI</Text>
                <View style={styles.skillsWrap}>
                  {hobbies.map((h: string) => (
                    <View key={h} style={styles.skillChip}>
                      <Text style={styles.skillText}>{h}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : null}
          </View>
        </AnimSection>

        {/* ── PENGALAMAN ── */}
        {experiences.length > 0 ? (
          <AnimSection delay={380}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PENGALAMAN</Text>
              <View style={styles.expList}>
                {experiences.map((e: any, i: number) => (
                  <ExpItem key={i} role={e.role || e.title} place={e.place || e.organization || ''} period={e.period || e.year || ''} />
                ))}
              </View>
            </View>
          </AnimSection>
        ) : null}

        <View style={{ height: SPACING.xl * 2 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },

  // COVER
  cover: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 52,
    overflow: 'hidden',
    position: 'relative',
  },
  coverBottomFade: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
  },

  // Decorative geometric circles
  decCircle1: {
    position: 'absolute', top: -60, right: -60,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decCircle2: {
    position: 'absolute', top: 20, right: 40,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decCircle3: {
    position: 'absolute', bottom: 30, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(184,134,11,0.12)',
  },
  decCircle4: {
    position: 'absolute', bottom: -30, left: 100,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  decDot1: {
    position: 'absolute', top: 44, left: 130,
    width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: 'rgba(184,134,11,0.7)',
  },
  decDot2: {
    position: 'absolute', top: 72, left: 155,
    width: 3, height: 3, borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  decDot3: {
    position: 'absolute', top: 58, left: 175,
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(184,134,11,0.5)',
  },

  coverActions: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginBottom: 20,
    zIndex: 2,
  },
  coverIconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarWrap: {
    position: 'relative',
    alignSelf: 'flex-start',
    zIndex: 2,
  },
  avatarGlow: {
    position: 'absolute',
    top: -8, left: -8,
    width: 116, height: 116, borderRadius: 58,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(184,134,11,0.5)',
  },
  avatarRing: {
    borderWidth: 3.5, borderColor: '#fff',
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarDot: {
    position: 'absolute', bottom: 6, right: 4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#4CAF50',
    borderWidth: 2.5, borderColor: '#fff',
  },

  // PROFILE CARD
  profileCard: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 8,
  },
  editBtn: {
    position: 'absolute', top: 12, right: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  editBtnText: { fontFamily: FONTS.semiBold, fontSize: 13, color: '#fff' },
  profileName: { fontFamily: FONTS.bold, fontSize: 21, color: COLORS.text, marginBottom: 3 },
  profileUsername: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginBottom: 10 },
  badgeRow: { flexDirection: 'row', marginBottom: 12 },
  badgePill: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.gold,
  },
  badgePillText: { fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.gold },
  bio: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text, lineHeight: 22, marginBottom: 10 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: SPACING.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: COLORS.textSecondary },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingTop: SPACING.md, marginTop: 4,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text },
  statLabel: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  statsDivider: { width: 1, backgroundColor: COLORS.border },

  // SECTION
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm,
  },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 13, color: COLORS.text, letterSpacing: 0.5, marginBottom: SPACING.sm },
  sectionMeta: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  seeAll: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.primary, marginBottom: SPACING.sm },

  // HAFALAN CARD
  hafalanCard: {
    backgroundColor: '#F8FAFB', borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  hafalanTop: { flexDirection: 'row', gap: SPACING.md, marginBottom: 14 },
  hafalanInfo: { flex: 1, justifyContent: 'center' },
  hafalanName: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: 4 },
  hafalanRiwayat: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  hafalanPill: {
    backgroundColor: COLORS.primaryLight, alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full,
  },
  hafalanPillText: { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.primary },

  // JUZ GRID
  juzGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: SPACING.sm },
  juzCell: {
    width: '13%', aspectRatio: 1, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center', maxWidth: 38,
  },
  juzHafal: { backgroundColor: COLORS.primary },
  juzSedang: { backgroundColor: COLORS.gold },
  juzBelum: { backgroundColor: COLORS.border },
  juzCellText: { fontFamily: FONTS.semiBold, fontSize: 11, color: COLORS.textSecondary },
  juzCellTextHafal: { color: '#fff' },

  // LEGEND
  legendRow: { flexDirection: 'row', gap: 16, marginTop: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary },

  // CIRCLE PROGRESS
  circleOuter: {
    borderWidth: 5, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  circleInner: {
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  circleValue: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.primary },
  circleLabel: { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textSecondary },

  // CERT
  certList: { gap: SPACING.sm, paddingBottom: 4 },
  certCard: {
    width: 148, backgroundColor: '#F8FAFB',
    borderRadius: RADIUS.lg, padding: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  certIcon: { width: '100%', height: 60, borderRadius: RADIUS.sm, marginBottom: 8 },
  certTitle: { fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.text, marginBottom: 4 },
  certOrg: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginBottom: 2 },
  certYear: { fontFamily: FONTS.semiBold, fontSize: 11, color: COLORS.primary },

  // INFO LIST
  infoList: { gap: 0 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  infoLabel: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary, width: 100 },
  infoValue: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, flex: 1 },
  infoDivider: { height: 1, backgroundColor: COLORS.border },

  // SKILLS
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  skillChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: '#F4F5F7',
    borderWidth: 1, borderColor: COLORS.border,
  },
  skillChipHL: { backgroundColor: '#FFF8E1', borderColor: COLORS.gold },
  skillText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.text },
  skillTextHL: { color: COLORS.gold },

  // EXPERIENCE
  expList: { gap: SPACING.sm, marginTop: 4 },
  expItem: {
    flexDirection: 'row', gap: SPACING.sm,
    backgroundColor: '#F8FAFB', borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  expIconWrap: {
    width: 44, height: 44, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  expInfo: { flex: 1 },
  expRole: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text, marginBottom: 2 },
  expPlace: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginBottom: 3 },
  expPeriod: { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.primary },
});
