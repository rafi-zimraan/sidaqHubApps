import React from 'react';
import { Text, View } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

function TestConsumer() {
  const { user, token, loading, login, logout, updateUser } = useAuth();
  return (
    <View>
      <Text testID="user-name">{user?.name ?? ''}</Text>
      <Text testID="token-value">{token ?? ''}</Text>
      <Text testID="loading-value">{loading ? 'true' : 'false'}</Text>
      <Text testID="login-fn">{typeof login}</Text>
      <Text testID="logout-fn">{typeof logout}</Text>
      <Text testID="updateUser-fn">{typeof updateUser}</Text>
    </View>
  );
}

describe('AuthContext', () => {
  it('starts in loading state then resolves to null user', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(getByTestId('loading-value').props.children).toBe('true');

    await waitFor(() => {
      expect(getByTestId('loading-value').props.children).toBe('false');
    });

    expect(getByTestId('user-name').props.children).toBe('');
    expect(getByTestId('token-value').props.children).toBe('');
  });

  it('provides login, logout, and updateUser functions', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading-value').props.children).toBe('false');
    });

    expect(getByTestId('login-fn').props.children).toBe('function');
    expect(getByTestId('logout-fn').props.children).toBe('function');
    expect(getByTestId('updateUser-fn').props.children).toBe('function');
  });
});
