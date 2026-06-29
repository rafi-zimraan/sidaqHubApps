# Contributing — SidaqHub

## Getting Started
```bash
git clone https://github.com/anomalyco/sidaqhub-apps.git
cd sidaqhub-apps
yarn install
yarn start
```

## Before Contributing
1. Baca dokumentasi di `internal/docs/`
2. Pahami arsitektur dan data flow
3. Cek project board untuk tugas yang available

## Pull Request Process
1. Fork repo (external) atau buat branch (internal)
2. Implementasi fitur/fix dengan test
3. Pastikan TypeScript lulus (`npx tsc --noEmit`)
4. Pastikan lint lulus (`yarn lint`)
5. Pastikan test lulus (`yarn test`)
6. Buat PR ke branch `develop`
7. Tunggu review minimal 1 maintainer

## Code Review Checklist
- [ ] TypeScript type safety
- [ ] Error handling (try-catch untuk async)
- [ ] Tidak ada hardcoded values (gunakan theme)
- [ ] Path alias (@/src/) bukan relative path
- [ ] Tidak ada console.log (kecuali debug)
- [ ] Props & state handling benar
- [ ] Performance (useCallback, useMemo jika perlu)

## Commit Convention
```
feat(scope): description
fix(scope): description
refactor(scope): description
chore(scope): description
docs(scope): description
```

## Testing
- Unit test untuk utility functions
- Component test untuk UI components
- Integration test untuk screen flows
