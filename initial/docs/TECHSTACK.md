# TECHSTACK — Technology Stack & Configuration

## SidaqHub Application

### 1. Core Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Expo** | ~54.0.35 | Framework React Native |
| **React Native** | 0.81.5 | Mobile runtime |
| **React** | 19.1.0 | UI library |
| **TypeScript** | ~5.9.3 | Type safety |
| **Expo Router** | ~6.0.24 | File-based routing |
| **Node.js** | 18+ | Runtime |

### 2. Navigation

| Package | Version | Purpose |
|---------|---------|---------|
| expo-router | ~6.0.24 | Root navigation (file-based) |
| @react-navigation/native | ^7.1.8 | Navigation core |
| @react-navigation/bottom-tabs | ^7.4.0 | Bottom tab navigator |
| @react-navigation/native-stack | ^7.3.16 | Stack navigator |
| @react-navigation/elements | 2.3.8 | Shared navigation elements |
| react-native-screens | ~4.16.0 | Native screen containers |
| react-native-safe-area-context | ~5.6.0 | Safe area insets |
| react-native-gesture-handler | ~2.28.0 | Gesture handling |

### 3. UI & Styling

| Package | Version | Purpose |
|---------|---------|---------|
| @expo/vector-icons | 15.0.3 | Icon library (Ionicons) |
| expo-linear-gradient | ~15.0.8 | Gradient backgrounds |
| expo-blur | ~15.0.8 | Blur effects |
| expo-symbols | ~1.0.8 | SF Symbols (iOS) |

**Font:**
- `@expo-google-fonts/poppins` — Poppins 400/500/600/700 (UI text)
- `@expo-google-fonts/amiri` — Amiri 400 (Arabic text)

### 4. Media & Input

| Package | Version | Purpose |
|---------|---------|---------|
| expo-image-picker | ~17.0.11 | Pick avatar from gallery |
| expo-image | ~3.0.11 | Optimized image component |
| expo-haptics | ~15.0.8 | Haptic feedback |

### 5. Storage & Data

| Package | Version | Purpose |
|---------|---------|---------|
| @react-native-async-storage/async-storage | 2.2.0 | Local storage |
| expo-secure-store | ~15.0.8 | Secure credential storage |
| date-fns | 4.1.0 | Date utilities |
| dayjs | 1.11.13 | Date formatting |
| react-native-dotenv | 3.4.11 | Environment variables |

### 6. Platform Support

| Platform | Method |
|----------|--------|
| **Android** | `yarn android` or EAS Build → APK |
| **iOS** | `yarn ios` (requires Mac + Xcode) |
| **Web** | `yarn web` (via react-native-web ~0.21.0) |

### 7. Build & CI

| Tool | Config | Purpose |
|------|--------|---------|
| **EAS Build** | `eas.json` | Build APK for distribution |
| **ESLint** | `eslint.config.js` | Linting (eslint-config-expo) |
| **Metro** | `metro.config.js` | JS bundler |

**Build Profiles (eas.json):**
- `preview` → APK internal distribution (development)
- `production` → APK production (auto-increment version)

### 8. App Configuration

| Config | Value |
|--------|-------|
| Application ID | `com.sidaqhub.app` |
| Version | `1.0.0` |
| New Architecture | `newArchEnabled: true` |
| Package Manager | `yarn@1.22.22` |
| Path Alias | `@/` → `./` (root) |

### 9. Dependencies File (`package.json`)

**Production dependencies:** ~30 packages
**Dev dependencies:** `@types/react`, `eslint`, `eslint-config-expo`, `typescript`

### 10. Testing Stack (Planned)

| Package | Purpose |
|---------|---------|
| Jest | Test runner (included with Expo) |
| @testing-library/react-native | Component rendering & interaction |
| @testing-library/react-hooks | Hook testing |
