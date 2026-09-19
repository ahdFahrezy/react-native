import { ApiClientConfig } from '@/types/health.types';
import { logger } from '@/utils/logger';
import { SecureStorage } from '@/storage/secureStorage';

const log = logger.createScope('HTTP');

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public responseData?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private config: ApiClientConfig;

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = {
      baseUrl: config?.baseUrl ?? process.env.EXPO_PUBLIC_API_URL ?? 'https://httpbin.org',
      timeoutMs: config?.timeoutMs ?? 7000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(config?.headers ?? {}),
      },
    };
  }

  public setBaseUrl(url: string) {
    this.config.baseUrl = url;
    log.info(`Base URL changed to: ${url}`);
  }

  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  private async request<T>(method: string, path: string, body?: unknown, options?: RequestInit): Promise<T> {
    const url = path.startsWith('http') ? path : `${this.config.baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    const startTime = Date.now();

    log.info(`🚀 ${method} ${url}`, body ? { payload: body } : undefined);

    try {
      // Auto-inject JWT token from SecureStorage if available
      const token = await SecureStorage.getAuthToken();
      const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(url, {
        ...options,
        method,
        headers: {
          ...this.config.headers,
          ...authHeaders,
          ...(options?.headers ?? {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timer);
      const duration = Date.now() - startTime;

      if (!response.ok) {
        log.warn(`⚠️ ${method} ${url} [${response.status}] (${duration}ms)`);
        throw new ApiError(
          `Request failed with status ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      log.info(`✅ ${method} ${url} [${response.status}] (${duration}ms)`);

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as T;
      }

      const text = await response.text();
      try {
        return JSON.parse(text) as T;
      } catch {
        return { message: text } as unknown as T;
      }
    } catch (error: unknown) {
      clearTimeout(timer);
      const duration = Date.now() - startTime;

      if (error instanceof ApiError) {
        throw error;
      }

      let errorMessage = 'Unknown network error';
      if (error instanceof Error && error.name === 'AbortError') {
        errorMessage = `Request timeout after ${this.config.timeoutMs}ms`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      log.error(`❌ ${method} ${url} (${duration}ms): ${errorMessage}`);
      throw new ApiError(`Network error: ${errorMessage}`);
    }
  }

  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }
}

export const apiClient = new ApiClient();
