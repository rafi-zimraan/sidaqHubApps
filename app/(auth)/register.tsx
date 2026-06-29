import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '@/src/context/AuthContext';
import { REGISTER_MUTATION } from '@/src/graphql/mutations';
import { COLORS, FONTS, SPACING, RADIUS } from '@/src/constants/theme';

const ROLES = [
  { id: 'santri', label: 'Santri Huffadz', desc: 'Aktif menghafal Al-Quran' },
  { id: 'ustadz', label: 'Ustadz/Musyrif', desc: 'Pengajar & pembimbing tahfidz' },
  { id: 'huffadz', label: 'Huffadz Dewasa', desc: 'Penghafal Al-Quran dewasa' },
];

const GENDERS = [
  { id: 'L', label: 'Laki-laki' },
  { id: 'P', label: 'Perempuan' },
];

const JUZ_OPTIONS = [0, 1, 3, 5, 7, 10, 15, 20, 25, 30];

const INTERESTS = ['Tahfidz', 'Tajwid', 'Tafsir', 'Tilawah', 'Qiraah', 'Fiqh', 'Hadits', 'Bahasa Arab'];

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  username?: string;
  phone?: string;
  role?: string;
  gender?: string;
  birthday?: string;
  photo_url?: string;
  province_id?: number;
  city_id?: number;
  juzProgress?: number;
  bio?: string;
  interests?: string[];
  hobbies?: string[];
  skillsList?: string[];
  showSkills?: boolean;
  showExperiences?: boolean;
}

