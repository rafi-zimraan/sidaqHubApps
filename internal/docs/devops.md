# DevOps — SidaqHub

## CI/CD Pipeline (Future)

### GitHub Actions Workflow
```yaml
name: Build & Deploy
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: yarn install
      - run: yarn lint
      - run: yarn test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
      - run: npx eas-cli build --platform android
```

### Branch Strategy
- `main` — Production
- `develop` — Staging
- `feature/*` — Feature branches
- `fix/*` — Bug fixes
- `release/*` — Release preparation

### Versioning
- SemVer (Major.Minor.Patch)
- Automatically incremented by EAS
- Changelog updated per release

### Infrastructure (Future)
- **Hosting**: Vercel / Railway (backend)
- **Database**: Supabase / Neon
- **CDN**: Cloudflare (assets)
- **CI**: GitHub Actions
