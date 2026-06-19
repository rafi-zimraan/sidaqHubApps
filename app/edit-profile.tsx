import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, SafeAreaView,
  KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/src/context/AuthContext';
import { apiPut } from '@/src/utils/api';
import { COLORS, FONTS, SPACING, RADIUS } from '@/src/constants/theme';

const ROLES = [
  { id: 'santri', label: 'Santri Huffadz', icon: '📚' },
  { id: 'ustadz', label: 'Ustadz/Musyrif', icon: '🎓' },
  { id: 'huffadz', label: 'Huffadz Dewasa', icon: '🌟' },
];

const INTERESTS = ['Tahfidz', 'Tajwid', 'Tafsir', 'Tilawah', 'Qiraah', 'Fiqh', 'Hadits', 'Bahasa Arab'];

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name || '');
  const [city, setCity] = useState(user?.city || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [juzCount, setJuzCount] = useState(user?.juz_count?.toString() || '0');
  const [role, setRole] = useState(user?.role || 'santri');
  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [avatarUri, setAvatarUri] = useState(user?.avatar_url || '');
  const [loading, setLoading] = useState(false);

  const toggleInterest = (item: string) => {
    setInterests((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Dibutuhkan', 'Izinkan akses galeri untuk mengganti foto profil');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.base64) {
        setAvatarUri(`data:image/jpeg;base64,${asset.base64}`);
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Perhatian', 'Nama tidak boleh kosong');
      return;
    }
    setLoading(true);
    try {
      const updated = await apiPut('/api/users/me', {
        name: name.trim(),
        city: city.trim(),
        bio: bio.trim(),
        juz_count: parseInt(juzCount) || 0,
        role,
        interests,
        avatar_url: avatarUri,
      });
      updateUser(updated);
      Alert.alert('Berhasil!', 'Profil berhasil diperbarui', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profil</Text>
          <TouchableOpacity
            testID="save-profile-btn"
            style={[styles.saveBtn, loading && styles.btnDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveBtnText}>Simpan</Text>}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity testID="change-avatar-btn" onPress={pickImage} activeOpacity={0.8}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitials}>
                    {name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?'}
                  </Text>
                </View>
              )}
              <View style={styles.editAvatarBadge}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Ketuk untuk ubah foto</Text>
          </View>

          {[
            { label: 'Nama Lengkap', value: name, setter: setName, testId: 'edit-name-input' },
            { label: 'Kota', value: city, setter: setCity, testId: 'edit-city-input', placeholder: 'Jakarta' },
          ].map((f) => (
            <View key={f.testId} style={styles.field}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                testID={f.testId}
                style={styles.input}
                value={f.value}
                onChangeText={f.setter}
                placeholder={f.placeholder || f.label}
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
          ))}

          <View style={styles.field}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              testID="edit-bio-input"
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Ceritakan tentang perjalanan hafalanmu..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Jumlah Juz Hafalan</Text>
            <TextInput
              testID="edit-juz-input"
              style={styles.input}
              value={juzCount}
              onChangeText={setJuzCount}
              placeholder="0"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Peran</Text>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.id}
                testID={`edit-role-${r.id}`}
                style={[styles.roleBtn, role === r.id && styles.roleBtnActive]}
                onPress={() => setRole(r.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.roleIcon}>{r.icon}</Text>
                <Text style={[styles.roleLabel, role === r.id && styles.roleLabelActive]}>{r.label}</Text>
                {role === r.id && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Minat</Text>
            <View style={styles.interestGrid}>
              {INTERESTS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.interestChip, interests.includes(item) && styles.interestChipActive]}
                  onPress={() => toggleInterest(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.interestText, interests.includes(item) && styles.interestTextActive]}>{item}</Text>
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
  saveBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, height: 36, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.6 },
  saveBtnText: { fontFamily: FONTS.semiBold, fontSize: 14, color: '#fff' },
  scroll: { padding: SPACING.md, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: SPACING.xl },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: COLORS.primary },
  avatarPlaceholder: { backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: '#fff', fontSize: 32, fontFamily: FONTS.bold },
  editAvatarBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.card,
  },
  avatarHint: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.primary, marginTop: 8 },
  field: { marginBottom: SPACING.md },
  label: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.border, paddingHorizontal: SPACING.md, height: 48,
    fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text,
  },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: SPACING.sm },
  roleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    borderWidth: 2, borderColor: COLORS.border, marginBottom: SPACING.sm,
  },
  roleBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  roleIcon: { fontSize: 22 },
  roleLabel: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text, flex: 1 },
  roleLabelActive: { color: COLORS.primary },
  interestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  interestChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.card },
  interestChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  interestText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.text },
  interestTextActive: { color: COLORS.primary },
});
