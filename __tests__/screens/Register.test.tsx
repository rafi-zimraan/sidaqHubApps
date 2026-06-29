import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import RegisterScreen from '@/app/(auth)/register';

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockLogin = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, back: mockBack, push: jest.fn(), navigate: jest.fn() }),
}));

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin, user: null }),
}));

jest.mock('@apollo/client/react', () => ({
  useMutation: () => {
    const mutate = jest.fn(() => Promise.resolve({ data: {} }));
    return [mutate, { loading: false, error: null }];
  },
}));

jest.mock('@apollo/client', () => ({
  gql: jest.fn(() => 'mocked_gql'),
}));

jest.mock('expo-font', () => ({ useFonts: () => [true, false], loadAsync: jest.fn() }));
jest.mock('expo-asset', () => ({ Asset: { fromURI: jest.fn() } }));
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const MockIcon = (props: any) => React.createElement(Text, { ...props, testID: 'ionicon' });
  return { Ionicons: MockIcon };
});

jest.spyOn(global.console, 'error').mockImplementation(() => {});

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders step 1 title', () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText('Buat Akun')).toBeTruthy();
    expect(getByText('Langkah 1/3 — Informasi akun')).toBeTruthy();
  });

  it('renders all step 1 fields', () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    expect(getByPlaceholderText('Cth: Ahmad Fauzi')).toBeTruthy();
    expect(getByPlaceholderText('email@kamu.com')).toBeTruthy();
    expect(getByPlaceholderText('Min. 8 karakter')).toBeTruthy();
    expect(getByPlaceholderText('Ulangi kata sandi')).toBeTruthy();
  });

  it('Lanjut button is disabled when fields empty', () => {
    const { getByText } = render(<RegisterScreen />);
    const btn = getByText('Lanjut').parent?.parent;
    expect(btn?.props?.accessibilityState?.disabled ?? btn?.props?.disabled).toBeTruthy();
  });

  it('Lanjut button is enabled with valid step 1', () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText('Cth: Ahmad Fauzi'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('email@kamu.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Min. 8 karakter'), 'password123');
    const btn = getByText('Lanjut').parent?.parent;
    expect(btn?.props?.accessibilityState?.disabled ?? btn?.props?.disabled).toBeFalsy();
  });

  it('shows konfirmasi error when passwords mismatch', () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText('Min. 8 karakter'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Ulangi kata sandi'), 'different');
    expect(getByText('Kata sandi tidak cocok')).toBeTruthy();
  });

  it('renders step 2 role options', () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText('Cth: Ahmad Fauzi'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('email@kamu.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Min. 8 karakter'), 'password123');
    fireEvent.press(getByText('Lanjut'));
    expect(getByText('Data Diri')).toBeTruthy();
    expect(getByText('Santri Huffadz')).toBeTruthy();
    expect(getByText('Ustadz/Musyrif')).toBeTruthy();
  });

  it('renders step 3 huffadz profile', () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText('Cth: Ahmad Fauzi'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('email@kamu.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Min. 8 karakter'), 'password123');
    fireEvent.press(getByText('Lanjut'));
    fireEvent.press(getByText('Santri Huffadz'));
    fireEvent.press(getByText('Lanjut'));
    expect(getByText('Profil Huffadz')).toBeTruthy();
    expect(getByText('Bio / Tentang Kamu')).toBeTruthy();
    expect(getByText('Minat')).toBeTruthy();
  });

  it('can toggle interests in step 3', () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText('Cth: Ahmad Fauzi'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('email@kamu.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Min. 8 karakter'), 'password123');
    fireEvent.press(getByText('Lanjut'));
    fireEvent.press(getByText('Santri Huffadz'));
    fireEvent.press(getByText('Lanjut'));
    fireEvent.press(getByText('Tahfidz'));
    fireEvent.press(getByText('Tajwid'));
  });

  it('shows progress dots', () => {
    const { UNSAFE_getAllByType } = render(<RegisterScreen />);
    const { View } = require('react-native');
    const dots = UNSAFE_getAllByType(View).filter(
      (v: any) => v.props.style && Array.isArray(v.props.style) && v.props.style.some((s: any) => s && s.borderRadius === 3)
    );
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });
});
