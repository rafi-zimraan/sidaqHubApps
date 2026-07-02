import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NotificationsScreen from '@/app/(tabs)/notifications';

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

const NOTIFS = [
  { notification_id: 'n1', type: 'reaction', message: 'Ustadz Abdullah mengucap Aamiin', created_at: new Date().toISOString(), is_read: false },
  { notification_id: 'n2', type: 'comment', message: 'Fatimah mengomentari postinganmu', created_at: new Date().toISOString(), is_read: false },
  { notification_id: 'n3', type: 'follow', message: 'Rizki mulai mengikutimu', created_at: new Date().toISOString(), is_read: true },
];

const api = jest.requireMock('@/src/utils/api');

describe('NotificationsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.apiGet.mockResolvedValue(NOTIFS.map((n) => ({ ...n })));
    api.apiPut.mockResolvedValue({});
  });

  it('renders notifications and unread badge', async () => {
    const { getByText, getByTestId } = render(<NotificationsScreen />);
    await waitFor(() => {
      expect(getByText('Notifikasi')).toBeTruthy();
      expect(getByText('2 belum dibaca')).toBeTruthy();
      expect(getByTestId('notification-n1')).toBeTruthy();
      expect(getByTestId('notification-n3')).toBeTruthy();
    });
  });

  it('marks a single notification as read', async () => {
    const { getByTestId } = render(<NotificationsScreen />);
    await waitFor(() => expect(getByTestId('notification-n1')).toBeTruthy());
    fireEvent.press(getByTestId('notification-n1'));
    await waitFor(() => {
      expect(api.apiPut).toHaveBeenCalledWith('/api/notifications/n1/read');
    });
  });

  it('marks all notifications as read and hides the badge', async () => {
    const { getByTestId, queryByText } = render(<NotificationsScreen />);
    await waitFor(() => expect(getByTestId('mark-all-read-btn')).toBeTruthy());
    fireEvent.press(getByTestId('mark-all-read-btn'));
    await waitFor(() => {
      expect(api.apiPut).toHaveBeenCalledWith('/api/notifications/read-all');
      expect(queryByText('2 belum dibaca')).toBeNull();
    });
  });

  it('shows empty state when there are no notifications', async () => {
    api.apiGet.mockResolvedValue([]);
    const { getByText } = render(<NotificationsScreen />);
    await waitFor(() => {
      expect(getByText('Belum ada notifikasi')).toBeTruthy();
    });
  });
});
