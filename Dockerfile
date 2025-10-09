# Multi-stage Dockerfile optimized for Google Cloud Run with security best practices
# Stage 1: Dependencies
FROM node:20.18.0-alpine3.20 AS deps
WORKDIR /app

# Update packages for security patches
RUN apk update && apk upgrade --no-cache

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production --ignore-scripts

# Stage 2: Builder
FROM node:20.18.0-alpine3.20 AS builder
WORKDIR /app

# Update packages for security patches
RUN apk update && apk upgrade --no-cache

# Copy package files and install ALL dependencies (including dev)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
# Dummy values for build-time validation (real values provided at runtime)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV JWT_SECRET="build-time-dummy-secret-min-32-chars-long"
ENV SESSION_SECRET="build-time-dummy-session-secret-min-32"

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:20.18.0-alpine3.20 AS runner
WORKDIR /app

# Update packages and install required dependencies for health checks and Prisma
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache curl openssl libc6-compat && \
    rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Expose port
EXPOSE 8080

# Health check with retry logic
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Switch to non-root user
USER nextjs

# Start the application
CMD ["node", "server.js"]
