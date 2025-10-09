# ⚡ Quick Start Guide - Braian.rent

## 🎯 Wybierz Swój Scenariusz

### 👨‍💻 Dla Developerów (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/your-username/braian.rent.git
cd braian.rent

# 2. Quick setup (all-in-one)
make setup
# Lub manualnie:
npm install
cp .env.example .env
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env

# 3. Start database
docker-compose up -d db

# 4. Setup database
npx prisma migrate dev
npx prisma db seed

# 5. Start dev server
make dev
# Lub: npm run dev

# 6. Open browser
open http://localhost:3000

# 7. Login with test credentials
# Email: marek.wlasciciel@example.com
# Password: TestPassword123!
```

**Czas setup:** ~5 minut  
**Wymagania:** Node.js 20+, Docker, Git

---

### 🚀 Dla DevOps (Production Deployment)

```bash
# Prerequisites
# - GCP project created
# - Billing enabled
# - gcloud CLI installed

# 1. Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Clone repository
git clone https://github.com/your-username/braian.rent.git
cd braian.rent

# 3. Configure Terraform
cd terraform/
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Edit: project_id, region, etc.

# 4. Deploy infrastructure
terraform init
terraform plan
terraform apply  # Review and confirm

# 5. Get outputs
terraform output

# 6. Build and push Docker image
cd ..
PROJECT_ID=$(gcloud config get-value project)
REGION=europe-west1

docker buildx build --platform linux/amd64 \
  -t $REGION-docker.pkg.dev/$PROJECT_ID/braian-rent-images/braian-rent:latest \
  --push .

# 7. Deploy to Cloud Run (if not auto-deployed)
gcloud run services update braian-rent-service \
  --region $REGION \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/braian-rent-images/braian-rent:latest

# 8. Run migrations
# See: docs/terraform_deployment_guide.md

# 9. Verify
CLOUD_RUN_URL=$(terraform output -raw cloud_run_url)
curl "$CLOUD_RUN_URL/api/health"

# 10. Access application
open "$CLOUD_RUN_URL"
```

**Czas deployment:** ~15-20 minut (pierwsze wdrożenie)  
**Wymagania:** gcloud CLI, Terraform, Docker

---

### 🤖 Dla CI/CD (GitHub Actions)

```bash
# 1. Fork/Clone repository
# 2. Setup GCP Workload Identity Federation
#    (See: docs/terraform_deployment_guide.md - Section "Workload Identity")

# 3. Add GitHub Secrets
# Repository → Settings → Secrets and variables → Actions

GCP_PROJECT_ID: your-project-id
GCP_WORKLOAD_IDENTITY_PROVIDER: projects/123.../github-provider
GCP_SERVICE_ACCOUNT: github-actions@project.iam.gserviceaccount.com
TF_STATE_BUCKET: your-terraform-state-bucket

# 4. Push to main = automatic deployment!
git add .
git commit -m "feat: initial deployment"
git push origin main

# 5. Monitor deployment
# GitHub → Actions → Deploy to GCP Cloud Run

# 6. Wait for completion (~10-12 minutes)

# 7. Access application
# URL will be in GitHub Actions output
```

**Czas deployment:** ~10-12 minut  
**Wymagania:** GitHub account, GCP project setup

---

## 🎮 Makefile Commands

```bash
# Development
make dev              # Start dev server
make build            # Build production
make lint             # Run linter
make format           # Format code

# Docker
make docker-build     # Build image
make docker-run       # Run container
make docker-compose-up # Start DB + App

# Database
make db-migrate       # Run migrations
make db-seed          # Seed test data
make db-studio        # Open Prisma Studio
make db-reset         # Reset database

# Terraform
make terraform-init   # Initialize
make terraform-plan   # Plan changes
make terraform-apply  # Apply changes

# Deployment
make deploy           # Full deployment
make health-prod      # Check production health

# Utilities
make clean            # Clean build artifacts
make setup            # Initial setup
make help             # Show all commands
```

---

## 📊 Verify Setup

### ✅ Local Development Working?

```bash
# Test checklist
curl http://localhost:3000/api/health
# → Should return: {"status":"healthy"}

curl http://localhost:3000/auth/login
# → Should return: Login page HTML

# Open in browser and login
# → Should see dashboard with property data
```

### ✅ Production Deployment Working?

```bash
# Get Cloud Run URL
CLOUD_RUN_URL=$(gcloud run services describe braian-rent-service \
  --region europe-west1 \
  --format='value(status.url)')

# Test health
curl "$CLOUD_RUN_URL/api/health"
# → Should return: {"status":"healthy"}

# Test login page
curl "$CLOUD_RUN_URL/auth/login"
# → Should return: Login page HTML

# Open in browser
open "$CLOUD_RUN_URL"
# → Should redirect to /auth/login
# → Login should work
# → Dashboard should display
```

---

## 🆘 Common Issues

### Issue: "Port 3000 already in use"

**Solution:**

```bash
# Kill existing process
pkill -f "next dev"
# Or:
lsof -ti:3000 | xargs kill -9

# Restart
make dev
```

### Issue: "Database connection failed"

**Solution:**

```bash
# Check if database is running
docker ps | grep postgres

# Start database
docker-compose up -d db

# Verify connection
psql -h localhost -U braian -d braian_dev
```

### Issue: "Prisma Client not generated"

**Solution:**

```bash
npx prisma generate
npm run dev
```

### Issue: "NEXTAUTH_SECRET not set"

**Solution:**

```bash
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
echo "NEXTAUTH_URL=http://localhost:3000" >> .env
```

### Issue: "GitHub Actions failing"

**Check:**

1. Secrets are configured
2. Service account has permissions
3. Terraform state bucket exists
4. View detailed logs in GitHub Actions UI

---

## 📚 Next Steps

### After First Deployment

1. **Configure Custom Domain:**

   ```bash
   gcloud run domain-mappings create \
     --service braian-rent-service \
     --domain app.braian.rent
   ```

2. **Set Up Monitoring:**
   - Cloud Console → Monitoring → Dashboards
   - Create alerts for errors, latency
   - Configure uptime checks

3. **Configure Sentry:**

   ```bash
   # Add Sentry DSN to Secret Manager
   echo -n "YOUR_SENTRY_DSN" | \
     gcloud secrets versions add braian-rent-sentry-dsn --data-file=-
   ```

4. **Add Team Members:**
   ```bash
   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member="user:colleague@example.com" \
     --role="roles/viewer"
   ```

### Documentation To Read

**Start here:**

1. [IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md) - Overview
2. [Auth Testing Guide](./docs/auth_testing_guide.md) - Test authentication

**Then read:** 3. [Terraform Deployment Guide](./docs/terraform_deployment_guide.md) - Full deployment 4. [CI/CD Implementation](./docs/cicd_implementation.md) - GitHub Actions

**Reference:** 5. [Authentication System](./docs/authentication_system.md) 6. [Docker Security](./docs/docker_security.md) 7. [Monitoring Implementation](./docs/monitoring_implementation.md)

---

## 🎉 Success!

When you see this, you're ready:

**Local Development:**

```
✓ Database running
✓ Migrations applied
✓ Dev server started
✓ Can login at http://localhost:3000
```

**Production:**

```
✓ Terraform applied
✓ Cloud Run deployed
✓ Health check passing
✓ Application accessible
✓ Can create account and login
```

**Need help?** Check docs/ or open an issue.

---

**Made with ❤️ for property owners and tenants**
