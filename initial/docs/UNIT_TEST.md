# UNIT TEST — Strategi Testing & Setup

## SidaqHub Application

### 1. Testing Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **Jest** | ~54+ (built-in Expo) | Test runner, assertions, mocking |
| **@testing-library/react-native** | latest | Render React Native components, fire events, query output |
| **@testing-library/react-hooks** | latest | Test custom hooks in isolation |

### 2. Setup

```bash
npx expo install jest-expo @testing-library/react-native @testing-library/react-hooks
```

**jest.config.js** (di root):
```js
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
};
```

**Folder structure:**
```
__tests__/
├── utils/
│   ├── api.test.ts
│   ├── mock.test.ts
│   └── theme.test.ts
├── context/
│   └── AuthContext.test.tsx
└── screens/
    ├── login.test.tsx
    ├── home.test.tsx
    └── profile.test.tsx
```

### 3. Coverage Target

| Layer | Target Coverage |
|-------|----------------|
| `src/utils/*` — utility functions | **≥90%** |
| `src/constants/theme.ts` — pure functions | **100%** |
| `src/context/AuthContext.tsx` — auth flow | **≥85%** |
| Screens (app/*.tsx) — render & interaction | **≥60%** |

### 4. Test Spec Plan

#### 4.1 Unit Tests — Pure Functions

**`theme.test.ts` — formatTime()**
- ✅ Input: ISO string 5 menit lalu → output: "5 menit lalu"
- ✅ Input: ISO string 2 jam lalu → output: "2 jam lalu"
- ✅ Input: ISO string 3 hari lalu → output: "3 hari lalu"
- ✅ Input: ISO string >7 hari → output: format date "17 Mar"
- ✅ Input: invalid date → output: ""
- ✅ Edge: "Baru saja" untuk <1 menit

**`theme.test.ts` — getJuzBadge()**
- ✅ Input: 0 → label: "", bg: transparent
- ✅ Input: 5 → label: "5 Juz" (no emoji), bg: #aaa
- ✅ Input: 15 → label with 🥇
- ✅ Input: 30 → label with 👑

**`theme.test.ts` — formatSchedule()**
- ✅ Input: valid date → output: "Senin, 15 Maret 2026 20.00"
- ✅ Input: invalid → output: "Jadwal belum ditentukan"

**`theme.test.ts` — getRoleLabel()**
- ✅ Input: "santri", "ustadz", "huffadz", "komunitas"
- ✅ Input: unknown → return same string

#### 4.2 Unit Tests — Mock Data

**`mock.test.ts`**
- ✅ `resolveGet('/api/posts/feed')` → array of posts
- ✅ `resolveGet('/api/posts/p1')` → post with matching post_id
- ✅ `resolveGet('/api/posts/nonexistent')` → first post (fallback)
- ✅ `resolveGet('/api/unknown/path')` → []
- ✅ `resolveMutation('PUT', '/api/users/me', { bio: 'test' })` → merged user
- ✅ `resolveMutation('POST', '/api/posts/p1/comments', { content: 'test' })` → comment with generated id

#### 4.3 Auth Context

**`AuthContext.test.tsx`**
- ✅ Initial state: user = CURRENT_USER, token = MOCK_TOKEN
- ✅ login() → sets user & token
- ✅ logout() → clears user & token
- ✅ updateUser({ name: 'Baru' }) → merges update
- ✅ Provider wraps children correctly

#### 4.4 Screen Tests (Render)

**`login.test.tsx`**
- ✅ Renders header: bismillah, app name, subtitle
- ✅ Renders email & password input fields
- ✅ Login button disabled saat fields kosong
- ✅ Toggle password visibility
- ✅ Tap "Daftar sekarang" → navigates to register
- ✅ Login success → calls auth.login & replaces to home

**`home.test.tsx`**
- ✅ Renders top bar with brand
- ✅ Renders stories section
- ✅ Renders composer with placeholder text
- ✅ Renders post cards from mock data
- ✅ Filter tabs toggle
- ✅ Aamiin reaction toggles state
- ✅ Pull to refresh trigger

**`profile.test.tsx`**
- ✅ Renders cover gradient
- ✅ Renders user name & bio
- ✅ Renders JuzGrid with correct cells
- ✅ Edit Profil button renders
- ✅ Logout button → shows alert

### 5. Mock Strategy

```ts
// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useFocusEffect: jest.fn(),
  Redirect: 'Redirect',
  Stack: { Screen: 'Screen' },
  Tabs: 'Tabs',
  Tabs: { Screen: 'Screen' },
}));

// Mock API
jest.mock('@/src/utils/api', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiPut: jest.fn(),
  apiDelete: jest.fn(),
}));
```

### 6. Running Tests

```bash
# Run all tests
npx jest

# Run with coverage
npx jest --coverage

# Watch mode
npx jest --watch

# Run specific test file
npx jest __tests__/utils/theme.test.ts
```

### 7. CI Integration (Future)

```yaml
# GitHub Actions (conceptual)
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: yarn install
      - run: npx jest --coverage
```
