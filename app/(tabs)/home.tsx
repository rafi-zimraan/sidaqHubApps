import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ScrollView, RefreshControl, ActivityIndicator, Animated, Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { apiGet, apiPost, apiDelete } from '@/src/utils/api';
import { COLORS, FONTS, SPACING, formatTime } from '@/src/constants/theme';

// ---------- HELPERS ----------
function getInitials(name?: string): string {
  return (name || '?').split(' ').slice(0, 2).map((s) => s[0]).join('').toUpperCase();
}

function avatarColors(role?: string): { bg: string; fg: string } {
  if (role === 'ustadz') return { bg: '#FCE38A', fg: COLORS.gold };
  if (role === 'huffadz') return { bg: '#FCE38A', fg: COLORS.gold };
  if (role === 'komunitas') return { bg: COLORS.primary, fg: '#fff' };
  return { bg: COLORS.primaryLight, fg: COLORS.primary };
}

function juzBadgeLabel(juzCount: number): string | null {
  if (!juzCount || juzCount <= 0) return null;
  return `${juzCount} Juz`;
}

// ---------- AVATAR ----------
function InitialAvatar({ name, role, size = 40 }: { name?: string; role?: string; size?: number }) {
  const { bg, fg } = avatarColors(role);
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: bg, alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ color: fg, fontSize: size * 0.32, fontFamily: FONTS.bold }}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

// ---------- STORY CIRCLE ----------
function StoryItem({ name, role, label, isMine, hasUnviewed }: any) {
  if (isMine) {
    return (
      <View style={styles.storyItem}>
        <View style={styles.storyKamuCircle}>
          <Ionicons name="add" size={20} color="#fff" />
        </View>
        <Text style={styles.storyName} numberOfLines={1}>Kamu</Text>
      </View>
    );
  }
  return (
    <View style={styles.storyItem}>
      <View style={[styles.storyRing, hasUnviewed ? styles.storyRingActive : styles.storyRingViewed]}>
        <InitialAvatar name={name} role={role} size={48} />
      </View>
      <Text style={styles.storyName} numberOfLines={1}>{label}</Text>
    </View>
  );
}

// ---------- AYAT BOX ----------
function AyatBox({ ayatText, reference, translation }: any) {
  return (
    <View style={styles.ayatBox}>
      <Text style={styles.ayatLabel}>Ayat yang dibagikan</Text>
      <Text style={styles.arabicText}>{ayatText}</Text>
      {translation && <Text style={styles.ayatTranslation}>&ldquo;{translation}&rdquo;</Text>}
      {reference && <Text style={styles.ayatRef}>{reference}</Text>}
    </View>
  );
}

// ---------- TILAWAH AUDIO CARD ----------
function TilawahCard({ title, duration = '3:42' }: any) {
  return (
    <View style={styles.tilawahCard}>
      <View style={styles.tilawahPlayBtn}>
        <Ionicons name="play" size={16} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.tilawahTitle} numberOfLines={1}>{title}</Text>
        <View style={styles.tilawahTimeRow}>
          <Text style={styles.tilawahTime}>0:00</Text>
          <Text style={styles.tilawahTime}>{duration}</Text>
        </View>
      </View>
    </View>
  );
}

