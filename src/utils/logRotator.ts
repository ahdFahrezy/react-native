import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { LogEntry, LogFileInfo, LogRotatorConfig } from '@/types/logger.types';

export class LogRotator {
  private maxFileSizeBytes: number;
  private maxBackupFiles: number;
  private logDirectory: string | null = null;
  private activeFilePath: string | null = null;
  private isInitialized = false;
  private isWriting = false;
  private writeQueue: string[] = [];
  
  // In-memory fallback for web or when file system is not available
  private memoryLogs: string[] = [];
  private readonly maxMemoryLogs = 1000;

  constructor(config?: LogRotatorConfig) {
    this.maxFileSizeBytes = config?.maxFileSizeBytes ?? 512 * 1024; // 512 KB
    this.maxBackupFiles = config?.maxBackupFiles ?? 3;

    if (Platform.OS !== 'web' && FileSystem.documentDirectory) {
      const dirName = config?.directoryName ?? 'logs';
      const fileName = config?.activeFileName ?? 'app.log';
      this.logDirectory = `${FileSystem.documentDirectory}${dirName}/`;
      this.activeFilePath = `${this.logDirectory}${fileName}`;
    }
  }

  /**
   * Initializes the log directory on device storage.
   */
  public async init(): Promise<void> {
    if (this.isInitialized || !this.logDirectory) return;

    try {
      const dirInfo = await FileSystem.getInfoAsync(this.logDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.logDirectory, { intermediates: true });
      }
      this.isInitialized = true;
    } catch (error) {
      console.warn('[LogRotator] Failed to initialize log directory:', error);
    }
  }

  /**
   * Formats and writes a log entry to disk with automatic rotation.
   */
  public async write(entry: LogEntry): Promise<void> {
    const formattedLine = this.formatEntry(entry);

    if (Platform.OS === 'web' || !this.activeFilePath) {
      this.memoryLogs.push(formattedLine);
      if (this.memoryLogs.length > this.maxMemoryLogs) {
        this.memoryLogs.shift();
      }
      return;
    }

    this.writeQueue.push(formattedLine);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isWriting || this.writeQueue.length === 0 || !this.activeFilePath) {
      return;
    }

    this.isWriting = true;

    try {
      if (!this.isInitialized) {
        await this.init();
      }

      const chunk = this.writeQueue.join('');
      this.writeQueue = [];

      // Check current file info
      const fileInfo = await FileSystem.getInfoAsync(this.activeFilePath);

      if (fileInfo.exists) {
        if (fileInfo.size + chunk.length >= this.maxFileSizeBytes) {
          await this.rotate();
        }
      }

      // Read existing content and append (safe append)
      let existingContent = '';
      if (fileInfo.exists) {
        existingContent = await FileSystem.readAsStringAsync(this.activeFilePath);
      }

      await FileSystem.writeAsStringAsync(this.activeFilePath, existingContent + chunk, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (error) {
      console.warn('[LogRotator] Failed to write log chunk:', error);
    } finally {
      this.isWriting = false;
      if (this.writeQueue.length > 0) {
        this.processQueue();
      }
    }
  }

  /**
   * Rotates log files:
   * app.3.log -> deleted
   * app.2.log -> app.3.log
   * app.1.log -> app.2.log
   * app.log   -> app.1.log
   * Creates new empty app.log
   */
  public async rotate(): Promise<void> {
    if (!this.logDirectory || !this.activeFilePath) return;

    try {
      // 1. Delete oldest backup file if it exists
      const oldestBackup = `${this.logDirectory}app.${this.maxBackupFiles}.log`;
      const oldestInfo = await FileSystem.getInfoAsync(oldestBackup);
      if (oldestInfo.exists) {
        await FileSystem.deleteAsync(oldestBackup, { idempotent: true });
      }

      // 2. Shift older backup files
      for (let i = this.maxBackupFiles - 1; i >= 1; i--) {
        const currentFile = `${this.logDirectory}app.${i}.log`;
        const nextFile = `${this.logDirectory}app.${i + 1}.log`;

        const curInfo = await FileSystem.getInfoAsync(currentFile);
        if (curInfo.exists) {
          await FileSystem.moveAsync({ from: currentFile, to: nextFile });
        }
      }

      // 3. Move active log to app.1.log
      const firstBackup = `${this.logDirectory}app.1.log`;
      await FileSystem.moveAsync({ from: this.activeFilePath, to: firstBackup });

      // 4. Initialize fresh active log file
      const timestamp = new Date().toISOString();
      await FileSystem.writeAsStringAsync(
        this.activeFilePath,
        `--- [LOG ROTATED AT ${timestamp}] ---\n`,
        { encoding: FileSystem.EncodingType.UTF8 }
      );
    } catch (error) {
      console.warn('[LogRotator] Rotation failed:', error);
    }
  }

  /**
   * Reads all logs from active and backup files (oldest to newest).
   */
  public async readAllLogs(): Promise<string> {
    if (Platform.OS === 'web' || !this.logDirectory || !this.activeFilePath) {
      return this.memoryLogs.join('');
    }

    try {
      const parts: string[] = [];

      // Read from oldest backup down to newest backup
      for (let i = this.maxBackupFiles; i >= 1; i--) {
        const filePath = `${this.logDirectory}app.${i}.log`;
        const info = await FileSystem.getInfoAsync(filePath);
        if (info.exists) {
          const content = await FileSystem.readAsStringAsync(filePath);
          parts.push(`--- [app.${i}.log] ---\n${content}`);
        }
      }

      // Read current active log
      const activeInfo = await FileSystem.getInfoAsync(this.activeFilePath);
      if (activeInfo.exists) {
        const activeContent = await FileSystem.readAsStringAsync(this.activeFilePath);
        parts.push(`--- [app.log (active)] ---\n${activeContent}`);
      }

      return parts.join('\n');
    } catch (error) {
      console.warn('[LogRotator] Failed to read logs:', error);
      return '';
    }
  }

  /**
   * Returns list of log files with size and path info.
   */
  public async getLogFiles(): Promise<LogFileInfo[]> {
    if (Platform.OS === 'web' || !this.logDirectory) {
      return [
        {
          name: 'memory.log',
          size: this.memoryLogs.join('').length,
          uri: 'memory://logs',
        },
      ];
    }

    try {
      const results: LogFileInfo[] = [];
      const dirContents = await FileSystem.readDirectoryAsync(this.logDirectory);

      for (const fileName of dirContents) {
        const fileUri = `${this.logDirectory}${fileName}`;
        const info = await FileSystem.getInfoAsync(fileUri);
        if (info.exists && !info.isDirectory) {
          results.push({
            name: fileName,
            size: info.size,
            uri: fileUri,
            modificationTime: info.modificationTime,
          });
        }
      }

      return results.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.warn('[LogRotator] Failed to get log files:', error);
      return [];
    }
  }

  /**
   * Deletes all log files from disk / clears memory.
   */
  public async clearLogs(): Promise<void> {
    this.memoryLogs = [];

    if (Platform.OS === 'web' || !this.logDirectory) return;

    try {
      const dirInfo = await FileSystem.getInfoAsync(this.logDirectory);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(this.logDirectory, { idempotent: true });
        this.isInitialized = false;
        await this.init();
      }
    } catch (error) {
      console.warn('[LogRotator] Failed to clear logs:', error);
    }
  }

  private formatEntry(entry: LogEntry): string {
    const isoTime = new Date().toISOString();
    const tag = entry.tag ? `[${entry.tag}]` : '';
    const dataPart = entry.data !== undefined ? ` ${JSON.stringify(entry.data)}` : '';
    return `[${isoTime}] [${entry.level.toUpperCase()}] ${tag} ${entry.message}${dataPart}\n`;
  }
}

export const logRotator = new LogRotator();
