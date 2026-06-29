# Release Process — SidaqHub

## Versioning
Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Release Checklist

### 1. Preparation
- [ ] Semua feature PR sudah merge ke `develop`
- [ ] TypeScript: `npx tsc --noEmit` ✅
- [ ] Lint: `yarn lint` ✅
- [ ] Test: `yarn test` ✅
- [ ] Manual QA: semua critical path berfungsi

### 2. Build
```bash
# Update version di app.json
npx eas-cli build --platform android --profile production
```

### 3. Testing Build
- [ ] Install APK di device fisik
- [ ] Test: register → login → profile → logout
- [ ] Test: error handling
- [ ] Test: performance

### 4. Release
- [ ] Git tag: `git tag v1.0.0`
- [ ] Push tag: `git push origin v1.0.0`
- [ ] Upload ke Play Store Console (future)
- [ ] Update changelog

### 5. Post-Release
- [ ] Monitor crash reports
- [ ] Monitor user feedback
- [ ] Hotfix jika diperlukan
