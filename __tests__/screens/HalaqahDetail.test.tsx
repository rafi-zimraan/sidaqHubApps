import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HalaqahDetailScreen from '@/app/halaqah/[id]';

const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: mockPush, replace: jest.fn(), navigate: jest.fn() }),
  useLocalSearchParams: () => ({ id: 'h1' }),
}));

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => ({ user: { user_id: 'me', name: 'Ahmad Fauzi' } }),
}));

jest.mock('@/src/utils/api', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiPut: jest.fn(),
  apiDelete: jest.fn(),
}));

jest.mock('expo-font', () => ({ useFonts: () => [true, false] }));
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const MockIcon = (props: any) => React.createElement(Text, { ...props, testID: 'ionicon' });
  return { Ionicons: MockIcon };
});

jest.spyOn(global.console, 'error').mockImplementation(() => {});
const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const HALAQAH = {
  halaqah_id: 'h1', title: 'Murajaah Juz 1-5 Bersama',
  description: 'Halaqah murajaah rutin.',
  juz_range: 'Juz 1-5', platform: 'Zoom', platform_link: 'https://zoom.us/j/123',
  max_slots: 25, registered_count: 18, is_registered: false,
  schedule: new Date(Date.now() + 86400000).toISOString(),
  ustadz_name: 'Ustadz Abdullah',
  ustadz: { user_id: 'u1', name: 'Ustadz Abdullah', city: 'Jakarta', juz_count: 30, avatar_url: '' },
};

const api = jest.requireMock('@/src/utils/api');

describe('HalaqahDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.apiGet.mockResolvedValue({ ...HALAQAH });
    api.apiPost.mockResolvedValue({});
    api.apiDelete.mockResolvedValue({});
  });

  it('renders halaqah details', async () => {
    const { getByText } = render(<HalaqahDetailScreen />);
    await waitFor(() => {
      expect(getByText('Murajaah Juz 1-5 Bersama')).toBeTruthy();
      expect(getByText('Tentang Halaqah')).toBeTruthy();
      expect(getByText('Pengajar')).toBeTruthy();
      expect(getByText('18/25 peserta')).toBeTruthy();
      expect(getByText('🟢 7 slot tersisa')).toBeTruthy();
    });
  });

  it('registers to halaqah and shows success alert', async () => {
    const { getByTestId, getByText } = render(<HalaqahDetailScreen />);
    await waitFor(() => expect(getByTestId('register-halaqah-btn')).toBeTruthy());
    fireEvent.press(getByTestId('register-halaqah-btn'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith('/api/halaqahs/h1/register');
      expect(alertSpy).toHaveBeenCalledWith(
        'Berhasil!',
        expect.stringContaining('Murajaah Juz 1-5 Bersama')
      );
      expect(getByText('Batalkan Pendaftaran')).toBeTruthy();
    });
  });

  it('cancels registration when already registered', async () => {
    api.apiGet.mockResolvedValue({ ...HALAQAH, is_registered: true });
    const { getByTestId, getByText } = render(<HalaqahDetailScreen />);
    await waitFor(() => expect(getByText('Batalkan Pendaftaran')).toBeTruthy());
    fireEvent.press(getByTestId('register-halaqah-btn'));
    await waitFor(() => {
      expect(api.apiDelete).toHaveBeenCalledWith('/api/halaqahs/h1/register');
      expect(getByText('Daftar Halaqah')).toBeTruthy();
    });
  });

  it('disables registration when full', async () => {
    api.apiGet.mockResolvedValue({ ...HALAQAH, registered_count: 25 });
    const { getByText, getByTestId } = render(<HalaqahDetailScreen />);
    await waitFor(() => {
      expect(getByText('Slot Penuh')).toBeTruthy();
    });
    fireEvent.press(getByTestId('register-halaqah-btn'));
    expect(api.apiPost).not.toHaveBeenCalled();
  });

  it('navigates to ustadz profile', async () => {
    const { getByText } = render(<HalaqahDetailScreen />);
    await waitFor(() => expect(getByText('Ustadz Abdullah')).toBeTruthy());
    fireEvent.press(getByText('Ustadz Abdullah'));
    expect(mockPush).toHaveBeenCalledWith('/user/u1');
  });
});
