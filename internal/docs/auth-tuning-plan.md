# Plan — Auth Data Wiring & UI Tuning (Login/Register)

Status: **menunggu jawaban tim backend** soal schema `LoginInput`/`RegisterInput` (lihat pertanyaan yang sudah dikirim). Dokumen ini adalah spec sementara (Pipeline "Fitur Baru" / "Tuning" — `internal/docs/workflow.md`) untuk 2 pekerjaan paralel: mode dummy data, dan daftar perbaikan UI login/register.

## 1. Dummy Auth Mode (sudah diimplementasikan)

`login.tsx` dan `register.tsx` sudah wired ke Apollo (`LOGIN_MUTATION`/`REGISTER_MUTATION` di `src/graphql/mutations.ts`), tapi endpoint (`https://api.sidaqhub.com/graphql`) belum ada backend nyata. Supaya form tetap bisa dites end-to-end sambil menunggu jawaban tim backend soal field `LoginInput`/`RegisterInput`:

- **File baru**: `src/graphql/mockAuthLink.ts` — Apollo `ApolloLink` yang mengintersep operation `Login`/`Register` dan balikin dummy `RawUser` + token palsu setelah delay 400ms, tanpa menyentuh network.
- **Wiring**: `src/graphql/client.ts` — link order `[authLink, mockAuthLink, httpLink]`. Mutation lain (mis. `UpdateProfile`) tetap tembus ke `httpLink` asli.
- **Toggle**: `EXPO_PUBLIC_USE_MOCK_AUTH=false` di `.env` untuk mematikan dummy mode begitu schema real & endpoint backend terkonfirmasi.
- **Cleanup wajib setelah backend confirmed**: hapus `mockAuthLink` dari `client.ts`, hapus file `mockAuthLink.ts`, sesuaikan `input` di `login.tsx`/`register.tsx` dengan field asli dari tim backend.

## 2. Findings — Login Screen (`app/(auth)/login.tsx`)

| # | Severity | Temuan | Rekomendasi |
|---|----------|--------|--------------|
| L1 | warning | `paddingTop: 56` hardcoded di header, bukan `useSafeAreaInsets()` — bisa ketiban status bar/notch di sebagian device Android | Pakai `react-native-safe-area-context` (`useSafeAreaInsets`) untuk `paddingTop` dinamis |
| L2 | warning | "Ingat saya" checkbox murni state lokal, tidak mempengaruhi apa pun (persist token selalu terjadi) | Hilangkan checkbox jika tidak ada bedanya, atau wire ke logic sesungguhnya (mis. skip auto-login jika unchecked) |
| L3 | warning | Tidak ada `testID`/`accessibilityLabel` pada elemen non-trivial baru (cek ulang setelah perubahan) | Pastikan tetap konsisten dengan `src/constants/testIds/auth.js` |
| L4 | optimization | Validasi hanya via `Alert.alert` — mengganggu alur, tidak inline | Tambah inline error text di bawah input (pola sudah ada di Register step 1 untuk confirm password), reserve Alert untuk error dari server |
| L5 | optimization | Tidak ada `textContentType`/`autoComplete` di input email & password | Tambah `textContentType="emailAddress"` / `"password"`, `autoComplete="email"` / `"password"` agar autofill OS jalan (lebih profesional) |
| L6 | optimization | Tidak ada `returnKeyType`/`onSubmitEditing` untuk pindah fokus/submit dari keyboard | Tambah `returnKeyType="next"` di email → fokus ke password; `returnKeyType="done"` + `onSubmitEditing={handleLogin}` di password |
| L7 | info | Social login (Google/Facebook) trigger `Alert` "Segera Hadir" | Opsional: ganti jadi badge "Segera Hadir" di tombol (styling), Alert hanya untuk error sungguhan |

## 3. Findings — Register Screen (`app/(auth)/register.tsx`)

