import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiPost } from '@/src/utils/api';
import { useAuth } from '@/src/context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '@/src/constants/theme';

const POST_TYPES = [
  { id: 'text', label: 'Teks', icon: '✍️' },
  { id: 'ayat', label: 'Ayat', icon: '📖' },
];

const VISIBILITY_OPTIONS = [
  { id: 'public', label: 'Publik', icon: 'globe-outline' },
  { id: 'connections', label: 'Koneksi', icon: 'people-outline' },
];

export default function CreatePostScreen() {
  const [type, setType] = useState('text');
  const [content, setContent] = useState('');
  const [ayatText, setAyatText] = useState('');
  const [ayatRef, setAyatRef] = useState('');
  const [translation, setTranslation] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handlePost = async () => {
    if (type === 'text' && !content.trim()) {
      Alert.alert('Perhatian', 'Isi postingan tidak boleh kosong');
      return;
    }
    if (type === 'ayat' && !ayatText.trim()) {
      Alert.alert('Perhatian', 'Teks ayat tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      const tags = hashtags.split(/[,\s]+/).filter((t) => t.trim().replace('#', ''));
      await apiPost('/api/posts', {
        type,
        content: content.trim(),
        ayat_text: type === 'ayat' ? ayatText.trim() : undefined,
        ayat_reference: type === 'ayat' ? ayatRef.trim() : undefined,
        translation: type === 'ayat' ? translation.trim() : undefined,
        visibility,
        hashtags: tags.map((t) => t.replace('#', '')),
      });
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} testID="close-create-post">
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buat Postingan</Text>
          <TouchableOpacity
            testID="submit-post-btn"
            style={[styles.postBtn, loading && styles.btnDisabled]}
            onPress={handlePost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.postBtnText}>Posting</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Jenis Postingan</Text>
            <View style={styles.typeRow}>
              {POST_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  testID={`post-type-${t.id}`}
                  style={[styles.typeBtn, type === t.id && styles.typeBtnActive]}
                  onPress={() => setType(t.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.typeIcon}>{t.icon}</Text>
                  <Text style={[styles.typeText, type === t.id && styles.typeTextActive]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ayat Fields */}
          {type === 'ayat' && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Teks Arab</Text>
              <TextInput
                testID="ayat-arabic-input"
                style={[styles.textArea, styles.arabicInput]}
                placeholder="اكتب الآية هنا..."
                placeholderTextColor={COLORS.textSecondary}
                value={ayatText}
                onChangeText={setAyatText}
                multiline
                textAlign="right"
              />
              <Text style={[styles.sectionLabel, { marginTop: SPACING.sm }]}>Referensi Ayat</Text>
              <TextInput
                testID="ayat-reference-input"
                style={styles.singleInput}
                placeholder="Contoh: Al-Baqarah: 286"
                placeholderTextColor={COLORS.textSecondary}
                value={ayatRef}
                onChangeText={setAyatRef}
              />
              <Text style={[styles.sectionLabel, { marginTop: SPACING.sm }]}>Terjemahan</Text>
              <TextInput
                testID="ayat-translation-input"
                style={styles.textArea}
                placeholder="Terjemahan ayat..."
                placeholderTextColor={COLORS.textSecondary}
                value={translation}
                onChangeText={setTranslation}
                multiline
              />
            </View>
          )}

          {/* Caption / Content */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{type === 'ayat' ? 'Keterangan (opsional)' : 'Isi Postingan'}</Text>
            <TextInput
              testID="post-content-input"
              style={[styles.textArea, { minHeight: 120 }]}
              placeholder={type === 'ayat' ? 'Tambahkan keterangan atau hikmah...' : 'Tulis sesuatu yang bermanfaat...'}
              placeholderTextColor={COLORS.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
            />
          </View>

          {/* Hashtags */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Hashtag</Text>
            <TextInput
              testID="post-hashtags-input"
              style={styles.singleInput}
              placeholder="Tahfidz, Huffadz, Quran (pisahkan dengan koma)"
              placeholderTextColor={COLORS.textSecondary}
              value={hashtags}
              onChangeText={setHashtags}
            />
          </View>

          {/* Visibility */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Siapa yang bisa melihat?</Text>
            <View style={styles.visibilityRow}>
              {VISIBILITY_OPTIONS.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  testID={`visibility-${v.id}`}
                  style={[styles.visibilityBtn, visibility === v.id && styles.visibilityBtnActive]}
                  onPress={() => setVisibility(v.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={v.icon as any} size={18} color={visibility === v.id ? COLORS.primary : COLORS.textSecondary} />
                  <Text style={[styles.visibilityText, visibility === v.id && styles.visibilityTextActive]}>{v.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text },
  postBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, height: 36, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.6 },
  postBtnText: { fontFamily: FONTS.semiBold, fontSize: 14, color: '#fff' },
  scroll: { padding: SPACING.md },
  section: { marginBottom: SPACING.lg },
  sectionLabel: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: SPACING.sm },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: SPACING.sm, borderRadius: RADIUS.md,
    backgroundColor: COLORS.card, borderWidth: 2, borderColor: COLORS.border,
  },
  typeBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  typeIcon: { fontSize: 18 },
  typeText: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.textSecondary },
  typeTextActive: { color: COLORS.primary },
  arabicInput: { fontFamily: FONTS.arabic, fontSize: 20, lineHeight: 40, textAlign: 'right' },
  textArea: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.border, padding: SPACING.md,
    fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text,
    minHeight: 80, textAlignVertical: 'top',
  },
  singleInput: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.border, padding: SPACING.md, height: 48,
    fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text,
  },
  visibilityRow: { flexDirection: 'row', gap: SPACING.sm },
  visibilityBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: SPACING.sm, borderRadius: RADIUS.md,
    backgroundColor: COLORS.card, borderWidth: 2, borderColor: COLORS.border,
  },
  visibilityBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  visibilityText: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.textSecondary },
  visibilityTextActive: { color: COLORS.primary },
});