// ---------- HALAQAH EMBED CARD ----------
function HalaqahEmbed({ halaqah }: any) {
  if (!halaqah) return null;
  const reg = halaqah.registered_count || 0;
  const max = halaqah.max_slots || 0;
  return (
    <View style={styles.halaqahEmbed}>
      <View style={styles.halaqahThumb} />
      <View style={{ flex: 1 }}>
        <Text style={styles.halaqahEmbedTitle} numberOfLines={1}>{halaqah.title}</Text>
        <Text style={styles.halaqahEmbedMeta} numberOfLines={1}>Malam ini, 20.00 WIB</Text>
      </View>
      <Text style={styles.halaqahEmbedSlot}>{reg}/{max}</Text>
      <TouchableOpacity style={styles.halaqahEmbedBtn} testID={`join-${halaqah.halaqah_id}`} activeOpacity={0.85}>
        <Text style={styles.halaqahEmbedBtnText}>Gabung</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------- ACHIEVEMENT BAR ----------
function AchievementBar({ juz }: { juz: number }) {
  return (
    <View style={styles.achievementBar}>
      <Text style={styles.achievementText}>Pencapaian Hafalan — Juz {juz}</Text>
    </View>
  );
}

// ---------- REACTION CLUSTER ----------
function ReactionCluster({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={styles.reactionCluster}>
      <View style={[styles.reactionDot, { backgroundColor: '#FCE38A', zIndex: 3 }]}>
        <Text style={styles.reactionEmoji}>😊</Text>
      </View>
      <View style={[styles.reactionDot, { backgroundColor: '#FFB3B3', marginLeft: -7, zIndex: 2 }]}>
        <Text style={styles.reactionEmoji}>❤️</Text>
      </View>
      <View style={[styles.reactionDot, { backgroundColor: COLORS.primary, marginLeft: -7, zIndex: 1 }]}>
        <Text style={[styles.reactionEmoji, { color: '#fff' }]}>🤲</Text>
      </View>
      <Text style={styles.reactionCount}>{count.toLocaleString('id')} reaksi</Text>
    </View>
  );
}

// ---------- COMMENT PREVIEW ----------
function CommentPreview({ comment }: any) {
  if (!comment?.user) return null;
  return (
    <View style={styles.topComment}>
      <InitialAvatar name={comment.user.name} role={comment.user.role} size={32} />
      <View style={{ flex: 1 }}>
        <Text style={styles.commentName}>{comment.user.name}</Text>
        <Text style={styles.commentContent}>{comment.content}</Text>
        <Text style={styles.commentMeta}>
          {formatTime(comment.created_at)} · <Text style={styles.commentReply}>Balas</Text>
        </Text>
      </View>
    </View>
  );
}

// ---------- POST CARD ----------
function PostCard({ post, onReact, onPress }: any) {
  const isReacted = !!post.my_reaction;
  const juzLabel = juzBadgeLabel(post.user?.juz_count || 0);
  const community = post.community;
  const halaqah = post.halaqah;
  const achievement = post.achievement_juz;
  const topComments: any[] = post.top_comments || (post.top_comment ? [post.top_comment] : []);
  const isCommunityPost = !!community;

  // Display name & avatar (community overrides user)
  const displayName = isCommunityPost ? community.name : post.user?.name;
  const displayRole = isCommunityPost ? 'komunitas' : post.user?.role;

  return (
    <View style={styles.postCard} testID="home-feed-card">
      {/* Header */}
      <View style={styles.postHeader}>
        <InitialAvatar
          name={isCommunityPost ? community.name : post.user?.name}
          role={displayRole}
          size={40}
        />
        <View style={styles.postUserInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.postName} numberOfLines={1}>{displayName}</Text>
            {isCommunityPost ? (
              <View style={styles.komunitasBadge}>
                <Text style={styles.komunitasBadgeText}>Komunitas</Text>
              </View>
            ) : juzLabel ? (
              <View style={styles.juzBadge}>
                <Text style={styles.juzBadgeText}>{juzLabel}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.postMeta}>
            {isCommunityPost
              ? `${community.members_count?.toLocaleString('id') || '0'} anggota · ${formatTime(post.created_at)}`
              : `${post.user?.city || 'Indonesia'} · ${formatTime(post.created_at)}`}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Content with inline hashtags highlighted */}
      {post.content ? (
        <Text style={styles.postContent}>
          {post.content.split(/(#[A-Za-z0-9_]+)/g).map((part: string, i: number) =>
            part.startsWith('#') ? (
              <Text key={i} style={styles.hashtagInline}>{part}</Text>
            ) : (
              <Text key={i}>{part}</Text>
            )
          )}
        </Text>
      ) : null}

      {/* Hashtags array (only show tags NOT already in content) */}
      {(() => {
        const extra = (post.hashtags || []).filter((t: string) => !post.content?.includes(`#${t}`));
        if (extra.length === 0) return null;
        return (
          <View style={styles.hashtagRow}>
            {extra.map((tag: string) => (
              <Text key={tag} style={styles.hashtag}>#{tag}</Text>
            ))}
          </View>
        );
      })()}

      {/* Foto (Pinterest/Unsplash style) */}
      {post.image_url ? (
        <Image
          source={{ uri: post.image_url }}
          style={[styles.postImage, { aspectRatio: post.image_ratio || 4 / 3 }]}
          resizeMode="cover"
          testID={`post-image-${post.post_id}`}
        />
      ) : null}

      {/* Ayat Box */}
      {post.type === 'ayat' && post.ayat_text && (
        <AyatBox
          ayatText={post.ayat_text}
          reference={post.ayat_reference}
          translation={post.translation}
        />
      )}

      {/* Halaqah Embed */}
      {halaqah && <HalaqahEmbed halaqah={halaqah} />}

      {/* Achievement Bar */}
      {achievement && <AchievementBar juz={achievement} />}

      {/* Tilawah Audio */}
      {post.type === 'tilawah' && (
        <TilawahCard
          title={post.ayat_reference || 'Tilawah'}
          duration={post.audio_duration || '3:42'}
        />
      )}

      {/* Reaction summary */}
      <View style={styles.reactionSummary}>
        <ReactionCluster count={post.reactions_count || 0} />
        <Text style={styles.commentCount}>{post.comments_count || 0} komentar</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          testID={`react-btn-${post.post_id}`}
          style={[styles.actionBtn, isReacted && styles.actionBtnActive]}
          onPress={() => onReact(post)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>🤲</Text>
          <Text style={[styles.actionText, styles.actionTextAamiin, isReacted && { fontFamily: FONTS.bold }]}>
            Aamiin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onPress(post.post_id)} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={15} color={COLORS.textSecondary} />
          <Text style={styles.actionText}>Komentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="paper-plane-outline" size={15} color={COLORS.textSecondary} />
          <Text style={styles.actionText}>Bagikan</Text>
        </TouchableOpacity>
      </View>

      {/* Comment Previews (max 2) */}
      {topComments.slice(0, 2).map((c, i) => (
        <CommentPreview key={c.comment_id || i} comment={c} />
      ))}
    </View>
  );
}

// ---------- FILTER TABS (3 only, no Semua) ----------
const FILTERS = [
  { id: 'image', label: 'Foto' },
  { id: 'ayat', label: 'Ayat' },
  { id: 'tilawah', label: 'Tilawah' },
];

function FilterTabs({ value, onChange }: any) {
  return (
    <View style={styles.filterTabs}>
      {FILTERS.map((f) => (
        <TouchableOpacity
          key={f.id}
          testID={`filter-${f.id}`}
          style={[styles.filterChip, value === f.id && styles.filterChipActive]}
          onPress={() => onChange(value === f.id ? null : f.id)}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterChipText, value === f.id && styles.filterChipTextActive]}>
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ---------- COMPOSER ----------
function Composer({ user, onPress }: any) {
  return (
    <View style={styles.composer}>
      <InitialAvatar name={user?.name} role={user?.role} size={40} />
      <TouchableOpacity
        style={styles.composerInput}
        onPress={onPress}
        activeOpacity={0.7}
        testID="composer-input"
      >
        <Text style={styles.composerPlaceholder} numberOfLines={1}>
          Apa yang ingin kamu bagikan hari ini?
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.composerBtn}
        onPress={onPress}
        activeOpacity={0.85}
        testID="composer-post-btn"
      >
        <Text style={styles.composerBtnText}>Posting</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------- MAIN ----------
export default function HomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const { user } = useAuth();
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
      const [feedData, storiesData] = await Promise.all([
        apiGet('/api/posts/feed'),
        apiGet('/api/stories'),
      ]);
      setPosts(feedData || []);
      setStories(storiesData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => { setRefreshing(true); loadData(); }, []);

  const handleReact = async (post: any) => {
    try {
      if (post.my_reaction) {
        await apiDelete(`/api/posts/${post.post_id}/react`);
        setPosts((prev) => prev.map((p) => p.post_id === post.post_id
          ? { ...p, my_reaction: null, reactions_count: Math.max(0, p.reactions_count - 1) } : p));
      } else {
        await apiPost(`/api/posts/${post.post_id}/react`, { type: 'aamiin' });
        setPosts((prev) => prev.map((p) => p.post_id === post.post_id
          ? { ...p, my_reaction: 'aamiin', reactions_count: p.reactions_count + 1 } : p));
      }
    } catch {}
  };

  const filteredPosts = useMemo(() => {
    if (!filter) return posts;
    return posts.filter((p) => p.type === filter);
  }, [posts, filter]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <View style={styles.brandRow}>
          <View style={styles.brandLogo}>
            <Ionicons name="add" size={14} color={COLORS.gold} />
          </View>
          <Text style={styles.brandText}>
            Sidaq<Text style={{ color: COLORS.gold }}>Hub</Text>
          </Text>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.topIconBtn} testID="home-search-btn" activeOpacity={0.7}>
            <Ionicons name="search-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topIconBtn}
            onPress={() => router.push('/(tabs)/notifications')}
            testID="home-notifications-btn"
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={18} color="#fff" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topIconBtn} testID="home-chat-btn" activeOpacity={0.7}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.post_id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={
          <>
            {/* Stories */}
            <View style={styles.storiesSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesList}
              >
                <StoryItem isMine />
                {stories.map((s, i) => (
                  <StoryItem
                    key={i}
                    name={s.user?.name}
                    role={s.user?.role}
                    label={s.user?.name?.split(' ').slice(0, 2).join(' ') || 'User'}
                    hasUnviewed={s.has_unviewed}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Composer */}
            <Composer user={user} onPress={() => router.push('/post/create')} />

            {/* Filter Tabs */}
            <FilterTabs value={filter} onChange={setFilter} />
          </>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onReact={handleReact}
            onPress={(id: string) => router.push(`/post/${id}`)}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {filter === 'image' ? '📷' : filter === 'tilawah' ? '🎵' : filter === 'ayat' ? '📖' : '📭'}
            </Text>
            <Text style={styles.emptyTitle}>
              {filter ? `Belum ada postingan ${FILTERS.find(f => f.id === filter)?.label}` : 'Belum ada postingan'}
            </Text>
            <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/post/create')}>
              <Text style={styles.createBtnText}>Buat Postingan</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6F7F9' },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingBottom: 12,
    backgroundColor: COLORS.primary,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandLogo: {
    width: 26, height: 26, borderRadius: 8,
    borderWidth: 1.2, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  brandText: { fontFamily: FONTS.bold, fontSize: 18, color: '#fff', letterSpacing: -0.3 },
  topActions: { flexDirection: 'row', gap: 6 },
  topIconBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute', top: 8, right: 9,
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: COLORS.gold,
    borderWidth: 1, borderColor: COLORS.primary,
  },

  // Stories
  storiesSection: {
    backgroundColor: '#fff',
    marginHorizontal: 12, marginTop: 12, borderRadius: 20,
    shadowColor: '#1A2E35', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
  },
  storiesList: { paddingHorizontal: SPACING.md, paddingVertical: 14, gap: 12 },
  storyItem: { alignItems: 'center', width: 64 },
  storyKamuCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  storyRing: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 2,
  },
  storyRingActive: { borderColor: COLORS.gold },
  storyRingViewed: { borderColor: '#DDD' },
  storyName: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.text, textAlign: 'center' },

  // Composer
  composer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 12, marginTop: 12,
    paddingHorizontal: SPACING.md, paddingVertical: 12,
    gap: 10, borderRadius: 20,
    shadowColor: '#1A2E35', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
  },
  composerInput: {
    flex: 1, height: 40, justifyContent: 'center',
    paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: '#F4F5F7',
  },
  composerPlaceholder: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary },
  composerBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 18, height: 40,
    borderRadius: 20, alignItems: 'center', justifyContent: 'center',
  },
  composerBtnText: { fontFamily: FONTS.semiBold, fontSize: 13, color: '#fff' },

  // Filter (chips ala Dribbble)
  filterTabs: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: 12, paddingTop: 12, paddingBottom: 2,
  },
  filterChip: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#fff',
    shadowColor: '#1A2E35', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterChipText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary },
  filterChipTextActive: { fontFamily: FONTS.semiBold, color: '#fff' },

  // Post Card (floating, rounded)
  postCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12, marginTop: 12,
    borderRadius: 20,
    paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: 8,
    shadowColor: '#1A2E35', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07, shadowRadius: 16, elevation: 3,
  },
  postImage: {
    width: '100%', borderRadius: 16,
    backgroundColor: '#EDEFF2', marginBottom: SPACING.sm,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: 10 },
  postUserInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  postName: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.text, flexShrink: 1 },
  juzBadge: { backgroundColor: '#FCE38A', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  juzBadgeText: { fontFamily: FONTS.bold, fontSize: 10, color: COLORS.gold },
  komunitasBadge: { backgroundColor: COLORS.quoteBox, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  komunitasBadgeText: { fontFamily: FONTS.bold, fontSize: 10, color: COLORS.primary },
  postMeta: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  moreBtn: { padding: 6 },
  postContent: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text, lineHeight: 21, marginBottom: SPACING.sm },
  hashtagInline: { color: COLORS.primary, fontFamily: FONTS.medium },
  hashtagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: SPACING.sm },
  hashtag: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.primary },

  // Ayat Box
  ayatBox: {
    backgroundColor: COLORS.primary,
    borderRadius: 14, padding: SPACING.md, marginBottom: SPACING.sm,
  },
  ayatLabel: { fontFamily: FONTS.semiBold, fontSize: 11, color: COLORS.gold, marginBottom: 8, letterSpacing: 0.3 },
  arabicText: {
    fontFamily: FONTS.arabic, fontSize: 22, color: COLORS.gold,
    textAlign: 'right', lineHeight: 40, marginBottom: 10,
  },
  ayatTranslation: {
    fontFamily: FONTS.regular, fontSize: 13, color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic', lineHeight: 19, marginBottom: 6,
  },
  ayatRef: { fontFamily: FONTS.semiBold, fontSize: 12, color: '#fff' },

  // Tilawah
  tilawahCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.primary, borderRadius: 14,
    padding: SPACING.md, marginBottom: SPACING.sm,
  },
  tilawahPlayBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  tilawahTitle: { fontFamily: FONTS.bold, fontSize: 14, color: '#fff', marginBottom: 6 },
  tilawahTimeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  tilawahTime: { fontFamily: FONTS.regular, fontSize: 11, color: 'rgba(255,255,255,0.8)' },

  // Halaqah Embed
  halaqahEmbed: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F0F8FA', borderRadius: 12,
    padding: 10, marginBottom: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.quoteBox,
  },
  halaqahThumb: { width: 42, height: 42, borderRadius: 8, backgroundColor: COLORS.quoteBox },
  halaqahEmbedTitle: { fontFamily: FONTS.bold, fontSize: 13, color: COLORS.text },
  halaqahEmbedMeta: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  halaqahEmbedSlot: { fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.primary },
  halaqahEmbedBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 14, height: 32,
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  halaqahEmbedBtnText: { fontFamily: FONTS.bold, fontSize: 12, color: '#fff' },

  // Achievement
  achievementBar: {
    backgroundColor: COLORS.quoteBox, paddingVertical: 10,
    alignItems: 'center', borderRadius: 10, marginBottom: SPACING.sm,
  },
  achievementText: { fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.primary },

  // Reactions
  reactionSummary: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8,
  },
  reactionCluster: { flexDirection: 'row', alignItems: 'center' },
  reactionDot: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  reactionEmoji: { fontSize: 11 },
  reactionCount: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textSecondary, marginLeft: 6 },
  commentCount: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textSecondary },

  // Actions
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8, paddingBottom: 2,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', gap: 6,
    paddingVertical: 8, alignItems: 'center', justifyContent: 'center',
    borderRadius: 14,
  },
  actionBtnActive: { backgroundColor: COLORS.primaryLight },
  actionEmoji: { fontSize: 14 },
  actionText: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textSecondary },
  actionTextAamiin: { color: COLORS.primary },

  // Top comment
  topComment: {
    flexDirection: 'row', gap: 10, padding: SPACING.sm,
    backgroundColor: '#F8F9FA', borderRadius: 12,
    marginTop: 6,
  },
  commentName: { fontFamily: FONTS.bold, fontSize: 13, color: COLORS.text },
  commentContent: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.text, lineHeight: 18, marginTop: 1 },
  commentMeta: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
  commentReply: { fontFamily: FONTS.semiBold, color: COLORS.primary },

  // Empty
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: SPACING.xl },
  emptyIcon: { fontSize: 52, marginBottom: SPACING.md },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text, textAlign: 'center', marginBottom: SPACING.lg },
  createBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, height: 46,
    borderRadius: 23, alignItems: 'center', justifyContent: 'center',
  },
  createBtnText: { fontFamily: FONTS.bold, fontSize: 14, color: '#fff' },
});
