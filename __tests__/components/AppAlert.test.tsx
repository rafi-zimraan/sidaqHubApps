import React from 'react';
import { Button, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { AlertProvider, useAppAlert, AppAlertOptions } from '@/src/components/AppAlert';

jest.mock('expo-font', () => ({ useFonts: () => [true, false] }));
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const MockIcon = (props: any) => React.createElement(Text, { ...props, testID: 'ionicon' });
  MockIcon.glyphMap = {};
  return { Ionicons: MockIcon };
});

jest.spyOn(global.console, 'error').mockImplementation(() => {});

function Consumer({ options }: { options: AppAlertOptions }) {
  const { showAlert } = useAppAlert();
  return <Button testID="trigger" title="trigger" onPress={() => showAlert(options)} />;
}

function renderWithAlert(options: AppAlertOptions) {
  return render(
    <AlertProvider>
      <Consumer options={options} />
    </AlertProvider>
  );
}

describe('AppAlert', () => {
  it('is hidden by default', () => {
    const { queryByTestId } = renderWithAlert({ title: 'Halo' });
    expect(queryByTestId('app-alert')).toBeNull();
  });

  it('shows title and message when triggered', () => {
    const { getByTestId } = renderWithAlert({
      title: 'Perhatian',
      message: 'Email dan kata sandi harus diisi',
      type: 'warning',
    });
    fireEvent.press(getByTestId('trigger'));
    expect(getByTestId('app-alert')).toBeTruthy();
    expect(getByTestId('app-alert-title').props.children).toBe('Perhatian');
    expect(getByTestId('app-alert-message').props.children).toBe('Email dan kata sandi harus diisi');
  });

  it('renders default Mengerti button and closes on press', () => {
    const { getByTestId, getByText, queryByTestId } = renderWithAlert({ title: 'Info' });
    fireEvent.press(getByTestId('trigger'));
    expect(getByText('Mengerti')).toBeTruthy();
    fireEvent.press(getByTestId('app-alert-btn-0'));
    expect(queryByTestId('app-alert')).toBeNull();
  });

  it('renders custom buttons and calls onPress after closing', () => {
    const onConfirm = jest.fn();
    const { getByTestId, getByText, queryByTestId } = renderWithAlert({
      title: 'Keluar Akun',
      message: 'Yakin ingin keluar?',
      buttons: [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: onConfirm },
      ],
    });
    fireEvent.press(getByTestId('trigger'));
    expect(getByText('Batal')).toBeTruthy();
    fireEvent.press(getByTestId('app-alert-btn-1'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(queryByTestId('app-alert')).toBeNull();
  });

  it('cancel button closes without side effects', () => {
    const onConfirm = jest.fn();
    const { getByTestId, queryByTestId } = renderWithAlert({
      title: 'Konfirmasi',
      buttons: [
        { text: 'Batal', style: 'cancel' },
        { text: 'Lanjut', onPress: onConfirm },
      ],
    });
    fireEvent.press(getByTestId('trigger'));
    fireEvent.press(getByTestId('app-alert-btn-0'));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(queryByTestId('app-alert')).toBeNull();
  });

  it('can be re-triggered after close', () => {
    const { getByTestId, queryByTestId } = renderWithAlert({ title: 'Ulang' });
    fireEvent.press(getByTestId('trigger'));
    fireEvent.press(getByTestId('app-alert-btn-0'));
    expect(queryByTestId('app-alert')).toBeNull();
    fireEvent.press(getByTestId('trigger'));
    expect(getByTestId('app-alert')).toBeTruthy();
  });
});
