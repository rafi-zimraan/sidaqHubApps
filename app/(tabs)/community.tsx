import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Image, RefreshControl, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiGet, apiPost, apiDelete } from '../../utils/api';
import { COLORS, FONTS, SPACING, RADIUS, formatSchedule } from '../../constants/theme';

function CommunityCard({ item, onJoin, onPress }: any) {
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState(item.is_member);

  const handleJoin = async () => {
    setLoading(true);
    try {
      if (isMember) {
        await apiDelete(`/api/communities/${item.community_id}/join`);
        setIsMember(false);
      } else {
        await apiPost(`/api/communities/${item.community_id}/join`);
        setIsMember(true);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <TouchableOpacity style={styles.communityCard} onPress={() => onPress(item.community_id)} activeOpacity={0.8} testID="community-card">
      <Image
        source={{ uri: item.avatar_url || 'https://images.pexels.com/photos/5973518/pexels-photo-5973518.jpeg?w=120' }}
        style={styles.communityAvatar}
      />
      <View style={styles.communityInfo}>
        <View style={styles.communityNameRow}>
          <Text style={styles.communityName} numberOfLines={1}>{item.name}</Text>
          {item.is_verified && <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />}
        </View>
        <Text style={styles.communityDesc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.communityMeta}>{item.members_count?.toLocaleString('id')} anggota</Text>
      </View>
      <TouchableOpacity
        testID={`join-community-${item.community_id}`}
        style={[styles.joinBtn, isMember && styles.joinBtnActive]}
        onPress={handleJoin}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color={isMember ? COLORS.primary : '#fff'} />
        ) : (
          <Text style={[styles.joinBtnText, isMember && styles.joinBtnTextActive]}>
            {isMember ? 'Bergabung' : 'Ikuti'}
          </Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function HalaqahCard({ item, onPress }: any) {
  const slotLeft = (item.max_slots || 0) - (item.registered_count || 0);
  const isFull = slotLeft <= 0;
  return (
    <TouchableOpacity style={styles.halaqahCard} onPress={() => onPress(item.halaqah_id)} activeOpacity={0.8} testID="halaqah-card">
      <View style={styles.halaqahHeader}>
        <View style={[styles.platformBadge, { backgroundColor: item.platform === 'Zoom' ? '#2D8CFF22' : '#00AC4722' }]}>
          <Text style={[styles.platformText, { color: item.platform === 'Zoom' ? '#2D8CFF' : '#00AC47' }]}>
            {item.platform}
          </Text>
        </View>
        {isFull ? (
          <View style={styles.fullBadge}><Text style={styles.fullText}>Penuh</Text></View>
        ) : (
          <Text style={styles.slotText}>{slotLeft} slot tersisa</Text>
        )}
      </View>
      <Text style={styles.halaqahTitle}>{item.title}</Text>
      <Text style={styles.halaqahDesc} numberOfLines={2}>{item.description}</Text>
      <View style={styles.halaqahMeta}>
        <Ionicons name="person-circle-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.halaqahMetaText}>{item.ustadz_name || item.ustadz?.name}</Text>
        <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} style={{ marginLeft: SPACING.sm }} />
        <Text style={styles.halaqahMetaText} numberOfLines={1}>{formatSchedule(item.schedule)}</Text>
      </View>
      <View style={styles.halaqahFooter}>
        <View style={styles.slotBar}>
          <View style={[styles.slotFill, { width: `${Math.min(100, (item.registered_count / item.max_slots) * 100)}%` as any }]} />
        </View>
        <Text style={styles.slotLabel}>{item.registered_count}/{item.max_slots}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function CommunityScreen() {
  const [tab, setTab] = useState<'halaqah' | 'community'>('halaqah');
  const [communities, setCommunities] = useState<any[]>([]);
  const [halaqahs, setHalaqahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [comm, hq] = await Promise.all([
        apiGet('/api/communities'),
        apiGet('/api/halaqahs'),
      ]);
      setCommunities(comm);
      setHalaqahs(hq);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = useCallback(() => { setRefreshing(true); loadData(); }, []);

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Komunitas & Halaqah</Text>
          <Text style={styles.headerSub}>Bergabung & belajar bersama</Text>
        </View>
        <TouchableOpacity
          testID="create-halaqah-btn"
          style={styles.createBtn}
          onPress={() => router.push('/halaqah/create')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['halaqah', 'community'].map((t) => (
          <TouchableOpacity
            key={t}
            testID={`tab-${t}`}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t as any)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'halaqah' ? `Halaqah (${halaqahs.length})` : `Komunitas (${communities.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'halaqah' ? (
        <FlatList
          data={halaqahs}
          keyExtractor={(item) => item.halaqah_id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
          renderItem={({ item }) => (
            <HalaqahCard item={item} onPress={(id: string) => router.push(`/halaqah/${id}`)} />
          )}
          contentContainerStyle={{ padding: SPACING.md }}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🕌</Text>
              <Text style={styles.emptyTitle}>Belum ada halaqah</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/halaqah/create')}>
                <Text style={styles.emptyBtnText}>Buat Halaqah</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={communities}
          keyExtractor={(item) => item.community_id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
          renderItem={({ item }) => (
            <CommunityCard item={item} onJoin={loadData} onPress={() => {}} />
          )}
          contentContainerStyle={{ paddingVertical: SPACING.sm }}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyTitle}>Belum ada komunitas</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 20, color: COLORS.primary },
  headerSub: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  createBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primary, fontFamily: FONTS.semiBold },
  halaqahCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  halaqahHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  platformBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  platformText: { fontFamily: FONTS.semiBold, fontSize: 12 },
  fullBadge: { backgroundColor: '#FFE4E4', paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  fullText: { fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.error },
  slotText: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.success },
  halaqahTitle: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: 4 },
  halaqahDesc: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.sm, lineHeight: 19 },
  halaqahMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.sm, flexWrap: 'wrap' },
  halaqahMetaText: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, flex: 1 },
  halaqahFooter: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  slotBar: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  slotFill: { height: 4, backgroundColor: COLORS.primary, borderRadius: 2 },
  slotLabel: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textSecondary },
  communityCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md, marginTop: SPACING.sm, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm,
  },
  communityAvatar: { width: 56, height: 56, borderRadius: RADIUS.md },
  communityInfo: { flex: 1 },
  communityNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  communityName: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text, flex: 1 },
  communityDesc: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 2, lineHeight: 17 },
  communityMeta: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.primary, marginTop: 4 },
  joinBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.sm, height: 36,
    borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center', minWidth: 70,
  },
  joinBtnActive: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  joinBtnText: { fontFamily: FONTS.semiBold, fontSize: 12, color: '#fff' },
  joinBtnTextActive: { color: COLORS.primary },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: SPACING.md },
  emptyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, height: 44, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  emptyBtnText: { fontFamily: FONTS.semiBold, fontSize: 14, color: '#fff' },
});
