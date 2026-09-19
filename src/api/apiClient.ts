import { ApiClientConfig } from '@/types/health.types';

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
      // Endpoint fallback publik yang reliable untuk testing
      baseUrl: config?.baseUrl ?? 'https://httpbin.org',
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
  }

  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  async get<T>(path: string, options?: RequestInit): Promise<T> {
    const url = path.startsWith('http') ? path : `${this.config.baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        method: 'GET',
        headers: {
          ...this.config.headers,
          ...(options?.headers ?? {}),
        },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        throw new ApiError(
          `Request failed with status ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      // Format response: jika content json parse as json, jika text parse text
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
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(`Request timeout after ${this.config.timeoutMs}ms`);
      }
      const message = error instanceof Error ? error.message : 'Unknown network error';
      throw new ApiError(`Network error: ${message}`);
    }
  }
}

export const apiClient = new ApiClient();
