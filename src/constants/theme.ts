export const COLORS = {
  primary: '#1A5C6B',
  gold: '#B8860B',
  background: '#F5F5F5',
  card: '#FFFFFF',
  quoteBox: '#E8F4F7',
  text: '#1A1A2E',
  textSecondary: '#888888',
  border: '#E2E8F0',
  white: '#FFFFFF',
  error: '#E53E3E',
  success: '#38A169',
  primaryLight: 'rgba(26,92,107,0.1)',
};

export const FONTS = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  arabic: 'Amiri_400Regular',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 100,
};

export function getJuzBadge(juzCount: number): { label: string; color: string; bg: string } {
  if (juzCount >= 30) return { label: `${juzCount} Juz 👑`, color: '#fff', bg: '#B8860B' };
  if (juzCount >= 25) return { label: `${juzCount} Juz 💎`, color: '#fff', bg: '#1A5C6B' };
  if (juzCount >= 20) return { label: `${juzCount} Juz 🏆`, color: '#fff', bg: '#1A5C6B' };
  if (juzCount >= 15) return { label: `${juzCount} Juz 🥇`, color: '#fff', bg: '#2E7D8C' };
  if (juzCount >= 10) return { label: `${juzCount} Juz ⭐`, color: '#fff', bg: '#888888' };
  if (juzCount > 0) return { label: `${juzCount} Juz`, color: '#fff', bg: '#aaa' };
  return { label: '', color: '#888', bg: 'transparent' };
}

export function formatTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

export function formatSchedule(dateStr: string | Date): string {
  try {
    const date = new Date(dateStr as string);
    if (isNaN(date.getTime())) return 'Jadwal belum ditentukan';
    return date.toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return 'Jadwal belum ditentukan';
  }
}

export function getRoleLabel(role: string): string {
  const map: Record<string, string> = {
    santri: 'Santri Huffadz',
    ustadz: 'Ustadz/Musyrif',
    huffadz: 'Huffadz Dewasa',
    komunitas: 'Komunitas',
  };
  return map[role] || role;
}
