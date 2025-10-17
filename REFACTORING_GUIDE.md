# 🏗️ ENTERPRISE REFACTORING GUIDE - BRAIAN.RENT

## 📋 OVERVIEW

This document describes the major architectural refactoring applied to achieve enterprise-grade infrastructure and CI/CD practices.

---

## 🎯 KEY IMPROVEMENTS

### 1. **Modular Terraform Architecture**

- ✅ Separated concerns: networking, data, app
- ✅ Reusable modules
- ✅ Environment-specific configurations

### 2. **Cloud Run Job for Migrations**

- ✅ Eliminates Cloud SQL Proxy complexity
- ✅ Uses same image as app (consistency)
- ✅ Secure VPC connectivity

### 3. **Immutable Image Tags**

- ✅ SHA-based tags (main-abc1234)
- ✅ Full traceability (git → docker → deployment)
- ✅ Easy rollbacks

### 4. **Security Scans**

- ✅ IaC scanning (tfsec)
- ✅ Container scanning (Trivy)
- ✅ Fail on HIGH/CRITICAL vulnerabilities

### 5. **GitHub Environments**

- ✅ Staging and Production separation
- ✅ Required reviewers for production
- ✅ Environment-specific secrets

---

## 📁 NEW TERRAFORM STRUCTURE

```
terraform/
├── main-modular.tf                    # Orchestrates modules
├── variables-modular.tf               # Root variables
├── providers.tf                       # Google Cloud provider config
├── outputs.tf                         # Root outputs
│
├── modules/
│   ├── networking/                    # VPC, PSA, Connectors
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   │
│   ├── data/                          # Cloud SQL, Database
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   │
│   └── app/                           # Cloud Run Service + Job + Secrets
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
│
└── environments/
    ├── staging/
    │   └── terraform.tfvars           # Staging config
    └── production/
        └── terraform.tfvars           # Production config
```

---

## 🔧 CI/CD PIPELINE (8 JOBS)

```
1. lint-and-test      → Code quality
2. iac-scan           → Terraform security (tfsec)
3. container-scan     → Docker security (Trivy)
4. terraform          → Infrastructure provisioning
5. build-and-push     → Docker build + push (SHA tags)
6. deploy             → Cloud Run deployment (requires approval for prod)
7. migrate-database   → Cloud Run Job execution
8. verify-deployment  → Health checks
```

---

## 🚀 GITHUB ENVIRONMENTS SETUP (MANUAL STEPS)

### Step 1: Create Environments

1. Go to: `https://github.com/[YOUR_USER]/braian.rent/settings/environments`
2. Click: "New environment"
3. Create: **`staging`**
4. Create: **`production`**

### Step 2: Configure Production Environment

1. Click on **`production`** environment
2. Enable: **"Required reviewers"**
3. Add: Your GitHub username or team
4. Enable: **"Wait timer"** (optional, e.g., 5 minutes)
5. Click: "Save protection rules"

### Step 3: Add Environment Secrets

**For STAGING:**

```
Navigate to: Environments → staging → Add secret

Required secrets:
- GCP_PROJECT_ID: braian-rent-staging
- GCP_WORKLOAD_IDENTITY_PROVIDER: projects/[NUM]/...
- GCP_SERVICE_ACCOUNT: github-actions@braian-rent-staging.iam...
- TF_STATE_BUCKET: braian-rent-staging-terraform-state
```

**For PRODUCTION:**

```
Navigate to: Environments → production → Add secret

Required secrets:
- GCP_PROJECT_ID: braian-rent-prod
- GCP_WORKLOAD_IDENTITY_PROVIDER: projects/[NUM]/...
- GCP_SERVICE_ACCOUNT: github-actions@braian-rent-prod.iam...
- TF_STATE_BUCKET: braian-rent-prod-terraform-state
```

---

## 📊 KEY DIFF PREVIEWS

### terraform/modules/networking/main.tf

```hcl
# NEW MODULE - Networking isolation
+ resource "google_compute_network" "vpc"
+ resource "google_compute_subnetwork" "vpc_connector_subnet"
+   ip_cidr_range = "10.11.0.0/28"
+ resource "google_vpc_access_connector" "connector"
+ resource "google_compute_global_address" "psa_range"
+   address = "10.20.0.0"
+ resource "google_service_networking_connection" "psa_connection"
```

