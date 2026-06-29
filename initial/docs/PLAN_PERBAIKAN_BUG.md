# PLAN PERBAIKAN BUG — Bug Tracker & Improvement Plan

## SidaqHub Application

### 🐛 Bugs Teridentifikasi (Code Review)

#### Critical
| # | Bug | Lokasi | Deskripsi | Severity |
|---|-----|--------|-----------|----------|
| B1 | **API path tidak match di mock** | `mock.ts:resolveGet` | `/api/posts/:id/react` dan `/api/posts/:id/comments` tidak ada handler POST/DELETE → return `{}` tanpa effect. Tapi screen tetap jalan karena update state lokal. Sebenarnya tidak crash, tapi API layer tidak konsisten. | Medium |
| B2 | **apiPut read-all notif tidak ada resolver** | `mock.ts:resolveMutation` | `/api/notifications/read-all` dan `/api/notifications/:id/read` tidak di-handle → return `{}` tapi screen sudah update state lokal | Low |

#### Performance
| # | Issue | Lokasi | Deskripsi | Severity |
|---|-------|--------|-----------|----------|
| P1 | **FlatList tanpa key extractor optimal** | `home.tsx` | Sudah pakai `keyExtractor` — OK | - |
| P2 | **Semua data dimuat sekaligus** | Semua screen | Tidak ada pagination. Untuk jumlah data besar akan lambat | Medium |
| P3 | **useEffect tanpa cleanup** | Semua screen | Tidak ada AbortController. Jika user navigasi cepat, bisa setState unmounted component | Low |

#### UX/UI
| # | Issue | Lokasi | Deskripsi | Severity |
|---|-------|--------|-----------|----------|
| U1 | **Tidak ada skeleton loading** | Semua screen | Hanya ActivityIndicator. Tidak ada placeholders | Medium |
| U2 | **Empty state ilustrasi kurang personal** | Semua screen | Menggunakan emoji, bukan ilustrasi khas | Low |
| U3 | **Error handling tidak tampil ke user** | Semua screen | `try/catch` hanya `console.error`, tidak ada toast/alert error ke user | Medium |
| U4 | **Touch targets kecil di beberapa tempat** | `home.tsx:moreBtn` | Ellipsis button hanya 18px — minimum recommended 44px | Low |
| U5 | **Halaqah embed jadwal hardcode** | `home.tsx:107` | "Malam ini, 20.00 WIB" — tidak pakai `schedule` dari data | Medium |
| U6 | **Profile stats hardcode** | `profile.tsx:253` | "1.2K", "384" — hardcode, tidak dari user data | Medium |
| U7 | **Notifikasi tap tidak navigasi** | `notifications.tsx` | Tap notifikasi hanya mark read, tidak navigasi ke post/user terkait | Medium |

#### Code Quality
| # | Issue | Lokasi | Deskripsi | Severity |
|---|-------|--------|-----------|----------|
| C1 | **Inline components tanpa props type** | Semua screen | Props `any` di banyak komponen inline | Medium |
| C2 | **Redundant `formatSchedule` disebut 2x** | `community.tsx:86` | Memanggil `formatSchedule` dalam render — optimal | - |
| C3 | **`any[]` type di semua state** | Semua screen | Tidak memanfaatkan TypeScript interfaces | High |
| C4 | **Magic strings** | Semua screen | Warna hardcode di banyak tempat padahal `COLORS` sudah ada | Low |
| C5 | **`reactionDot` zIndex stacking** | `home.tsx:131-138` | zIndex untuk cluster reaksi — subtle, mungkin tidak konsisten di Android | Low |

### 📋 Improvement Plan

#### Priority 1: Immediate (Minggu ini)
| ID | Action |
|----|--------|
| U5 | Fix hardcode jadwal di HalaqahEmbed — ambil dari `post.halaqah.schedule` |
| U6 | Profile stats ambil dari user data, bukan hardcode |
| B2 | Tambah handler `resolveMutation` untuk `/api/notifications/read-all` dan `/:id/read` |
| C4 | Ganti magic string warna dengan `COLORS.*` |

#### Priority 2: Short-term (2-3 minggu)
| ID | Action |
|----|--------|
| U3 | Tambah toast/snackbar untuk error handling di semua screen |
| U1 | Implement skeleton loading dengan `react-native-reanimated` |
| C3 | Definisikan TypeScript interfaces untuk Post, User, Halaqah, dll |
| C1 | Add proper props types untuk semua komponen inline |
| U7 | Navigasi ke post/user saat notifikasi di-tap |

#### Priority 3: Medium-term (1-2 bulan)
| ID | Action |
|----|--------|
| B1 | Konsistenkan API path handler dan update mock resolver |
| P2 | Implementasi infinite scroll / pagination |
| U2 | Buat ilustrasi khas Huffadz untuk empty state |
| P3 | Tambah cleanup di useEffect (AbortController) |
| U4 | Increase touch target size untuk icon buttons |

