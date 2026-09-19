export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  tag?: string;
  message: string;
  data?: unknown;
  timestamp: string;
}

export type LogListener = (entry: LogEntry) => void | Promise<void>;

export interface ILogger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, error?: unknown): void;
  createScope(tag: string): ILogger;
}

export interface LogRotatorConfig {
  maxFileSizeBytes?: number; // Default: 512 KB
  maxBackupFiles?: number;   // Default: 3 files (app.1.log, app.2.log, app.3.log)
  directoryName?: string;    // Default: 'logs'
  activeFileName?: string;   // Default: 'app.log'
}

export interface LogFileInfo {
  name: string;
  size: number;
  uri: string;
  modificationTime?: number;
}
