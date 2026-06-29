# Quality Assurance — SidaqHub

## QA Strategy

### Test Levels
1. **Unit Tests** — Fungsi utility, helpers, formatters
2. **Component Tests** — Render & interaction
3. **Integration Tests** — Screen flow & navigation
4. **Manual QA** — Exploratory testing on device

### Test Coverage Goals
| Area | Target |
|------|--------|
| Utility functions | 90%+ |
| Context/state | 80%+ |
| UI Components | 70%+ |
| Screens | 60%+ |
| Critical paths | 100% |

## Manual QA Checklist

### Auth Flow
- [ ] Register flow: semua step validasi
- [ ] Login: email valid, password benar
- [ ] Login: email tanpa @ → error
- [ ] Register: password < 8 chars → error
- [ ] Onboarding: semua step bisa dilalui
- [ ] Logout → redirect ke login

### Profile
- [ ] Profil menampilkan data user
- [ ] Edit profil: simpan perubahan
- [ ] Edit profil: validasi field wajib
- [ ] Foto profil: picker & upload

### Navigation
- [ ] Tab navigasi berfungsi
- [ ] Back button berfungsi
- [ ] Modal screens (create post, create halaqah)
- [ ] Deep linking

### Edge Cases
- [ ] Keyboard not遮蔽 form fields (KeyboardAvoidingView)
- [ ] Scroll behavior pada form panjang
- [ ] Loading states (ActivityIndicator)
- [ ] Error states (Alert)
- [ ] Empty states

## Bug Reporting
```markdown
## Bug Report
**Device**: Pixel 5 / Android 15
**Screen**: Register
**Steps**:
1. Buka app
2. Tap register
3. Isi form...
**Expected**: ...
**Actual**: ...
**Screenshot**: ...
```
