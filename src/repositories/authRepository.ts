import { apiClient } from '@/api/apiClient';
import { authDummyApi, USE_DUMMY_API } from '@/dummy';
import { SecureStorage } from '@/storage/secureStorage';
import { AuthResponse, AuthUser, LoginCredentials } from '@/types/auth.types';
import { logger } from '@/utils/logger';

const log = logger.createScope('AuthRepository');

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  getStoredSession(): Promise<{ token: string; user: AuthUser } | null>;
}

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    log.info(`Processing login for: ${credentials.email}`);

    // When dummy mode is enabled (default until real backend is built)
    if (USE_DUMMY_API) {
      log.info('Using Dummy API for authentication (EXPO_PUBLIC_USE_DUMMY_API=true)');
      const response = await authDummyApi.login(credentials);
      await this.saveSession(response.token, response.user);
      return response;
    }

    // Real backend API mode
    log.info('Using remote API for authentication...');
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    await this.saveSession(response.token, response.user);
    return response;
  }

  async logout(): Promise<void> {
    log.info('Clearing user session and authentication tokens...');
    await SecureStorage.removeAuthToken();
    await SecureStorage.removeUserSession();
  }

  async getStoredSession(): Promise<{ token: string; user: AuthUser } | null> {
    const token = await SecureStorage.getAuthToken();
    const user = await SecureStorage.getUserSession<AuthUser>();

    if (token && user) {
      return { token, user };
    }
    return null;
  }

  private async saveSession(token: string, user: AuthUser): Promise<void> {
    await SecureStorage.setAuthToken(token);
    await SecureStorage.setUserSession(user);
    log.info(`User session saved securely for ${user.email}`);
  }
}

export const authRepository = new AuthRepository();
