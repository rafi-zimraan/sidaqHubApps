# Feature Checklist — SidaqHub

> Status fitur aplikasi per **2 Juli 2026**.
> Konteks: aplikasi berjalan **tanpa backend** — semua data dari `src/utils/mock.ts` (REST mock) dan `src/graphql/mockAuthLink.ts` (auth mock).
> Legend: `[x]` = bisa digunakan (berbasis mock) · `[ ]` = **belum bisa digunakan**.

---

## 1. Autentikasi & Akun

- [x] Login email + password (mock GraphQL, semua kombinasi valid diterima)
- [x] Tampil/sembunyikan kata sandi
- [x] Checkbox "Ingat saya" (UI saja, sesi selalu tersimpan)
- [x] Register 3 langkah (akun → data diri → profil huffadz)
- [x] Validasi register (email `@`, sandi min. 8 karakter, konfirmasi cocok)
- [x] Upload foto profil saat register (base64, lokal)
- [x] Onboarding (pilih peran, jumlah juz, minat)
- [x] Sesi tersimpan di AsyncStorage (auto-login saat buka ulang)
- [x] Redirect otomatis (belum login → login; profil belum lengkap → onboarding)
- [x] Logout dengan konfirmasi
- [ ] **Lupa kata sandi** — tombol menampilkan alert "Segera Hadir"
- [ ] **Login Google** — alert "Segera Hadir"
- [ ] **Login Facebook** — alert "Segera Hadir"
- [ ] **Verifikasi email / OTP** — belum ada
- [ ] Provinsi & kota di register **tidak ikut terkirim** ke input mutation (field diketik tapi diabaikan)

## 2. Beranda (Feed)

- [x] Feed postingan (teks, ayat, tilawah, foto) dari mock
- [x] Filter feed: Foto / Ayat / Tilawah (chip, tap ulang untuk hapus filter)
- [x] Reaksi "Aamiin" (tambah/batal, optimistic update)
- [x] Postingan foto ala Pinterest/Unsplash (gambar rounded di kartu feed)
- [x] Ayat box (teks Arab + terjemahan + referensi)
- [x] Preview komentar (maks. 2) di kartu feed
- [x] Pull-to-refresh
- [x] Buka detail postingan via tombol "Komentar"
- [x] Composer → buka halaman Buat Postingan
- [ ] **Pencarian** (ikon kaca pembesar) — tidak ada aksi
- [ ] **Chat/pesan** (ikon chat) — tidak ada aksi
- [ ] **Stories** — hanya tampilan; belum bisa dibuka, dibuat, atau dilihat
- [ ] **Bagikan postingan** — tombol tanpa aksi
- [ ] **Menu titik-tiga postingan** (laporkan/simpan/hapus) — tanpa aksi
- [ ] **Pemutar audio tilawah** — tombol play dummy, tidak memutar audio
- [ ] **Tombol "Gabung" halaqah di kartu feed** — tanpa aksi (gunakan halaman detail halaqah)
- [ ] **Balas komentar** dari preview feed — teks "Balas" tanpa aksi

## 3. Postingan

- [x] Buat postingan teks
- [x] Buat postingan ayat (teks Arab, referensi, terjemahan)
- [x] Hashtag (dipisah koma/spasi)
- [x] Visibilitas Publik/Koneksi (tersimpan di body request)
- [x] Detail postingan + daftar komentar
- [x] Tambah komentar di detail postingan
- [x] Reaksi Aamiin di detail postingan
- [ ] **Postingan baru TIDAK muncul di feed** — mock tidak menyimpan hasil `POST /api/posts`
- [ ] **Upload foto ke postingan** — belum ada picker gambar di Buat Postingan
- [ ] **Rekam/upload audio tilawah** — belum ada
- [ ] **Edit / hapus postingan** — belum ada
- [ ] **Balas komentar (threaded)** — belum ada

## 4. Komunitas & Halaqah

- [x] Daftar halaqah (slot, platform, jadwal, badge "Penuh")
- [x] Detail halaqah (jadwal, slot bar, pengajar, link Zoom/Meet)
- [x] Daftar / batal daftar halaqah
- [x] Buat halaqah (judul, jadwal, platform, maks. peserta)
- [x] Daftar komunitas + ikuti/berhenti ikuti (state lokal)
- [ ] **Halaqah baru TIDAK muncul di daftar** — mock tidak menyimpan hasil `POST /api/halaqahs`
- [ ] **Halaman detail komunitas** — tap kartu komunitas tidak membuka apa pun (`onPress` kosong)
- [ ] **Link Zoom/Meet tidak bisa diklik** — hanya teks, belum membuka browser
- [ ] **Date/time picker** buat halaqah — masih input teks manual `YYYY-MM-DD`
- [ ] **Keanggotaan tidak persisten** — join/ikuti hilang setelah refresh (mock)

## 5. Jejaring

