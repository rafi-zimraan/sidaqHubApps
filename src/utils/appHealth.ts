import { GRAPHQL_URL } from '@/src/graphql/config';

export interface HealthIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info' | 'optimization';
  category: string;
  title: string;
  description: string;
  recommendation: string;
  effort: 'easy' | 'medium' | 'hard';
}

export interface HealthReport {
  timestamp: string;
  score: number;
  totalIssues: number;
  criticalCount: number;
  warningCount: number;
  optimizationCount: number;
  infoCount: number;
  issues: HealthIssue[];
  summary: string;
  verdict: string;
}

function checkDependencies(): HealthIssue[] {
  const issues: HealthIssue[] = [];

  issues.push({
    id: 'dep-1',
    severity: 'info',
    category: 'Dependencies',
    title: 'Apollo Client v4 Aktif',
    description: 'Menggunakan @apollo/client versi 4 dengan codegen siap. Sudah sesuai best practice GraphQL.',
    recommendation: 'Pastikan gunakan codegen untuk type-safe queries & mutations.',
    effort: 'medium',
  });

  issues.push({
    id: 'dep-2',
    severity: 'optimization',
    category: 'Dependencies',
    title: 'Bundle Size: @expo/vector-icons',
    description: 'Import seluruh ikon dari @expo/vector-icons menambah bundle size.',
    recommendation: 'Gunakan import spesifik: import { Ionicons } from "@expo/vector-icons/Ionicons" untuk mengurangi bundle size ~200KB.',
    effort: 'easy',
  });

  issues.push({
    id: 'dep-3',
    severity: 'optimization',
    category: 'Dependencies',
    title: 'Dual date library (date-fns + dayjs)',
    description: 'Terdapat 2 library date: date-fns (4.1.0) dan dayjs (1.11.13).',
    recommendation: 'Hapus salah satu untuk mengurangi bundle size. dayjs lebih ringan (~2KB gzipped) dibanding date-fns (~70KB).',
    effort: 'easy',
  });

  issues.push({
    id: 'dep-4',
    severity: 'warning',
    category: 'Dependencies',
    title: 'RxJS Dependency',
    description: 'rxjs terinstall sebagai dependency. Hanya dibutuhkan jika ada observable streams.',
    recommendation: 'Jika tidak menggunakan observables, hapus rxjs untuk mengurangi bundle size.',
    effort: 'easy',
  });

  return issues;
}

function checkConfig(): HealthIssue[] {
  const issues: HealthIssue[] = [];

  issues.push({
    id: 'cfg-1',
    severity: 'warning',
    category: 'Configuration',
    title: 'GraphQL URL Pintasan',
    description: `GraphQL endpoint diarahkan ke ${GRAPHQL_URL}. Belum ada backend production.`,
    recommendation: 'Pastikan EXPO_PUBLIC_GRAPHQL_URL di .env sudah mengarah ke server production sebelum rilis.',
    effort: 'easy',
  });

  issues.push({
    id: 'cfg-2',
    severity: 'info',
    category: 'Configuration',
    title: 'New Architecture Aktif',
    description: 'React Native New Architecture (Fabric/TurboModules) sudah aktif di app.json.',
    recommendation: 'Pantau kompatibilitas library pihak ketiga. Beberapa library mungkin belum mendukung New Architecture.',
    effort: 'medium',
  });

  issues.push({
    id: 'cfg-3',
    severity: 'optimization',
    category: 'Configuration',
    title: 'Hermes Engine',
    description: 'Hermes sudah diaktifkan untuk performa JavaScript yang lebih baik.',
    recommendation: 'Pastikan testing menyeluruh karena Hermes punya perilaku berbeda dengan JSC untuk某些 feature.',
    effort: 'easy',
  });

  issues.push({
    id: 'cfg-4',
    severity: 'optimization',
    category: 'Configuration',
    title: 'Path Alias @/src/',
    description: 'Path alias @/src/ sudah dikonfigurasi di tsconfig.json.',
    recommendation: 'Gunakan @/src/ secara konsisten untuk semua import. Jangan gunakan relative path dari dalam app/.',
    effort: 'easy',
  });

  return issues;
}

