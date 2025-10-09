import { env, isDevelopment, isProduction } from './env';

// Application configuration
export const config = {
  // App info
  app: {
    name: 'Braian.rent',
    version: '0.1.0',
    description: 'Platforma do zarządzania najmem w Polsce',
    url: env.NEXT_PUBLIC_APP_URL,
    environment: env.NEXT_PUBLIC_APP_ENV,
    isDevelopment,
    isProduction,
  },

  // Database configuration
  database: {
    url: env.DATABASE_URL,
    poolSize: env.DATABASE_POOL_SIZE || 10,
    timeout: env.DATABASE_TIMEOUT || 20000,
  },

  // Security configuration
  security: {
    jwtSecret: env.JWT_SECRET,
    sessionSecret: env.SESSION_SECRET,
    nextAuthSecret: env.NEXTAUTH_SECRET,
    nextAuthUrl: env.NEXTAUTH_URL,
    // Security headers configuration
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': isProduction
        ? 'max-age=31536000; includeSubDomains'
        : '',
    },
  },

  // API configuration
  api: {
    baseUrl: env.NEXT_PUBLIC_APP_URL,
    rateLimit: {
      max: env.API_RATE_LIMIT_MAX || 100,
      window: env.API_RATE_LIMIT_WINDOW || 900000,
    },
    cors: {
      origin: isDevelopment
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
        : [env.NEXT_PUBLIC_APP_URL],
      credentials: true,
    },
  },

  // Firebase configuration
  firebase: {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
    enabled: Boolean(
      env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
        env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ),
  },

  // Email configuration
  email: {
    apiKey: env.EMAIL_API_KEY,
    from: env.EMAIL_FROM || 'noreply@braian.rent',
    enabled: Boolean(env.EMAIL_API_KEY),
  },

  // Monitoring configuration
  monitoring: {
    sentry: {
      dsn: env.SENTRY_DSN,
      environment: env.SENTRY_ENVIRONMENT || env.NEXT_PUBLIC_APP_ENV,
      enabled: Boolean(env.SENTRY_DSN),
    },
    logging: {
      level: env.LOG_LEVEL,
      enabled: true,
    },
  },

  // Google Cloud Platform configuration
  gcp: {
    projectId: env.GOOGLE_CLOUD_PROJECT_ID,
    storageBucket: env.GOOGLE_CLOUD_STORAGE_BUCKET,
    enabled: Boolean(env.GOOGLE_CLOUD_PROJECT_ID),
  },

  // Feature flags
  features: {
    chat: env.NEXT_PUBLIC_ENABLE_CHAT ?? true,
    notifications: env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS ?? true,
    analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS ?? false,
  },

  // Development-specific configuration
  development: {
    enableSwagger: true,
    enablePlayground: true,
    logLevel: 'debug',
  },

  // Production-specific configuration
  production: {
    enableSwagger: false,
    enablePlayground: false,
    logLevel: 'info',
    compression: true,
    caching: true,
  },
} as const;

// Type exports for better TypeScript support
export type AppConfig = typeof config;
export type SecurityConfig = typeof config.security;
export type ApiConfig = typeof config.api;
export type DatabaseConfig = typeof config.database;
export type FeatureFlags = typeof config.features;

// Helper functions
export const getConfig = () => config;

export const isFeatureEnabled = (
  feature: keyof typeof config.features
): boolean => {
  return config.features[feature];
};

export const getApiUrl = (path: string = ''): string => {
  return `${config.api.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export const getDatabaseConfig = () => config.database;

export const getSecurityConfig = () => config.security;

// Validation helpers
export const validateConfig = (): boolean => {
  const errors: string[] = [];

  // Required configurations
  if (!config.database.url) {
    errors.push('Database URL is required');
  }

  if (!config.security.jwtSecret) {
    errors.push('JWT Secret is required');
  }

  if (!config.security.sessionSecret) {
    errors.push('Session Secret is required');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    return false;
  }

  return true;
};

// Export default configuration
export default config;