- [x] Saran koneksi + ikuti/berhenti ikuti (state lokal)
- [x] Komunitas populer (kartu horizontal)
- [x] Halaqah aktif (daftar ringkas)
- [x] Huffadz dekat lokasi → buka profil user
- [ ] **Kolom pencarian** — bisa diketik tapi tidak mencari
- [ ] **Filter chips (Semua/Huffadz/Komunitas/…)** — bisa dipilih tapi **tidak memfilter data**
- [ ] **Statistik (1.2K Pengikut, 384 Mengikuti, dst.)** — angka hardcoded, bukan data user
- [ ] **"Lihat Semua"** di tiap seksi — tanpa aksi
- [ ] **Jarak "12 mutasi"** — dummy, bukan lokasi asli (belum ada izin/API lokasi)
- [ ] **Tombol ikon search & filter di header** — tanpa aksi

## 6. Notifikasi

- [x] Daftar notifikasi (reaksi, komentar, follow, halaqah)
- [x] Badge jumlah belum dibaca
- [x] Tandai satu / semua sudah dibaca
- [ ] **Tap notifikasi tidak membuka konten terkait** (post/profil) — hanya menandai dibaca
- [ ] **Push notification** — belum ada (butuh backend + expo-notifications)

## 7. Profil

- [x] Profil sendiri (cover, avatar, bio, statistik, info akun)
- [x] Grid progres 30 juz + legend
- [x] Keahlian, minat, hobi, pengalaman, sertifikasi (dari data user)
- [x] Edit profil (nama, username, telepon, kota, juz, peran, minat, dst.)
- [x] Ganti foto profil (galeri, base64 lokal)
- [x] Profil user lain + ikuti/berhenti ikuti
- [x] Shortcut App Health (ikon hati di cover)
- [ ] **Statistik profil (1.2K Pengikut / 384 Mengikuti / 12 Sertifikat)** — hardcoded
- [ ] **Menu titik-tiga di cover** — tanpa aksi
- [ ] **Tap statistik** (daftar pengikut/mengikuti) — tanpa aksi
- [ ] **Ganti foto cover** — belum ada
- [ ] **"Murattal Riwayat Hafs" & "Update: 3 hari lalu"** — teks statis

## 8. Umum / Infrastruktur

- [x] Mock API layer (`apiGet/apiPost/apiPut/apiDelete` + delay 250ms)
- [x] App Health scanner (`/app-health`)
- [x] Font Poppins + Amiri (swap tanpa blok render)
- [x] Tab bar kustom + FAB buat postingan
- [ ] **Backend nyata** — semua data hilang saat app ditutup (kecuali sesi login)
- [ ] **Mode gelap** — belum ada
- [ ] **Bahasa selain Indonesia** — belum ada
- [ ] **Deep linking ke post/halaqah** — belum diuji/dikonfigurasi

---

## Coverage Unit Test (Jest — 201 tests, 26 suites)

| Area | File Test | Status |
|---|---|---|
| Login | `__tests__/screens/login.test.tsx` | ✅ |
| Register (3 langkah) | `__tests__/screens/Register.test.tsx` | ✅ |
| Onboarding | `__tests__/screens/Onboarding.test.tsx` | ✅ |
| Flow auth (login→update→logout→restore sesi) | `__tests__/flows/auth-flow.test.tsx` | ✅ |
| Routing awal (index redirect) | `__tests__/screens/Index.test.tsx` | ✅ |
| Beranda (feed, filter, reaksi, empty state) | `__tests__/screens/Home.test.tsx` | ✅ |
| Buat postingan (validasi, ayat, hashtag) | `__tests__/screens/PostCreate.test.tsx` | ✅ |
| Detail postingan (komentar, reaksi) | `__tests__/screens/PostDetail.test.tsx` | ✅ |
| Komunitas & halaqah (tab, join, navigasi) | `__tests__/screens/Community.test.tsx` | ✅ |
| Detail halaqah (daftar/batal/penuh) | `__tests__/screens/HalaqahDetail.test.tsx` | ✅ |
| Buat halaqah (validasi, jadwal, platform) | `__tests__/screens/HalaqahCreate.test.tsx` | ✅ |
| Jejaring | `__tests__/screens/Network.test.tsx` | ✅ |
| Notifikasi (baca satu/semua) | `__tests__/screens/Notifications.test.tsx` | ✅ |
| Profil sendiri | `__tests__/screens/Profile.test.tsx` | ✅ |
| Logout (konfirmasi + redirect) | `__tests__/screens/Logout.test.tsx` | ✅ |
| Profil user lain (follow/unfollow) | `__tests__/screens/UserProfile.test.tsx` | ✅ |
| Edit profil | `__tests__/screens/EditProfile.test.tsx` | ✅ |
| AuthContext, api, mock, storage, theme, graphql, hooks | `__tests__/utils|context|graphql|hooks/*` | ✅ |

> Jalankan: `yarn test` — seluruh 201 test wajib hijau sebelum commit (lihat `quality-gates.md`).
