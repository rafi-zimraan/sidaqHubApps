import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Image, RefreshControl, ActivityIndicator, SafeAreaView, ScrollView, Alert,
  Platform, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { apiGet } from '../../utils/api';
import { COLORS, FONTS, SPACING, RADIUS, getJuzBadge, getRoleLabel, formatTime } from '../../constants/theme';

// Tinggi status bar Android — agar tombol cover tidak tertutup status bar (jadi bisa ditekan).
const STATUS_BAR_TOP = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

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

export default function ProfileScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'posts' | 'achievements'>('posts');
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => { if (user) loadPosts(); }, [user]);

  const loadPosts = async () => {
    try {
      const data = await apiGet(`/api/users/${user!.user_id}/posts`);
      setPosts(data);
    } catch {}
    setLoading(false);
  };

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

  const badge = getJuzBadge(user?.juz_count || 0);

  const achievements = [
    { id: 1, icon: '📖', label: '5 Juz', unlocked: (user?.juz_count || 0) >= 5 },
    { id: 2, icon: '⭐', label: '10 Juz', unlocked: (user?.juz_count || 0) >= 10 },
    { id: 3, icon: '🥈', label: '15 Juz', unlocked: (user?.juz_count || 0) >= 15 },
    { id: 4, icon: '🥇', label: '20 Juz', unlocked: (user?.juz_count || 0) >= 20 },
    { id: 5, icon: '🏆', label: '25 Juz', unlocked: (user?.juz_count || 0) >= 25 },
    { id: 6, icon: '💎', label: '28 Juz', unlocked: (user?.juz_count || 0) >= 28 },
    { id: 7, icon: '👑', label: 'Hafiz 30 Juz', unlocked: (user?.juz_count || 0) >= 30 },
  ];

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={styles.cover}>
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/edit-profile')} testID="edit-profile-btn">
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} testID="logout-btn">
            <Ionicons name="log-out-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Avatar uri={user.avatar_url} name={user.name} size={80} />
            {badge.label ? (
              <View style={[styles.juzBadge, { backgroundColor: badge.bg }]}>
                <Text style={styles.juzBadgeText}>{badge.label}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          {user.city ? <Text style={styles.userCity}><Ionicons name="location-outline" size={14} /> {user.city}</Text> : null}
          <Text style={styles.userRole}>{getRoleLabel(user.role)}</Text>
          {user.bio ? <Text style={styles.userBio}>{user.bio}</Text> : null}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{user.posts_count}</Text>
              <Text style={styles.statLabel}>Postingan</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{user.followers_count}</Text>
              <Text style={styles.statLabel}>Pengikut</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{user.following_count}</Text>
              <Text style={styles.statLabel}>Mengikuti</Text>
            </View>
          </View>

          {/* Interests */}
          {user.interests?.length > 0 && (
            <View style={styles.interestRow}>
              {user.interests.map((i: string) => (
                <View key={i} style={styles.interestChip}>
                  <Text style={styles.interestText}>{i}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['posts', 'achievements'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'posts' ? 'Postingan' : 'Pencapaian'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'posts' ? (
          loading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
          ) : posts.length === 0 ? (
            <View style={styles.emptyPosts}>
              <Text style={styles.emptyIcon}>✍️</Text>
              <Text style={styles.emptyText}>Belum ada postingan</Text>
              <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/post/create')}>
                <Text style={styles.createBtnText}>Buat Postingan</Text>
              </TouchableOpacity>
            </View>
          ) : (
            posts.map((post) => (
              <TouchableOpacity
                key={post.post_id}
                style={styles.miniPost}
                onPress={() => router.push(`/post/${post.post_id}`)}
                activeOpacity={0.8}
              >
                {post.type === 'ayat' && post.ayat_text ? (
                  <View style={styles.miniAyatBox}>
                    <Text style={styles.miniArabic} numberOfLines={2}>{post.ayat_text}</Text>
                    <Text style={styles.miniRef}>{post.ayat_reference}</Text>
                  </View>
                ) : (
                  <Text style={styles.miniContent} numberOfLines={3}>{post.content}</Text>
                )}
                <View style={styles.miniFooter}>
                  <Text style={styles.miniMeta}>🤲 {post.reactions_count}  💬 {post.comments_count}  ·  {formatTime(post.created_at)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )
        ) : (
          <View style={styles.achievementGrid}>
            {achievements.map((a) => (
              <View key={a.id} style={[styles.achievementCard, !a.unlocked && styles.achievementLocked]}>
                <Text style={[styles.achievementIcon, !a.unlocked && { opacity: 0.3 }]}>{a.icon}</Text>
                <Text style={[styles.achievementLabel, !a.unlocked && styles.achievementLabelLocked]}>{a.label}</Text>
                {a.unlocked && <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  cover: {
    height: 120 + STATUS_BAR_TOP, backgroundColor: COLORS.primary,
    flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start',
    paddingTop: 16 + STATUS_BAR_TOP, paddingRight: 16, gap: 8,
  },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  logoutBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  profileSection: {
    backgroundColor: COLORS.card, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg,
    alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  avatarWrapper: { marginTop: -40, alignItems: 'center', marginBottom: SPACING.sm },
  juzBadge: { marginTop: 6, paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  juzBadgeText: { fontFamily: FONTS.semiBold, fontSize: 12, color: '#fff' },
  userName: { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.text, marginBottom: 4 },
  userCity: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  userRole: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.primary, marginBottom: 8 },
  userBio: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text, textAlign: 'center', lineHeight: 20, marginBottom: SPACING.sm },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.md, gap: SPACING.lg },
  stat: { alignItems: 'center', minWidth: 70 },
  statNum: { fontFamily: FONTS.bold, fontSize: 20, color: COLORS.text },
  statLabel: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
  interestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  interestChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, backgroundColor: COLORS.primaryLight },
  interestText: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.primary },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primary, fontFamily: FONTS.semiBold },
  emptyPosts: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary, marginBottom: SPACING.md },
  createBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, height: 44, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  createBtnText: { fontFamily: FONTS.semiBold, fontSize: 14, color: '#fff' },
  miniPost: {
    backgroundColor: COLORS.card, marginHorizontal: SPACING.md, marginTop: SPACING.sm,
    borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  miniAyatBox: { backgroundColor: COLORS.quoteBox, borderLeftWidth: 3, borderLeftColor: COLORS.primary, borderRadius: RADIUS.sm, padding: SPACING.sm },
  miniArabic: { fontFamily: FONTS.arabic, fontSize: 18, color: COLORS.text, textAlign: 'right', lineHeight: 36 },
  miniRef: { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.primary, marginTop: 4 },
  miniContent: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text, lineHeight: 20 },
  miniFooter: { marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border },
  miniMeta: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: SPACING.md, gap: SPACING.sm },
  achievementCard: {
    width: '30%', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
    gap: 4,
  },
  achievementLocked: { borderColor: COLORS.border, opacity: 0.7 },
  achievementIcon: { fontSize: 32 },
  achievementLabel: { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.text, textAlign: 'center' },
  achievementLabelLocked: { color: COLORS.textSecondary },
});
