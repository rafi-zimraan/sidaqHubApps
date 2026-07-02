import React from 'react';
import { Text, View, Button } from 'react-native';
import { render, waitFor, fireEvent, act } from '@testing-library/react-native';
import { AuthProvider, useAuth, RawUser } from '@/src/context/AuthContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

const AsyncStorage = jest.requireMock('@react-native-async-storage/async-storage');

const RAW_USER: RawUser = {
  id: 'u-100',
  name: 'Siti Hafshah',
  email: 'siti@test.com',
  role: 'santri',
  uniqueId: 'sidaq-100',
  photo_url: null,
  cover_photo_url: null,
  username: 'sitihafshah',
  phone: '0812000111',
  birthday: '2001-02-03',
  province_id: 1,
  city_id: 1,
  verification_level: 'basic',
  huffadzProfile: {
    city: 'Depok', province: 'Jawa Barat', bio: 'Bismillah 30 juz',
    verifiedJuz: 5, badge_tier: 'silver', gender: 'P',
    interests: ['Tahfidz'], hobbies: [], juzProgress: 5,
    experiences: [], certificationsList: [], skillsList: [],
    showSkills: false, showExperiences: false,
  },
  city: { id: 1, name: 'Depok' },
  province: { id: 1, name: 'Jawa Barat' },
};

function FlowConsumer() {
  const { user, token, loading, isAuthenticated, login, logout, updateUser } = useAuth();
  return (
    <View>
      <Text testID="loading">{loading ? 'true' : 'false'}</Text>
      <Text testID="authed">{isAuthenticated ? 'yes' : 'no'}</Text>
      <Text testID="name">{user?.name ?? ''}</Text>
      <Text testID="user-id">{user?.user_id ?? ''}</Text>
      <Text testID="juz">{user ? String(user.juz_count) : ''}</Text>
      <Text testID="city">{user?.city_name ?? ''}</Text>
      <Text testID="completed">{user ? String(user.profile_completed) : ''}</Text>
      <Text testID="token">{token ?? ''}</Text>
      <Button testID="do-login" title="login" onPress={() => login(RAW_USER, 'token-abc')} />
      <Button testID="do-logout" title="logout" onPress={() => logout()} />
      <Button testID="do-update" title="update" onPress={() => updateUser({ name: 'Siti Update' })} />
    </View>
  );
}

async function renderFlow() {
  const utils = render(
    <AuthProvider>
      <FlowConsumer />
    </AuthProvider>
  );
  await waitFor(() => expect(utils.getByTestId('loading').props.children).toBe('false'));
  return utils;
}

describe('Auth flow: login → update → logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('starts unauthenticated', async () => {
    const { getByTestId } = await renderFlow();
    expect(getByTestId('authed').props.children).toBe('no');
    expect(getByTestId('name').props.children).toBe('');
  });

  it('login normalizes RawUser and sets token', async () => {
    const { getByTestId } = await renderFlow();
    await act(async () => {
      fireEvent.press(getByTestId('do-login'));
    });
    expect(getByTestId('authed').props.children).toBe('yes');
    expect(getByTestId('name').props.children).toBe('Siti Hafshah');
    // normalizeUser: user_id dari id, juz dari juzProgress, city dari huffadzProfile
    expect(getByTestId('user-id').props.children).toBe('u-100');
    expect(getByTestId('juz').props.children).toBe('5');
    expect(getByTestId('city').props.children).toBe('Depok');
    expect(getByTestId('completed').props.children).toBe('true');
    expect(getByTestId('token').props.children).toBe('token-abc');
  });

  it('persists token and user to AsyncStorage after login', async () => {
    const { getByTestId } = await renderFlow();
    await act(async () => {
      fireEvent.press(getByTestId('do-login'));
    });
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('sidaq_token', 'token-abc');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('sidaq_user', expect.stringContaining('Siti Hafshah'));
    });
  });

  it('updateUser merges changes into current user', async () => {
    const { getByTestId } = await renderFlow();
    await act(async () => {
      fireEvent.press(getByTestId('do-login'));
    });
    await act(async () => {
      fireEvent.press(getByTestId('do-update'));
    });
    expect(getByTestId('name').props.children).toBe('Siti Update');
    // Field lain tetap ada
    expect(getByTestId('user-id').props.children).toBe('u-100');
  });

  it('logout clears user, token, and storage', async () => {
    const { getByTestId } = await renderFlow();
    await act(async () => {
      fireEvent.press(getByTestId('do-login'));
    });
    expect(getByTestId('authed').props.children).toBe('yes');

    await act(async () => {
      fireEvent.press(getByTestId('do-logout'));
    });
    expect(getByTestId('authed').props.children).toBe('no');
    expect(getByTestId('name').props.children).toBe('');
    expect(getByTestId('token').props.children).toBe('');
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['sidaq_token', 'sidaq_user']);
  });

  it('restores session from AsyncStorage on mount', async () => {
    AsyncStorage.getItem.mockImplementation((key: string) => {
      if (key === 'sidaq_token') return Promise.resolve('stored-token');
      if (key === 'sidaq_user') {
        return Promise.resolve(JSON.stringify({ ...RAW_USER, user_id: RAW_USER.id, avatar_url: null, juz_count: 5, bio: 'x', city_name: 'Depok', interests: [], profile_completed: true, followers_count: 0, following_count: 0, posts_count: 0 }));
      }
      return Promise.resolve(null);
    });
    const { getByTestId } = await renderFlow();
    expect(getByTestId('authed').props.children).toBe('yes');
    expect(getByTestId('name').props.children).toBe('Siti Hafshah');
    expect(getByTestId('token').props.children).toBe('stored-token');
  });
});
