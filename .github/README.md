# 🔄 GitHub Actions Workflows

## Workflows

### 1. Deploy Workflow (`workflows/deploy.yml`)

**Trigger:** Push to `main` branch or manual dispatch

**Jobs (6):**

1. **lint-and-test** - Code quality checks
2. **terraform** - Infrastructure provisioning
3. **build-and-push** - Docker image build & push
4. **deploy** - Cloud Run deployment
5. **migrate-database** - Prisma migrations
6. **verify-deployment** - Health checks

**Duration:** ~15-20 minutes

**Status:** ![Deploy](https://github.com/YOUR_USERNAME/braian.rent/actions/workflows/deploy.yml/badge.svg)

### 2. CI Workflow (`workflows/ci.yml`)

**Trigger:** Pull requests, push to `develop`

**Jobs (4):**

1. **lint** - ESLint
2. **typecheck** - TypeScript compilation
3. **build** - Next.js build test
4. **docker-build** - Docker build test

**Duration:** ~3-5 minutes

**Status:** ![CI](https://github.com/YOUR_USERNAME/braian.rent/actions/workflows/ci.yml/badge.svg)

---

## 🔐 Required Secrets

Add these in: Repository → Settings → Secrets and variables → Actions

| Secret                           | Description                    | Example                                          |
| -------------------------------- | ------------------------------ | ------------------------------------------------ |
| `GCP_PROJECT_ID`                 | GCP Project ID                 | `braian-rent-prod`                               |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Workload Identity Provider     | `projects/123.../providers/github-provider`      |
| `GCP_SERVICE_ACCOUNT`            | Service Account email          | `github-actions@project.iam.gserviceaccount.com` |
| `TF_STATE_BUCKET`                | GCS bucket for Terraform state | `project-id-terraform-state`                     |

---

## ⚙️ Setup Instructions

**First time?** See: [MANUAL_GCP_SETUP.md](../docs/MANUAL_GCP_SETUP.md)

**Quick setup:**

```bash
# 1. Create Terraform state bucket
gsutil mb gs://$(gcloud config get-value project)-terraform-state

# 2. Add GitHub secrets (see table above)

# 3. Push to main
git push origin main
```

---

## 🆘 Troubleshooting

- **Workflow failing?** Check: Actions → Failed run → Job logs
- **Terraform errors?** See: [Terraform Deployment Guide](../docs/terraform_deployment_guide.md)
- **Docker build fails?** Check: Dockerfile and .dockerignore
- **Deployment fails?** Check: Cloud Run logs

---

## 📚 Documentation

- [CI/CD Implementation](../docs/cicd_implementation.md) - Full guide
- [CICD Pipeline Fix](../docs/CICD_PIPELINE_FIX.md) - Recent fixes
- [Manual GCP Setup](../docs/MANUAL_GCP_SETUP.md) - Required setup steps
