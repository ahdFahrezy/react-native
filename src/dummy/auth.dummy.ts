import { AuthResponse, AuthUser, LoginCredentials } from '@/types/auth.types';
import { simulateDelay } from './helper';
import { logger } from '@/utils/logger';

const log = logger.createScope('AuthDummyAPI');

export const DUMMY_USERS: Record<string, { user: AuthUser; passwordHash: string }> = {
  'admin@example.com': {
    user: {
      id: 'usr_admin_001',
      email: 'admin@example.com',
      name: 'System Administrator',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    passwordHash: 'password123',
  },
  'student@example.com': {
    user: {
      id: 'usr_student_002',
      email: 'student@example.com',
      name: 'Aditya Pratama (Applicant)',
      role: 'user',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDRXFBxUjCpGdRbBtDglrUI9r0UObWZSKwToACymGmYCvcXOI5jJmOY1K9jnXrPMnGyN7wRgSxzlV2wWKNUnA5YXNh2aBj5dHELN0nXjiAJmMnDW9ozGQoLHG0BJh_XdSHFEMToNfXdjT61N3TpAj1uIXV0XV3WIlL67H51vIBWot9QxN9TZBbQQITht79m_kuWxNu3VgKan7I9uCA0Utl7-T_4ZZtO_-0GzoGMmFAFBW7Dx82Ixeb0',
    },
    passwordHash: 'password123',
  },
  'developer@example.com': {
    user: {
      id: 'usr_student_002',
      email: 'student@example.com',
      name: 'Aditya Pratama (Applicant)',
      role: 'user',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDRXFBxUjCpGdRbBtDglrUI9r0UObWZSKwToACymGmYCvcXOI5jJmOY1K9jnXrPMnGyN7wRgSxzlV2wWKNUnA5YXNh2aBj5dHELN0nXjiAJmMnDW9ozGQoLHG0BJh_XdSHFEMToNfXdjT61N3TpAj1uIXV0XV3WIlL67H51vIBWot9QxN9TZBbQQITht79m_kuWxNu3VgKan7I9uCA0Utl7-T_4ZZtO_-0GzoGMmFAFBW7Dx82Ixeb0',
    },
    passwordHash: 'password123',
  },
  'guest@example.com': {
    user: {
      id: 'usr_guest_003',
      email: 'guest@example.com',
      name: 'Guest Explorer',
      role: 'user',
    },
    passwordHash: 'password123',
  },
};

export class AuthDummyApi {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    log.info(`[DummyAPI] Processing login request for: ${credentials.email}`);
    await simulateDelay(280);

    const email = credentials.email.toLowerCase().trim();
    const matched = DUMMY_USERS[email];

    // If matches a predefined demo account
    if (matched) {
      if (credentials.password !== matched.passwordHash) {
        log.warn(`[DummyAPI] Invalid password provided for: ${email}`);
        throw new Error('Invalid email or password.');
      }

      const token = `jwt_dummy_${matched.user.id}_${Date.now()}`;
      log.info(`[DummyAPI] Login successful for: ${email}`);
      return {
        token,
        user: matched.user,
      };
    }

    // Allow custom email with minimum 6 characters password for testing
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const newUser: AuthUser = {
      id: `usr_${Date.now().toString(36)}`,
      email,
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      role: email.includes('admin') ? 'admin' : 'user',
    };

    const token = `jwt_dummy_${newUser.id}_${Date.now()}`;
    log.info(`[DummyAPI] Custom user login successful for: ${email}`);
    return {
      token,
      user: newUser,
    };
  }

  async getProfile(userId: string): Promise<AuthUser> {
    await simulateDelay(120);
    const found = Object.values(DUMMY_USERS).find((entry) => entry.user.id === userId);
    if (found) {
      return found.user;
    }
    return {
      id: userId,
      email: 'user@example.com',
      name: 'Active User',
      role: 'user',
    };
  }
}

export const authDummyApi = new AuthDummyApi();