### terraform/modules/data/main.tf

```hcl
# NEW MODULE - Database layer
+ resource "google_sql_database_instance" "main"
+   depends_on = [var.psa_connection_id]  ← EXPLICIT DEPENDENCY
+ resource "google_sql_database" "database"
+ resource "google_sql_user" "user"
+ locals {
+   database_url = format("postgresql://...")
+ }
```

### terraform/modules/app/main.tf

```hcl
# NEW MODULE - Application layer
+ resource "google_cloud_run_v2_service" "main"
+   image = var.image_tag  ← VARIABLE (not hardcoded)

+ resource "google_cloud_run_v2_job" "db_migrate"  ← NEW!
+   command = ["npx"]
+   args    = ["prisma", "migrate", "deploy"]
```

### .github/workflows/deploy.yml

```diff
+ # Job 2: IaC Security Scan (tfsec)
+ iac-scan:
+   uses: aquasecurity/tfsec-action@v1.0.3
+   additional_args: --minimum-severity HIGH

+ # Job 3: Container Security Scan (Trivy)
+ container-scan:
+   uses: aquasecurity/trivy-action@0.24.0
+   severity: 'HIGH,CRITICAL'
+   exit-code: '1'

# Job 5: Build
- needs: terraform
+ needs: [terraform, container-scan]

# Job 6: Deploy
+ environment:
+   name: production
+   url: ${{ steps.get-url.outputs.url }}

- --image app:latest
+ --image ${{ needs.build-and-push.outputs.image }}  ← SHA-based

# Job 7: Migrate
- Install Cloud SQL Proxy (7 steps)
- npx prisma migrate deploy
+ gcloud run jobs execute braian-rent-db-migrate --wait  ← 1 step!
```

---

## 🔐 SECURITY IMPROVEMENTS

### Workload Identity Federation (Enforced)

- ✅ No JSON keys anywhere
- ✅ Short-lived tokens only
- ✅ Audit trail complete

### Container Security

- ✅ Trivy scans every build
- ✅ Fails on HIGH/CRITICAL
- ✅ Results in GitHub Security tab

### IaC Security

- ✅ tfsec scans Terraform
- ✅ Catches misconfigurations
- ✅ Prevents security issues before deployment

### Network Security

- ✅ VPC isolation
- ✅ Private IP only (no public)
- ✅ Explicit CIDR separation

---

## 📊 COMPARISON: BEFORE vs AFTER

| Aspect                  | Before                    | After                   |
| ----------------------- | ------------------------- | ----------------------- |
| **Terraform Structure** | Monolithic (8 files)      | Modular (3 modules)     |
| **Migrations**          | Cloud SQL Proxy (7 steps) | Cloud Run Job (1 step)  |
| **Image Tags**          | :latest (mutable)         | :main-sha (immutable)   |
| **Security Scans**      | None                      | tfsec + Trivy           |
| **Environments**        | None                      | staging + production    |
| **Secrets**             | Repository-level          | Environment-level       |
| **Deployment Approval** | None                      | Required for production |
| **Network Config**      | Hardcoded                 | Explicit with variables |

---

## 🚀 DEPLOYMENT INSTRUCTIONS

### For Staging:

```bash
cd terraform
terraform workspace select staging || terraform workspace new staging
terraform apply -var-file=environments/staging/terraform.tfvars
```

### For Production:

```bash
cd terraform
terraform workspace select production || terraform workspace new production
terraform apply -var-file=environments/production/terraform.tfvars
```

### Via GitHub Actions:

```
Push to main → Auto-deploys to production (after approval)
Manual dispatch → Select environment
```

---

## ✅ VERIFICATION CHECKLIST

Before pushing:

- [ ] Review all module code
- [ ] Verify network CIDR ranges
- [ ] Check depends_on chains
- [ ] Test Terraform locally (terraform plan)
- [ ] Configure GitHub Environments
- [ ] Update environment secrets
- [ ] Review CI/CD pipeline changes

---

## 📚 RESOURCES

- Terraform Modules: `terraform/modules/*/`
- Environment Configs: `terraform/environments/*/`
- CI/CD Workflow: `.github/workflows/deploy.yml`
- Migration Job: Defined in `modules/app/main.tf`

---

**This refactoring establishes production-grade infrastructure with proper separation of concerns, security scanning, and deployment controls.**
EOF
