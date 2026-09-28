/**
 * Conditional logging utility
 * Only logs in development or when ENABLE_LOGGING is true
 */

import { config } from '@/lib/config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Check if logging is enabled
 */
function isLoggingEnabled(): boolean {
  return config.features.enableLogging;
}

/**
 * Log a message to console (conditional on environment)
 */
export function log(level: LogLevel, message: string, ...args: unknown[]): void {
  if (!isLoggingEnabled()) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  switch (level) {
    case 'error':
      console.error(prefix, message, ...args);
      break;
    case 'warn':
      console.warn(prefix, message, ...args);
      break;
    case 'debug':
      console.debug(prefix, message, ...args);
      break;
    case 'info':
    default:
      console.log(prefix, message, ...args);
      break;
  }
}

/**
 * Log an error (only in development or when ENABLE_LOGGING=true)
 */
export function logError(message: string, error?: unknown): void {
  log('error', message, error);
}

/**
 * Log a warning
 */
export function logWarn(message: string, ...args: unknown[]): void {
  log('warn', message, ...args);
}

/**
 * Log info
 */
export function logInfo(message: string, ...args: unknown[]): void {
  log('info', message, ...args);
}

/**
 * Log debug (only in development)
 */
export function logDebug(message: string, ...args: unknown[]): void {
  if (config.features.isDevelopment) {
    log('debug', message, ...args);
  }
}