function checkPerformance(): HealthIssue[] {
  const issues: HealthIssue[] = [];

  issues.push({
    id: 'perf-1',
    severity: 'optimization',
    category: 'Performance',
    title: 'Image Loading Tanpa Cache',
    description: 'Foto profil menggunakan Image biasa tanpa caching atau placeholder blur.',
    recommendation: 'Gunakan expo-image untuk progressive loading, caching, dan placeholder yang lebih baik.',
    effort: 'medium',
  });

  issues.push({
    id: 'perf-2',
    severity: 'optimization',
    category: 'Performance',
    title: 'FlatList vs ScrollView',
    description: 'Beberapa screen menggunakan ScrollView untuk daftar data. ScrollView me-render semua item sekaligus.',
    recommendation: 'Gunakan FlatList untuk daftar panjang (>20 item) agar memori lebih efisien dengan windowing.',
    effort: 'medium',
  });

  issues.push({
    id: 'perf-3',
    severity: 'warning',
    category: 'Performance',
    title: 'Mock Delay 250ms',
    description: 'Mock API menggunakan delay 250ms. Ini bagus untuk testing loading state.',
    recommendation: 'Pastikan delay dihapus atau dikurangi saat backend real terhubung untuk UX lebih responsif.',
    effort: 'easy',
  });

  issues.push({
    id: 'perf-4',
    severity: 'optimization',
    category: 'Performance',
    title: 'Animated API Usage',
    description: 'Profile screen menggunakan Animated API untuk fade-in. Ini sudah baik.',
    recommendation: 'Pertimbangkan useNativeDriver: true (sudah diterapkan) untuk animasi yang lebih smooth.',
    effort: 'easy',
  });

  issues.push({
    id: 'perf-5',
    severity: 'optimization',
    category: 'Performance',
    title: 'Font Loading: useCallback',
    description: 'Font dimuat di _layout.tsx tanpa memblokir render. Font-swap digunakan agar app tidak hang.',
    recommendation: 'Pertimbangkan skeleton screen atau loading fallback sementara font dimuat untuk UX yang lebih baik.',
    effort: 'medium',
  });

  return issues;
}

function checkCodeQuality(): HealthIssue[] {
  const issues: HealthIssue[] = [];

  issues.push({
    id: 'cq-1',
    severity: 'info',
    category: 'Code Quality',
    title: 'TypeScript Strict Mode',
    description: 'TypeScript dikonfigurasi dengan strict mode. Ini mencegah banyak bug runtime.',
    recommendation: 'Pastikan strict mode tetap aktif. Jangan turunkan ke non-strict tanpa alasan kuat.',
    effort: 'easy',
  });

  issues.push({
    id: 'cq-2',
    severity: 'optimization',
    category: 'Code Quality',
    title: 'Any Types di Mock Data',
    description: 'Data di mock.ts menggunakan type any. Ini mengurangi manfaat TypeScript.',
    recommendation: 'Buat interface untuk setiap data entity (Post, User, Comment, Halaqah). Hapus any types.',
    effort: 'medium',
  });

  issues.push({
    id: 'cq-3',
    severity: 'warning',
    category: 'Code Quality',
    title: 'Inline Styling di Components',
    description: 'Beberapa komponen (Avatar, JuzGrid) menggunakan inline styles. Ini membuat re-render tidak optimal.',
    recommendation: 'Pindahkan inline styles ke StyleSheet.create() untuk performa lebih baik dan kode lebih rapi.',
    effort: 'easy',
  });

  issues.push({
    id: 'cq-4',
    severity: 'info',
    category: 'Code Quality',
    title: 'Path Alias @/src/ Tersedia',
    description: 'Path alias @/src/ digunakan di semua import screen. Ini baik untuk maintainability.',
    recommendation: 'Pastikan semua import baru menggunakan @/src/, bukan relative path.',
    effort: 'easy',
  });

  return issues;
}

