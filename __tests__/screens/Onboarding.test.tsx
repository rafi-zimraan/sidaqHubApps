import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OnboardingScreen from '@/app/(auth)/onboarding';

const mockReplace = jest.fn();
const mockUpdateUser = jest.fn();
const mockMutate = jest.fn(() =>
  Promise.resolve({ data: { updateProfile: { name: 'Ahmad Fauzi', role: 'santri' } } })
);

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn(), back: jest.fn(), navigate: jest.fn() }),
}));

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Ahmad Fauzi', profile_completed: false },
    updateUser: mockUpdateUser,
  }),
}));

jest.mock('@apollo/client/react', () => ({
  useMutation: () => [mockMutate, { loading: false, error: null }],
}));

jest.mock('@apollo/client', () => ({ gql: jest.fn(() => 'mocked_gql') }));

jest.mock('expo-font', () => ({ useFonts: () => [true, false] }));
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const MockIcon = (props: any) => React.createElement(Text, { ...props, testID: 'ionicon' });
  return { Ionicons: MockIcon };
});

jest.spyOn(global.console, 'error').mockImplementation(() => {});

function goToStep2(utils: any) {
  fireEvent.press(utils.getByTestId('role-santri'));
  fireEvent.press(utils.getByTestId('onboarding-next'));
}

function goToStep3(utils: any) {
  goToStep2(utils);
  fireEvent.press(utils.getByTestId('onboarding-next'));
}

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome message with first name', () => {
    const { getByText } = render(<OnboardingScreen />);
    expect(getByText('Selamat datang, Ahmad! 🎉')).toBeTruthy();
  });

  it('renders step 1 role options', () => {
    const { getByText, getByTestId } = render(<OnboardingScreen />);
    expect(getByText('Siapa kamu?')).toBeTruthy();
    expect(getByTestId('role-santri')).toBeTruthy();
    expect(getByTestId('role-ustadz')).toBeTruthy();
    expect(getByTestId('role-huffadz')).toBeTruthy();
  });

  it('disables Lanjut until a role is chosen', () => {
    const { getByTestId } = render(<OnboardingScreen />);
    const next = getByTestId('onboarding-next');
    expect(next.props.accessibilityState?.disabled).toBe(true);
    fireEvent.press(getByTestId('role-santri'));
    expect(getByTestId('onboarding-next').props.accessibilityState?.disabled).toBe(false);
  });

  it('moves to juz step after choosing a role', () => {
    const utils = render(<OnboardingScreen />);
    goToStep2(utils);
    expect(utils.getByText('Berapa Juz yang sudah kamu hafal?')).toBeTruthy();
    expect(utils.getByTestId('juz-15')).toBeTruthy();
  });

  it('moves to interests step and toggles interests', () => {
    const utils = render(<OnboardingScreen />);
    goToStep3(utils);
    expect(utils.getByText('Topik yang kamu minati')).toBeTruthy();
    fireEvent.press(utils.getByTestId('interest-Tahfidz'));
    fireEvent.press(utils.getByTestId('interest-Tajwid'));
  });

  it('finishes onboarding: saves profile and redirects home', async () => {
    const utils = render(<OnboardingScreen />);
    goToStep3(utils);
    fireEvent.press(utils.getByTestId('interest-Tahfidz'));
    fireEvent.press(utils.getByTestId('onboarding-finish'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockUpdateUser).toHaveBeenCalledWith(
        expect.objectContaining({ profile_completed: true })
      );
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/home');
    });
  });

  it('can go back to previous step', () => {
    const utils = render(<OnboardingScreen />);
    goToStep2(utils);
    fireEvent.press(utils.getByText('Kembali'));
    expect(utils.getByText('Siapa kamu?')).toBeTruthy();
  });
});
