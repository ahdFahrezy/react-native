import { authRepository, IAuthRepository } from '@/repositories/authRepository';
import { logger } from '@/utils/logger';

const log = logger.createScope('LogoutService');

/**
 * Single-Action Service: Handles clearing user authentication and stored sessions.
 */
export class LogoutService {
  constructor(private readonly repo: IAuthRepository = authRepository) {}

  async execute(): Promise<void> {
    log.info('Executing logout procedure...');
    await this.repo.logout();
    log.info('User successfully signed out.');
  }
}

export const logoutService = new LogoutService();
