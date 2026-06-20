import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, RefreshControl, ActivityIndicator, Animated,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { apiGet, apiPost, apiDelete } from '@/src/utils/api';
import { COLORS, FONTS, SPACING, RADIUS, getJuzBadge, getRoleLabel } from '@/src/constants/theme';
import { USERS, COMMUNITIES, HALAQAHS } from '@/src/utils/mock';

// ---------- AVATAR ----------
function Avatar({ name, size = 44, role }: { name?: string; size?: number; role?: string }) {
  const initials = (name || '?').split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  const bg = role === 'ustadz' || role === 'huffadz' ? '#FCE38A' : COLORS.primaryLight;
  const fg = role === 'ustadz' || role === 'huffadz' ? COLORS.gold : COLORS.primary;
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: bg, alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ color: fg, fontSize: size * 0.34, fontFamily: FONTS.bold }}>{initials}</Text>
    </View>
  );
}

const FILTERS = ['Semua', 'Huffadz', 'Komunitas', 'Halaqah', 'Pesantren'];

// ---------- ANIMATED PRESS BUTTON ----------
function PressBtn({ style, textStyle, label, onPress, disabled }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 30 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={style}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        {typeof label === 'string'
          ? <Text style={textStyle}>{label}</Text>
          : label}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ---------- SARAN KONEKSI CARD ----------
function SuggestionCard({ user, onFollow }: any) {
  const [following, setFollowing] = useState(user.is_following || false);
  const [loading, setLoading] = useState(false);
  const badge = getJuzBadge(user.juz_count || 0);

  const handleFollow = async () => {
    setLoading(true);
    try {
      if (following) {
        await apiDelete(`/api/users/${user.user_id}/follow`);
      } else {
        await apiPost(`/api/users/${user.user_id}/follow`);
      }
      setFollowing(!following);
      onFollow?.();
    } catch {}
    setLoading(false);
  };

  return (
    <View style={styles.suggCard}>
      <View style={styles.suggAvatarRing}>
        <Avatar name={user.name} size={56} role={user.role} />
      </View>
      <Text style={styles.suggName} numberOfLines={1}>{user.name}</Text>
      <Text style={styles.suggRole} numberOfLines={1}>{getRoleLabel(user.role)}</Text>
      {badge.label ? (
        <View style={[styles.juzPill, { backgroundColor: badge.bg }]}>
          <Text style={styles.juzPillText}>{badge.label}</Text>
        </View>
      ) : null}
      <Text style={styles.suggCity} numberOfLines={1}>{user.city}</Text>
      <PressBtn
        style={[styles.followBtn, following && styles.followBtnActive]}
        textStyle={[styles.followBtnText, following && styles.followBtnTextActive]}
        label={loading
          ? <ActivityIndicator size="small" color={following ? COLORS.primary : '#fff'} />
          : (following ? '✓ Mengikuti' : '+ Ikuti')
        }
        onPress={handleFollow}
        disabled={loading}
      />
    </View>
  );
}

// ---------- KOMUNITAS CARD ----------
function CommunityCard({ community }: any) {
  const [joined, setJoined] = useState(community.is_member || false);
  const coverColor = community.is_verified ? COLORS.primary : '#2E7D8C';
  const tag = community.is_verified ? 'Nasional' : 'Mahasiswa';

  return (
    <View style={styles.commCard}>
      <View style={[styles.commCover, { backgroundColor: coverColor }]}>
        <View style={styles.commCoverGradient} />
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>{tag}</Text>
        </View>
      </View>
      <View style={styles.commBody}>
        <Text style={styles.commName} numberOfLines={2}>{community.name}</Text>
        <Text style={styles.commMembers}>
          {community.members_count >= 1000
            ? `${(community.members_count / 1000).toFixed(1)}K anggota`
            : `${community.members_count} anggota`}
        </Text>
        <View style={styles.commTag}>
          <Text style={styles.commTagText}>{tag}</Text>
        </View>
        <PressBtn
          style={[styles.joinBtn, joined && styles.joinBtnActive]}
          textStyle={[styles.joinBtnText, joined && styles.joinBtnTextActive]}
          label={joined ? '✓ Bergabung' : '+ Bergabung'}
          onPress={() => setJoined(!joined)}
        />
      </View>
    </View>
  );
}

// ---------- HALAQAH ROW ----------
function HalaqahRow({ halaqah }: any) {
  const [registered, setRegistered] = useState(halaqah.is_registered || false);
  const full = halaqah.registered_count >= halaqah.max_slots;
  const isOnline = halaqah.platform !== 'Offline';

  return (
    <View style={styles.halaqahCard}>
      <View style={styles.halaqahTop}>
        <Avatar name={halaqah.ustadz_name} size={44} role="ustadz" />
        <View style={styles.halaqahInfo}>
          <View style={styles.halaqahTitleRow}>
            <Text style={styles.halaqahTitle} numberOfLines={1}>{halaqah.title}</Text>
            <View style={[styles.onlineBadge, { backgroundColor: isOnline ? '#E8F5E9' : '#FFF3E0' }]}>
              <Text style={[styles.onlineBadgeText, { color: isOnline ? '#2E7D32' : '#E65100' }]}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
          <Text style={styles.halaqahLeader}>Dipimpin {halaqah.ustadz_name}</Text>
        </View>
      </View>
      <View style={styles.halaqahDivider} />
      <View style={styles.halaqahBottom}>
        <View style={styles.halaqahMeta}>
          <Ionicons name="time-outline" size={12} color={COLORS.textSecondary} />
          <Text style={styles.halaqahMetaText}>
            {halaqah.platform === 'Offline' ? 'Hari ini' : 'Malam ini'}, 20.00 WIB · {halaqah.registered_count}/{halaqah.max_slots} peserta
          </Text>
        </View>
        <View style={styles.halaqahFooter}>
          <View style={styles.miniAvatarRow}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.miniAvatar, { marginLeft: i > 0 ? -8 : 0 }]}>
                <Text style={styles.miniAvatarText}>{String.fromCharCode(65 + i)}</Text>
              </View>
            ))}
            <Text style={styles.moreText}>+{Math.max(0, halaqah.registered_count - 3)} lainnya</Text>
          </View>
          <PressBtn
            style={[
              styles.gabungBtn,
              registered && styles.gabungBtnRegistered,
              full && !registered && styles.gabungBtnFull,
            ]}
            textStyle={[styles.gabungBtnText, registered && styles.gabungBtnTextRegistered]}
            label={registered ? 'Daftar' : full ? 'Penuh' : 'Gabung'}
            onPress={() => !full && setRegistered(!registered)}
            disabled={full && !registered}
          />
        </View>
      </View>
    </View>
  );
}

