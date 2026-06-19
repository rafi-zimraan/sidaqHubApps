# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tentang Aplikasi

**SidaqHub** adalah aplikasi mobile jejaring sosial untuk komunitas Huffadz (penghafal Al-Quran) Indonesia. Fitur utama: feed postingan (ayat/teks/tilawah), halaqah online/offline, jejaring sesama penghafal, notifikasi, dan sistem badge Juz.

**Status saat ini: tanpa backend.** Seluruh data bersumber dari `src/utils/mock.ts`. Semua layar sudah berfungsi penuh secara UI tanpa server.

## Commands

```bash
# Jalankan dev server
yarn start          # atau: npx expo start

# Target platform tertentu
yarn android        # buka di Android emulator/perangkat
yarn ios            # buka di iOS Simulator
yarn web            # buka di browser

# Lint
yarn lint           # expo lint (eslint-config-expo)

# Build APK Android (via EAS)
npx eas-cli build --platform android --profile preview   # APK internal
npx eas-cli build --platform android --profile production
```

> Gunakan **yarn**, bukan npm — project menggunakan `packageManager: yarn@1.22.22`.

## Arsitektur

### Routing (Expo Router v6 — file-based)

```
app/
├── index.tsx              # Gate: cek auth → redirect ke (auth) atau (tabs)
├── _layout.tsx            # Root layout: load font, bungkus AuthProvider
├── (auth)/                # Stack: login → register → onboarding
│   ├── auth.tsx           # Handler auto-login (mock)
│   ├── login.tsx
│   ├── register.tsx
│   └── onboarding.tsx     # 3-step onboarding setelah register
├── (tabs)/                # Bottom tab navigator (5 tab)
│   ├── home.tsx           # Feed utama + stories + FAB composer
│   ├── network.tsx        # Koneksi & saran follow
│   ├── community.tsx      # Komunitas & halaqah
│   ├── notifications.tsx  # Notifikasi (hidden dari tab bar)
│   └── profile.tsx        # Profil sendiri
├── post/[id].tsx          # Detail postingan + komentar
├── post/create.tsx        # Buat postingan (modal)
├── halaqah/[id].tsx       # Detail halaqah
├── halaqah/create.tsx     # Buat halaqah (modal)
├── user/[id].tsx          # Profil pengguna lain
└── edit-profile.tsx       # Edit profil (modal)
```

Alur auth: `index.tsx` membaca `useAuth()` → jika tidak ada user redirect ke `/(auth)/login`, jika `profile_completed === false` redirect ke `/(auth)/onboarding`, jika sudah masuk redirect ke `/(tabs)/home`.

### Layer Data (Mock)

Karena belum ada backend, data mengalir seperti ini:

```
Screen → apiGet/apiPost/apiPut/apiDelete (src/utils/api.ts)
           ↓ delay 250ms (agar loading state terlihat)
        resolveGet / resolveMutation (src/utils/mock.ts)
           ↓
        Data dummy lokal (POSTS, USERS, HALAQAHS, dll.)
```

- **`src/utils/api.ts`** — hanya wrapper tipis dengan delay artifisial. Tanda tangan (`apiGet`, `apiPost`, `apiPut`, `apiDelete`) sengaja dibuat mirip REST client agar mudah diganti implementasi nyata nantinya.
- **`src/utils/mock.ts`** — satu-satunya sumber kebenaran data. Edit di sini untuk mengubah tampilan tanpa menyentuh layar.

### Auth (Context)

`src/context/AuthContext.tsx` — auto-login dengan `CURRENT_USER` dari `mock.ts`. Tidak ada persistensi ke storage; setiap reload app kembali ke user dummy. Ekspor: `AuthProvider`, `useAuth`, dan tipe `User`.

### Tema & Konstanta

`src/constants/theme.ts` — satu-satunya sumber untuk styling:
- `COLORS` — palet warna (primary `#1A5C6B`, gold `#B8860B`, dll.)
- `FONTS` — nama font Poppins (UI) dan Amiri (teks Arab)
- `SPACING` / `RADIUS` — nilai spacing dan border radius
- Helper functions: `getJuzBadge()`, `formatTime()`, `formatSchedule()`, `getRoleLabel()`

### Path Alias

`tsconfig.json` memetakan `@/*` → `./*` (root). Gunakan `@/src/` untuk mengimpor dari `src/`:

```ts
import { useAuth } from '@/src/context/AuthContext';
import { COLORS, FONTS } from '@/src/constants/theme';
import { apiGet } from '@/src/utils/api';
```

Jangan gunakan path relatif seperti `../../context/...` dari dalam `app/`.

### Font

Dua keluarga font dimuat di `app/_layout.tsx`:
- **Poppins** (400/500/600/700) — untuk semua teks UI
- **Amiri** (400) — untuk teks Arab (ayat Al-Quran)

Splash screen tidak memblokir render — font di-swap setelah siap agar app tidak hang jika CDN Google Fonts lambat.

### Storage Utility

`src/utils/storage/` — wrapper AsyncStorage + SecureStore yang tidak pernah throw. Gunakan untuk persistensi data non-auth. Saat ini belum dipakai oleh layar mana pun (belum ada backend), tapi tersedia.

### Build

EAS Build dikonfigurasi di `eas.json`:
- **`preview`** → APK Android untuk distribusi internal
- **`production`** → APK Android dengan auto-increment versi
- Application ID: `com.sidaqhub.app`
- New Architecture (`newArchEnabled: true`) sudah aktif