function checkSecurity(): HealthIssue[] {
  const issues: HealthIssue[] = [];

  issues.push({
    id: 'sec-1',
    severity: 'warning',
    category: 'Security',
    title: 'Environment Variables Belum Optimal',
    description: 'GraphQL URL menggunakan EXPO_PUBLIC_ variable. Pastikan tidak ada secret di client.',
    recommendation: 'Semua secret (API keys, tokens) harus di server. EXPO_PUBLIC_ hanya untuk public config.',
    effort: 'medium',
  });

  issues.push({
    id: 'sec-2',
    severity: 'info',
    category: 'Security',
    title: 'SecureStore Tersedia',
    description: 'expo-secure-store sudah terinstall untuk menyimpan data sensitif.',
    recommendation: 'Gunakan SecureStore untuk token auth, jangan AsyncStorage biasa.',
    effort: 'easy',
  });

  issues.push({
    id: 'sec-3',
    severity: 'info',
    category: 'Security',
    title: 'Mock Token',
    description: 'Saat ini menggunakan mock token. Token asli dari server akan lebih aman.',
    recommendation: 'Implementasikan refresh token rotation di backend untuk keamanan session.',
    effort: 'hard',
  });

  issues.push({
    id: 'sec-4',
    severity: 'warning',
    category: 'Security',
    title: 'Base64 Image Upload',
    description: 'Foto profil dikirim sebagai base64 string. Ini tidak efisien dan bermasalah untuk file besar.',
    recommendation: 'Gunakan direct upload ke cloud storage (S3/Cloudinary) dan kirim URL saja ke GraphQL.',
    effort: 'hard',
  });

  return issues;
}

function checkUserExperience(): HealthIssue[] {
  const issues: HealthIssue[] = [];

  issues.push({
    id: 'ux-1',
    severity: 'optimization',
    category: 'User Experience',
    title: 'Error Handling: Alert API',
    description: 'Error ditampilkan via Alert.alert(). Ini mengganggu UX.',
    recommendation: 'Gunakan toast/snackbar component untuk feedback non-blocking. Contoh: react-native-toast-message.',
    effort: 'medium',
  });

  issues.push({
    id: 'ux-2',
    severity: 'optimization',
    category: 'User Experience',
    title: 'Loading States',
    description: 'Loading state menggunakan ActivityIndicator di tombol submit. Ini minimalis.',
    recommendation: 'Tambah skeleton loading untuk feed, shimmer effect untuk profile, dan progress bar untuk step form.',
    effort: 'medium',
  });

  issues.push({
    id: 'ux-3',
    severity: 'optimization',
    category: 'User Experience',
    title: 'Pull to Refresh',
    description: 'Beberapa screen belum support pull-to-refresh untuk data update.',
    recommendation: 'Implementasikan RefreshControl di ScrollView/FlatList untuk feed, komunitas, dan notifikasi.',
    effort: 'medium',
  });

  issues.push({
    id: 'ux-4',
    severity: 'optimization',
    category: 'User Experience',
    title: 'Haptic Feedback',
    description: 'Interaksi tombol tidak memberikan haptic feedback.',
    recommendation: 'Gunakan expo-haptics untuk feedback sentuhan ringan saat menekan tombol penting (like, follow, submit).',
    effort: 'easy',
  });

  issues.push({
    id: 'ux-5',
    severity: 'optimization',
    category: 'User Experience',
    title: 'Offline Support',
    description: 'Belum ada penanganan offline. App akan error saat tidak ada koneksi.',
    recommendation: 'Implementasikan NetInfo untuk deteksi offline, tampilkan banner "Mode Offline", dan queue actions.',
    effort: 'hard',
  });

  return issues;
}

function checkAccessibility(): HealthIssue[] {
  const issues: HealthIssue[] = [];

  issues.push({
    id: 'a11y-1',
    severity: 'warning',
    category: 'Accessibility',
    title: 'Missing Accessibility Labels',
    description: 'Beberapa TouchableOpacity tidak memiliki accessibilityLabel atau accessibilityHint.',
    recommendation: 'Tambah accessibilityLabel untuk semua elemen interaktif. Contoh: accessibilityLabel="Tombol like postingan"',
    effort: 'medium',
  });

  issues.push({
    id: 'a11y-2',
    severity: 'warning',
    category: 'Accessibility',
    title: 'Font Size Tidak Dinamis',
    description: 'Semua font menggunakan ukuran absolut (px). Ini tidak mengikuti pengaturan font size sistem.',
    recommendation: 'Gunakan Text dengan allowFontScaling atau Dynamic Type iOS untuk aksesibilitas lebih baik.',
    effort: 'medium',
  });

  issues.push({
    id: 'a11y-3',
    severity: 'info',
    category: 'Accessibility',
    title: 'Color Contrast',
    description: 'Kombinasi warna gold (#B8860B) di background putih mungkin kurang kontras.',
    recommendation: 'Periksa color contrast ratio minimal 4.5:1 untuk teks normal sesuai WCAG 2.1 AA.',
    effort: 'easy',
  });

  return issues;
}

