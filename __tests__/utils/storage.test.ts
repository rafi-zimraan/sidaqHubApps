jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import { Storage } from '@/src/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

describe('Storage', () => {
  let storage: Storage;

  beforeEach(() => {
    jest.clearAllMocks();
    storage = new Storage();
  });

  describe('getItem', () => {
    it('returns parsed value when key exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('"test-value"');
      const result = await storage.getItem('test-key', 'fallback');
      expect(result).toBe('test-value');
    });

    it('returns fallback when key missing', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await storage.getItem('test-key', 'fallback');
      expect(result).toBe('fallback');
    });

    it('returns fallback on error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('fail'));
      const result = await storage.getItem('test-key', 'fallback');
      expect(result).toBe('fallback');
    });

    it('handles number values', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('42');
      const result = await storage.getItem('count', '0' as any);
      expect(result).toBe(42);
    });
  });

  describe('setItem', () => {
    it('stores JSON-stringified value', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      const result = await storage.setItem('key', 'value');
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('key', '"value"');
    });

    it('stores number values', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      await storage.setItem('key', 42);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('key', '42');
    });

    it('returns false on error', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('fail'));
      const result = await storage.setItem('key', 'value');
      expect(result).toBe(false);
    });
  });

  describe('removeItem', () => {
    it('removes key', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
      const result = await storage.removeItem('key');
      expect(result).toBe(true);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('key');
    });

    it('returns false on error', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('fail'));
      const result = await storage.removeItem('key');
      expect(result).toBe(false);
    });
  });

  describe('secure storage', () => {
    it('secureGet returns value', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('"secret"');
      const result = await storage.secureGet('token', 'fallback');
      expect(result).toBe('secret');
    });

    it('secureGet returns fallback on error', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('fail'));
      const result = await storage.secureGet('token', 'fallback');
      expect(result).toBe('fallback');
    });

    it('secureSet stores value', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
      const result = await storage.secureSet('token', 'secret-value');
      expect(result).toBe(true);
    });

    it('secureSet returns false on error', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(new Error('fail'));
      const result = await storage.secureSet('token', 'value');
      expect(result).toBe(false);
    });

    it('secureRemove deletes key', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
      const result = await storage.secureRemove('token');
      expect(result).toBe(true);
    });
  });
});
