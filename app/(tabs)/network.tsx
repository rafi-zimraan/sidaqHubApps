import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, FlatList, RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { apiGet, apiPost, apiDelete } from '@/src/utils/api';
import { COLORS, FONTS, SPACING, RADIUS, getJuzBadge, getRoleLabel, formatTime } from '@/src/constants/theme';
import { USERS, COMMUNITIES, HALAQAHS } from '@/src/utils/mock';

// ---------- AVATAR ----------
function Avatar({ name, size = 44, role }: { name?: string; size?: number; role?: string }) {
  const initials = (name || '?').split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  const bg = role === 'ustadz' || role === 'huffadz' ? '#FCE38A' : COLORS.primaryLight;
  const fg = role === 'ustadz' || role === 'huffadz' ? COLORS.gold : COLORS.primary;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: fg, fontSize: size * 0.34, fontFamily: FONTS.bold }}>{initials}</Text>
    </View>
  );
}

const FILTERS = ['Semua', 'Huffadz', 'Komunitas', 'Halaqah', 'Pesantren'];

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
      <Avatar name={user.name} size={56} role={user.role} />
      <Text style={styles.suggName} numberOfLines={1}>{user.name}</Text>
      <Text style={styles.suggRole} numberOfLines={1}>{getRoleLabel(user.role)}</Text>
      {badge.label ? (
        <View style={[styles.juzPill, { backgroundColor: badge.bg }]}>
          <Text style={styles.juzPillText}>{badge.label}</Text>
        </View>
      ) : null}
      <Text style={styles.suggCity} numberOfLines={1}>{user.city}</Text>
      <TouchableOpacity
        style={[styles.followBtn, following && styles.followBtnActive]}
        onPress={handleFollow}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading
          ? <ActivityIndicator size="small" color={following ? COLORS.primary : '#fff'} />
          : <Text style={[styles.followBtnText, following && styles.followBtnTextActive]}>
              {following ? '✓ Mengikuti' : '+ Ikuti'}
            </Text>
        }
      </TouchableOpacity>
    </View>
  );
}

