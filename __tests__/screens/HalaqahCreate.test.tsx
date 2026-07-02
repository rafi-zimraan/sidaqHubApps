import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateHalaqahScreen from '@/app/halaqah/create';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: jest.fn(), replace: jest.fn(), navigate: jest.fn() }),
}));

jest.mock('@/src/utils/api', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(() => Promise.resolve({})),
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
const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const api = jest.requireMock('@/src/utils/api');

describe('CreateHalaqahScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.apiPost.mockResolvedValue({});
  });

  it('renders form fields', () => {
    const { getByText, getByTestId } = render(<CreateHalaqahScreen />);
    expect(getByText('Buat Halaqah')).toBeTruthy();
    expect(getByTestId('halaqah-title-input')).toBeTruthy();
    expect(getByTestId('halaqah-date-input')).toBeTruthy();
    expect(getByTestId('halaqah-slots-input')).toBeTruthy();
  });

  it('rejects submit without title', () => {
    const { getByTestId } = render(<CreateHalaqahScreen />);
    fireEvent.press(getByTestId('create-halaqah-submit'));
    expect(alertSpy).toHaveBeenCalledWith('Perhatian', 'Judul halaqah harus diisi');
    expect(api.apiPost).not.toHaveBeenCalled();
  });

  it('rejects submit without schedule date', () => {
    const { getByTestId } = render(<CreateHalaqahScreen />);
    fireEvent.changeText(getByTestId('halaqah-title-input'), 'Murajaah Sabtu');
    fireEvent.press(getByTestId('create-halaqah-submit'));
    expect(alertSpy).toHaveBeenCalledWith('Perhatian', 'Tanggal jadwal harus diisi (format: YYYY-MM-DD)');
    expect(api.apiPost).not.toHaveBeenCalled();
  });

  it('creates halaqah with combined schedule datetime', async () => {
    const { getByTestId } = render(<CreateHalaqahScreen />);
    fireEvent.changeText(getByTestId('halaqah-title-input'), 'Murajaah Sabtu');
    fireEvent.changeText(getByTestId('halaqah-date-input'), '2026-08-01');
    fireEvent.press(getByTestId('create-halaqah-submit'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith(
        '/api/halaqahs',
        expect.objectContaining({
          title: 'Murajaah Sabtu',
          schedule: '2026-08-01T08:00:00',
          max_slots: 10,
        })
      );
      expect(alertSpy).toHaveBeenCalledWith('Berhasil!', 'Halaqah berhasil dibuat', expect.anything());
    });
  });

  it('supports selecting Offline platform', async () => {
    const { getByTestId } = render(<CreateHalaqahScreen />);
    fireEvent.changeText(getByTestId('halaqah-title-input'), 'Setoran Offline');
    fireEvent.changeText(getByTestId('halaqah-date-input'), '2026-08-02');
    fireEvent.press(getByTestId('platform-Offline'));
    fireEvent.press(getByTestId('create-halaqah-submit'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith(
        '/api/halaqahs',
        expect.objectContaining({ platform: 'Offline' })
      );
    });
  });

  it('parses max slots number', async () => {
    const { getByTestId } = render(<CreateHalaqahScreen />);
    fireEvent.changeText(getByTestId('halaqah-title-input'), 'Halaqah Besar');
    fireEvent.changeText(getByTestId('halaqah-date-input'), '2026-08-03');
    fireEvent.changeText(getByTestId('halaqah-slots-input'), '25');
    fireEvent.press(getByTestId('create-halaqah-submit'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith(
        '/api/halaqahs',
        expect.objectContaining({ max_slots: 25 })
      );
    });
  });
});
