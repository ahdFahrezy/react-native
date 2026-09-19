import { authRepository, IAuthRepository } from '@/repositories/authRepository';
import { AuthResponse } from '@/types/auth.types';
import { logger } from '@/utils/logger';

const log = logger.createScope('CheckAuthSessionService');

/**
 * Single-Action Service: Restores existing session from SecureStorage upon app launch.
 */
export class CheckAuthSessionService {
  constructor(private readonly repo: IAuthRepository = authRepository) {}

  async execute(): Promise<AuthResponse | null> {
    log.debug('Checking for existing stored authentication session...');
    const session = await this.repo.getStoredSession();

    if (session) {
      log.info(`Active session restored for user: ${session.user.email}`);
      return session;
    }

    log.debug('No active authentication session found.');
    return null;
  }
}

export const checkAuthSessionService = new CheckAuthSessionService();
