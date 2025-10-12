# 🏗️ Terraform Infrastructure

Infrastructure as Code for Braian.rent application deployment on Google Cloud Platform.

## 📁 Structure

```
terraform/
├── providers.tf           # GCP provider configuration
├── variables.tf           # Input variables
├── terraform.tfvars.example # Example variables file
├── networking.tf          # VPC, subnets, VPC connector
├── cloud-sql.tf          # PostgreSQL database
├── artifact-registry.tf  # Docker image repository
├── secrets.tf            # Secret Manager configuration
├── cloud-run.tf          # Cloud Run service
├── outputs.tf            # Output values
└── .gitignore            # Terraform gitignore
```

## 🚀 Quick Start

### Prerequisites

1. **GCP Project:**

   ```bash
   gcloud projects create your-project-id
   gcloud config set project your-project-id
   ```

2. **Enable Billing:**
   - Link billing account in GCP Console

3. **Install Terraform:**

   ```bash
   brew install terraform  # macOS
   # or download from: https://www.terraform.io/downloads
   ```

4. **Authenticate:**
   ```bash
   gcloud auth application-default login
   ```

### Initial Setup

1. **Copy variables file:**

   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit terraform.tfvars:**

   ```hcl
   project_id = "your-actual-project-id"
   region     = "europe-west3"
   # ... customize other values
   ```

3. **Initialize Terraform:**

   ```bash
   terraform init
   ```

4. **Plan infrastructure:**

   ```bash
   terraform plan
   ```

5. **Apply infrastructure:**
   ```bash
   terraform apply
   ```

## 📋 Resources Created

| Resource          | Type                                  | Purpose                |
| ----------------- | ------------------------------------- | ---------------------- |
| VPC Network       | `google_compute_network`              | Private networking     |
| VPC Connector     | `google_vpc_access_connector`         | Cloud Run ↔ Cloud SQL |
| Cloud SQL         | `google_sql_database_instance`        | PostgreSQL 15 database |
| Database          | `google_sql_database`                 | Application database   |
| Artifact Registry | `google_artifact_registry_repository` | Docker images          |
| Secret Manager    | `google_secret_manager_secret`        | Secrets storage        |
| Cloud Run         | `google_cloud_run_v2_service`         | Application hosting    |
| Service Account   | `google_service_account`              | Cloud Run identity     |

## 🔐 Security Features

- ✅ Private IP for Cloud SQL (no public IP)
- ✅ VPC connector for secure connection
- ✅ Secret Manager for all secrets
- ✅ Service Account with minimal permissions
- ✅ Automatic backups enabled
- ✅ Point-in-time recovery
- ✅ Query insights enabled
- ✅ Deletion protection (prod)

## 💰 Cost Estimation

### Development (Minimal)

- Cloud SQL: db-f1-micro (~$10/month)
- Cloud Run: Pay-per-use (~$5-20/month)
- **Total:** ~$15-30/month

### Production (Recommended)

- Cloud SQL: db-custom-2-4096 (~$100/month)
- Cloud Run: 1-100 instances (~$50-300/month)
- **Total:** ~$150-400/month

### Cost Optimization

```hcl
# Development
cloud_run_min_instances = 0  # Scale to zero
db_instance_tier = "db-f1-micro"

# Production
cloud_run_min_instances = 1  # Always warm
db_instance_tier = "db-custom-2-4096"
```

## 🔧 Commands

### View state

```bash
terraform show
```

### View outputs

```bash
terraform output
```

### Destroy infrastructure

```bash
terraform destroy
```

### Update single resource

```bash
terraform apply -target=google_cloud_run_v2_service.main
```

### Import existing resource

```bash
terraform import google_cloud_run_v2_service.main projects/PROJECT/locations/REGION/services/SERVICE
```

## 📊 Monitoring

After deployment, access:

- **Cloud Run Logs:**

  ```bash
  gcloud run services logs read braian-rent-service --region europe-west3
  ```

- **Cloud SQL Logs:**

  ```bash
  gcloud sql operations list --instance braian-rent-db-prod
  ```

- **Metrics:**
  - Cloud Console → Cloud Run → braian-rent-service → Metrics

## 🆘 Troubleshooting

### Error: "API not enabled"

**Solution:**

```bash
gcloud services enable compute.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
```

### Error: "Insufficient permissions"

**Solution:**

```bash
# Grant yourself necessary roles
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:YOUR_EMAIL" \
  --role="roles/editor"
```

### Error: "VPC connector failed to create"

**Solution:**

- Check IP range doesn't conflict: `10.8.0.0/28`
- Ensure VPC Access API is enabled
- Wait 5-10 minutes (creation is slow)

### Error: "Cloud SQL connection failed"

**Solution:**

- Verify private IP configuration
- Check VPC peering
- Verify service account has `cloudsql.client` role

## 🔄 State Management

### Remote State (Production)

1. **Create GCS bucket:**

   ```bash
   gsutil mb gs://your-terraform-state-bucket
   gsutil versioning set on gs://your-terraform-state-bucket
   ```

2. **Uncomment in providers.tf:**

   ```hcl
   backend "gcs" {
     bucket = "your-terraform-state-bucket"
     prefix = "terraform/state"
   }
   ```

3. **Migrate state:**
   ```bash
   terraform init -migrate-state
   ```

## 📝 Variables Reference

See `variables.tf` for full list. Key variables:

| Variable                  | Default      | Description               |
| ------------------------- | ------------ | ------------------------- |
| `project_id`              | -            | GCP Project ID (required) |
| `region`                  | europe-west3 | GCP Region                |
| `environment`             | prod         | Environment name          |
| `db_instance_tier`        | db-f1-micro  | Cloud SQL tier            |
| `cloud_run_min_instances` | 0            | Min instances             |
| `cloud_run_max_instances` | 10           | Max instances             |

## 🔗 Next Steps

1. Set up GitHub Actions secrets
2. Enable Workload Identity Federation
3. Configure custom domain
4. Set up monitoring alerts
5. Configure backup retention

See `../docs/terraform_deployment_guide.md` for detailed walkthrough.
