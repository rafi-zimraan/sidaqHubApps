import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import LoginScreen from '@/app/(auth)/login';

const mockReplace = jest.fn();
const mockLogin = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, back: jest.fn(), push: jest.fn(), navigate: jest.fn() }),
}));

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
  }),
}));

jest.mock('@/src/utils/mock', () => ({
  CURRENT_USER: { name: 'Test User' },
  MOCK_TOKEN: 'test-token',
}));

jest.mock('expo-font', () => ({ useFonts: () => [true, false], loadAsync: jest.fn() }));
jest.mock('expo-asset', () => ({ Asset: { fromURI: jest.fn() } }));
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const MockIonicon = (props: any) => React.createElement(Text, { ...props, testID: 'ionicon' });
  return { Ionicons: MockIonicon };
});

let capturedOnCompleted: ((data: any) => void) | null = null;

jest.mock('@apollo/client', () => ({
  useMutation: jest.fn(),
  gql: jest.fn(() => 'mocked_gql'),
  ApolloProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@apollo/client/react', () => ({
  useMutation: jest.fn(),
}));

jest.spyOn(global.console, 'error').mockImplementation(() => {});

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedOnCompleted = null;

    const mockMutate = jest.fn(() => {
      if (capturedOnCompleted) {
        capturedOnCompleted({
          login: {
            user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'huffadz' },
            token: 'mock-token',
          },
        });
      }
      return Promise.resolve({ data: {} });
    });

    const useMutation = jest.requireMock('@apollo/client/react').useMutation;
    useMutation.mockImplementation((_mutation: any, options?: { onCompleted?: (data: any) => void }) => {
      capturedOnCompleted = options?.onCompleted || null;
      return [mockMutate, { data: null, loading: false, error: null }];
    });
  });

  it('renders header elements', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('SidaqHub')).toBeTruthy();
    expect(getByText('Masuk ke akun Huffadz kamu')).toBeTruthy();
  });

  it('renders email and password inputs', () => {
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId('login-email-input')).toBeTruthy();
    expect(getByTestId('login-password-input')).toBeTruthy();
  });

  it('renders login button', () => {
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId('login-submit-button')).toBeTruthy();
  });

  it('toggles password visibility', () => {
    const { getByTestId } = render(<LoginScreen />);
    const toggle = getByTestId('toggle-password-visibility');
    fireEvent.press(toggle);
  });

  it('renders remember me checkbox', () => {
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId('remember-me-checkbox')).toBeTruthy();
  });

  it('renders forgot password link', () => {
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId('forgot-password-link')).toBeTruthy();
  });

  it('renders register link', () => {
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId('go-to-register')).toBeTruthy();
  });

  it('renders social login buttons', () => {
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId('login-google-button')).toBeTruthy();
    expect(getByTestId('login-facebook-button')).toBeTruthy();
  });

  it('calls login on submit with valid inputs', async () => {
    const { getByTestId } = render(<LoginScreen />);
    const emailInput = getByTestId('login-email-input');
    const passwordInput = getByTestId('login-password-input');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(passwordInput, 'password123');

    const submitBtn = getByTestId('login-submit-button');
    fireEvent.press(submitBtn);

    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('shows custom alert when submitting with empty fields', () => {
    const { AlertProvider } = require('@/src/components/AppAlert');
    const { getByTestId, queryByTestId } = render(
      <AlertProvider>
        <LoginScreen />
      </AlertProvider>
    );
    expect(queryByTestId('app-alert')).toBeNull();

    fireEvent.press(getByTestId('login-submit-button'));

    expect(getByTestId('app-alert')).toBeTruthy();
    expect(getByTestId('app-alert-title').props.children).toBe('Perhatian');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('closes the custom alert with Mengerti button', () => {
    const { AlertProvider } = require('@/src/components/AppAlert');
    const { getByTestId, queryByTestId } = render(
      <AlertProvider>
        <LoginScreen />
      </AlertProvider>
    );
    fireEvent.press(getByTestId('login-submit-button'));
    expect(getByTestId('app-alert')).toBeTruthy();

    fireEvent.press(getByTestId('app-alert-btn-0'));
    expect(queryByTestId('app-alert')).toBeNull();
  });

  it('shows Segera Hadir custom alert for forgot password', () => {
    const { AlertProvider } = require('@/src/components/AppAlert');
    const { getByTestId } = render(
      <AlertProvider>
        <LoginScreen />
      </AlertProvider>
    );
    fireEvent.press(getByTestId('forgot-password-link'));
    expect(getByTestId('app-alert-title').props.children).toBe('Segera Hadir');
  });
});