// ---------- NEARBY ROW ----------
function NearbyRow({ user, onPress, index }: any) {
  const [following, setFollowing] = useState(user.is_following || false);
  const badge = getJuzBadge(user.juz_count || 0);
  const interests = user.interests?.slice(0, 2) || [];
  const dist = [12, 7, 24][index % 3];

  return (
    <TouchableOpacity style={styles.nearbyRow} onPress={() => onPress(user.user_id)} activeOpacity={0.75}>
      <View style={styles.nearbyAvatarWrap}>
        <Avatar name={user.name} size={50} role={user.role} />
      </View>
      <View style={styles.nearbyInfo}>
        <Text style={styles.nearbyName}>{user.name}</Text>
        <Text style={styles.nearbyRole}>{getRoleLabel(user.role)} · {user.city}</Text>
        <View style={styles.nearbyTags}>
          {badge.label && (
            <View style={[styles.nearbyPill, { backgroundColor: badge.bg }]}>
              <Text style={styles.nearbyPillText}>{badge.label}</Text>
            </View>
          )}
          {interests.map((t: string) => (
            <View key={t} style={styles.interestTag}>
              <Text style={styles.interestTagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.nearbyRight}>
        <PressBtn
          style={[styles.nearbyFollowBtn, following && styles.nearbyFollowBtnActive]}
          textStyle={[styles.nearbyFollowText, following && styles.nearbyFollowTextActive]}
          label={following ? 'Mengikuti' : '+ Ikuti'}
          onPress={() => setFollowing(!following)}
        />
        <Text style={styles.nearbyDist}>{dist} mutasi</Text>
      </View>
    </TouchableOpacity>
  );
}

// ---------- ANIMATED SECTION ----------
function AnimSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, { toValue: 1, duration: 380, delay, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 380, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: slide }] }}>
      {children}
    </Animated.View>
  );
}

