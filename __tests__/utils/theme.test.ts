import { getJuzBadge, formatTime, formatSchedule, getRoleLabel } from '@/src/constants/theme';

describe('getJuzBadge', () => {
  it('returns empty label for 0 juz', () => {
    const result = getJuzBadge(0);
    expect(result.label).toBe('');
    expect(result.bg).toBe('transparent');
  });

  it('returns plain badge for small count', () => {
    const result = getJuzBadge(5);
    expect(result.label).toContain('5 Juz');
    expect(result.bg).toBe('#aaa');
  });

  it('returns star badge for 10+ juz', () => {
    const result = getJuzBadge(10);
    expect(result.label).toContain('⭐');
  });

  it('returns medal badge for 15+ juz', () => {
    const result = getJuzBadge(15);
    expect(result.label).toContain('🥇');
    expect(result.bg).toBe('#2E7D8C');
  });

  it('returns trophy badge for 20+ juz', () => {
    const result = getJuzBadge(20);
    expect(result.label).toContain('🏆');
  });

  it('returns diamond badge for 25+ juz', () => {
    const result = getJuzBadge(25);
    expect(result.label).toContain('💎');
  });

  it('returns crown badge for 30 juz', () => {
    const result = getJuzBadge(30);
    expect(result.label).toContain('👑');
    expect(result.bg).toBe('#B8860B');
  });
});

describe('formatTime', () => {
  it('returns "Baru saja" for less than 1 minute', () => {
    const now = new Date().toISOString();
    expect(formatTime(now)).toBe('Baru saja');
  });

  it('returns minutes ago', () => {
    const fiveMin = new Date(Date.now() - 5 * 60000).toISOString();
    expect(formatTime(fiveMin)).toBe('5 menit lalu');
  });

  it('returns hours ago', () => {
    const twoHours = new Date(Date.now() - 2 * 3600000).toISOString();
    expect(formatTime(twoHours)).toBe('2 jam lalu');
  });

  it('returns days ago', () => {
    const threeDays = new Date(Date.now() - 3 * 86400000).toISOString();
    expect(formatTime(threeDays)).toBe('3 hari lalu');
  });

  it('returns formatted date for >7 days', () => {
    const eightDays = new Date(Date.now() - 8 * 86400000).toISOString();
    const result = formatTime(eightDays);
    expect(result).not.toContain('hari');
    expect(result.length).toBeLessThan(20);
  });

  it('returns empty string for invalid date', () => {
    expect(formatTime('invalid-date')).toBe('');
  });

});

describe('formatSchedule', () => {
  it('returns formatted schedule', () => {
    const date = '2026-03-15T10:00:00';
    const result = formatSchedule(date);
    expect(result).toContain('Minggu');
    expect(result).toContain('15');
    expect(result).toContain('10.00');
  });

  it('returns fallback for invalid date', () => {
    expect(formatSchedule('not-a-date')).toBe('Jadwal belum ditentukan');
  });
});

describe('getRoleLabel', () => {
  it('returns correct label for known roles', () => {
    expect(getRoleLabel('santri')).toBe('Santri Huffadz');
    expect(getRoleLabel('ustadz')).toBe('Ustadz/Musyrif');
    expect(getRoleLabel('huffadz')).toBe('Huffadz Dewasa');
    expect(getRoleLabel('komunitas')).toBe('Komunitas');
  });

  it('returns original input for unknown role', () => {
    expect(getRoleLabel('guru')).toBe('guru');
  });
});
