import winston from 'winston';
import { config } from './config';

// Custom log format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const logEntry = {
      timestamp,
      level,
      message,
      service: 'braian-rent',
      environment: config.app.environment,
      version: config.app.version,
      ...meta,
    };
    return JSON.stringify(logEntry);
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.monitoring.logging.level,
  format: logFormat,
  defaultMeta: {
    service: 'braian-rent',
    environment: config.app.environment,
    version: config.app.version,
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: config.app.isDevelopment
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const metaStr = Object.keys(meta).length
                ? ` ${JSON.stringify(meta)}`
                : '';
              return `${timestamp} [${level}]: ${message}${metaStr}`;
            })
          )
        : logFormat,
    }),
  ],
});

// Add file transport in production
if (config.app.isProduction) {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Logger interface for type safety
export interface Logger {
  error: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
  http: (message: string, meta?: Record<string, unknown>) => void;
}

// Create typed logger instance
export const appLogger: Logger = {
  error: (message: string, meta?: Record<string, unknown>) => {
    logger.error(message, meta);
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    logger.warn(message, meta);
  },
  info: (message: string, meta?: Record<string, unknown>) => {
    logger.info(message, meta);
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    logger.debug(message, meta);
  },
  http: (message: string, meta?: Record<string, unknown>) => {
    logger.info(message, { ...meta, type: 'http' });
  },
};

/**
 * Logs an incoming HTTP request with relevant metadata
 * @param req - Request information including method, URL, headers, userAgent, and IP
 */
export const logRequest = (req: {
  method: string;
  url: string;
  headers: Record<string, string>;
  userAgent?: string;
  ip?: string;
}) => {
  appLogger.http('Incoming request', {
    method: req.method,
    url: req.url,
    userAgent: req.userAgent,
    ip: req.ip,
    requestId: req.headers['x-request-id'],
  });
};

// Response logging helper
export const logResponse = (
  req: { method: string; url: string },
  res: { statusCode: number; responseTime?: number }
) => {
  const level = res.statusCode >= 400 ? 'warn' : 'info';
  appLogger[level]('Request completed', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: res.responseTime,
  });
};

// Error logging helper
export const logError = (error: Error, context?: Record<string, unknown>) => {
  appLogger.error('Application error', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    ...context,
  });
};

// Database logging helper
export const logDatabase = (
  operation: string,
  table: string,
  duration: number,
  success: boolean
) => {
  const level = success ? 'debug' : 'error';
  appLogger[level]('Database operation', {
    operation,
    table,
    duration: `${duration}ms`,
    success,
  });
};

// Performance logging helper
export const logPerformance = (
  operation: string,
  duration: number,
  metadata?: Record<string, unknown>
) => {
  appLogger.info('Performance metric', {
    operation,
    duration: `${duration}ms`,
    ...metadata,
  });
};

// Security logging helper
export const logSecurity = (
  event: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  metadata?: Record<string, unknown>
) => {
  const level =
    severity === 'critical' || severity === 'high' ? 'error' : 'warn';
  appLogger[level]('Security event', {
    event,
    severity,
    ...metadata,
  });
};

// Business logic logging helper
export const logBusiness = (
  action: string,
  userId?: string,
  metadata?: Record<string, unknown>
) => {
  appLogger.info('Business action', {
    action,
    userId,
    ...metadata,
  });
};

// Export default logger
export default appLogger;
