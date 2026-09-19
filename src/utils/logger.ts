import { ILogger, LogEntry, LogLevel, LogListener } from '@/types/logger.types';
import { logRotator } from '@/utils/logRotator';

class Logger implements ILogger {
  private listeners: Set<LogListener> = new Set();

  constructor(private tag?: string) {
    // Automatically pipe all logs to the LogRotator
    this.addListener((entry) => logRotator.write(entry));
  }

  /**
   * Register a custom listener for monitoring services (e.g. Sentry, Bugsnag, Crashlytics).
   */
  public addListener(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Creates a scoped logger instance with a specific tag/namespace.
   * Example: const log = logger.createScope('ApiClient');
   */
  public createScope(tag: string): ILogger {
    const scopedLogger = new Logger(tag);
    // Forward scoped logs to root listeners
    scopedLogger.addListener((entry) => {
      this.listeners.forEach((listener) => {
        try {
          listener(entry);
        } catch (err) {
          console.error('[Logger] Listener execution error:', err);
        }
      });
    });
    return scopedLogger;
  }

  public debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  public info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  public warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  public error(message: string, error?: unknown): void {
    this.log('error', message, error);
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

    // In production: silence debug & info logs from console for performance and privacy
    if (!isDev && (level === 'debug' || level === 'info')) {
      return;
    }

    const entry: LogEntry = {
      level,
      tag: this.tag,
      message,
      data,
      timestamp,
    };

    // Broadcast to registered listeners (LogRotator, Sentry, etc.)
    this.listeners.forEach((listener) => {
      try {
        listener(entry);
      } catch (err) {
        console.error('[Logger] Listener error:', err);
      }
    });

    const prefix = this.getPrefix(level, timestamp);

    switch (level) {
      case 'debug':
        if (data !== undefined) {
          console.debug(prefix, message, data);
        } else {
          console.debug(prefix, message);
        }
        break;
      case 'info':
        if (data !== undefined) {
          console.info(prefix, message, data);
        } else {
          console.info(prefix, message);
        }
        break;
      case 'warn':
        if (data !== undefined) {
          console.warn(prefix, message, data);
        } else {
          console.warn(prefix, message);
        }
        break;
      case 'error':
        if (data !== undefined) {
          console.error(prefix, message, data);
        } else {
          console.error(prefix, message);
        }
        break;
    }
  }

  private getPrefix(level: LogLevel, timestamp: string): string {
    const tagPart = this.tag ? `[${this.tag}]` : '';
    switch (level) {
      case 'debug':
        return `🔍 [${timestamp}]${tagPart}`;
      case 'info':
        return `ℹ️  [${timestamp}]${tagPart}`;
      case 'warn':
        return `⚠️  [${timestamp}]${tagPart}`;
      case 'error':
        return `❌ [${timestamp}]${tagPart}`;
    }
  }
}

export const logger = new Logger();
export { logRotator } from '@/utils/logRotator';
