import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXT_PUBLIC_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),

  // Database
  DATABASE_URL: z.string().url('Invalid DATABASE_URL format'),
  DATABASE_POOL_SIZE: z.string().transform(Number).optional(),
  DATABASE_TIMEOUT: z.string().transform(Number).optional(),

  // Next.js
  PORT: z.string().transform(Number).optional(),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('Invalid NEXT_PUBLIC_APP_URL format')
    .default('http://localhost:3000'),

  // Security
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  SESSION_SECRET: z
    .string()
    .min(32, 'SESSION_SECRET must be at least 32 characters'),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters')
    .optional(),
  NEXTAUTH_URL: z.string().url('Invalid NEXTAUTH_URL format').optional(),

  // Firebase (optional)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),

  // Email
  EMAIL_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email('Invalid EMAIL_FROM format').optional(),

  // Monitoring
  SENTRY_DSN: z.string().url('Invalid SENTRY_DSN format').optional(),
  SENTRY_ENVIRONMENT: z
    .enum(['development', 'staging', 'production'])
    .optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Google Cloud Platform
  GOOGLE_CLOUD_PROJECT_ID: z.string().optional(),
  GOOGLE_CLOUD_STORAGE_BUCKET: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_CHAT: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform(val => val === 'true')
    .optional(),

  // Rate Limiting
  API_RATE_LIMIT_MAX: z.string().transform(Number).optional(),
  API_RATE_LIMIT_WINDOW: z.string().transform(Number).optional(),
});

// Validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.issues.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      console.error(
        '\n📋 Please check your .env file and ensure all required variables are set correctly.'
      );
      console.error(
        '💡 Use .env.example as a reference for required variables.'
      );
    } else {
      console.error(
        '❌ Unexpected error during environment validation:',
        error
      );
    }
    process.exit(1);
  }
}

// Export validated environment variables
export const env = validateEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;

// Helper functions
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

export const isStaging = env.NEXT_PUBLIC_APP_ENV === 'staging';
export const isProd = env.NEXT_PUBLIC_APP_ENV === 'production';

// Feature flags helpers
export const features = {
  chat: env.NEXT_PUBLIC_ENABLE_CHAT,
  notifications: env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
} as const;

// Security helpers
export const security = {
  jwtSecret: env.JWT_SECRET,
  sessionSecret: env.SESSION_SECRET,
  nextAuthSecret: env.NEXTAUTH_SECRET,
  nextAuthUrl: env.NEXTAUTH_URL,
} as const;

// Database helpers
export const database = {
  url: env.DATABASE_URL,
  poolSize: env.DATABASE_POOL_SIZE,
  timeout: env.DATABASE_TIMEOUT,
} as const;

// API helpers
export const api = {
  baseUrl: env.NEXT_PUBLIC_APP_URL,
  rateLimitMax: env.API_RATE_LIMIT_MAX,
  rateLimitWindow: env.API_RATE_LIMIT_WINDOW,
} as const;
