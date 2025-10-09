import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { config } from './config';
import { appLogger } from './logger';

// Create simplified OpenTelemetry SDK instance
const sdk = new NodeSDK({
  serviceName: 'braian-rent',

  // Simplified instrumentations for Next.js compatibility
  instrumentations: [
    getNodeAutoInstrumentations({
      // Minimal instrumentations to avoid build issues
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-dns': { enabled: false },
      '@opentelemetry/instrumentation-winston': { enabled: false },
    }),
  ],
});

// Initialize OpenTelemetry
export function initializeTelemetry() {
  try {
    sdk.start();
    appLogger.info('OpenTelemetry initialized successfully', {
      serviceName: 'braian-rent',
      serviceVersion: config.app.version,
      environment: config.app.environment,
      metricsPort: 9464,
    });
  } catch (error) {
    appLogger.error('Failed to initialize OpenTelemetry', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Graceful shutdown
export function shutdownTelemetry() {
  sdk
    .shutdown()
    .then(() => {
      appLogger.info('OpenTelemetry shutdown completed');
    })
    .catch(error => {
      appLogger.error('Error during OpenTelemetry shutdown', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });
}

// Custom metrics helpers
export const metrics = {
  // HTTP request metrics
  httpRequests: {
    total: 0,
    success: 0,
    errors: 0,
    duration: [] as number[],
  },

  // Database metrics
  database: {
    queries: 0,
    errors: 0,
    duration: [] as number[],
  },

  // Business metrics
  business: {
    userLogins: 0,
    propertiesCreated: 0,
    paymentsProcessed: 0,
    documentsUploaded: 0,
  },
};

// Metrics recording functions
export const recordHttpRequest = (
  method: string,
  path: string,
  statusCode: number,
  duration: number
) => {
  metrics.httpRequests.total++;
  metrics.httpRequests.duration.push(duration);

  if (statusCode >= 400) {
    metrics.httpRequests.errors++;
  } else {
    metrics.httpRequests.success++;
  }

  appLogger.debug('HTTP request recorded', {
    method,
    path,
    statusCode,
    duration: `${duration}ms`,
    totalRequests: metrics.httpRequests.total,
  });
};

export const recordDatabaseQuery = (
  operation: string,
  table: string,
  duration: number,
  success: boolean
) => {
  metrics.database.queries++;
  metrics.database.duration.push(duration);

  if (!success) {
    metrics.database.errors++;
  }

  appLogger.debug('Database query recorded', {
    operation,
    table,
    duration: `${duration}ms`,
    success,
    totalQueries: metrics.database.queries,
  });
};

export const recordBusinessEvent = (
  event: string,
  metadata?: Record<string, unknown>
) => {
  switch (event) {
    case 'user_login':
      metrics.business.userLogins++;
      break;
    case 'property_created':
      metrics.business.propertiesCreated++;
      break;
    case 'payment_processed':
      metrics.business.paymentsProcessed++;
      break;
    case 'document_uploaded':
      metrics.business.documentsUploaded++;
      break;
  }

  appLogger.info('Business event recorded', {
    event,
    ...metadata,
  });
};

// Get metrics summary
export const getMetricsSummary = () => {
  const avgHttpDuration =
    metrics.httpRequests.duration.length > 0
      ? metrics.httpRequests.duration.reduce((a, b) => a + b, 0) /
        metrics.httpRequests.duration.length
      : 0;

  const avgDbDuration =
    metrics.database.duration.length > 0
      ? metrics.database.duration.reduce((a, b) => a + b, 0) /
        metrics.database.duration.length
      : 0;

  return {
    timestamp: new Date().toISOString(),
    http: {
      total: metrics.httpRequests.total,
      success: metrics.httpRequests.success,
      errors: metrics.httpRequests.errors,
      avgDuration: Math.round(avgHttpDuration),
      errorRate:
        metrics.httpRequests.total > 0
          ? (
              (metrics.httpRequests.errors / metrics.httpRequests.total) *
              100
            ).toFixed(2) + '%'
          : '0%',
    },
    database: {
      queries: metrics.database.queries,
      errors: metrics.database.errors,
      avgDuration: Math.round(avgDbDuration),
      errorRate:
        metrics.database.queries > 0
          ? (
              (metrics.database.errors / metrics.database.queries) *
              100
            ).toFixed(2) + '%'
          : '0%',
    },
    business: metrics.business,
  };
};

export default sdk;
