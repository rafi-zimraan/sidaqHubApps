import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { apiGet, apiPost, apiDelete } from '../../utils/api';
import { COLORS, FONTS, SPACING, RADIUS, getJuzBadge, getRoleLabel, formatTime } from '../../constants/theme';

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

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const { user: me } = useAuth();
  const router = useRouter();

  useEffect(() => { loadProfile(); }, [id]);

  const loadProfile = async () => {
    try {
      const [p, userPosts] = await Promise.all([
        apiGet(`/api/users/${id}`),
        apiGet(`/api/users/${id}/posts`),
      ]);
      setProfile(p);
      setPosts(userPosts);
    } catch {}
    setLoading(false);
  };

  const handleFollow = async () => {
    if (!profile) return;
    setFollowLoading(true);
    try {
      if (profile.is_following) {
        await apiDelete(`/api/users/${id}/follow`);
        setProfile({ ...profile, is_following: false, followers_count: profile.followers_count - 1 });
      } else {
        await apiPost(`/api/users/${id}/follow`);
        setProfile({ ...profile, is_following: true, followers_count: profile.followers_count + 1 });
      }
    } catch {}
    setFollowLoading(false);
  };

  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (!profile) return <SafeAreaView style={styles.container}><Text style={styles.notFound}>User tidak ditemukan</Text></SafeAreaView>;

  const badge = getJuzBadge(profile.juz_count || 0);
  const isMe = me?.user_id === profile.user_id;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={styles.cover}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Avatar uri={profile.avatar_url} name={profile.name} size={80} />
          </View>
          {badge.label ? (
            <View style={[styles.juzBadge, { backgroundColor: badge.bg }]}>
              <Text style={styles.juzBadgeText}>{badge.label}</Text>
            </View>
          ) : null}

          <Text style={styles.userName}>{profile.name}</Text>
          {profile.city ? <Text style={styles.userCity}>📍 {profile.city}</Text> : null}
          <Text style={styles.userRole}>{getRoleLabel(profile.role)}</Text>
          {profile.bio ? <Text style={styles.userBio}>{profile.bio}</Text> : null}

          <View style={styles.statsRow}>
            <View style={styles.stat}><Text style={styles.statNum}>{profile.posts_count}</Text><Text style={styles.statLabel}>Postingan</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><Text style={styles.statNum}>{profile.followers_count}</Text><Text style={styles.statLabel}>Pengikut</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><Text style={styles.statNum}>{profile.following_count}</Text><Text style={styles.statLabel}>Mengikuti</Text></View>
          </View>

          {!isMe && (
            <TouchableOpacity
              testID="user-follow-btn"
              style={[styles.followBtn, profile.is_following && styles.followBtnActive]}
              onPress={handleFollow}
              disabled={followLoading}
              activeOpacity={0.8}
            >
              {followLoading ? (
                <ActivityIndicator size="small" color={profile.is_following ? COLORS.primary : '#fff'} />
              ) : (
                <Text style={[styles.followBtnText, profile.is_following && styles.followBtnTextActive]}>
                  {profile.is_following ? '✓ Mengikuti' : 'Ikuti'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Posts */}
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Postingan</Text>
          {posts.length === 0 ? (
            <View style={styles.emptyPosts}>
              <Text style={styles.emptyText}>Belum ada postingan</Text>
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
                  <View style={styles.ayatBox}>
                    <Text style={styles.arabicText} numberOfLines={2}>{post.ayat_text}</Text>
                    <Text style={styles.ayatRef}>{post.ayat_reference}</Text>
                  </View>
                ) : (
                  <Text style={styles.postContent} numberOfLines={3}>{post.content}</Text>
                )}
                <Text style={styles.postMeta}>🤲 {post.reactions_count}  💬 {post.comments_count}  ·  {formatTime(post.created_at)}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFound: { padding: SPACING.lg, textAlign: 'center' },
  cover: { height: 120, backgroundColor: COLORS.primary, paddingTop: 16, paddingHorizontal: 16 },
  backBtn: { padding: 4, alignSelf: 'flex-start' },
  profileSection: { backgroundColor: COLORS.card, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatarWrapper: { marginTop: -40, marginBottom: SPACING.sm },
  juzBadge: { marginBottom: SPACING.sm, paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
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
  followBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, height: 44, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center', minWidth: 140 },
  followBtnActive: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  followBtnText: { fontFamily: FONTS.semiBold, fontSize: 15, color: '#fff' },
  followBtnTextActive: { color: COLORS.primary },
  postsSection: { padding: SPACING.md },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: SPACING.sm },
  emptyPosts: { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyText: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary },
  miniPost: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  ayatBox: { backgroundColor: COLORS.quoteBox, borderLeftWidth: 3, borderLeftColor: COLORS.primary, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: SPACING.sm },
  arabicText: { fontFamily: FONTS.arabic, fontSize: 18, color: COLORS.text, textAlign: 'right', lineHeight: 36 },
  ayatRef: { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.primary, marginTop: 4 },
  postContent: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text, lineHeight: 20, marginBottom: SPACING.sm },
  postMeta: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary },
});