// ---------- KOMUNITAS CARD ----------
function CommunityCard({ community }: any) {
  const [joined, setJoined] = useState(community.is_member || false);
  return (
    <View style={styles.commCard}>
      <View style={[styles.commCover, { backgroundColor: community.is_verified ? COLORS.primary : '#2E7D8C' }]}>
        {community.is_verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Nasional</Text>
          </View>
        )}
      </View>
      <Text style={styles.commName} numberOfLines={2}>{community.name}</Text>
      <Text style={styles.commMembers}>{(community.members_count / 1000).toFixed(1)}K anggota</Text>
      {community.is_verified && (
        <View style={styles.commTag}>
          <Text style={styles.commTagText}>Nasional</Text>
        </View>
      )}
      <TouchableOpacity
        style={[styles.joinBtn, joined && styles.joinBtnActive]}
        onPress={() => setJoined(!joined)}
        activeOpacity={0.8}
      >
        <Text style={[styles.joinBtnText, joined && styles.joinBtnTextActive]}>
          {joined ? '✓ Bergabung' : '+ Bergabung'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------- HALAQAH ROW ----------
function HalaqahRow({ halaqah }: any) {
  const [registered, setRegistered] = useState(halaqah.is_registered || false);
  const full = halaqah.registered_count >= halaqah.max_slots;
  const isOnline = halaqah.platform !== 'Offline';

  return (
    <View style={styles.halaqahRow}>
      <View style={styles.halaqahAvatar}>
        <Avatar name={halaqah.ustadz_name} size={44} role="ustadz" />
      </View>
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
        <Text style={styles.halaqahMeta}>
          {halaqah.platform === 'Offline' ? 'Hari ini' : 'Malam ini'}, 20.00 WIB · {halaqah.registered_count}/{halaqah.max_slots} peserta
        </Text>
        <View style={styles.halaqahAvatarRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.miniAvatar, { marginLeft: i > 0 ? -8 : 0 }]}>
              <Text style={styles.miniAvatarText}>{String.fromCharCode(65 + i)}</Text>
            </View>
          ))}
          <Text style={styles.moreText}>+{halaqah.registered_count - 3} lainnya</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.gabungBtn, registered && styles.gabungBtnDaftar, full && !registered && styles.gabungBtnFull]}
        onPress={() => !full && setRegistered(!registered)}
        activeOpacity={0.8}
        disabled={full && !registered}
      >
        <Text style={[styles.gabungBtnText, registered && styles.gabungBtnTextDaftar]}>
          {registered ? 'Daftar' : full ? 'Penuh' : 'Gabung'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------- HUFFADZ DEKAT ROW ----------
function NearbyRow({ user, onPress }: any) {
  const [following, setFollowing] = useState(user.is_following || false);
  const badge = getJuzBadge(user.juz_count || 0);
  const interests = user.interests?.slice(0, 3) || [];

  return (
    <TouchableOpacity style={styles.nearbyRow} onPress={() => onPress(user.user_id)} activeOpacity={0.8}>
      <Avatar name={user.name} size={48} role={user.role} />
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
        <TouchableOpacity
          style={[styles.nearbyFollowBtn, following && styles.nearbyFollowBtnActive]}
          onPress={() => setFollowing(!following)}
          activeOpacity={0.8}
        >
          <Text style={[styles.nearbyFollowText, following && styles.nearbyFollowTextActive]}>
            {following ? 'Mengikuti' : '+ Ikuti'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.nearbyDist}>{Math.floor(Math.random() * 24) + 1} mutasi</Text>
      </View>
    </TouchableOpacity>
  );
}

// ---------- MAIN SCREEN ----------
export default function NetworkScreen() {
  const [filter, setFilter] = useState('Semua');
  const [connections, setConnections] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [conn, sugg] = await Promise.all([
        apiGet('/api/network/connections'),
        apiGet('/api/network/suggestions'),
      ]);
      setConnections(conn);
      setSuggestions(sugg);
    } catch {}
    setRefreshing(false);
  };

  const onRefresh = useCallback(() => { setRefreshing(true); loadData(); }, []);

  const allUsers = [...USERS].slice(0, 5);
  const communities = [...COMMUNITIES].slice(0, 4);
  const halaqahs = [...HALAQAHS].slice(0, 2);
  const nearbyUsers = [...USERS].slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>Jejaring Huffadz</Text>
          <Text style={styles.headerSub}>Terhubung bersama Para Penghafal Quran</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="search-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        {/* SEARCH BAR */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama, pesantren, kota..."
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          {[
            { value: `${connections.length > 0 ? '1.2K' : '1.2K'}`, label: 'Pengikut' },
            { value: '384', label: 'Mengikuti' },
            { value: '12', label: 'Komunitas' },
            { value: '5', label: 'Halaqah' },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statsDivider} />}
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        {/* FILTER CHIPS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SARAN KONEKSI */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SARAN KONEKSI</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {allUsers.map((u) => (
            <SuggestionCard key={u.user_id} user={u} onFollow={loadData} />
          ))}
        </ScrollView>

        {/* KOMUNITAS POPULER */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>KOMUNITAS POPULER</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {communities.map((c) => (
            <CommunityCard key={c.community_id} community={c} />
          ))}
        </ScrollView>

        {/* HALAQAH AKTIF */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>HALAQAH AKTIF</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
        </View>
        <View style={styles.halaqahList}>
          {halaqahs.map((h) => (
            <HalaqahRow key={h.halaqah_id} halaqah={h} />
          ))}
        </View>

        {/* HUFFADZ DEKAT LOKASI */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>HUFFADZ DEKAT LOKASI ANDA</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
        </View>
        <View style={styles.nearbyList}>
          {nearbyUsers.map((u) => (
            <NearbyRow key={u.user_id} user={u} onPress={(id: string) => router.push(`/user/${id}`)} />
          ))}
        </View>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // HEADER
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTextCol: { flex: 1 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 22, color: '#fff' },
  headerSub: { fontFamily: FONTS.regular, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  headerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },

  // SEARCH
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchInput: { flex: 1, fontFamily: FONTS.regular, fontSize: 14, color: '#fff', padding: 0 },

  // STATS
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text },
  statLabel: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  statsDivider: { width: 1, backgroundColor: COLORS.border },

  // FILTER
  filterRow: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm, gap: 8 },
  filterChip: {
    paddingHorizontal: SPACING.md, paddingVertical: 7,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary },
  filterChipTextActive: { color: '#fff' },

  // SECTION
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, marginTop: SPACING.md, marginBottom: SPACING.sm,
  },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 12, color: COLORS.text, letterSpacing: 0.5 },
  seeAll: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.primary },

  // HORIZONTAL LIST
  horizontalList: { paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingBottom: 4 },

  // SARAN KONEKSI CARD
  suggCard: {
    width: 140, backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  suggName: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, textAlign: 'center', marginTop: 8 },
  suggRole: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },
  juzPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full, marginTop: 4 },
  juzPillText: { fontFamily: FONTS.medium, fontSize: 10, color: '#fff' },
  suggCity: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginTop: 3 },
  followBtn: {
    marginTop: 10, width: '100%', height: 32, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  followBtnActive: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.primary },
  followBtnText: { fontFamily: FONTS.semiBold, fontSize: 12, color: '#fff' },
  followBtnTextActive: { color: COLORS.primary },

  // KOMUNITAS CARD
  commCard: {
    width: 160, backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
  },
  commCover: { height: 70, width: '100%' },
  verifiedBadge: {
    position: 'absolute', bottom: 6, left: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.full,
  },
  verifiedText: { fontFamily: FONTS.medium, fontSize: 10, color: '#fff' },
  commName: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, margin: SPACING.sm, marginBottom: 2 },
  commMembers: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginHorizontal: SPACING.sm },
  commTag: {
    alignSelf: 'flex-start', marginHorizontal: SPACING.sm, marginTop: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full,
  },
  commTagText: { fontFamily: FONTS.medium, fontSize: 10, color: COLORS.primary },
  joinBtn: {
    margin: SPACING.sm, marginTop: 8, height: 32, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  joinBtnActive: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.primary },
  joinBtnText: { fontFamily: FONTS.semiBold, fontSize: 12, color: '#fff' },
  joinBtnTextActive: { color: COLORS.primary },

  // HALAQAH
  halaqahList: { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  halaqahRow: {
    flexDirection: 'row', backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'flex-start', gap: SPACING.sm,
  },
  halaqahAvatar: {},
  halaqahInfo: { flex: 1 },
  halaqahTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  halaqahTitle: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text, flex: 1 },
  onlineBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full },
  onlineBadgeText: { fontFamily: FONTS.medium, fontSize: 10 },
  halaqahLeader: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 },
  halaqahMeta: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginBottom: 6 },
  halaqahAvatarRow: { flexDirection: 'row', alignItems: 'center' },
  miniAvatar: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#fff',
  },
  miniAvatarText: { fontFamily: FONTS.bold, fontSize: 8, color: COLORS.primary },
  moreText: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginLeft: 6 },
  gabungBtn: {
    backgroundColor: COLORS.gold, paddingHorizontal: SPACING.md,
    height: 34, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
  },
  gabungBtnDaftar: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.primary },
  gabungBtnFull: { backgroundColor: COLORS.border },
  gabungBtnText: { fontFamily: FONTS.semiBold, fontSize: 13, color: '#fff' },
  gabungBtnTextDaftar: { color: COLORS.primary },

  // NEARBY
  nearbyList: { paddingHorizontal: SPACING.md, gap: 1 },
  nearbyRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: SPACING.sm,
  },
  nearbyInfo: { flex: 1 },
  nearbyName: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text },
  nearbyRole: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  nearbyTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 5 },
  nearbyPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full },
  nearbyPillText: { fontFamily: FONTS.medium, fontSize: 10, color: '#fff' },
  interestTag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full, backgroundColor: COLORS.primaryLight },
  interestTagText: { fontFamily: FONTS.medium, fontSize: 10, color: COLORS.primary },
  nearbyRight: { alignItems: 'flex-end', gap: 4 },
  nearbyFollowBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.sm,
    height: 30, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center', minWidth: 70,
  },
  nearbyFollowBtnActive: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.primary },
  nearbyFollowText: { fontFamily: FONTS.semiBold, fontSize: 12, color: '#fff' },
  nearbyFollowTextActive: { color: COLORS.primary },
  nearbyDist: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary },
});
