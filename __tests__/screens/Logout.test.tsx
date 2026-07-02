import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ProfileScreen from '@/app/(tabs)/profile';

const mockReplace = jest.fn();
const mockLogout = jest.fn(() => Promise.resolve());

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn(), back: jest.fn(), navigate: jest.fn() }),
  useFocusEffect: (cb: any) => { cb(); },
}));

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      user_id: 'me',
      name: 'Ahmad Fauzi',
      email: 'ahmad@test.com',
      role: 'huffadz',
      username: 'ahmad_fauzi',
      phone: '08123456789',
      city_name: 'Bandung',
      bio: 'Penghafal Al-Quran',
      juz_count: 15,
      huffadzProfile: null,
    },
    logout: mockLogout,
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
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const MockIcon = (props: any) => React.createElement(Text, { ...props, testID: 'ionicon' });
  return { Ionicons: MockIcon };
});

jest.spyOn(global.console, 'error').mockImplementation(() => {});
const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('Logout flow (ProfileScreen)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows confirmation alert when logout pressed', () => {
    const { getByTestId } = render(<ProfileScreen />);
    fireEvent.press(getByTestId('logout-btn'));
    expect(alertSpy).toHaveBeenCalledWith(
      'Keluar Akun',
      'Apakah kamu yakin ingin keluar dari akun?',
      expect.any(Array),
      expect.anything()
    );
  });

  it('does nothing when user cancels', async () => {
    const { getByTestId } = render(<ProfileScreen />);
    fireEvent.press(getByTestId('logout-btn'));
    const buttons = alertSpy.mock.calls[0][2] as any[];
    const cancelBtn = buttons.find((b) => b.style === 'cancel');
    expect(cancelBtn.text).toBe('Batal');
    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('logs out and redirects to login when confirmed', async () => {
    const { getByTestId } = render(<ProfileScreen />);
    fireEvent.press(getByTestId('logout-btn'));

    const buttons = alertSpy.mock.calls[0][2] as any[];
    const keluarBtn = buttons.find((b) => b.style === 'destructive');
    expect(keluarBtn.text).toBe('Keluar');

    await act(async () => {
      await keluarBtn.onPress();
    });

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockReplace).toHaveBeenCalledWith('/(auth)/login');
    });
  });
});
