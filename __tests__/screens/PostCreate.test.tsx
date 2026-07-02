import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreatePostScreen from '@/app/post/create';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: jest.fn(), replace: jest.fn(), navigate: jest.fn() }),
}));

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => ({ user: { user_id: 'me', name: 'Ahmad Fauzi' } }),
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

describe('CreatePostScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.apiPost.mockResolvedValue({});
  });

  it('renders header and inputs', () => {
    const { getByText, getByTestId } = render(<CreatePostScreen />);
    expect(getByText('Buat Postingan')).toBeTruthy();
    expect(getByTestId('post-content-input')).toBeTruthy();
    expect(getByTestId('post-hashtags-input')).toBeTruthy();
  });

  it('rejects empty text post', () => {
    const { getByTestId } = render(<CreatePostScreen />);
    fireEvent.press(getByTestId('submit-post-btn'));
    expect(alertSpy).toHaveBeenCalledWith('Perhatian', 'Isi postingan tidak boleh kosong');
    expect(api.apiPost).not.toHaveBeenCalled();
  });

  it('submits a text post and goes back', async () => {
    const { getByTestId } = render(<CreatePostScreen />);
    fireEvent.changeText(getByTestId('post-content-input'), 'Alhamdulillah selesai murajaah');
    fireEvent.press(getByTestId('submit-post-btn'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith(
        '/api/posts',
        expect.objectContaining({ type: 'text', content: 'Alhamdulillah selesai murajaah' })
      );
      expect(mockBack).toHaveBeenCalled();
    });
  });

  it('parses hashtags from comma separated input', async () => {
    const { getByTestId } = render(<CreatePostScreen />);
    fireEvent.changeText(getByTestId('post-content-input'), 'Konten');
    fireEvent.changeText(getByTestId('post-hashtags-input'), 'Tahfidz, #Quran');
    fireEvent.press(getByTestId('submit-post-btn'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith(
        '/api/posts',
        expect.objectContaining({ hashtags: ['Tahfidz', 'Quran'] })
      );
    });
  });

  it('shows ayat fields when ayat type selected and validates empty ayat', () => {
    const { getByTestId } = render(<CreatePostScreen />);
    fireEvent.press(getByTestId('post-type-ayat'));
    expect(getByTestId('ayat-arabic-input')).toBeTruthy();
    expect(getByTestId('ayat-reference-input')).toBeTruthy();
    expect(getByTestId('ayat-translation-input')).toBeTruthy();

    fireEvent.press(getByTestId('submit-post-btn'));
    expect(alertSpy).toHaveBeenCalledWith('Perhatian', 'Teks ayat tidak boleh kosong');
  });

  it('submits an ayat post with reference and translation', async () => {
    const { getByTestId } = render(<CreatePostScreen />);
    fireEvent.press(getByTestId('post-type-ayat'));
    fireEvent.changeText(getByTestId('ayat-arabic-input'), 'بِسْمِ اللَّهِ');
    fireEvent.changeText(getByTestId('ayat-reference-input'), 'Al-Fatihah: 1');
    fireEvent.changeText(getByTestId('ayat-translation-input'), 'Dengan nama Allah');
    fireEvent.press(getByTestId('submit-post-btn'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith(
        '/api/posts',
        expect.objectContaining({
          type: 'ayat',
          ayat_text: 'بِسْمِ اللَّهِ',
          ayat_reference: 'Al-Fatihah: 1',
          translation: 'Dengan nama Allah',
        })
      );
    });
  });

  it('includes selected visibility', async () => {
    const { getByTestId } = render(<CreatePostScreen />);
    fireEvent.changeText(getByTestId('post-content-input'), 'Konten koneksi');
    fireEvent.press(getByTestId('visibility-connections'));
    fireEvent.press(getByTestId('submit-post-btn'));
    await waitFor(() => {
      expect(api.apiPost).toHaveBeenCalledWith(
        '/api/posts',
        expect.objectContaining({ visibility: 'connections' })
      );
    });
  });

  it('closes screen via close button', () => {
    const { getByTestId } = render(<CreatePostScreen />);
    fireEvent.press(getByTestId('close-create-post'));
    expect(mockBack).toHaveBeenCalled();
  });
});
