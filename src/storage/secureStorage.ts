import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'auth_access_token';

// In-memory fallback for web or environments where SecureStore is not supported
const memoryStore = new Map<string, string>();

export class SecureStorage {
  /**
   * Checks whether SecureStore is available on the current platform (iOS & Android).
   */
  private static async isNativeSecureStoreAvailable(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      return await SecureStore.isAvailableAsync();
    } catch {
      return false;
    }
  }

  /**
   * Sets a key-value pair in secure storage (Keychain on iOS, Keystore on Android).
   */
  static async setItem(key: string, value: string): Promise<void> {
    const isAvailable = await this.isNativeSecureStoreAvailable();
    if (isAvailable) {
      await SecureStore.setItemAsync(key, value);
    } else {
      memoryStore.set(key, value);
    }
  }

  /**
   * Retrieves a value from secure storage.
   */
  static async getItem(key: string): Promise<string | null> {
    const isAvailable = await this.isNativeSecureStoreAvailable();
    if (isAvailable) {
      return await SecureStore.getItemAsync(key);
    }
    return memoryStore.get(key) ?? null;
  }

  /**
   * Deletes a key from secure storage.
   */
  static async deleteItem(key: string): Promise<void> {
    const isAvailable = await this.isNativeSecureStoreAvailable();
    if (isAvailable) {
      await SecureStore.deleteItemAsync(key);
    } else {
      memoryStore.delete(key);
    }
  }

  /**
   * Convenience method to retrieve the stored JWT authentication token.
   */
  static async getAuthToken(): Promise<string | null> {
    return this.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Convenience method to store the JWT authentication token securely.
   */
  static async setAuthToken(token: string): Promise<void> {
    return this.setItem(AUTH_TOKEN_KEY, token);
  }

  /**
   * Convenience method to remove the JWT authentication token (logout).
   */
  static async removeAuthToken(): Promise<void> {
    return this.deleteItem(AUTH_TOKEN_KEY);
  }
}