function checkDataMock(): HealthIssue[] {
  const issues: HealthIssue[] = [];

  issues.push({
    id: 'mock-1',
    severity: 'info',
    category: 'Data Layer',
    title: 'Mock Data Active',
    description: 'App berjalan dengan data mock. Belum ada backend terhubung.',
    recommendation: 'Siapkan transisi ke backend dengan mengganti implementasi api.ts. Pastikan format response konsisten.',
    effort: 'hard',
  });

  issues.push({
    id: 'mock-2',
    severity: 'info',
    category: 'Data Layer',
    title: 'Mock API Delay 250ms',
    description: 'Delay 250ms membantu melihat loading state. Real API mungkin lebih lambat.',
    recommendation: 'Ukur latensi endpoint real dan sesuaikan timeout di Apollo Client (default 10s).',
    effort: 'medium',
  });

  issues.push({
    id: 'mock-3',
    severity: 'warning',
    category: 'Data Layer',
    title: 'No Persistence',
    description: 'Data tidak persist: reload app akan reset semua data (kecuali auth via AsyncStorage).',
    recommendation: 'Implementasikan persistence layer untuk data pengguna (preferences, draft postingan).',
    effort: 'medium',
  });

  return issues;
}

export function runHealthCheck(): HealthReport {
  const allIssues: HealthIssue[] = [
    ...checkDependencies(),
    ...checkConfig(),
    ...checkPerformance(),
    ...checkCodeQuality(),
    ...checkSecurity(),
    ...checkUserExperience(),
    ...checkAccessibility(),
    ...checkDataMock(),
  ];

  const critical = allIssues.filter((i) => i.severity === 'critical');
  const warnings = allIssues.filter((i) => i.severity === 'warning');
  const optimizations = allIssues.filter((i) => i.severity === 'optimization');
  const infos = allIssues.filter((i) => i.severity === 'info');

  const score = Math.max(0, Math.min(100,
    100 -
    critical.length * 15 -
    warnings.length * 8 -
    optimizations.length * 3
  ));

  const total = allIssues.length;

  let verdict: string;
  if (score >= 90) {
    verdict = 'App dalam kondisi sangat baik! Beberapa optimasi minor bisa dilakukan.';
  } else if (score >= 70) {
    verdict = 'App cukup baik. Ada beberapa area yang perlu diperhatikan untuk performa & UX optimal.';
  } else if (score >= 50) {
    verdict = 'App perlu tuning. Prioritaskan issues critical & warning.';
  } else {
    verdict = 'App membutuhkan perbaikan signifikan. Fokus pada issues critical terlebih dahulu.';
  }

  let summary: string;
  if (critical.length > 0) {
    summary = `${critical.length} critical issues perlu segera ditangani. ${warnings.length} warning dan ${optimizations.length} optimasi bisa dikejar.`;
  } else if (warnings.length > 0) {
    summary = `Tidak ada critical issues. ${warnings.length} warning perlu diperhatikan. ${optimizations.length} saran optimasi siap diterapkan.`;
  } else {
    summary = `${optimizations.length} saran optimasi untuk meningkatkan performa & UX. ${infos.length} informasi umum.`;
  }

  return {
    timestamp: new Date().toISOString(),
    score,
    totalIssues: total,
    criticalCount: critical.length,
    warningCount: warnings.length,
    optimizationCount: optimizations.length,
    infoCount: infos.length,
    issues: [
      ...critical,
      ...warnings,
      ...optimizations,
      ...infos,
    ],
    summary,
    verdict,
  };
}
