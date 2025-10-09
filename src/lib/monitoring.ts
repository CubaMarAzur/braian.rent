import { initializeTelemetry } from './telemetry';
import { initializeSentry } from './sentry';
import { appLogger } from './logger';

// Initialize all monitoring systems
export function initializeMonitoring() {
  try {
    appLogger.info('Initializing monitoring systems...');

    // Initialize OpenTelemetry first
    initializeTelemetry();

    // Initialize Sentry
    initializeSentry();

    appLogger.info('All monitoring systems initialized successfully');
  } catch (error) {
    appLogger.error('Failed to initialize monitoring systems', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Graceful shutdown for monitoring systems
export function shutdownMonitoring() {
  try {
    appLogger.info('Shutting down monitoring systems...');

    // Note: Sentry and OpenTelemetry will handle their own cleanup
    // This is mainly for logging

    appLogger.info('Monitoring systems shutdown completed');
  } catch (error) {
    appLogger.error('Error during monitoring shutdown', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Process event handlers
process.on('SIGTERM', () => {
  appLogger.info('SIGTERM received, shutting down gracefully...');
  shutdownMonitoring();
  process.exit(0);
});

process.on('SIGINT', () => {
  appLogger.info('SIGINT received, shutting down gracefully...');
  shutdownMonitoring();
  process.exit(0);
});

process.on('uncaughtException', error => {
  appLogger.error('Uncaught exception', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  });

  // Give time for logs to flush
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  appLogger.error('Unhandled promise rejection', {
    reason:
      reason instanceof Error
        ? {
            name: reason.name,
            message: reason.message,
            stack: reason.stack,
          }
        : reason,
    promise: promise.toString(),
  });
});

const monitoring = {
  initialize: initializeMonitoring,
  shutdown: shutdownMonitoring,
};

export default monitoring;
