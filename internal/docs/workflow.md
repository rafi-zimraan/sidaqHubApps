# Workflow Pipeline — SidaqHub

Dokumen ini mendefinisikan **3 pipeline standar** untuk setiap pekerjaan di repositori ini.
Setiap pipeline memiliki langkah berurutan yang **wajib diikuti**.

---

## 🆕 Pipeline 1: Fitur Baru

### Step 1: Planning
- Baca `internal/docs/blueprint.md` untuk memahami visi fitur
- Baca `internal/docs/prd.md` (jika ada) untuk requirement detail
- Tentukan screen/component mana yang perlu dibuat/dimodifikasi
- Tentukan data flow: mock data → API → GraphQL
- **Output**: Ringkasan singkat (3-5 baris) apa yang akan dibuat

### Step 2: Design
- Tentukan UI components yang diperlukan (periksa existing patterns)
- Tentukan routing (Expo Router file-based)
- Tentukan state management (local state vs context vs Apollo cache)
- Tentukan tipe data (interface/types di mock.ts atau mutations.ts)
- **Output**: Nama-nama file yang akan dibuat/dimodifikasi

### Step 3: Implementasi
- Ikuti `internal/docs/coding-standard.md`:
  - Gunakan `@/src/` path alias
  - StyleSheet.create(), bukan inline styles
  - Functional components dengan hooks
  - Import terurut: react → expo → library → internal
- Tambahkan `testID` pada setiap elemen interaktif (TouchableOpacity, TextInput, dll.)
- Error handling: semua async operation wajib punya try-catch
- **Wajib**: Jalankan `npx tsc --noEmit` dan `yarn lint` setelah selesai
- **Output**: Kode fitur siap

### Step 4: Testing
- Buat file test di `__tests__/` sesuai struktur existing
- Test coverage minimal:
  - Utility functions: 90%+
  - Screen: render + navigasi + form validation
  - Component: render + props + interaction
- **Wajib**: `yarn test` harus pass sebelum lanjut
- **Output**: 1+ file test dengan semua test passing

### Step 5: Tuning
- Buka `app/app-health.tsx` (atau jalankan `src/utils/appHealth.ts`)
- Perbaiki semua findings severity **critical** dan **warning**
- Perhatikan: bundle size, re-render optimization, UX polish
- **Output**: Health score ≥ 70

### Step 6: Review
- Pastikan semua quality gates lulus (lihat `internal/docs/quality-gates.md`)
- Jika ada PR, tulis deskripsi: `feat(scope): deskripsi singkat`
- **Output**: Siap commit/diminta review

---

## 🐛 Pipeline 2: Bug Fix

### Step 1: Reproduce
- Identifikasi **trigger** (aksi user apa yang menyebabkan bug)
- Identifikasi **expected behavior** vs **actual behavior**
- Catat: device/platform, screen, error message
- **Output**: Deskripsi bug yang jelas (3-5 baris)

### Step 2: Diagnose
- Cek error log (console, Alert, crash)
- Trace data flow: input → component → API → mock → render
- Identifikasi root cause (type error, logic error, missing null check, dll.)
- **Output**: Root cause + lokasi file:baris

### Step 3: Fix
- Implementasi **solusi minimal** — jangan ubah kode yang tidak relevan
- Pastikan fix tidak memperkenalkan bug baru di area lain
- **Wajib**: `npx tsc --noEmit` dan `yarn lint` setelah fix
- **Output**: Kode fix

### Step 4: Test
- Jalankan `yarn test` — semua existing test harus tetap pass
- Jika ada test yang meng-cover area bug, pastikan passing
- Jika tidak ada test untuk area bug, pertimbangkan tambah test
- **Output**: Semua test passing

### Step 5: Verify
- Manual test di device/simulator untuk memastikan bug tidak muncul lagi
- Test edge cases (input kosong, null values, error states)
- **Output**: Bug terverifikasi fix

---

## ⚡ Pipeline 3: Tuning / Optimasi

### Step 1: Health Check
- Jalankan `app/app-health.tsx` atau panggil `runHealthCheck()` dari `src/utils/appHealth.ts`
- Catat semua findings: severity, category, effort level
- **Output**: Daftar findings terurut

### Step 2: Prioritize
Urutkan berdasarkan:
1. **Critical** — segera perbaiki (pengaruh langsung ke stabilitas/keamanan)
2. **Warning** — prioritaskan (potensi masalah di production)
3. **Optimization** — kerjakan sesuai effort:
   - Easy (Mudah): kerjakan semua
   - Medium (Sedang): kerjakan jika ada waktu
   - Hard (Sulit): rencanakan untuk sprint berikutnya
4. **Info** — dokumentasikan saja

### Step 3: Optimize
- Terapkan rekomendasi satu per satu
- Setiap perubahan: `npx tsc --noEmit` + `yarn lint`
- **Wajib**: Jangan memperkenalkan regresi
- **Output**: Perubahan kode untuk setiap optimasi

### Step 4: Benchmark
- Jalankan ulang health check untuk melihat improvement skor
- Catat metrik: bundle size (jika relevan), render performance
- Uji UX: pastikan perubahan tidak mengganggu user experience
- **Output**: Skor health baru + ringkasan improvement

---

## Referensi

| Dokumen | Isi |
|---------|-----|
| `CLAUDE.md` | Pipeline ringkas + quality gates checklist |
| `quality-gates.md` | Checklist detail untuk sebelum commit |
| `coding-standard.md` | Aturan penulisan kode |
| `testing.md` | Strategi & struktur testing |
| `app-health.tsx` | Health check screen |
| `src/utils/appHealth.ts` | Health check utility |
