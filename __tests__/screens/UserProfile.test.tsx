import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserProfileScreen from '@/app/user/[id]';

const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: mockPush, replace: jest.fn(), navigate: jest.fn() }),
  useLocalSearchParams: () => ({ id: 'u1' }),
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

const PROFILE = {
  user_id: 'u1', name: 'Ustadz Abdullah Hanif', role: 'ustadz', city: 'Jakarta',
  juz_count: 30, avatar_url: '', bio: 'Pembimbing tahfidz.',
  followers_count: 1240, following_count: 86, posts_count: 58, is_following: false,
};

const USER_POSTS = [
  {
    post_id: 'p1', type: 'text', content: 'Tips murajaah harian',
    created_at: new Date().toISOString(), reactions_count: 3, comments_count: 1,
  },
];

const api = jest.requireMock('@/src/utils/api');

describe('UserProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.apiGet.mockImplementation((path: string) => {
      if (path === '/api/users/u1') return Promise.resolve({ ...PROFILE });
      if (path === '/api/users/u1/posts') return Promise.resolve(USER_POSTS.map((p) => ({ ...p })));
      return Promise.resolve([]);
    });
    api.apiPost.mockResolvedValue({});
    api.apiDelete.mockResolvedValue({});
  });

  it('renders profile info and stats', async () => {
    const { getByText } = render(<UserProfileScreen />);
    await waitFor(() => {
      expect(getByText('Ustadz Abdullah Hanif')).toBeTruthy();
      expect(getByText('Ustadz/Musyrif')).toBeTruthy();
      expect(getByText('1240')).toBeTruthy();
      expect(getByText('Pembimbing tahfidz.')).toBeTruthy();
    });
  });

  it('renders user posts', async () => {
    const { getByText } = render(<UserProfileScreen />);
    await waitFor(() => {
      expect(getByText('Tips murajaah harian')).toBeTruthy();
    });
  });

  it('follows the user and increments follower count', async () => {
    const { getByTestId, getByText } = render(<UserProfileScreen />);
    await waitFor(() => expect(getByTestId('user-follow-btn')).toBeTruthy());
    fireEvent.press(getByTestId('user-follow-btn'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith('/api/users/u1/follow');
      expect(getByText('✓ Mengikuti')).toBeTruthy();
      expect(getByText('1241')).toBeTruthy();
    });
  });

  it('unfollows when already following', async () => {
    api.apiGet.mockImplementation((path: string) => {
      if (path === '/api/users/u1') return Promise.resolve({ ...PROFILE, is_following: true });
      if (path === '/api/users/u1/posts') return Promise.resolve([]);
      return Promise.resolve([]);
    });
    const { getByTestId, getByText } = render(<UserProfileScreen />);
    await waitFor(() => expect(getByText('✓ Mengikuti')).toBeTruthy());
    fireEvent.press(getByTestId('user-follow-btn'));
    await waitFor(() => {
      expect(api.apiDelete).toHaveBeenCalledWith('/api/users/u1/follow');
      expect(getByText('Ikuti')).toBeTruthy();
    });
  });

  it('navigates to post detail from a mini post', async () => {
    const { getByText } = render(<UserProfileScreen />);
    await waitFor(() => expect(getByText('Tips murajaah harian')).toBeTruthy());
    fireEvent.press(getByText('Tips murajaah harian'));
    expect(mockPush).toHaveBeenCalledWith('/post/p1');
  });

  it('shows empty state when user has no posts', async () => {
    api.apiGet.mockImplementation((path: string) => {
      if (path === '/api/users/u1') return Promise.resolve({ ...PROFILE });
      return Promise.resolve([]);
    });
    const { getByText } = render(<UserProfileScreen />);
    await waitFor(() => {
      expect(getByText('Belum ada postingan')).toBeTruthy();
    });
  });
});
