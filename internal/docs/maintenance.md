# Maintenance — SidaqHub

## Routine Tasks

### Weekly
- [ ] Review error logs (jika ada backend)
- [ ] Check dependency vulnerabilities (`yarn audit`)
- [ ] Review PR yang pending

### Monthly
- [ ] Update dependencies (`yarn upgrade-interactive`)
- [ ] Performance review (bundle size, startup time)
- [ ] Backup data (jika ada backend)
- [ ] Review user feedback & ratings

### Quarterly
- [ ] Major dependency upgrades (Expo SDK, React Native)
- [ ] Security audit
- [ ] Accessibility audit
- [ ] Code health review (tech debt)

## Dependency Updates
```bash
# Check outdated packages
yarn outdated

# Interactive upgrade
yarn upgrade-interactive --latest

# Audit security
yarn audit
```

## Known Maintenance Items
1. **Expo SDK updates** — Perlu tes kompatibilitas setiap major update
2. **Apollo Client** — v4 API masih berkembang, perlu monitor changelog
3. **React Native** — New Architecture mungkin perlu penyesuaian
4. **Mock data** — Perlu update saat real backend terintegrasi

## Deprecation Policy
- Feature deprecation diumumkan 1 versi sebelumnya
- Migration guide disediakan
- Backward compatibility dijaga minimal 2 versi
