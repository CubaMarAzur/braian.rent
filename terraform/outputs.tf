# Root-level outputs for modular Terraform configuration

# Cloud Run Service URL
output "cloud_run_url" {
  description = "URL of the Cloud Run service"
  value       = module.app.service_url
}

# Cloud SQL Connection Name
output "cloud_sql_connection_name" {
  description = "Cloud SQL instance connection name"
  value       = module.data.instance_connection_name
}

# Cloud SQL Private IP
output "cloud_sql_private_ip" {
  description = "Cloud SQL instance private IP address"
  value       = module.data.instance_name
}

# Database Name
output "database_name" {
  description = "Database name"
  value       = module.data.database_name
}

# Artifact Registry Repository
output "artifact_registry_repository" {
  description = "Artifact Registry repository URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker_repo.repository_id}"
}

# VPC Connector
output "vpc_connector_id" {
  description = "VPC Connector ID"
  value       = module.networking.vpc_connector_id
}

# Service Account Email
output "cloud_run_service_account" {
  description = "Cloud Run service account email"
  value       = module.app.service_account_email
}

# Migration Job Name
output "migration_job_name" {
  description = "Database migration job name"
  value       = module.app.migration_job_name
}

# Secret Manager Secret Names (from app module)
output "secret_names" {
  description = "Secret Manager secret names"
  value = {
    database_url    = "${var.app_name}-database-url"
    nextauth_secret = "${var.app_name}-nextauth-secret"
    jwt_secret      = "${var.app_name}-jwt-secret"
    session_secret  = "${var.app_name}-session-secret"
  }
}

# Project Information
output "project_info" {
  description = "GCP Project information"
  value = {
    project_id  = var.project_id
    region      = var.region
    environment = var.environment
  }
}

# Important URLs for setup
output "setup_instructions" {
  description = "Post-deployment setup instructions"
  value       = <<-EOT
  
  🎉 Infrastructure deployed successfully!
  
  📋 Next Steps:
  
  1. Access your application:
     ${module.app.service_url}
  
  2. Run database migrations:
     gcloud run jobs execute ${module.app.migration_job_name} --region ${var.region} --wait
  
  3. Access Cloud SQL:
     gcloud sql connect ${module.data.instance_name} --user=${var.db_user}
  
  4. View secrets:
     gcloud secrets versions access latest --secret=${var.app_name}-database-url
  
  5. View logs:
     gcloud run services logs read ${var.app_name}-service --region ${var.region}
  
  6. Health check:
     curl -f "${module.app.service_url}/api/health"
  
  EOT
}

# Network Information
output "network_info" {
  description = "Network configuration details"
  value = {
    vpc_id            = module.networking.vpc_id
    vpc_name          = module.networking.vpc_name
    psa_connection_id = module.networking.psa_connection_id
  }
}