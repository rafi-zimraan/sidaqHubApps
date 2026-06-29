# Architecture — SidaqHub

## Overview
SidaqHub menggunakan arsitektur **layered architecture** dengan pemisahan concern yang jelas:

```
┌─────────────────────────────────────┐
│            UI Layer (Screens)       │
│  app/  — Expo Router screens       │
├─────────────────────────────────────┤
│        State / Context Layer        │
│  src/context/ — AuthContext         │
├─────────────────────────────────────┤
│         Data / API Layer            │
│  src/utils/api.ts  — API wrapper   │
│  src/utils/mock.ts — Mock data     │
│  src/graphql/      — GQL queries   │
├─────────────────────────────────────┤
│         Service / Util Layer        │
│  src/constants/theme.ts            │
│  src/utils/storage/                │
└─────────────────────────────────────┘
```

## Data Flow
```
Screen → apiGet/apiPost (src/utils/api.ts)
          ↓ delay 250ms
       resolveGet/resolveMutation (src/utils/mock.ts)
          ↓
       Data dummy (POSTS, USERS, HALAQAHS)
```

## Routing Architecture
Expo Router v6 — file-based routing:
- `app/` — semua route berdasarkan struktur file
- `app/(auth)/` — auth screens (stack navigator)
- `app/(tabs)/` — tab screens (bottom tab navigator)
- Dynamic routes: `post/[id]`, `user/[id]`, `halaqah/[id]`

## Component Architecture
- Screens: composable dari small components
- Shared components: inline dalam screen
- No global component library (future: design-system)
