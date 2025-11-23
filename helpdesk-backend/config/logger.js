/**
 * Logger Configuration
 * 
 * Simple logging wrapper with log levels and formatting.
 * Can be easily swapped with winston, pino, etc. if needed.
 */

import config, { isTest, isProduction } from './env.js';

// ======================
// Log Levels
// ======================

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

// Map env log level to our levels
const getLogLevel = () => {
  if (isTest()) return LOG_LEVELS.error;  // Minimal logging in tests
  if (isProduction()) return LOG_LEVELS.info;
  return LOG_LEVELS.debug;  // Full logging in development
};

const currentLevel = getLogLevel();

// ======================
// Formatting
// ======================

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatMessage = (level, message, meta = {}) => {
  const timestamp = getTimestamp();
  const metaStr = Object.keys(meta).length > 0 
    ? ` ${JSON.stringify(meta)}` 
    : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
};

// ======================
// Colors (for terminal)
// ======================

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

const colorize = (color, text) => {
  if (isProduction()) return text;  // No colors in production
  return `${color}${text}${colors.reset}`;
};

// ======================
// Logger Object
// ======================

export const logger = {
  /**
   * Error - Always shown
   */
  error(message, meta = {}) {
    if (currentLevel >= LOG_LEVELS.error) {
      const formatted = formatMessage('error', message, meta);
      console.error(colorize(colors.red, formatted));
    }
  },

  /**
   * Warning - Shown in development and production
   */
  warn(message, meta = {}) {
    if (currentLevel >= LOG_LEVELS.warn) {
      const formatted = formatMessage('warn', message, meta);
      console.warn(colorize(colors.yellow, formatted));
    }
  },

  /**
   * Info - General information
   */
  info(message, meta = {}) {
    if (currentLevel >= LOG_LEVELS.info) {
      const formatted = formatMessage('info', message, meta);
      console.info(colorize(colors.blue, formatted));
    }
  },

  /**
   * Debug - Development only
   */
  debug(message, meta = {}) {
    if (currentLevel >= LOG_LEVELS.debug) {
      const formatted = formatMessage('debug', message, meta);
      console.log(colorize(colors.gray, formatted));
    }
  },

  /**
   * Log HTTP request (for custom middleware)
   */
  request(method, url, statusCode, duration) {
    const color = statusCode >= 400 ? colors.red : colors.blue;
    const message = `${method} ${url} ${statusCode} - ${duration}ms`;
    if (currentLevel >= LOG_LEVELS.info) {
      console.log(colorize(color, `[${getTimestamp()}] [HTTP] ${message}`));
    }
  },

  /**
   * Log with custom level
   */
  log(level, message, meta = {}) {
    const logFn = this[level];
    if (logFn) {
      logFn.call(this, message, meta);
    }
  }
};

// ======================
// Shorthand Exports
// ======================

export const { error, warn, info, debug } = logger;

export default logger;