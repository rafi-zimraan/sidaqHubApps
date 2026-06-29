# Quality Gates — SidaqHub

**Wajib dicek SEBELUM commit atau merge.** Setiap gate harus lulus.

---

## Gate 1: TypeScript (`npx tsc --noEmit`)
```bash
npx tsc --noEmit
```
- ✅ Nol type errors
- ❌ Jika ada error: perbaiki semua, jangan gunakan `// @ts-ignore` atau `as any` tanpa alasan kuat
- ❌ Jangan ubah `strict: true` di `tsconfig.json`

## Gate 2: Lint (`yarn lint`)
```bash
yarn lint
```
- ✅ Nol lint errors
- ❌ Jika ada error: perbaiki sesuai aturan ESLint
- ❌ Jangan nonaktifkan rule ESLint tanpa diskusi tim

## Gate 3: Unit Test (`yarn test`)
```bash
yarn test
```
- ✅ Semua test pass (minimum 116 tests)
- ✅ Coverage: jangan turun signifikan dari baseline
- ❌ Jika ada test fail: perbaiki kode atau update test

## Gate 4: Manual QA
- [ ] App bisa dijalankan (`yarn android` atau `yarn start`)
- [ ] Tidak ada crash saat navigasi normal
- [ ] Form validation berfungsi (required fields, format check)
- [ ] Error handling: error state muncul dengan pesan yang jelas
- [ ] Keyboard tidak menutup input (KeyboardAvoidingView)
- [ ] ScrollView/FlatList berfungsi normal
- [ ] Back navigation kembali ke screen yang benar
- [ ] Loading state muncul untuk async operations

## Gate 5: App Health Scan
```
Buka app → Profile → tombol ❤️ (health scan) → tap "Mulai Scan"
```
- [ ] Skor ≥ 70
- [ ] Tidak ada issues severity **critical**
- [ ] Semua issues severity **warning** sudah diperbaiki atau didokumentasikan
- [ ] Minimal 50% issues severity **optimization** sudah diperbaiki

Atau via utility:
```bash
# Jalankan test health check
npx jest __tests__/utils/appHealth.test.ts
```

## Gate 6: Error Handling
- [ ] Setiap async function (useMutation, apiGet, apiPost, dll.) punya try-catch atau .catch()
- [ ] Setiap error ditampilkan ke user (Alert, toast, atau UI feedback)
- [ ] Tidak ada `console.log` di production code (kecuali debug yang ditandai)
- [ ] Network error handling: timeout, offline state

## Gate 7: TestID
- [ ] Setiap TouchableOpacity punya `testID` (kecuali trivial/Icon-only tanpa interaksi)
- [ ] Setiap TextInput punya `testID`
- [ ] `testID` bersifat unik dalam satu screen
- [ ] Format: `{screen}-{element}-{action}` (contoh: `login-email-input`, `register-submit-button`)

## Gate 8: Code Quality
- [ ] Gunakan `@/src/` path alias, bukan relative path
- [ ] Tidak ada `any` type (kecuali mock data yang belum direfactor)
- [ ] Styles menggunakan `StyleSheet.create()`, bukan inline styles
- [ ] Import terurut: react → expo → library → internal
- [ ] Tidak ada file/folder yang tidak digunakan (dead code)

---

## Ringkasan Cepat (untuk commit message)

```markdown
## Quality Gates
- [x] TypeScript: ✅
- [x] Lint: ✅
- [x] Test: ✅ (116 passed)
- [x] Manual QA: ✅
- [x] App Health: ✅ (score: X)
- [x] Error Handling: ✅
- [x] TestID: ✅
- [x] Code Quality: ✅
```