### ✅ Progress Tracking
| ID | Status | Note |
|----|--------|------|
| All | 📝 Belum dimulai | Perlu assign priority dan mulai perbaikan |

---

## 👤 Human Tuning — Accessibility & UX Audit

### Accessibility (a11y)

| # | Issue | Screen | Rekomendasi | Priority |
|---|-------|--------|-------------|----------|
| A1 | **Tidak ada `accessibilityLabel`** | Semua screen | Tambah `accessibilityLabel` di semua TouchableOpacity, tombol, dan icon | High |
| A2 | **Tidak ada `accessibilityRole`** | Semua screen | Tambah `accessibilityRole="button"` di TouchableOpacity, `header` di judul layar | High |
| A3 | **Kontras warna** | `login.tsx:210-215` | Header background primary (#1A5C6B) overlaid dengan text white — OK ✅. Tapi di beberapa chip mungkin kurang kontras | Low |
| A4 | **Touch target < 44px** | `home.tsx:204` (moreBtn), `notifications.tsx:129` (notifDot) | Minimum touch target 44x44pt (Apple HIG / Material Design). Butiran kecil seperti unread dot harus diperbesar area tap-nya | Medium |
| A5 | **Teks Arab tidak accessible** | `home.tsx:72` (AyatBox) | Screen reader tidak bisa membaca teks Arab. Tambah `accessibilityLabel` berbasis transliterasi | Low |
| A6 | **Avatar initials tidak accessible** | Semua screen | `accessibilityLabel="Avatar {nama}"` untuk setiap InitialAvatar | Medium |
| A7 | **Empty state tidak dideskripsikan** | Semua screen | Tambah `accessibilityLabel` menjelaskan bahwa ini adalah state kosong dan tindakan yang bisa dilakukan | Medium |

### UX Writing

| # | Issue | Screen | Rekomendasi | Priority |
|---|-------|--------|-------------|----------|
| U8 | **Error handling silent** | Semua screen | Ganti `console.error` dengan snackbar/toast berbahasa Indonesia yang ramah: "Wah, gagal memuat. Coba tarik ke bawah untuk refresh" | High |
| U9 | **Empty state emoji vs ilustrasi** | Semua screen | Ganti emoji dengan ilustrasi custom bertema Islami (masjid, Quran, buku) — lebih profesional | Medium |
| U10 | **Login placeholder "email@kamu.com"** | `login.tsx:74` | Bisa lebih spesifik: "email@contoh.com" atau "Masukkan alamat email" | Low |
| U11 | **"Karir" tab label membingungkan** | `tabs/_layout.tsx:76` | Tab berisi Community & Halaqah tapi label "Karir". Sebaiknya "Komunitas" | Medium |
| U12 | **Onboarding "Langkah 1 dari 3"** | `onboarding.tsx:146` | Informasi langkah sudah baik. Tapi user tidak bisa skip onboarding — perlu dipertimbangkan | Low |
| U13 | **Button consistency** | Semua screen | Campuran "Ikuti" vs "+ Ikuti" vs "Mengikuti" — perlu standarisasi | Low |
| U14 | **Coming Soon alert message** | `login.tsx:42` | Pesan sudah baik 👌 tapi bisa tambah konteks fitur apa yang akan datang | Low |

### Micro-interactions & Visual Feedback

| # | Issue | Screen | Rekomendasi | Priority |
|---|-------|--------|-------------|----------|
| M1 | **Tidak ada skeleton loading** | Semua screen | ActivityIndicator diganti skeleton placeholder bentuk card/post | High |
| M2 | **Animasi fade-in di semua screen** | Semua screen | Sudah ada ✅ — `Animated.View` dengan `fadeAnim` 220ms | - |
| M3 | **Spring animation di PressBtn** | `network.tsx:32-51` | Sudah ada ✅ — contoh yang baik untuk diterapkan di screen lain | - |
| M4 | **Haptic feedback tidak digunakan** | Semua screen | Tambah `expo-haptics` untuk tombol aksi utama (like, follow, gabung) | Medium |
| M5 | **Pull-to-refresh tanpa feedback** | Semua screen | RefreshControl sudah ada ✅ — tapi tidak ada pesan "Last updated" | Low |
| M6 | **Reaksi Aamiin tanpa animasi** | `home.tsx:266-276` | Saat tap Aamiin, beri feedback visual (scale bounce, warna berubah, atau confetti) | Medium |

### Performance UX (User-facing)

| # | Issue | Screen | Rekomendasi | Priority |
|---|-------|--------|-------------|----------|
| P4 | **Loading state hanya spinner** | Semua screen | Skeleton loading untuk placeholder konten | High |
| P5 | **Gambar profil tidak di-cache** | Semua screen | Gunakan `expo-image` dengan `cachePolicy="persistent"` | Medium |
| P6 | **FlatList tanpa estimatedItemSize** | `home.tsx:444` | Tambah `getItemLayout` atau FlashList untuk performa scroll | Medium |