| # | Severity | Temuan | Rekomendasi |
|---|----------|--------|--------------|
| R1 | **critical (quality gate)** | **Nol** `testID` di seluruh form (name/email/password/confirm/phone/birthday/gender/role/province/city/juz/bio/interests/hobbies/skills/submit) — melanggar `CLAUDE.md` Quality Gates | Tambahkan `testID` di semua elemen interaktif, selaraskan dengan `src/constants/testIds/auth.js` (`REGISTER.*`) — tambah key baru di file testIds jika elemen belum ada |
| R2 | warning | `province`/`city` adalah `TextInput` teks bebas, tapi backend (dari `AuthContext.jsx` referensi) expect `provinceID`/`cityID` (integer FK) — dan nilainya **tidak pernah dikirim** di `handleRegister` sama sekali | Ganti jadi picker/dropdown (`province → city` cascading, city difilter oleh province terpilih) begitu tim backend konfirmasi ada query list province/city. Sertakan `province_id`/`city_id` di `RegisterInput` yang dikirim |
| R3 | warning | `birthday` diketik manual format `YYYY-MM-DD` — rawan salah ketik, tidak profesional dibanding date picker native | Tambah `@react-native-community/datetimepicker` (belum ada di `package.json`, perlu ditambahkan) atau native `DateTimePicker` dari Expo untuk pilih tanggal |
| R4 | warning | `paddingTop: 56` hardcoded di header, sama seperti Login (L1) | Sama: pakai `useSafeAreaInsets()` |
| R5 | optimization | `ImagePicker.MediaTypeOptions.Images` **deprecated** di `expo-image-picker@17.0.11` | Ganti ke `mediaTypes: ['images']` (array) sesuai API baru |
| R6 | optimization | Field opsional (`username`, `phone`, dll.) tidak ada inline hint "opsional" yang konsisten — cuma foto profil yang dikasih label "(opsional)" | Tambah label "(opsional)" konsisten di semua field non-wajib untuk ekspektasi yang jelas ke user |
| R7 | optimization | Tidak ada `returnKeyType`/keyboard chaining antar field step 1 | Sama seperti L6 |
| R8 | optimization | `skills`/`hobbies` pakai input teks dipisah koma (`split(',')`) — rawan typo, tidak serapi chip-based input seperti `interests` | Pertimbangkan ganti ke pola chip input custom (ketik lalu Enter jadi chip), atau minimal trim tiap item lebih robust |
| R9 | info | Tidak ada indikator jumlah karakter di `bio` (`multiline` textarea) | Tambah counter kecil (mis. "120/300") jika backend punya batas panjang bio |

## 4. Prioritas Pengerjaan (disarankan)

1. **R1** — testID di Register (quality gate, wajib, effort kecil)
2. **L1 / R4** — safe-area header fix (bug visual nyata di sebagian device, effort kecil)
3. **L2** — beresin "Ingat saya" checkbox yang tidak berfungsi (effort kecil)
4. **R5** — fix `MediaTypeOptions` deprecated (effort kecil, cegah warning/break di update Expo berikutnya)
5. **L4/L5/L6, R6/R7** — polish input UX (inline error, autofill, keyboard chaining) (effort medium)
6. **R2, R3** — province/city picker & date picker — **tunda sampai tim backend konfirmasi** field & query province/city list (effort medium-hard, tergantung jawaban backend)
7. **R8, R9** — nice-to-have, effort medium, prioritas rendah

## 5. Menunggu dari Tim Backend

Pertanyaan sudah dikirim ke tim backend (schema `LoginInput`/`RegisterInput`, query province/city, mekanisme upload foto, validasi, format error, endpoint dev/staging). Setelah dijawab:
- Update bagian "Future GraphQL Mutations" di `internal/docs/api.md` jadi schema real.
- Sesuaikan `RegisterInput`/`LoginInput` interface di `register.tsx`/`login.tsx`.
- Matikan `EXPO_PUBLIC_USE_MOCK_AUTH`, hapus `mockAuthLink.ts`.
- Kerjakan R2/R3 di atas.