export default function RegisterScreen() {
  const [step, setStep] = useState(0);
  const { login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');

  const [juzCount, setJuzCount] = useState(0);
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [hobbies, setHobbies] = useState('');
  const [skills, setSkills] = useState('');
  const [photoUri, setPhotoUri] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Dibutuhkan', 'Izinkan akses galeri untuk memilih foto profil');
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
      if (asset.base64) setPhotoUri(`data:image/jpeg;base64,${asset.base64}`);
    }
  };

  const toggleInterest = (item: string) => {
    setInterests((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);
  };

  const [doRegister, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: async (data: any) => {
      const { token, user } = data.register;
      await login(user, token);
      router.replace('/(tabs)/home');
    },
    onError: (err: any) => {
      const message = err.graphQLErrors?.[0]?.message || err.message || 'Gagal daftar';
      Alert.alert('Registrasi Gagal', message);
    },
  });

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Perhatian', 'Nama, email dan kata sandi wajib diisi');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Perhatian', 'Format email tidak valid (harus mengandung @)');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Perhatian', 'Kata sandi minimal 8 karakter');
      return;
    }
    if (password !== confirmPass) {
      Alert.alert('Perhatian', 'Konfirmasi kata sandi tidak cocok');
      return;
    }

    const input: RegisterInput = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      username: username.trim() || undefined,
      phone: phone.trim() || undefined,
      role: role || undefined,
      gender: gender || undefined,
      birthday: birthday.trim() || undefined,
      juzProgress: juzCount || undefined,
      bio: bio.trim() || undefined,
      interests: interests.length > 0 ? interests : undefined,
      hobbies: hobbies.trim() ? hobbies.split(',').map((h) => h.trim()) : undefined,
      skillsList: skills.trim() ? skills.split(',').map((s) => s.trim()) : undefined,
      showSkills: skills.trim() ? true : undefined,
    };
    if (photoUri) input.photo_url = photoUri;
    doRegister({ variables: { input } });
  };

  const canNext = () => {
    if (step === 0) return !!name.trim() && !!email.trim() && email.includes('@') && !!password.trim() && password.length >= 8;
    if (step === 1) return !!role;
    return true;
  };

  const steps = [
    <View key="akun" style={styles.stepWrap}>
      <Text style={styles.stepTitle}>Buat Akun</Text>
      <Text style={styles.stepSub}>Langkah 1/3 — Informasi akun</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput style={styles.input} placeholder="Cth: Ahmad Fauzi" placeholderTextColor="#C5C5C5" value={name} onChangeText={setName} autoCapitalize="words" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} placeholder="Cth: ahmad_fauzi" placeholderTextColor="#C5C5C5" value={username} onChangeText={setUsername} autoCapitalize="none" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="email@kamu.com" placeholderTextColor="#C5C5C5" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Kata Sandi</Text>
        <View style={styles.passwordRow}>
          <TextInput style={[styles.input, { paddingRight: 44 }]} placeholder="Min. 8 karakter" placeholderTextColor="#C5C5C5" value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
        <View style={styles.passwordRow}>
          <TextInput style={[styles.input, { paddingRight: 44 }, confirmPass && password !== confirmPass && styles.inputError]} placeholder="Ulangi kata sandi" placeholderTextColor="#C5C5C5" value={confirmPass} onChangeText={setConfirmPass} secureTextEntry={!showConfirm} />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
            <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        {confirmPass && password !== confirmPass ? <Text style={styles.errorText}>Kata sandi tidak cocok</Text> : null}
      </View>
    </View>,

    <View key="profil" style={styles.stepWrap}>
      <Text style={styles.stepTitle}>Data Diri</Text>
      <Text style={styles.stepSub}>Langkah 2/3 — Identitas & peran</Text>

      {/* Photo */}
      <View style={styles.photoSection}>
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          ) : (
            <View style={[styles.photoPreview, styles.photoPlaceholder]}>
              <Ionicons name="camera" size={28} color={COLORS.primary} />
            </View>
          )}
          <View style={styles.photoBadge}>
            <Ionicons name="cloud-upload-outline" size={14} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.photoHint}>Foto Profil (opsional)</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>No. Telepon</Text>
        <TextInput style={styles.input} placeholder="Cth: 08123456789" placeholderTextColor="#C5C5C5" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Tanggal Lahir</Text>
        <TextInput style={styles.input} placeholder="YYYY-MM-DD (Cth: 2000-01-15)" placeholderTextColor="#C5C5C5" value={birthday} onChangeText={setBirthday} autoCapitalize="none" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Jenis Kelamin</Text>
        <View style={styles.optionRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity key={g.id} style={[styles.optionChip, gender === g.id && styles.optionChipActive]} onPress={() => setGender(g.id)} activeOpacity={0.75}>
              <Text style={[styles.optionText, gender === g.id && styles.optionTextActive]}>{g.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Peran</Text>
        {ROLES.map((r) => (
          <TouchableOpacity key={r.id} style={[styles.roleCard, role === r.id && styles.roleCardActive]} onPress={() => setRole(r.id)} activeOpacity={0.8}>
            <Text style={styles.roleIcon}>{r.id === 'santri' ? '📚' : r.id === 'ustadz' ? '🎓' : '🌟'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.roleLabel, role === r.id && styles.roleLabelActive]}>{r.label}</Text>
              <Text style={styles.roleDesc}>{r.desc}</Text>
            </View>
            {role === r.id && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Provinsi</Text>
        <TextInput style={styles.input} placeholder="Cth: Jawa Barat" placeholderTextColor="#C5C5C5" value={province} onChangeText={setProvince} autoCapitalize="words" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Kota / Kabupaten</Text>
        <TextInput style={styles.input} placeholder="Cth: Bandung, Depok..." placeholderTextColor="#C5C5C5" value={city} onChangeText={setCity} autoCapitalize="words" />
      </View>
    </View>,

    <View key="huffadz" style={styles.stepWrap}>
      <Text style={styles.stepTitle}>Profil Huffadz</Text>
      <Text style={styles.stepSub}>Langkah 3/3 — Informasi hafalan & minat</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Juz yang Sudah Dihafal</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.juzRow}>
          {JUZ_OPTIONS.map((j) => (
            <TouchableOpacity key={j} style={[styles.juzBtn, juzCount === j && styles.juzBtnActive]} onPress={() => setJuzCount(j)} activeOpacity={0.7}>
              <Text style={[styles.juzBtnText, juzCount === j && styles.juzBtnTextActive]}>{j}</Text>
              <Text style={styles.juzBtnSub}>{j === 30 ? 'Khatam' : 'Juz'}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Bio / Tentang Kamu</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Ceritakan tentang perjalanan hafalanmu..." placeholderTextColor="#C5C5C5" value={bio} onChangeText={setBio} multiline />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Minat</Text>
        <View style={styles.chipGrid}>
          {INTERESTS.map((item) => (
            <TouchableOpacity key={item} style={[styles.chip, interests.includes(item) && styles.chipActive]} onPress={() => toggleInterest(item)} activeOpacity={0.7}>
              <Text style={[styles.chipText, interests.includes(item) && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Hobi (pisahkan dengan koma)</Text>
        <TextInput style={styles.input} placeholder="Cth: Membaca, Olahraga, Kaligrafi" placeholderTextColor="#C5C5C5" value={hobbies} onChangeText={setHobbies} autoCapitalize="words" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Keahlian (pisahkan dengan koma)</Text>
        <TextInput style={styles.input} placeholder="Cth: Tahfidz, Tajwid, Tilawah" placeholderTextColor="#C5C5C5" value={skills} onChangeText={setSkills} autoCapitalize="words" />
      </View>
    </View>,
  ];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={step > 0 ? () => setStep(step - 1) : () => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.progressRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.progressDot, step >= i && styles.progressDotActive]} />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {steps[step]}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, (!canNext() || (step === 2 && loading)) && styles.btnDisabled]}
          onPress={step < 2 ? () => setStep(step + 1) : handleRegister}
          disabled={(step < 2 && !canNext()) || (step === 2 && loading)}
          activeOpacity={0.85}
        >
          {step === 2 && loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>{step < 2 ? 'Lanjut' : 'Daftar Sekarang'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 56, paddingBottom: 16,
    paddingHorizontal: SPACING.md, flexDirection: 'row', alignItems: 'center',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  progressRow: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  progressDot: { width: 28, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  progressDotActive: { backgroundColor: COLORS.gold },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xl },
  stepWrap: { gap: 4 },
  stepTitle: { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.text, marginBottom: 2 },
  stepSub: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  field: { marginBottom: SPACING.md },
  label: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, marginBottom: 8 },
  input: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEEEEE', borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, height: 50, fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text },
  inputError: { borderColor: COLORS.error },
  textArea: { height: 90, textAlignVertical: 'top', paddingTop: SPACING.sm },
  passwordRow: { position: 'relative', justifyContent: 'center' },
  eyeBtn: { position: 'absolute', right: 14, padding: 4 },
  errorText: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.error, marginTop: 4 },
  photoSection: { alignItems: 'center', marginBottom: SPACING.lg },
  photoPreview: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: COLORS.primary },
  photoPlaceholder: { backgroundColor: '#FAFAFA', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },
  photoBadge: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  photoHint: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.primary, marginTop: 8 },
  optionRow: { flexDirection: 'row', gap: 12 },
  optionChip: { flex: 1, paddingVertical: 12, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: '#EEEEEE', backgroundColor: '#FAFAFA', alignItems: 'center' },
  optionChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  optionText: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.text },
  optionTextActive: { color: COLORS.primary, fontFamily: FONTS.semiBold },
  roleCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: '#FAFAFA', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 2, borderColor: '#EEEEEE', marginBottom: SPACING.sm },
  roleCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  roleIcon: { fontSize: 26 },
  roleLabel: { fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text },
  roleLabelActive: { color: COLORS.primary },
  roleDesc: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  juzRow: { gap: 8, paddingVertical: 4 },
  juzBtn: { width: 64, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, backgroundColor: '#FAFAFA', borderWidth: 2, borderColor: '#EEEEEE', alignItems: 'center' },
  juzBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  juzBtnText: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text },
  juzBtnTextActive: { color: COLORS.primary },
  juzBtnSub: { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: '#EEEEEE', backgroundColor: '#FAFAFA' },
  chipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  chipText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.text },
  chipTextActive: { color: COLORS.primary },
  footer: { padding: SPACING.lg, borderTopWidth: 1, borderTopColor: '#EEEEEE' },
  submitBtn: { backgroundColor: COLORS.primary, height: 52, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.5 },
  submitBtnText: { fontFamily: FONTS.bold, fontSize: 16, color: '#fff' },
});
