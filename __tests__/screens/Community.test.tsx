import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CommunityScreen from '@/app/(tabs)/community';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), back: jest.fn(), navigate: jest.fn() }),
  useFocusEffect: (cb: any) => { cb(); },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 0, left: 0, right: 0 }),
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

const COMMUNITIES = [
  { community_id: 'cm1', name: 'Komunitas Huffadz Nusantara', description: 'Desc 1', members_count: 8420, is_member: true, is_verified: true },
  { community_id: 'cm2', name: 'Santri Tahfidz Jabar', description: 'Desc 2', members_count: 3210, is_member: false, is_verified: false },
];

const HALAQAHS = [
  {
    halaqah_id: 'h1', title: 'Murajaah Juz 1-5', description: 'Halaqah rutin',
    platform: 'Zoom', max_slots: 25, registered_count: 18, is_registered: false,
    schedule: new Date(Date.now() + 86400000).toISOString(), ustadz_name: 'Ustadz Abdullah',
  },
  {
    halaqah_id: 'h2', title: 'Tahsin Pemula', description: 'Kelas dasar',
    platform: 'Google Meet', max_slots: 20, registered_count: 20, is_registered: false,
    schedule: new Date(Date.now() + 2 * 86400000).toISOString(), ustadz_name: 'Ustadz Salman',
  },
];

const api = jest.requireMock('@/src/utils/api');

describe('CommunityScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.apiGet.mockImplementation((path: string) => {
      if (path === '/api/communities') return Promise.resolve(COMMUNITIES);
      if (path === '/api/halaqahs') return Promise.resolve(HALAQAHS);
      return Promise.resolve([]);
    });
    api.apiPost.mockResolvedValue({});
    api.apiDelete.mockResolvedValue({});
  });

  it('renders header and halaqah tab by default', async () => {
    const { getByText, getAllByTestId } = render(<CommunityScreen />);
    await waitFor(() => {
      expect(getByText('Komunitas & Halaqah')).toBeTruthy();
      expect(getAllByTestId('halaqah-card').length).toBe(2);
    });
  });

  it('shows tab counters', async () => {
    const { getByText } = render(<CommunityScreen />);
    await waitFor(() => {
      expect(getByText('Halaqah (2)')).toBeTruthy();
      expect(getByText('Komunitas (2)')).toBeTruthy();
    });
  });

  it('marks full halaqah with Penuh badge', async () => {
    const { getByText } = render(<CommunityScreen />);
    await waitFor(() => {
      expect(getByText('Penuh')).toBeTruthy();
      expect(getByText('7 slot tersisa')).toBeTruthy();
    });
  });

  it('navigates to halaqah detail on card press', async () => {
    const { getAllByTestId } = render(<CommunityScreen />);
    await waitFor(() => expect(getAllByTestId('halaqah-card').length).toBe(2));
    fireEvent.press(getAllByTestId('halaqah-card')[0]);
    expect(mockPush).toHaveBeenCalledWith('/halaqah/h1');
  });

  it('navigates to create halaqah', async () => {
    const { getByTestId } = render(<CommunityScreen />);
    await waitFor(() => expect(getByTestId('create-halaqah-btn')).toBeTruthy());
    fireEvent.press(getByTestId('create-halaqah-btn'));
    expect(mockPush).toHaveBeenCalledWith('/halaqah/create');
  });

  it('switches to community tab and lists communities', async () => {
    const { getByTestId, getAllByTestId } = render(<CommunityScreen />);
    await waitFor(() => expect(getByTestId('tab-community')).toBeTruthy());
    fireEvent.press(getByTestId('tab-community'));
    await waitFor(() => {
      expect(getAllByTestId('community-card').length).toBe(2);
    });
  });

  it('joins a community', async () => {
    const { getByTestId, getByText } = render(<CommunityScreen />);
    await waitFor(() => expect(getByTestId('tab-community')).toBeTruthy());
    fireEvent.press(getByTestId('tab-community'));
    await waitFor(() => expect(getByTestId('join-community-cm2')).toBeTruthy());
    fireEvent.press(getByTestId('join-community-cm2'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith('/api/communities/cm2/join');
    });
  });

  it('leaves a community that is already joined', async () => {
    const { getByTestId } = render(<CommunityScreen />);
    await waitFor(() => expect(getByTestId('tab-community')).toBeTruthy());
    fireEvent.press(getByTestId('tab-community'));
    await waitFor(() => expect(getByTestId('join-community-cm1')).toBeTruthy());
    fireEvent.press(getByTestId('join-community-cm1'));
    await waitFor(() => {
      expect(api.apiDelete).toHaveBeenCalledWith('/api/communities/cm1/join');
    });
  });
});
