import * as Sentry from '@sentry/nextjs';
import { config } from './config';
import { appLogger } from './logger';

// Initialize Sentry
export function initializeSentry() {
  if (!config.monitoring.sentry.enabled) {
    appLogger.info('Sentry disabled - skipping initialization');
    return;
  }

  try {
    Sentry.init({
      dsn: config.monitoring.sentry.dsn,
      environment: config.monitoring.sentry.environment,

      // Performance monitoring
      tracesSampleRate: config.app.isProduction ? 0.1 : 1.0,

      // Session replay
      replaysSessionSampleRate: config.app.isProduction ? 0.01 : 0.1,
      replaysOnErrorSampleRate: 1.0,

      // Release tracking
      release: config.app.version,

      // Error filtering
      beforeSend(event, hint) {
        // Filter out certain errors in development
        if (config.app.isDevelopment) {
          const error = hint.originalException;
          if (error instanceof Error) {
            // Filter out common development errors
            if (
              error.message.includes('ResizeObserver') ||
              error.message.includes('Non-Error promise rejection')
            ) {
              return null;
            }
          }
        }

        // Log error to our logger
        appLogger.error('Sentry error captured', {
          eventId: event.event_id,
          level: event.level,
          message: event.message,
          exception: event.exception,
          tags: event.tags,
        });

        return event;
      },

      // Integration configuration
      integrations: [
        // Integrations are auto-detected in Sentry Next.js SDK
      ],

      // Additional options
      maxBreadcrumbs: 50,
      attachStacktrace: true,
      sendDefaultPii: false, // Don't send personally identifiable information

      // Custom tags
      initialScope: {
        tags: {
          component: 'braian-rent',
          environment: config.app.environment,
        },
      },
    });

    appLogger.info('Sentry initialized successfully', {
      environment: config.monitoring.sentry.environment,
      dsn: config.monitoring.sentry.dsn ? 'configured' : 'not configured',
    });
  } catch (error) {
    appLogger.error('Failed to initialize Sentry', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Sentry wrapper for API routes (simplified for Next.js)
export function withSentryApiHandler<T extends (...args: unknown[]) => unknown>(
  handler: T
): T {
  // Sentry Next.js SDK handles this automatically
  return handler;
}

// Sentry wrapper for server components (simplified for Next.js)
export function withSentryServerComponent<
  T extends (...args: unknown[]) => unknown,
>(component: T): T {
  // Sentry Next.js SDK handles this automatically
  return component;
}

// Custom error capture with context
export function captureError(
  error: Error,
  context?: {
    tags?: Record<string, string>;
    user?: { id?: string; email?: string };
    extra?: Record<string, unknown>;
    level?: 'error' | 'warning' | 'info' | 'debug';
  }
) {
  Sentry.withScope(scope => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.user) {
      scope.setUser(context.user);
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    if (context?.level) {
      scope.setLevel(context.level);
    }

    Sentry.captureException(error);
  });
}

// Custom message capture
export function captureMessage(
  message: string,
  level: 'error' | 'warning' | 'info' | 'debug' = 'info',
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
) {
  Sentry.withScope(scope => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    scope.setLevel(level);
    Sentry.captureMessage(message);
  });
}

// Performance monitoring helpers (simplified)
export function startTransaction(
  name: string,
  _op = 'function',
  _data?: Record<string, unknown>
) {
  // Sentry Next.js SDK handles transactions automatically
  console.log(`[Sentry] Starting transaction: ${name}`);
  return {
    finish: () => console.log(`[Sentry] Finished transaction: ${name}`),
    setTag: () => {},
    setData: () => {},
  };
}

export function addBreadcrumb(
  message: string,
  category: string = 'custom',
  level: 'error' | 'warning' | 'info' | 'debug' = 'info',
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

// User context helpers
export function setUserContext(user: {
  id?: string;
  email?: string;
  role?: string;
  properties?: string[];
}) {
  Sentry.setUser(user);
}

export function clearUserContext() {
  Sentry.setUser(null);
}

// Custom tags helpers
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

export function setContext(key: string, context: Record<string, unknown>) {
  Sentry.setContext(key, context);
}

// Error boundary for React components (simplified)
export const SentryErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;
