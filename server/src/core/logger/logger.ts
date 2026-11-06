import fs from 'node:fs';
import path from 'node:path';
import { tenantContext } from '../database/tenant-context.js';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogMetadata {
  requestId?: string;
  tenantId?: string;
  userId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  stack?: string;
  [key: string]: unknown;
}

class AppLogger {
  private readonly logsDir: string;
  private readonly errorLogFile: string;
  private readonly combinedLogFile: string;

  constructor() {
    this.logsDir = path.resolve(process.cwd(), 'logs');
    this.errorLogFile = path.join(this.logsDir, 'error.log');
    this.combinedLogFile = path.join(this.logsDir, 'combined.log');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    try {
      if (!fs.existsSync(this.logsDir)) {
        fs.mkdirSync(this.logsDir, { recursive: true });
      }
    } catch (err) {
      console.error('[Logger] Failed to create logs directory:', err);
    }
  }

  private formatMessage(level: LogLevel, message: string, meta?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    const requestId = meta?.requestId || tenantContext.getRequestId() || '-';
    let tenantId = '-';
    try {
      tenantId = meta?.tenantId || tenantContext.getTenantId();
    } catch {
      // outside tenant scope
    }

    const contextParts = [
      `[${timestamp}]`,
      `[${level.padEnd(5)}]`,
      `[req:${requestId}]`,
      `[tenant:${tenantId}]`
    ];

    if (meta?.method && meta?.url) {
      contextParts.push(`[${meta.method} ${meta.url}]`);
    }

    let formatted = `${contextParts.join(' ')} - ${message}`;

    if (meta?.stack) {
      formatted += `\n  Stack: ${meta.stack}`;
    }

    return formatted;
  }

  private async appendToFile(filePath: string, line: string): Promise<void> {
    try {
      await fs.promises.appendFile(filePath, line + '\n', 'utf8');
    } catch (err) {
      console.error('[Logger] Failed to write log to file:', err);
    }
  }

  public info(message: string, meta?: LogMetadata): void {
    const logLine = this.formatMessage('INFO', message, meta);
    console.log(logLine);
    this.appendToFile(this.combinedLogFile, logLine);
  }

  public warn(message: string, meta?: LogMetadata): void {
    const logLine = this.formatMessage('WARN', message, meta);
    console.warn(logLine);
    this.appendToFile(this.combinedLogFile, logLine);
  }

  public error(message: string, meta?: LogMetadata): void {
    const logLine = this.formatMessage('ERROR', message, meta);
    console.error(logLine);
    this.appendToFile(this.errorLogFile, logLine);
    this.appendToFile(this.combinedLogFile, logLine);
  }
}

export const logger = new AppLogger();
