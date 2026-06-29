# SEO — SidaqHub

## Platform
SidaqHub adalah mobile app (React Native), bukan website. SEO berlaku untuk:
1. **Web export** — `npx expo export --platform web`
2. **App Store** — Google Play Store listing
3. **Landing page** — Future marketing site

## Mobile App SEO (ASO)
### App Name
SidaqHub — Jejaring Huffadz Indonesia

### Keywords
huffadz, tahfidz, Al-Quran, hafalan, santri, ustadz, ngaji, Islam, Quran, tadarus

### Description (Play Store)
"SidaqHub adalah aplikasi jejaring sosial khusus untuk komunitas Huffadz (penghafal Al-Quran) di Indonesia. Fitur: feed postingan, halaqah online/offline, badge Juz, dan jaringan sesama penghafal."

## Web Export Meta
```tsx
// app/_layout.tsx
<Head>
  <title>SidaqHub — Jejaring Huffadz Indonesia</title>
  <meta name="description" content="Aplikasi jejaring sosial untuk komunitas Huffadz Indonesia" />
  <meta property="og:title" content="SidaqHub" />
  <meta property="og:description" content="Jejaring sosial penghafal Al-Quran" />
</Head>
```
