# Braian.rent — Autonomiczny Agent Najmu

**Braian.rent** to aplikacja do zarządzania najmem, która pozwala właścicielom mieszkań samodzielnie i profesjonalnie prowadzić proces wynajmu — bez pośredników, z pomocą AI i automatyzacji.

---

## Cel Projektu

Uregulowanie rynku najmu w Polsce poprzez budowanie świadomości dobrych praktyk, weryfikację obu stron i automatyzację kluczowych procesów.

---

## Zakres MVP Slim

- Rejestracja/logowanie (Właściciel, Najemca)
- Dodanie nieruchomości i zaproszenie najemcy
- Dashboard w formie checklisty
- Prosty czat i ręczne zarządzanie płatnościami
- Upload kluczowych dokumentów (bez OCR)

---

## Kluczowe Technologie

| Warstwa         | Technologia                      |
| --------------- | -------------------------------- |
| Frontend        | Next.js + Tailwind CSS           |
| Backend         | Next.js API Routes (REST)        |
| Baza Danych     | PostgreSQL (Cloud SQL)           |
| ORM             | Prisma                           |
| Zadania w Tle   | Pub/Sub + Cloud Run Jobs         |
| Czat (Realtime) | Firestore                        |
| Storage         | Google Cloud Storage             |
| Monitoring      | Winston + Sentry + OpenTelemetry |
| Container       | Docker (Node 20.18.0-alpine3.20) |
| CI/CD & Infra   | GitHub Actions + Terraform       |

---

## 🔒 Security & Production Ready

- ✅ **Authentication:** NextAuth.js z bcrypt password hashing
- ✅ **Authorization:** Per-user data filtering (ownerId)
- ✅ **Session Management:** JWT strategy z server-side validation
- ✅ **Route Protection:** Middleware zabezpieczający wszystkie protected routes
- ✅ **Docker Security:** Node 20.18.0-alpine3.20 z automatycznymi security updates
- ✅ **Non-root User:** Aplikacja działa jako `nextjs` user (nie root)
- ✅ **Multi-stage Build:** Minimalna powierzchnia ataku (~507MB)
- ✅ **Health Checks:** Automatyczne monitorowanie stanu aplikacji
- ✅ **Structured Logging:** Winston + JSON logs
- ✅ **Error Tracking:** Sentry integration
- ✅ **Metrics:** OpenTelemetry + Prometheus

📚 **Dokumentacja:**

**Getting Started:**

- [**📋 Full Implementation Summary**](./docs/IMPLEMENTATION_SUMMARY.md) - Start here!
- [**🏛️ Architecture Audit Report**](./docs/ARCHITECTURE_AUDIT_REPORT.md) - Modernization & best practices
- [Auth Testing Guide](./docs/auth_testing_guide.md) - Testowanie autentykacji
- [Testing Guide](./docs/testing_guide.md) - Vitest + React Testing Library

**Architecture & Code Quality:**

- [Architecture Modernization](./docs/architecture_modernization.md) - RSC, Server Actions, State
- [Authentication System](./docs/authentication_system.md) - NextAuth.js implementation
- [Docker Security Implementation](./docs/docker_security.md) - Container security

**Infrastructure & Deployment:**

- [Terraform Deployment Guide](./docs/terraform_deployment_guide.md) - GCP setup
- [CI/CD Implementation](./docs/cicd_implementation.md) - GitHub Actions

**Monitoring:**

- [Monitoring & Observability](./docs/monitoring_implementation.md) - Logs, metrics, errors
- [Dynamic Dashboard](./docs/dynamic_dashboard_implementation.md) - Frontend implementation

---

## Getting Started (Uruchomienie lokalne)

### Pierwszy raz? Skonfiguruj projekt:

```bash
# 1. Zainstaluj zależności
npm install

# 2. Skopiuj .env.example do .env
cp .env.example .env

# 3. Wygeneruj NEXTAUTH_SECRET
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
echo "NEXTAUTH_URL=http://localhost:3000" >> .env

# 4. Uruchom PostgreSQL (Docker)
docker-compose up -d db

# 5. Wykonaj migracje bazy danych
npx prisma migrate dev

# 6. Wypełnij bazę testowymi danymi
npx prisma db seed

# 7. Uruchom serwer deweloperski
npm run dev

# 8. Otwórz przeglądarkę
open http://localhost:3000
```

### Dane testowe:

- **Owner:** `marek.wlasciciel@example.com` / `TestPassword123!`
- **Tenant:** `anna.najemca@example.com` / `TestPassword123!`

### Szybki start (Makefile):

```bash
make help          # Zobacz wszystkie komendy
make setup         # Pierwszy raz - instalacja i konfiguracja
make dev           # Uruchom development server
make docker-build  # Zbuduj Docker image
```

---

## 🚀 Production Deployment

### Automatyczny deployment (GitHub Actions):

```bash
# 1. Skonfiguruj GCP i GitHub secrets (jednorazowo)
# Zobacz: docs/terraform_deployment_guide.md

# 2. Push do main = automatyczny deployment!
git push origin main

# GitHub Actions automatycznie:
# ✅ Testuje kod
# ✅ Buduje Docker image
# ✅ Wdraża infrastrukturę (Terraform)
# ✅ Deployuje na Cloud Run
# ✅ Uruchamia migracje bazy danych
# ✅ Weryfikuje deployment
```

### Ręczny deployment (Terraform):

```bash
cd terraform/

# 1. Konfiguracja
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Edytuj wartości

# 2. Deployment
terraform init
terraform plan
terraform apply

# 3. Zobacz outputs
terraform output
```

**Więcej:** [Terraform Deployment Guide](./docs/terraform_deployment_guide.md)
