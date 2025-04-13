// utils/logger.ts

export enum LogLevel {
  INFO = 1,
  DEBUG = 2,
  WARN = 3,
  ERROR = 4,
}

// Import log level from .env
const CURRENT_LOG_LEVEL: LogLevel =
  (parseInt(import.meta.env.VITE_LOG_LEVEL || "1") as LogLevel) || 1;

export const logEvent = (eventName: string, data: any, level: LogLevel = 1) => {
  if (level <= CURRENT_LOG_LEVEL) {
    console.log(`[Level ${level}] ${eventName}`, data);

    // LogRocket.log(`[Level ${level}] ${eventName}`, data);
  }
};
