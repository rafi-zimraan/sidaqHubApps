import { renderHook } from '@testing-library/react-native';

jest.mock('expo-constants', () => ({
  ExecutionEnvironment: { StoreClient: 1 },
  default: { executionEnvironment: 2 },
}));

jest.mock('expo-font', () => ({
  useFonts: jest.fn(),
}));

describe('useIconFonts', () => {
  it('returns [true, null] when fonts loaded', () => {
    const expoFont = require('expo-font');
    expoFont.useFonts.mockReturnValue([true, null]);

    const { useIconFonts } = require('@/src/hooks/use-icon-fonts');
    const [loaded, error] = useIconFonts();
    expect(loaded).toBe(true);
    expect(error).toBeNull();
  });

  it('returns [false, null] when fonts loading', () => {
    const expoFont = require('expo-font');
    expoFont.useFonts.mockReturnValue([false, null]);

    const { useIconFonts } = require('@/src/hooks/use-icon-fonts');
    const [loaded, error] = useIconFonts();
    expect(loaded).toBe(false);
    expect(error).toBeNull();
  });

  it('returns [false, Error] on font load error', () => {
    const err = new Error('font load failed');
    const expoFont = require('expo-font');
    expoFont.useFonts.mockReturnValue([false, err]);

    const { useIconFonts } = require('@/src/hooks/use-icon-fonts');
    const [loaded, error] = useIconFonts();
    expect(loaded).toBe(false);
    expect(error?.message).toBe('font load failed');
  });
});
