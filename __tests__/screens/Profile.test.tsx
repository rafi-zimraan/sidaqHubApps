import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '@/app/(tabs)/profile';

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush, back: jest.fn(), navigate: jest.fn() }),
  useFocusEffect: (cb: any) => { cb(); },
}));

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'test-id',
      user_id: 'test-id',
      name: 'Ahmad Fauzi',
      email: 'ahmad@test.com',
      role: 'huffadz',
      username: 'ahmad_fauzi',
      phone: '08123456789',
      birthday: '2000-01-15',
      avatar_url: null,
      photo_url: null,
      city_name: 'Bandung',
      bio: 'Penghafal Al-Quran',
      interests: ['Tahfidz', 'Tajwid'],
      juz_count: 15,
      profile_completed: true,
      followers_count: 248,
      following_count: 132,
      posts_count: 12,
      huffadzProfile: {
        city: 'Bandung',
        province: 'Jawa Barat',
        bio: 'Penghafal Al-Quran',
        verifiedJuz: 15,
        juzProgress: 15,
        badge_tier: 'gold',
        gender: 'L',
        interests: ['Tahfidz', 'Tajwid'],
        hobbies: ['Membaca', 'Olahraga'],
        skillsList: ['Tahfidz', 'Tilawah', 'Tajwid'],
        experiences: [
          { role: 'Guru Tahfidz', place: 'Ponpes Al-Quran', period: '2023-Sekarang' }
        ],
        certificationsList: [
          { title: 'Sertifikat Tahfidz 15 Juz', organization: 'Kemenag', year: '2025', color: '#1A5C6B' }
        ],
        showSkills: true,
        showExperiences: true,
      },
    },
    logout: jest.fn(() => Promise.resolve()),
  }),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, style }: any) => {
    const { View } = require('react-native');
    return <View style={style}>{children}</View>;
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('expo-font', () => ({ useFonts: () => [true, false] }));
jest.mock('expo-asset', () => ({ Asset: { fromURI: jest.fn() } }));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const MockIcon = (props: any) => React.createElement(Text, { ...props, testID: 'ionicon' });
  return { Ionicons: MockIcon };
});

jest.spyOn(global.console, 'error').mockImplementation(() => {});

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user name', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('Ahmad Fauzi')).toBeTruthy();
  });

  it('renders email in informasi akun', () => {
    const { getAllByText } = render(<ProfileScreen />);
    expect(getAllByText('ahmad@test.com').length).toBeGreaterThan(0);
  });

  it('renders phone number', () => {
    const { getAllByText } = render(<ProfileScreen />);
    expect(getAllByText('08123456789').length).toBeGreaterThan(0);
  });

  it('renders edit profile button', () => {
    const { getByTestId } = render(<ProfileScreen />);
    expect(getByTestId('edit-profile-btn')).toBeTruthy();
  });

  it('renders logout button', () => {
    const { getByTestId } = render(<ProfileScreen />);
    expect(getByTestId('logout-btn')).toBeTruthy();
  });

  it('navigates to edit-profile on button press', () => {
    const { getByTestId } = render(<ProfileScreen />);
    fireEvent.press(getByTestId('edit-profile-btn'));
    expect(mockPush).toHaveBeenCalledWith('/edit-profile');
  });

  it('renders sections', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('INFORMASI AKUN')).toBeTruthy();
    expect(getByText('PROGRES HAFALAN')).toBeTruthy();
    expect(getByText('KEAHLIAN & BAKAT')).toBeTruthy();
  });

  it('renders skills chips', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('Tilawah')).toBeTruthy();
  });

  it('renders minat chips', () => {
    const { getAllByText } = render(<ProfileScreen />);
    expect(getAllByText('Tahfidz').length).toBeGreaterThanOrEqual(1);
  });

  it('renders hobi chips', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('Membaca')).toBeTruthy();
    expect(getByText('Olahraga')).toBeTruthy();
  });

  it('renders pengalaman section', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('PENGALAMAN')).toBeTruthy();
    expect(getByText('Guru Tahfidz')).toBeTruthy();
  });

  it('renders sertifikasi section', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('SERTIFIKASI & PENCAPAIAN')).toBeTruthy();
  });

  it('renders juz 1 in grid', () => {
    const { getAllByText } = render(<ProfileScreen />);
    expect(getAllByText('1').length).toBeGreaterThan(0);
  });

  it('renders circle progress with juz count', () => {
    const { getAllByText } = render(<ProfileScreen />);
    expect(getAllByText('15').length).toBeGreaterThanOrEqual(2);
  });

  it('renders bio', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('Penghafal Al-Quran')).toBeTruthy();
  });
});

describe('ProfileScreen no user', () => {
  let origUseAuth: any;

  beforeAll(() => {
    origUseAuth = jest.requireMock('@/src/context/AuthContext').useAuth;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    const authMock = require('@/src/context/AuthContext');
    authMock.useAuth = () => ({ user: null, logout: jest.fn() });
  });

  afterAll(() => {
    const authMock = require('@/src/context/AuthContext');
    if (origUseAuth) authMock.useAuth = origUseAuth;
  });

  it('returns null when user is null', () => {
    const { UNSAFE_root } = render(<ProfileScreen />);
    expect(UNSAFE_root?.children?.length ?? 0).toBe(0);
  });
});
