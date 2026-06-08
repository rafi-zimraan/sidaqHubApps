import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Image, RefreshControl, ActivityIndicator, SafeAreaView, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { apiGet, apiPost, apiDelete } from '../../utils/api';
import { COLORS, FONTS, SPACING, RADIUS, getJuzBadge, getRoleLabel } from '../../constants/theme';

function Avatar({ uri, name, size = 44 }: any) {
  const [err, setErr] = useState(false);
  const initials = (name || '?').split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
  if (uri && !err) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} onError={() => setErr(true)} />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: size * 0.35, fontFamily: FONTS.semiBold }}>{initials}</Text>
    </View>
  );
}

function UserCard({ user, isFollowing, onFollow, onPress }: any) {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);
  const badge = getJuzBadge(user.juz_count || 0);

  const handleFollow = async () => {
    setLoading(true);
    try {
      if (following) {
        await apiDelete(`/api/users/${user.user_id}/follow`);
        setFollowing(false);
      } else {
        await apiPost(`/api/users/${user.user_id}/follow`);
        setFollowing(true);
      }
      onFollow?.(user.user_id, !following);
    } catch {}
    setLoading(false);
  };

  return (
    <TouchableOpacity style={styles.userCard} onPress={() => onPress(user.user_id)} activeOpacity={0.8} testID="network-user-card">
      <Avatar uri={user.avatar_url} name={user.name} size={52} />
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
        <Text style={styles.userRole}>{getRoleLabel(user.role)} · {user.city || 'Indonesia'}</Text>
        {badge.label ? (
          <View style={[styles.badge, { backgroundColor: badge.bg, alignSelf: 'flex-start', marginTop: 3 }]}>
            <Text style={styles.badgeText}>{badge.label}</Text>
          </View>
        ) : null}
      </View>
      <TouchableOpacity
        testID={`follow-btn-${user.user_id}`}
        style={[styles.followBtn, following && styles.followBtnActive]}
        onPress={handleFollow}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color={following ? COLORS.primary : '#fff'} />
        ) : (
          <Text style={[styles.followBtnText, following && styles.followBtnTextActive]}>
            {following ? 'Mengikuti' : 'Ikuti'}
          </Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function NetworkScreen() {
  const [tab, setTab] = useState<'connections' | 'suggestions'>('suggestions');
  const [connections, setConnections] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = useCallback(() => { setRefreshing(true); loadData(); }, []);

  const data = tab === 'connections' ? connections : suggestions;

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jaringan</Text>
        <Text style={styles.headerSub}>{connections.length} koneksi</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          testID="tab-suggestions"
          style={[styles.tab, tab === 'suggestions' && styles.tabActive]}
          onPress={() => setTab('suggestions')}
        >
          <Text style={[styles.tabText, tab === 'suggestions' && styles.tabTextActive]}>
            Temukan ({suggestions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="tab-connections"
          style={[styles.tab, tab === 'connections' && styles.tabActive]}
          onPress={() => setTab('connections')}
        >
          <Text style={[styles.tabText, tab === 'connections' && styles.tabTextActive]}>
            Mengikuti ({connections.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.user_id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            isFollowing={tab === 'connections'}
            onFollow={() => loadData()}
            onPress={(id: string) => router.push(`/user/${id}`)}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{tab === 'connections' ? '👥' : '🔍'}</Text>
            <Text style={styles.emptyTitle}>
              {tab === 'connections' ? 'Belum ada koneksi' : 'Tidak ada saran'}
            </Text>
            <Text style={styles.emptyText}>
              {tab === 'connections' ? 'Mulai ikuti sesama Huffadz!' : 'Kamu sudah mengikuti semua'}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: SPACING.sm }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.primary },
  headerSub: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primary, fontFamily: FONTS.semiBold },
  userCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md, marginTop: SPACING.sm, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm,
  },
  userInfo: { flex: 1 },
  userName: { fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text },
  userRole: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full },
  badgeText: { fontFamily: FONTS.medium, fontSize: 10, color: '#fff' },
  followBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, height: 36,
    borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center', minWidth: 80,
  },
  followBtnActive: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  followBtnText: { fontFamily: FONTS.semiBold, fontSize: 13, color: '#fff' },
  followBtnTextActive: { color: COLORS.primary },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: 6 },
  emptyText: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary },
});
