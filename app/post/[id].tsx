import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Image, ActivityIndicator, SafeAreaView, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { apiGet, apiPost, apiDelete } from '@/src/utils/api';
import { COLORS, FONTS, SPACING, RADIUS, getJuzBadge, formatTime } from '@/src/constants/theme';

function Avatar({ uri, name, size = 40 }: any) {
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

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => { loadPost(); }, [id]);

  const loadPost = async () => {
    try {
      const [p, c] = await Promise.all([
        apiGet(`/api/posts/${id}`),
        apiGet(`/api/posts/${id}/comments`),
      ]);
      setPost(p);
      setComments(c);
    } catch {}
    setLoading(false);
  };

  const handleReact = async () => {
    if (!post) return;
    try {
      if (post.my_reaction) {
        await apiDelete(`/api/posts/${id}/react`);
        setPost({ ...post, my_reaction: null, reactions_count: Math.max(0, post.reactions_count - 1) });
      } else {
        await apiPost(`/api/posts/${id}/react`, { type: 'aamiin' });
        setPost({ ...post, my_reaction: 'aamiin', reactions_count: post.reactions_count + 1 });
      }
    } catch {}
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const c = await apiPost(`/api/posts/${id}/comments`, { content: commentText.trim() });
      setComments([...comments, { ...c, user }]);
      setCommentText('');
      setPost((p: any) => p ? { ...p, comments_count: p.comments_count + 1 } : p);
    } catch {}
    setSubmitting(false);
  };

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loading}><Text style={styles.errorText}>Post tidak ditemukan</Text></View>
      </SafeAreaView>
    );
  }

  const badge = getJuzBadge(post.user?.juz_count || 0);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Postingan</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Post */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <TouchableOpacity onPress={() => router.push(`/user/${post.user?.user_id}`)}>
                <Avatar uri={post.user?.avatar_url} name={post.user?.name} size={48} />
              </TouchableOpacity>
              <View style={styles.postUserInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.postName}>{post.user?.name}</Text>
                  {badge.label ? (
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <Text style={styles.badgeText}>{badge.label}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.postMeta}>{post.user?.city}{post.user?.city ? ' · ' : ''}{formatTime(post.created_at)}</Text>
              </View>
            </View>

            {post.type === 'ayat' && post.ayat_text && (
              <View style={styles.ayatBox}>
                <Text style={styles.arabicText}>{post.ayat_text}</Text>
                {post.ayat_reference && <Text style={styles.ayatRef}>— {post.ayat_reference}</Text>}
                {post.translation && <Text style={styles.ayatTranslation}>"{post.translation}"</Text>}
              </View>
            )}

            {post.content ? <Text style={styles.postContent}>{post.content}</Text> : null}

            {post.hashtags?.length > 0 && (
              <View style={styles.hashtagRow}>
                {post.hashtags.map((t: string) => <Text key={t} style={styles.hashtag}>#{t}</Text>)}
              </View>
            )}

            {/* Reactions */}
            <View style={styles.reactionRow}>
              <TouchableOpacity
                testID="post-react-btn"
                style={[styles.reactBtn, post.my_reaction && styles.reactBtnActive]}
                onPress={handleReact}
                activeOpacity={0.7}
              >
                <Text style={styles.reactIcon}>🤲</Text>
                <Text style={[styles.reactText, post.my_reaction && styles.reactTextActive]}>
                  Aamiin {post.reactions_count > 0 ? `(${post.reactions_count})` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Komentar ({comments.length})</Text>
            {comments.map((c) => (
              <View key={c.comment_id} style={styles.commentCard}>
                <Avatar uri={c.user?.avatar_url} name={c.user?.name} size={36} />
                <View style={styles.commentContent}>
                  <View style={styles.commentBubble}>
                    <Text style={styles.commentName}>{c.user?.name}</Text>
                    <Text style={styles.commentText}>{c.content}</Text>
                  </View>
                  <Text style={styles.commentTime}>{formatTime(c.created_at)}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.commentInput}>
          <Avatar uri={user?.avatar_url} name={user?.name} size={36} />
          <TextInput
            testID="comment-input"
            style={styles.input}
            placeholder="Tulis komentar..."
            placeholderTextColor={COLORS.textSecondary}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            testID="send-comment-btn"
            style={[styles.sendBtn, (!commentText.trim() || submitting) && styles.sendBtnDisabled]}
            onPress={handleComment}
            disabled={!commentText.trim() || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Ionicons name="send" size={20} color={commentText.trim() ? COLORS.primary : COLORS.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary },
  header: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, gap: SPACING.md,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text },
  postCard: { backgroundColor: COLORS.card, margin: SPACING.md, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  postHeader: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  postUserInfo: { flex: 1, justifyContent: 'center' },
  postName: { fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full },
  badgeText: { fontFamily: FONTS.medium, fontSize: 10, color: '#fff' },
  postMeta: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  ayatBox: { backgroundColor: COLORS.quoteBox, borderLeftWidth: 4, borderLeftColor: COLORS.primary, borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.sm },
  arabicText: { fontFamily: FONTS.arabic, fontSize: 24, color: COLORS.text, textAlign: 'right', lineHeight: 48, marginBottom: 8 },
  ayatRef: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.primary, marginBottom: 6 },
  ayatTranslation: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text, fontStyle: 'italic', lineHeight: 22 },
  postContent: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.text, lineHeight: 24, marginBottom: SPACING.sm },
  hashtagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: SPACING.sm },
  hashtag: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.primary },
  reactionRow: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm },
  reactBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  reactBtnActive: { backgroundColor: COLORS.primaryLight },
  reactIcon: { fontSize: 18 },
  reactText: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.textSecondary },
  reactTextActive: { color: COLORS.primary },
  commentsSection: { paddingHorizontal: SPACING.md },
  commentsTitle: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: SPACING.sm },
  commentCard: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  commentContent: { flex: 1 },
  commentBubble: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  commentName: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, marginBottom: 2 },
  commentText: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text, lineHeight: 20 },
  commentTime: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginTop: 4, marginLeft: SPACING.sm },
  commentInput: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    padding: SPACING.md, backgroundColor: COLORS.card,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  input: { flex: 1, fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text, maxHeight: 80 },
  sendBtn: { padding: 6 },
  sendBtnDisabled: { opacity: 0.5 },
});
