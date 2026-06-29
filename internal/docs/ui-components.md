# UI Components — SidaqHub

## Shared Components

### Avatar
```tsx
<Avatar name="Ahmad Fauzi" size={88} />
```
- Props: name, size (default 88), photoUrl (future)
- Fallback: Initials dari name

### JuzGrid
```tsx
<JuzGrid total={15} />
```
- Props: total (0-30)
- Warna: Hafal (primary), Sedang (gold), Belum (border)

### CircleProgress
```tsx
<CircleProgress value={15} size={72} />
```
- Props: value, size
- Lingkaran dengan nilai di tengah

### CertCard
```tsx
<CertCard title="Sanad Quran" org="LTN" year="2023" color="#1A5C6B" />
```

### ExpItem
```tsx
<ExpItem role="Pengajar" place="Pesantren" period="2022-2024" />
```

### AnimSection
```tsx
<AnimSection delay={60}>
  <View>...</View>
</AnimSection>
```
- Fade in + slide up animation

## Screen-Specific Components
- **Profile**: Avatar, JuzGrid, CircleProgress, CertCard, ExpItem
- **Feed**: PostCard (future)
- **Community**: HalaqahCard (future)
