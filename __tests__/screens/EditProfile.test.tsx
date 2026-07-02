import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditProfileScreen from '@/app/edit-profile';

const mockBack = jest.fn();
const mockUpdateUser = jest.fn();
const mockMutate = jest.fn(() =>
  Promise.resolve({ data: { updateProfile: { name: 'Ahmad Fauzi Baru', role: 'ustadz' } } })
);

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: jest.fn(), replace: jest.fn(), navigate: jest.fn() }),
}));

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      user_id: 'me',
      name: 'Ahmad Fauzi',
      username: 'ahmad_fauzi',
      phone: '08123456789',
      birthday: '2000-01-15',
      role: 'huffadz',
      city_name: 'Bandung',
      bio: 'Penghafal Al-Quran',
      juz_count: 15,
      avatar_url: '',
      interests: ['Tahfidz'],
      huffadzProfile: {
        city: 'Bandung', province: 'Jawa Barat', bio: 'Penghafal Al-Quran',
        gender: 'L', interests: ['Tahfidz'], hobbies: ['Membaca'],
        skillsList: ['Tahfidz'], juzProgress: 15, verifiedJuz: 15,
        badge_tier: 'gold', experiences: [], certificationsList: [],
        showSkills: true, showExperiences: true,
      },
    },
    updateUser: mockUpdateUser,
  }),
}));

jest.mock('@apollo/client/react', () => ({
  useMutation: () => [mockMutate, { loading: false, error: null }],
}));

jest.mock('@apollo/client', () => ({ gql: jest.fn(() => 'mocked_gql') }));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true, assets: [] })),
  MediaTypeOptions: { Images: 'Images' },
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

describe('EditProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prefills fields with current user data', () => {
    const { getByTestId } = render(<EditProfileScreen />);
    expect(getByTestId('edit-name-input').props.value).toBe('Ahmad Fauzi');
    expect(getByTestId('edit-username-input').props.value).toBe('ahmad_fauzi');
    expect(getByTestId('edit-phone-input').props.value).toBe('08123456789');
    expect(getByTestId('edit-city-input').props.value).toBe('Bandung');
    expect(getByTestId('edit-juz-input').props.value).toBe('15');
  });

  it('rejects saving when name is empty', () => {
    const { getByTestId } = render(<EditProfileScreen />);
    fireEvent.changeText(getByTestId('edit-name-input'), '');
    fireEvent.press(getByTestId('save-profile-btn'));
    expect(alertSpy).toHaveBeenCalledWith('Perhatian', 'Nama tidak boleh kosong');
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('saves profile, updates user, and shows success alert', async () => {
    const { getByTestId } = render(<EditProfileScreen />);
    fireEvent.changeText(getByTestId('edit-name-input'), 'Ahmad Fauzi Baru');
    fireEvent.press(getByTestId('save-profile-btn'));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({
            input: expect.objectContaining({ name: 'Ahmad Fauzi Baru' }),
          }),
        })
      );
      expect(mockUpdateUser).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Ahmad Fauzi Baru' })
      );
      expect(alertSpy).toHaveBeenCalledWith('Berhasil!', 'Profil berhasil diperbarui', expect.anything());
    });
  });

  it('changes role selection before saving', async () => {
    const { getByTestId } = render(<EditProfileScreen />);
    fireEvent.press(getByTestId('edit-role-ustadz'));
    fireEvent.press(getByTestId('save-profile-btn'));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({
            input: expect.objectContaining({ role: 'ustadz' }),
          }),
        })
      );
    });
  });

  it('updates juz progress as number', async () => {
    const { getByTestId } = render(<EditProfileScreen />);
    fireEvent.changeText(getByTestId('edit-juz-input'), '20');
    fireEvent.press(getByTestId('save-profile-btn'));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({
            input: expect.objectContaining({ juzProgress: 20 }),
          }),
        })
      );
    });
  });

  it('renders change avatar button', () => {
    const { getByTestId } = render(<EditProfileScreen />);
    expect(getByTestId('change-avatar-btn')).toBeTruthy();
  });
});
