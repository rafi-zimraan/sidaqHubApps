# Deployment — SidaqHub

## Current State
Saat ini **tanpa backend** — semua data mock. Belum ada deployment ke production.

## Build Android APK
```bash
# Preview APK (internal distribution)
npx eas-cli build --platform android --profile preview

# Production APK (Play Store)
npx eas-cli build --platform android --profile production
```

## EAS Build Profiles (`eas.json`)
```json
{
  "preview": {
    "android": { "buildType": "apk" },
    "distribution": "internal"
  },
  "production": {
    "android": { "buildType": "apk" },
    "autoIncrementVersion": true
  }
}
```

## App Configuration (`app.json`)
- Application ID: `com.sidaqhub.app`
- New Architecture: enabled
- Splash Screen: custom image

## Future Deployment Plan
1. **Backend**: Supabase / Custom GraphQL API
2. **Mobile**: Google Play Store
3. **CI/CD**: GitHub Actions + EAS Build
4. **Monitoring**: Sentry for crash reporting
5. **Updates**: EAS Update for OTA updates