// ---------- MAIN SCREEN ----------
export default function NetworkScreen() {
  const [filter, setFilter] = useState('Semua');
  const [connections, setConnections] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(useCallback(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fadeAnim]));

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const conn = await apiGet('/api/network/connections');
      setConnections(conn);
    } catch {}
    setRefreshing(false);
  };

  const onRefresh = useCallback(() => { setRefreshing(true); loadData(); }, []);

  const suggestions = [...USERS].slice(0, 5);
  const communities = [...COMMUNITIES].slice(0, 4);
  const halaqahs = [...HALAQAHS].slice(0, 2);
  const nearbyUsers = [...USERS].slice(0, 3);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* HEADER (teal, behind status bar) */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle}>Jejaring Huffadz</Text>
            <Text style={styles.headerSub}>Terhubung bersama Para Penghafal Quran</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
              <Ionicons name="search-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
              <Ionicons name="options-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH BAR (inside header) */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={15} color="rgba(255,255,255,0.7)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama, pesantren, kota..."
            placeholderTextColor="rgba(255,255,255,0.55)"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        {/* STATS */}
        <AnimSection delay={50}>
          <View style={styles.statsRow}>
            {[
              { value: '1.2K', label: 'Pengikut' },
              { value: '384', label: 'Mengikuti' },
              { value: '12', label: 'Komunitas' },
              { value: '5', label: 'Halaqah' },
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
        </AnimSection>

        {/* FILTER CHIPS */}
        <AnimSection delay={100}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, filter === f && styles.filterChipActive]}
                onPress={() => setFilter(f)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </AnimSection>

        {/* SARAN KONEKSI */}
        <AnimSection delay={180}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SARAN KONEKSI</Text>
            <TouchableOpacity activeOpacity={0.7}><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {suggestions.map((u) => (
              <SuggestionCard key={u.user_id} user={u} onFollow={loadData} />
            ))}
          </ScrollView>
        </AnimSection>

        {/* KOMUNITAS POPULER */}
        <AnimSection delay={260}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>KOMUNITAS POPULER</Text>
            <TouchableOpacity activeOpacity={0.7}><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {communities.map((c) => (
              <CommunityCard key={c.community_id} community={c} />
            ))}
          </ScrollView>
        </AnimSection>

        {/* HALAQAH AKTIF */}
        <AnimSection delay={340}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>HALAQAH AKTIF</Text>
            <TouchableOpacity activeOpacity={0.7}><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
          </View>
          <View style={styles.cardList}>
            {halaqahs.map((h) => (
              <HalaqahRow key={h.halaqah_id} halaqah={h} />
            ))}
          </View>
        </AnimSection>

        {/* HUFFADZ DEKAT LOKASI */}
        <AnimSection delay={420}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>HUFFADZ DEKAT LOKASI ANDA</Text>
            <TouchableOpacity activeOpacity={0.7}><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
          </View>
          <View style={styles.nearbyList}>
            {nearbyUsers.map((u, i) => (
              <NearbyRow
                key={u.user_id}
                user={u}
                index={i}
                onPress={(id: string) => router.push(`/user/${id}`)}
              />
            ))}
          </View>
        </AnimSection>

        <View style={{ height: SPACING.xl * 2 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },

  // HEADER
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTextCol: { flex: 1 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 22, color: '#fff' },
  headerSub: { fontFamily: FONTS.regular, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  headerIconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },

  // SEARCH
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: SPACING.md, paddingVertical: 10,
  },
  searchInput: {
    flex: 1, fontFamily: FONTS.regular, fontSize: 14,
    color: '#fff', padding: 0,
  },

  // STATS
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text },
  statLabel: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  statsDivider: { width: 1, backgroundColor: COLORS.border },

  // FILTER
  filterRow: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: '#fff',
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary },
  filterChipTextActive: { color: '#fff' },

  // SECTION
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, marginTop: 20, marginBottom: 10,
  },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 12, color: COLORS.text, letterSpacing: 0.8 },
  seeAll: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.primary },

  // HORIZONTAL LIST
  hList: { paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingBottom: 4 },

  // SARAN KONEKSI CARD
  suggCard: {
    width: 148, backgroundColor: '#fff',
    borderRadius: RADIUS.lg, padding: 14,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  suggAvatarRing: {
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 2, borderColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  suggName: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, textAlign: 'center', marginTop: 8 },
  suggRole: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },
  juzPill: {
    paddingHorizontal: 9, paddingVertical: 3,
    borderRadius: RADIUS.full, marginTop: 5,
  },
  juzPillText: { fontFamily: FONTS.semiBold, fontSize: 10, color: '#fff' },
  suggCity: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginTop: 3 },
  followBtn: {
    marginTop: 10, width: '100%', height: 34,
    borderRadius: RADIUS.full, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  followBtnActive: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.primary },
  followBtnText: { fontFamily: FONTS.semiBold, fontSize: 12, color: '#fff' },
  followBtnTextActive: { color: COLORS.primary },

  // KOMUNITAS CARD
  commCard: {
    width: 168, backgroundColor: '#fff',
    borderRadius: RADIUS.lg, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  commCover: { height: 72, width: '100%', justifyContent: 'flex-end' },
  commCoverGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  verifiedBadge: {
    position: 'absolute', bottom: 8, left: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full,
  },
  verifiedText: { fontFamily: FONTS.medium, fontSize: 10, color: '#fff' },
  commBody: { padding: 12 },
  commName: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, marginBottom: 2 },
  commMembers: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginBottom: 6 },
  commTag: {
    alignSelf: 'flex-start', backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full, marginBottom: 10,
  },
  commTagText: { fontFamily: FONTS.medium, fontSize: 10, color: COLORS.primary },
  joinBtn: {
    height: 32, borderRadius: RADIUS.full, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  joinBtnActive: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.primary },
  joinBtnText: { fontFamily: FONTS.semiBold, fontSize: 12, color: '#fff' },
  joinBtnTextActive: { color: COLORS.primary },

  // HALAQAH
  cardList: { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  halaqahCard: {
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  halaqahTop: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: SPACING.md, gap: SPACING.sm,
  },
  halaqahInfo: { flex: 1 },
  halaqahTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  halaqahTitle: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text, flex: 1 },
  onlineBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  onlineBadgeText: { fontFamily: FONTS.semiBold, fontSize: 10 },
  halaqahLeader: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary },
  halaqahDivider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: SPACING.md },
  halaqahBottom: { padding: SPACING.md },
  halaqahMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  halaqahMetaText: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, flex: 1 },
  halaqahFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  miniAvatarRow: { flexDirection: 'row', alignItems: 'center' },
  miniAvatar: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#fff',
  },
  miniAvatarText: { fontFamily: FONTS.bold, fontSize: 8, color: COLORS.primary },
  moreText: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginLeft: 6 },
  gabungBtn: {
    backgroundColor: COLORS.gold, paddingHorizontal: 18,
    height: 34, borderRadius: RADIUS.full,
    alignItems: 'center', justifyContent: 'center',
  },
  gabungBtnRegistered: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.primary },
  gabungBtnFull: { backgroundColor: COLORS.border },
  gabungBtnText: { fontFamily: FONTS.semiBold, fontSize: 13, color: '#fff' },
  gabungBtnTextRegistered: { color: COLORS.primary },

  // NEARBY
  nearbyList: { paddingHorizontal: SPACING.md, gap: 6 },
  nearbyRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: RADIUS.lg,
    padding: SPACING.md, gap: SPACING.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  nearbyAvatarWrap: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, borderColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  nearbyInfo: { flex: 1 },
  nearbyName: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text },
  nearbyRole: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  nearbyTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 5 },
  nearbyPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full },
  nearbyPillText: { fontFamily: FONTS.semiBold, fontSize: 10, color: '#fff' },
  interestTag: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: RADIUS.full, backgroundColor: COLORS.primaryLight,
  },
  interestTagText: { fontFamily: FONTS.medium, fontSize: 10, color: COLORS.primary },
  nearbyRight: { alignItems: 'flex-end', gap: 5 },
  nearbyFollowBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 14,
    height: 32, borderRadius: RADIUS.full,
    alignItems: 'center', justifyContent: 'center', minWidth: 78,
  },
  nearbyFollowBtnActive: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.primary },
  nearbyFollowText: { fontFamily: FONTS.semiBold, fontSize: 12, color: '#fff' },
  nearbyFollowTextActive: { color: COLORS.primary },
  nearbyDist: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary },
});
