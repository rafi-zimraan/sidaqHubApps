# CLAUDE.md — SidaqHub

Aplikasi mobile jejaring sosial untuk komunitas Huffadz (penghafal Al-Quran) Indonesia.
**Status: tanpa backend.** Seluruh data dari `src/utils/mock.ts`.

## Quick Commands
```bash
yarn start             # Expo dev server
yarn android           # Expo Go Android
yarn lint              # expo lint
yarn test              # Jest (116 tests)
npx tsc --noEmit       # TypeScript check
npx eas-cli build      # Production build
```

> Gunakan **yarn**, bukan npm. `packageManager: yarn@1.22.22`

## Arsitektur Ringkas

- **Routing**: Expo Router v6 (file-based) — `app/` → `(auth)/`, `(tabs)/`, `post/[id]`, dll.
- **Data Flow**: Screen → `apiGet/apiPost` → delay 250ms → `resolveGet/ResolveMutation` → Mock data
- **Auth**: `AuthContext.tsx` — login/logout/updateUser + persist ke AsyncStorage
- **Tema**: `src/constants/theme.ts` — COLORS, FONTS (Poppins + Amiri), SPACING, RADIUS
- **Path Alias**: `@/` → root. Gunakan `@/src/...`, jangan relative path
- **Storage**: `src/utils/storage/` — wrapper AsyncStorage + SecureStore (tidak pernah throw)
- **Fonts**: `app/_layout.tsx` load Poppins + Amiri — render ditahan sampai font siap (splash tetap tampil) agar teks tidak terpotong di Android
- **Build**: EAS, `eas.json` (preview + production), `com.sidaqhub.app`, New Architecture aktif

## Pipeline

### 🆕 Fitur Baru
1. **Planning** — baca `internal/docs/blueprint.md`, tulis spec
2. **Design** — tentukan UI components, data flow, routing
3. **Implementasi** — ikuti `internal/docs/coding-standard.md`
4. **Testing** — unit test + component test + manual (`internal/docs/testing.md`)
5. **Tuning** — jalankan `app/app-health.tsx`, perbaiki findings
6. **Review** — pastikan semua quality gates lulus

### 🐛 Bug Fix
1. **Reproduce** — identifikasi trigger & expected vs actual behavior
2. **Diagnose** — cari root cause (error log, data flow tracing)
3. **Fix** — implementasi solusi minimal, jangan ubah yang tidak relevan
4. **Test** — `yarn test` + pastikan bug tidak muncul lagi
5. **Verify** — manual test di device/simulator

### ⚡ Tuning / Optimasi
1. **Health Check** — scan di `app/app-health.tsx` (atau `src/utils/appHealth.ts`)
2. **Prioritize** — critical > warning > optimization
3. **Optimize** — terapkan rekomendasi satu per satu
4. **Benchmark** — ukur improvement (render time, bundle size, dsb.)

## Quality Gates (wajib lulus SEBELUM commit)
- [ ] `npx tsc --noEmit` — nol type errors
- [ ] `yarn lint` — nol lint errors
- [ ] `yarn test` — semua test pass (116+ tests)
- [ ] Manual QA — sesuai `internal/docs/quality-gates.md`
- [ ] App Health — scan di `app/app-health.tsx`, skor ≥ 70
- [ ] Error handling — semua async operation punya try-catch
- [ ] TestID — setiap elemen interaktif punya `testID` (kecuali trivial)

## Konteks Kritis
- `expo-modules-core@3.0.30` broken untuk Android native build — **gunakan Expo Go** (`yarn android`)
- Apollo Client v4: `useMutation` dari `@apollo/client/react`, `onCompleted` data bertipe `unknown`
- `expo-keep-awake@15.0.8` canary — Metro mock via `metro.config.js` + `mock.js`
- Semua layar berfungsi penuh secara UI tanpa server; data mock di `src/utils/mock.ts`
- Jangan commit tanpa diminta. Jangan buat file README/docs baru tanpa diminta.

## Referensi Dokumen
- **Blueprint**: `internal/docs/blueprint.md`
- **PRD**: `internal/docs/prd.md`
- **Workflow Detail**: `internal/docs/workflow.md`
- **Quality Gates Detail**: `internal/docs/quality-gates.md`
- **Coding Standard**: `internal/docs/coding-standard.md`
- **Architecture**: `internal/docs/architecture.md`
- **Database Schema**: `internal/docs/database.md`
- **API Spec**: `internal/docs/api.md`
- **Testing Detail**: `internal/docs/testing.md`
- **App Health Utility**: `src/utils/appHealth.ts`
