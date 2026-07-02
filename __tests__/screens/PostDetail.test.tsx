import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PostDetailScreen from '@/app/post/[id]';

const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: mockPush, replace: jest.fn(), navigate: jest.fn() }),
  useLocalSearchParams: () => ({ id: 'p1' }),
}));

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => ({ user: { user_id: 'me', name: 'Ahmad Fauzi', avatar_url: null } }),
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

const POST = {
  post_id: 'p1', type: 'ayat',
  content: 'Semoga dimudahkan menghafal',
  ayat_text: 'وَلَقَدْ يَسَّرْنَا الْقُرْآنَ',
  ayat_reference: 'Al-Qamar: 17',
  translation: 'Sungguh telah Kami mudahkan Al-Quran',
  hashtags: ['Tahfidz'],
  created_at: new Date().toISOString(),
  reactions_count: 10, comments_count: 1, my_reaction: null,
  user: { user_id: 'u1', name: 'Ustadz Abdullah', juz_count: 30, city: 'Jakarta' },
};

const COMMENTS = [
  { comment_id: 'c1', content: 'Aamiin ya Rabb', created_at: new Date().toISOString(), user: { name: 'Fatimah' } },
];

const api = jest.requireMock('@/src/utils/api');

describe('PostDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.apiGet.mockImplementation((path: string) => {
      if (path === '/api/posts/p1') return Promise.resolve({ ...POST });
      if (path === '/api/posts/p1/comments') return Promise.resolve(COMMENTS.map((c) => ({ ...c })));
      return Promise.resolve([]);
    });
    api.apiPost.mockResolvedValue({ comment_id: 'c-new', content: 'Komentar baru', created_at: new Date().toISOString() });
    api.apiDelete.mockResolvedValue({});
  });

  it('renders post content, ayat, and comments', async () => {
    const { getByText } = render(<PostDetailScreen />);
    await waitFor(() => {
      expect(getByText('Semoga dimudahkan menghafal')).toBeTruthy();
      expect(getByText('— Al-Qamar: 17')).toBeTruthy();
      expect(getByText('Komentar (1)')).toBeTruthy();
      expect(getByText('Aamiin ya Rabb')).toBeTruthy();
    });
  });

  it('adds a reaction', async () => {
    const { getByTestId } = render(<PostDetailScreen />);
    await waitFor(() => expect(getByTestId('post-react-btn')).toBeTruthy());
    fireEvent.press(getByTestId('post-react-btn'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith('/api/posts/p1/react', { type: 'aamiin' });
    });
  });

  it('removes reaction when already reacted', async () => {
    api.apiGet.mockImplementation((path: string) => {
      if (path === '/api/posts/p1') return Promise.resolve({ ...POST, my_reaction: 'aamiin' });
      if (path === '/api/posts/p1/comments') return Promise.resolve([]);
      return Promise.resolve([]);
    });
    const { getByTestId } = render(<PostDetailScreen />);
    await waitFor(() => expect(getByTestId('post-react-btn')).toBeTruthy());
    fireEvent.press(getByTestId('post-react-btn'));
    await waitFor(() => {
      expect(api.apiDelete).toHaveBeenCalledWith('/api/posts/p1/react');
    });
  });

  it('submits a new comment and shows it', async () => {
    const { getByTestId, getByText } = render(<PostDetailScreen />);
    await waitFor(() => expect(getByTestId('comment-input')).toBeTruthy());
    fireEvent.changeText(getByTestId('comment-input'), 'Komentar baru');
    fireEvent.press(getByTestId('send-comment-btn'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith('/api/posts/p1/comments', { content: 'Komentar baru' });
      expect(getByText('Komentar baru')).toBeTruthy();
      expect(getByText('Komentar (2)')).toBeTruthy();
    });
  });

  it('does not submit an empty comment', async () => {
    const { getByTestId } = render(<PostDetailScreen />);
    await waitFor(() => expect(getByTestId('send-comment-btn')).toBeTruthy());
    fireEvent.press(getByTestId('send-comment-btn'));
    expect(api.apiPost).not.toHaveBeenCalled();
  });
});
