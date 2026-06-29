# PLAN — Roadmap & Rencana Pengembangan

## SidaqHub Application

### Phase 1: Mock & UI (✅ Selesai)

| Item | Status |
|------|--------|
| Seluruh UI (20+ screens) selesai | ✅ |
| Mock data lokal (`src/utils/mock.ts`) | ✅ |
| Expo Router navigation structure | ✅ |
| Auth flow (Login → Register → Onboarding → Home) | ✅ |
| Feed dengan filter & reaksi | ✅ |
| Profil dengan Juz Grid & progres | ✅ |
| Halaqah & komunitas CRUD flow | ✅ |
| Notifikasi | ✅ |
| Build APK Android (EAS) | ✅ |

### Phase 2: Backend Integration (🔜 Sedang Direncanakan)

| Item | Target | Notes |
|------|--------|-------|
| Setup Supabase project | Q3 2026 | Database + Auth + Storage |
| Migrasi mock → Supabase schema | Q3 2026 | Users, Posts, Comments, Halaqahs, Communities |
| Auth real (email/password + Google) | Q3 2026 | Ganti auto-login mock |
| API client nyata (axios) | Q3 2026 | Ganti `api.ts` mock wrapper |
| Real-time notifikasi | Q4 2026 | Supabase Realtime |
| Upload avatar & images | Q4 2026 | Supabase Storage |
| Pagination feed & infinite scroll | Q4 2026 | Replace FlatList all-data |

### Phase 3: Production Readiness (🔜 Rencana)

| Item | Target | Notes |
|------|--------|-------|
| Rilis Beta (TestFlight / Internal Track) | Q4 2026 | 100 tester |
| Google Play Store rilis | Q1 2027 | Minimum Viable Product |
| Performance optimization | Q1 2027 | FlashList, image cache, reduce bundle |
| Push notifications | Q1 2027 | Firebase Cloud Messaging |
| Analytics & crash reporting | Q1 2027 | Sentry / Firebase Crashlytics |

### Phase 4: Post-MVP (💡 Ide)

| Fitur | Deskripsi |
|-------|-----------|
| **Sertifikasi Digital Hafalan** | Ujian & sertifikat hafalan on-chain |
| **Halaqah Premium** | Halaqah berbayar dengan ustadz ternama |
| **Leaderboard Huffadz** | Kompetisi murajaah mingguan |
| **AI-based Murajaah** | Deteksi kesalahan bacaan via audio |
| **Pencarian Ayat** | Search by keyword/terjemahan dari postingan |
| **Dark Mode** | Tema gelap sesuai preferensi |

### Human Tuning Milestones

| Item | Detail | Timeline |
|------|--------|----------|
| Accessibility audit | Screen reader labels, contrast, touch targets | Phase 1.5 |
| UX Writing review | Konsistensi bahasa, empty states, error messages | Phase 1.5 |
| Loading & skeleton | Skeleton loading untuk semua screen | Phase 1.5 |
| Micro-interactions | Haptic feedback, spring animations | Phase 1.5 |
| Empty state illustrations | Ilustrasi khas Huffadz untuk setiap empty state | Phase 2 |
| Onboarding refinement | Personalisasi, skip option | Phase 2 |
