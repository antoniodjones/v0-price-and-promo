// Define log levels
enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  HTTP = 3,
  DEBUG = 4,
}

// Define colors for console output
const colors = {
  error: "\x1b[31m", // red
  warn: "\x1b[33m", // yellow
  info: "\x1b[32m", // green
  http: "\x1b[35m", // magenta
  debug: "\x1b[37m", // white
  reset: "\x1b[0m", // reset
}

class Logger {
  private level: LogLevel

  constructor() {
    this.level = process.env.NODE_ENV === "development" ? LogLevel.DEBUG : LogLevel.WARN
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const color = colors[level as keyof typeof colors] || colors.reset
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : ""
    return `${color}${timestamp} ${level.toUpperCase()}: ${message}${metaStr}${colors.reset}`
  }

  private log(level: LogLevel, levelName: string, message: string, meta?: any) {
    if (level <= this.level) {
      const formattedMessage = this.formatMessage(levelName, message, meta)
      console.log(formattedMessage)
    }
  }

  error(message: string, error?: any) {
    const meta = error
      ? {
          error: error?.message || error,
          stack: error?.stack,
        }
      : undefined
    this.log(LogLevel.ERROR, "error", message, meta)
  }

  warn(message: string, meta?: any) {
    this.log(LogLevel.WARN, "warn", message, meta)
  }

  info(message: string, meta?: any) {
    this.log(LogLevel.INFO, "info", message, meta)
  }

  http(message: string, meta?: any) {
    this.log(LogLevel.HTTP, "http", message, meta)
  }

  debug(message: string, meta?: any) {
    this.log(LogLevel.DEBUG, "debug", message, meta)
  }
}

const logger = new Logger()

export { logger }
export default logger

// Helper functions for different log levels
export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta)
}

export const logError = (message: string, error?: any) => {
  logger.error(message, error)
}

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta)
}

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta)
}

export const logHttp = (message: string, meta?: any) => {
  logger.http(message, meta)
}
