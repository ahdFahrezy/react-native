import { authRepository, IAuthRepository } from '@/repositories/authRepository';
import { AuthResponse, LoginCredentials } from '@/types/auth.types';
import { logger } from '@/utils/logger';

const log = logger.createScope('LoginService');

/**
 * Single-Action Service: Handles user authentication and credential validation.
 */
export class LoginService {
  constructor(private readonly repo: IAuthRepository = authRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    log.info(`Executing user login for: ${credentials.email}`);

    // Business validation
    const email = credentials.email.trim();
    if (!email) {
      throw new Error('Email address is required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please provide a valid email address.');
    }

    if (!credentials.password || credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const result = await this.repo.login({
      ...credentials,
      email,
    });

    log.info(`User ${result.user.email} authenticated successfully.`);
    return result;
  }
}

export const loginService = new LoginService();
