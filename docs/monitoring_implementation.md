# 📊 Monitoring & Observability Implementation

## Przegląd

Implementacja profesjonalnego systemu monitorowania i observability dla aplikacji Braian.rent, gotowego do wdrożenia na Google Cloud Platform.

## 🎯 Zaimplementowane Komponenty

### 1. **Structured Logging (Winston)**

- **Lokalizacja:** `src/lib/logger.ts`
- **Funkcjonalność:**
  - Strukturalne logowanie JSON
  - Różne poziomy logowania (error, warn, info, debug, http)
  - Automatyczne rotowanie logów w produkcji
  - Helpers dla różnych typów logów (request, response, error, database, performance, security, business)
  - Kolorowanie w developmencie, JSON w produkcji

**Przykład użycia:**

```typescript
import { appLogger, logError, logSecurity } from '@/lib/logger';

// Podstawowe logowanie
appLogger.info('User logged in', { userId: '123', email: 'user@example.com' });

// Logowanie błędów
logError(new Error('Payment failed'), { userId: '123', amount: 2500 });

// Logowanie zdarzeń bezpieczeństwa
logSecurity('Failed login attempt', 'medium', {
  ip: '192.168.1.1',
  attempts: 3,
});
```

### 2. **Error Tracking (Sentry)**

- **Lokalizacja:** `src/lib/sentry.ts`
- **Funkcjonalność:**
  - Automatyczne śledzenie błędów
  - Performance monitoring
  - Session replay (opcjonalne)
  - Custom error capture z kontekstem
  - Breadcrumbs tracking
  - User context management

**Konfiguracja:**

```bash
# Dodaj do .env
SENTRY_DSN=your_sentry_dsn_here
```

**Przykład użycia:**

```typescript
import { captureError, setUserContext } from '@/lib/sentry';

// Ustawienie kontekstu użytkownika
setUserContext({
  id: '123',
  email: 'user@example.com',
  role: 'OWNER',
});

// Śledzenie błędu z dodatkowymi danymi
captureError(error, {
  tags: { feature: 'payment', severity: 'high' },
  extra: { transactionId: 'tx_123', amount: 2500 },
  level: 'error',
});
```

### 3. **OpenTelemetry (Metrics & Tracing)**

- **Lokalizacja:** `src/lib/telemetry.ts`
- **Funkcjonalność:**
  - Metryki HTTP (total requests, errors, duration)
  - Metryki bazy danych (queries, errors, duration)
  - Metryki biznesowe (user logins, properties created, payments, documents)
  - Prometheus exporter (port 9464)

**Uwaga:** OpenTelemetry nie działa w Edge Runtime (middleware), więc metryki są zbierane tylko w API routes.

**Przykład użycia:**

```typescript
import { recordHttpRequest, recordBusinessEvent } from '@/lib/telemetry';

// Nagrywanie metryki HTTP
recordHttpRequest('GET', '/api/properties', 200, 145);

// Nagrywanie zdarzenia biznesowego
recordBusinessEvent('payment_processed', { amount: 2500, userId: '123' });
```

### 4. **Request Monitoring Middleware**

- **Lokalizacja:** `src/middleware.ts`
- **Funkcjonalność:**
  - Automatyczne dodawanie Request ID do każdego żądania
  - Pomiar czasu odpowiedzi
  - Proste logowanie requestów (Edge Runtime compatible)
  - Headers: `x-request-id`, `x-response-time`

### 5. **Enhanced Health Check Endpoint**

- **Lokalizacja:** `src/app/api/health/route.ts`
- **Endpoint:** `GET /api/health`
- **Funkcjonalność:**
  - Status aplikacji i bazy danych
  - Metryki pamięci
  - Informacje o środowisku
  - Status monitoringu (logging, sentry, telemetry)
  - Walidacja konfiguracji

**Przykład response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-10-08T21:25:38.824Z",
  "version": "0.1.0",
  "environment": "production",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": "22ms",
      "metrics": {
        "queries": 156,
        "errors": 0,
        "avgDuration": 12,
        "errorRate": "0%"
      }
    },
    "application": {
      "status": "healthy",
      "uptime": 1135.474465833,
      "memory": {
        "used": 45,
        "total": 67,
        "external": 12
      },
      "metrics": {
        "totalRequests": 1234,
        "successRequests": 1200,
        "errorRequests": 34,
        "avgResponseTime": 145,
        "errorRate": "2.76%"
      }
    },
    "configuration": {
      "status": "healthy"
    },
    "monitoring": {
      "status": "healthy",
      "logging": "enabled",
      "sentry": "enabled",
      "telemetry": "enabled"
    }
  },
  "features": {
    "aiSummary": false,
    "smartNotifications": false,
    "documentOcr": false
  },
  "metrics": {
    "business": {
      "userLogins": 45,
      "propertiesCreated": 12,
      "paymentsProcessed": 89,
      "documentsUploaded": 134
    },
    "system": {
      "nodeVersion": "v20.x.x",
      "platform": "darwin",
      "arch": "arm64",
      "pid": 12345
    }
  }
}
```

### 6. **Central Monitoring Initialization**

- **Lokalizacja:** `src/lib/monitoring.ts`
- **Funkcjonalność:**
  - Inicjalizacja wszystkich systemów monitorowania
  - Graceful shutdown handling
  - Process error handlers (uncaughtException, unhandledRejection)
  - SIGTERM/SIGINT handlers

## 📦 Zainstalowane Zależności

```json
{
  "dependencies": {
    "winston": "^3.x.x",
    "pino": "^8.x.x",
    "@opentelemetry/api": "^1.x.x",
    "@opentelemetry/sdk-node": "^0.x.x",
    "@opentelemetry/auto-instrumentations-node": "^0.x.x",
    "@opentelemetry/exporter-prometheus": "^0.x.x",
    "@sentry/nextjs": "^8.x.x"
  }
}
```

## 🚀 Jak Używać

### Inicjalizacja w Aplikacji

W pliku startowym (np. `instrumentation.ts` w Next.js):

```typescript
import { initializeMonitoring } from '@/lib/monitoring';

