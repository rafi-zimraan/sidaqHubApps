import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NetworkScreen from '@/app/(tabs)/network';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), back: jest.fn(), navigate: jest.fn() }),
  useFocusEffect: (cb: any) => { cb(); },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => ({ user: { user_id: 'me', name: 'Ahmad Fauzi', role: 'huffadz' } }),
}));

jest.mock('@/src/utils/api', () => ({
  apiGet: jest.fn(() => Promise.resolve([])),
  apiPost: jest.fn(() => Promise.resolve({})),
  apiPut: jest.fn(() => Promise.resolve({})),
  apiDelete: jest.fn(() => Promise.resolve({})),
}));

jest.mock('expo-font', () => ({ useFonts: () => [true, false] }));
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const MockIcon = (props: any) => React.createElement(Text, { ...props, testID: 'ionicon' });
  return { Ionicons: MockIcon };
});

jest.spyOn(global.console, 'error').mockImplementation(() => {});

const api = jest.requireMock('@/src/utils/api');

describe('NetworkScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.apiGet.mockResolvedValue([]);
    api.apiPost.mockResolvedValue({});
    api.apiDelete.mockResolvedValue({});
  });

  it('renders header', async () => {
    const { getByText } = render(<NetworkScreen />);
    await waitFor(() => {
      expect(getByText('Jejaring Huffadz')).toBeTruthy();
      expect(getByText('Terhubung bersama Para Penghafal Quran')).toBeTruthy();
    });
  });

  it('renders all section titles', async () => {
    const { getByText } = render(<NetworkScreen />);
    await waitFor(() => {
      expect(getByText('SARAN KONEKSI')).toBeTruthy();
      expect(getByText('KOMUNITAS POPULER')).toBeTruthy();
      expect(getByText('HALAQAH AKTIF')).toBeTruthy();
      expect(getByText('HUFFADZ DEKAT LOKASI ANDA')).toBeTruthy();
    });
  });

  it('renders filter chips', async () => {
    const { getByText, getAllByText } = render(<NetworkScreen />);
    await waitFor(() => {
      expect(getByText('Semua')).toBeTruthy();
      expect(getByText('Huffadz')).toBeTruthy();
      expect(getAllByText('Komunitas').length).toBeGreaterThan(0);
      expect(getAllByText('Halaqah').length).toBeGreaterThan(0);
      expect(getByText('Pesantren')).toBeTruthy();
    });
  });

  it('renders network stats', async () => {
    const { getByText, getAllByText } = render(<NetworkScreen />);
    await waitFor(() => {
      expect(getByText('Pengikut')).toBeTruthy();
      expect(getAllByText('Mengikuti').length).toBeGreaterThan(0);
    });
  });

  it('renders suggestion cards from mock users', async () => {
    const { getAllByText } = render(<NetworkScreen />);
    await waitFor(() => {
      // Ustadz Abdullah Hanif ada di saran koneksi & nearby
      expect(getAllByText('Ustadz Abdullah Hanif').length).toBeGreaterThan(0);
    });
  });

  it('follows a suggested user via api', async () => {
    const { getAllByText } = render(<NetworkScreen />);
    // u2 (Fatimah Az-Zahra) belum diikuti → tombol "+ Ikuti"
    await waitFor(() => expect(getAllByText('+ Ikuti').length).toBeGreaterThan(0));
    fireEvent.press(getAllByText('+ Ikuti')[0]);
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalled();
    });
  });

  it('navigates to user profile from nearby row', async () => {
    const { getAllByText } = render(<NetworkScreen />);
    await waitFor(() => expect(getAllByText('Ustadz Abdullah Hanif').length).toBeGreaterThan(0));
    // Baris nearby adalah kemunculan terakhir nama user pertama
    const rows = getAllByText('Ustadz Abdullah Hanif');
    fireEvent.press(rows[rows.length - 1]);
    expect(mockPush).toHaveBeenCalledWith('/user/u1');
  });
});
