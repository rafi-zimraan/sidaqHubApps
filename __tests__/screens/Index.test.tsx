import React from 'react';
import { render } from '@testing-library/react-native';
import Index from '@/app/index';

let mockAuthState: { user: any; loading: boolean } = { user: null, loading: false };

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => mockAuthState,
}));

jest.mock('expo-router', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Redirect: ({ href }: { href: string }) =>
      React.createElement(Text, { testID: 'redirect' }, href),
  };
});

jest.spyOn(global.console, 'error').mockImplementation(() => {});

describe('Index routing', () => {
  it('shows loading spinner while auth state resolves', () => {
    mockAuthState = { user: null, loading: true };
    const { queryByTestId } = render(<Index />);
    expect(queryByTestId('redirect')).toBeNull();
  });

  it('redirects to login when unauthenticated', () => {
    mockAuthState = { user: null, loading: false };
    const { getByTestId } = render(<Index />);
    expect(getByTestId('redirect').props.children).toBe('/(auth)/login');
  });

  it('redirects to onboarding when profile is incomplete', () => {
    mockAuthState = { user: { name: 'A', profile_completed: false }, loading: false };
    const { getByTestId } = render(<Index />);
    expect(getByTestId('redirect').props.children).toBe('/(auth)/onboarding');
  });

  it('redirects to home when profile is complete', () => {
    mockAuthState = { user: { name: 'A', profile_completed: true }, loading: false };
    const { getByTestId } = render(<Index />);
    expect(getByTestId('redirect').props.children).toBe('/(tabs)/home');
  });
});