export function register() {
  initializeMonitoring();
}
```

### Logowanie w API Routes

```typescript
import { NextResponse } from 'next/server';
import { appLogger } from '@/lib/logger';
import { recordHttpRequest } from '@/lib/telemetry';

export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // Twoja logika
    const data = await getData();

    appLogger.info('Request successful', {
      endpoint: '/api/data',
      responseTime: Date.now() - startTime,
    });

    recordHttpRequest('GET', '/api/data', 200, Date.now() - startTime);

    return NextResponse.json(data);
  } catch (error) {
    appLogger.error('Request failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      endpoint: '/api/data',
    });

    recordHttpRequest('GET', '/api/data', 500, Date.now() - startTime);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### Logowanie Zdarzeń Biznesowych

```typescript
import { logBusiness, recordBusinessEvent } from '@/lib/telemetry';

// Po utworzeniu nieruchomości
logBusiness('property_created', userId, { propertyId, address });
recordBusinessEvent('property_created', { propertyId, address });

// Po przetworzeniu płatności
logBusiness('payment_processed', userId, { paymentId, amount });
recordBusinessEvent('payment_processed', { paymentId, amount });
```

## 🔧 Konfiguracja Środowiskowa

Dodaj do `.env`:

```bash
# Logging
LOG_LEVEL=info  # debug, info, warn, error

# Sentry
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ENVIRONMENT=production
SENTRY_ENABLED=true

# Features (opcjonalne)
FEATURE_AI_SUMMARY=false
FEATURE_SMART_NOTIFICATIONS=false
FEATURE_DOCUMENT_OCR=false
```

## 🐳 Docker & Cloud Run

System monitorowania jest w pełni kompatybilny z Docker i Cloud Run:

1. **Health Check w docker-compose.yml:**

```yaml
healthcheck:
  test: ['CMD-SHELL', 'curl -f http://localhost:8080/api/health || exit 1']
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

2. **Cloud Run Health Check:**

- Endpoint: `/api/health`
- Port: 8080 (automatycznie mapowany przez Cloud Run)
- Success criteria: status 200, `status: "healthy"`

## 📊 Monitoring w Produkcji

### Cloud Logging (GCP)

- Wszystkie logi automatycznie trafiają do Cloud Logging
- Structured JSON format dla łatwego filtrowania
- Automatyczne grupowanie po Request ID

### Sentry

- Dashboard: https://sentry.io/your-project
- Alerty na email/Slack
- Performance monitoring
- Error tracking z full stack trace

### Prometheus Metrics (Opcjonalnie)

- Endpoint: `http://localhost:9464/metrics`
- Format: Prometheus exposition format
- Integracja z Grafana/Cloud Monitoring

## ⚠️ Uwagi i Ograniczenia

1. **OpenTelemetry w Edge Runtime:**
   - Nie działa w middleware (Edge Runtime)
   - Używaj tylko w API routes (Node.js runtime)

2. **Standalone Output:**
   - Metrics endpoint ma problemy w standalone mode
   - Health check działa poprawnie
   - Zalecany monitoring przez health check

3. **Performance:**
   - Logging jest async i nie blokuje requestów
   - Telemetry ma minimalny overhead (~1-2ms)
   - Sentry sampling rate można dostosować w konfiguracji

## 📈 Następne Kroki

1. **Dodaj Alerting:**
   - Cloud Monitoring alerts dla health check
   - Sentry alerts dla critical errors
   - PagerDuty integration (opcjonalnie)

2. **Dashboard:**
   - Grafana dla metrics visualization
   - Cloud Monitoring dashboards
   - Sentry performance monitoring

3. **Distributed Tracing:**
   - OpenTelemetry tracing w pełni
   - Jaeger lub Cloud Trace backend
   - Request correlation across services

4. **Custom Metrics:**
   - Business-specific KPIs
   - SLA tracking
   - User behavior analytics

## 🔗 Przydatne Linki

- [Winston Documentation](https://github.com/winstonjs/winston)
- [Sentry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [OpenTelemetry JS](https://opentelemetry.io/docs/instrumentation/js/)
- [Cloud Run Monitoring](https://cloud.google.com/run/docs/monitoring)
