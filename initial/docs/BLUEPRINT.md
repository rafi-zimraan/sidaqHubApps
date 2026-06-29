# BLUEPRINT — Arsitektur Aplikasi

## SidaqHub — Struktur & Alur Data

### 1. Struktur Folder

```
sidaqHubApps/
├── app/                          # Expo Router (file-based routing)
│   ├── _layout.tsx               # Root: font loading, AuthProvider, Stack navigator
│   ├── index.tsx                 # Gate: redirect berdasarkan auth state
│   ├── +html.tsx                 # Root HTML (web)
│   ├── (auth)/                   # Auth stack (no tab bar)
│   │   ├── _layout.tsx           # Stack navigator untuk auth
│   │   ├── auth.tsx              # Auto-login handler (mock)
│   │   ├── login.tsx             # Login screen
│   │   ├── register.tsx          # Register screen
│   │   └── onboarding.tsx        # 3-step onboarding
│   ├── (tabs)/                   # Bottom tab navigator
│   │   ├── _layout.tsx           # Tabs + FAB composer
│   │   ├── home.tsx              # Feed utama
│   │   ├── network.tsx           # Jejaring
│   │   ├── community.tsx         # Komunitas & Halaqah
│   │   ├── notifications.tsx     # Notifikasi (hidden from tab bar)
│   │   └── profile.tsx           # Profil sendiri
│   ├── post/
│   │   ├── [id].tsx              # Detail postingan + komentar
│   │   └── create.tsx            # Buat postingan (modal)
│   ├── halaqah/
│   │   ├── [id].tsx              # Detail halaqah
│   │   └── create.tsx            # Buat halaqah (modal)
│   ├── user/[id].tsx             # Profil user lain
│   └── edit-profile.tsx          # Edit profil (modal)
├── src/
│   ├── constants/
│   │   ├── theme.ts              # COLORS, FONTS, SPACING, RADIUS + helpers
│   │   └── testIds/              # testID constants
│   ├── context/
│   │   └── AuthContext.tsx       # Auth state (user, token, login, logout, updateUser)
│   ├── hooks/
│   │   └── use-icon-fonts.ts     # Icon font loading hook
│   └── utils/
│       ├── api.ts                # API wrapper (delay 250ms)
│       ├── mock.ts               # ** Satu-satunya sumber data **
│       └── storage/              # AsyncStorage + SecureStore wrapper
├── assets/                       # Images, icons, splash
├── docs/screenshots/             # App screenshots
├── scripts/                      # Build scripts
├── initial/docs/                 # Project documentation
├── eas.json                      # EAS Build config
├── app.json                      # Expo config
├── tsconfig.json                 # TypeScript config (path alias @/ → ./*)
└── package.json                  # Dependencies
```

### 2. Alur Data

```
User Interaction (tap/scroll/pull)
        │
        ▼
Screen Component (app/*.tsx)
        │
        ▼
src/utils/api.ts
  ├── apiGet(path)     → delay(250ms) → resolveGet(path)
  ├── apiPost(path)    → delay(250ms) → resolveMutation('POST', path, body)
  ├── apiPut(path)     → delay(250ms) → resolveMutation('PUT', path, body)
  └── apiDelete(path)  → delay(250ms) → resolveMutation('DELETE', path)
        │
        ▼
src/utils/mock.ts
  ├── resolveGet(path) → switch/case + regex → return data dari array lokal
  └── resolveMutation(method, path, body) → mutate + return
        │
        ▼
Screen State (useState) → Re-render UI
```

### 3. Routing Graph

```
index.tsx (Gate)
  ├── !user → /(auth)/login
  ├── !profile_completed → /(auth)/onboarding
  └── → /(tabs)/home

(auth) Stack
  ├── login → register → onboarding → home
  └── auth (auto-login handler)

(tabs) Tab Bar
  ├── home → post/create (modal)
  │         → post/[id] → user/[id]
  │         → notifications
  ├── network → user/[id]
  ├── community → halaqah/create (modal)
  │               → halaqah/[id]
  ├── notifications
  └── profile → edit-profile (modal)
               → logout → /(auth)/login
```

### 4. Component Pattern

Setiap screen umumnya terdiri dari:
1. **Data loading** — `useEffect + apiGet` di mount
2. **State management** — `useState` local (no global store)
3. **Sub-components** — Defined inline in same file (no separate file per component)
4. **Animations** — `Animated.View` + `useFocusEffect` untuk fade-in
5. **Refresh** — `RefreshControl` di FlatList/ScrollView
6. **Error handling** — `try/catch` with `console.error` (no user-facing error UI)

### 5. Data Entities (Mock)

| Entity | Key Fields | Source Array |
|--------|-----------|-------------|
| User | user_id, name, role, juz_count, city, bio, interests | USERS |
| Post | post_id, type (ayat/text/tilawah), content, user, hashtags, reactions_count | POSTS |
| Comment | comment_id, content, user, created_at | COMMENTS |
| Story | user, has_unviewed | STORIES |
| Community | community_id, name, description, members_count, is_member | COMMUNITIES |
| Halaqah | halaqah_id, title, platform, max_slots, registered_count, schedule | HALAQAHS |
| Notification | notification_id, type, message, is_read | NOTIFICATIONS |
