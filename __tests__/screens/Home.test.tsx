import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/home';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), back: jest.fn(), navigate: jest.fn() }),
  useFocusEffect: (cb: any) => { cb(); },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { user_id: 'me', name: 'Ahmad Fauzi', role: 'huffadz' },
  }),
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

const FEED = [
  {
    post_id: 'p1', type: 'text',
    content: 'Semangat murajaah hari ini #Tahfidz',
    hashtags: ['Tahfidz'],
    created_at: new Date().toISOString(),
    reactions_count: 10, comments_count: 2, my_reaction: null,
    user: { name: 'Ustadz Abdullah', role: 'ustadz', juz_count: 30, city: 'Jakarta' },
  },
  {
    post_id: 'p2', type: 'image',
    content: 'Suasana halaqah subuh',
    image_url: 'https://example.com/foto.jpg',
    created_at: new Date().toISOString(),
    reactions_count: 5, comments_count: 0, my_reaction: 'aamiin',
    user: { name: 'Fatimah', role: 'santri', juz_count: 8, city: 'Surabaya' },
  },
];

const STORIES = [
  { user: { name: 'Ustadz Abdullah', role: 'ustadz' }, has_unviewed: true },
];

const api = jest.requireMock('@/src/utils/api');

function mockApiHappy() {
  api.apiGet.mockImplementation((path: string) => {
    if (path === '/api/posts/feed') return Promise.resolve(FEED);
    if (path === '/api/stories') return Promise.resolve(STORIES);
    return Promise.resolve([]);
  });
  api.apiPost.mockResolvedValue({});
  api.apiDelete.mockResolvedValue({});
}

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiHappy();
  });

  it('renders feed cards after loading', async () => {
    const { getAllByTestId } = render(<HomeScreen />);
    await waitFor(() => {
      expect(getAllByTestId('home-feed-card').length).toBe(2);
    });
  });

  it('renders top bar action buttons', async () => {
    const { getByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getByTestId('home-search-btn')).toBeTruthy());
    expect(getByTestId('home-notifications-btn')).toBeTruthy();
    expect(getByTestId('home-chat-btn')).toBeTruthy();
  });

  it('navigates to notifications from top bar', async () => {
    const { getByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getByTestId('home-notifications-btn')).toBeTruthy());
    fireEvent.press(getByTestId('home-notifications-btn'));
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/notifications');
  });

  it('opens create post from composer', async () => {
    const { getByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getByTestId('composer-input')).toBeTruthy());
    fireEvent.press(getByTestId('composer-input'));
    expect(mockPush).toHaveBeenCalledWith('/post/create');
  });

  it('renders image for foto post', async () => {
    const { getByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getByTestId('post-image-p2')).toBeTruthy());
  });

  it('filters feed by foto type', async () => {
    const { getByTestId, getAllByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getAllByTestId('home-feed-card').length).toBe(2));
    fireEvent.press(getByTestId('filter-image'));
    await waitFor(() => {
      expect(getAllByTestId('home-feed-card').length).toBe(1);
    });
  });

  it('clears filter when the same chip is pressed twice', async () => {
    const { getByTestId, getAllByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getAllByTestId('home-feed-card').length).toBe(2));
    fireEvent.press(getByTestId('filter-image'));
    await waitFor(() => expect(getAllByTestId('home-feed-card').length).toBe(1));
    fireEvent.press(getByTestId('filter-image'));
    await waitFor(() => expect(getAllByTestId('home-feed-card').length).toBe(2));
  });

  it('sends reaction when Aamiin pressed on unreacted post', async () => {
    const { getByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getByTestId('react-btn-p1')).toBeTruthy());
    fireEvent.press(getByTestId('react-btn-p1'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith('/api/posts/p1/react', { type: 'aamiin' });
    });
  });

  it('removes reaction when Aamiin pressed on reacted post', async () => {
    const { getByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(getByTestId('react-btn-p2')).toBeTruthy());
    fireEvent.press(getByTestId('react-btn-p2'));
    await waitFor(() => {
      expect(api.apiDelete).toHaveBeenCalledWith('/api/posts/p2/react');
    });
  });

  it('shows empty state when feed empty', async () => {
    api.apiGet.mockImplementation(() => Promise.resolve([]));
    const { getByText } = render(<HomeScreen />);
    await waitFor(() => {
      expect(getByText('Belum ada postingan')).toBeTruthy();
      expect(getByText('Buat Postingan')).toBeTruthy();
    });
  });
});
