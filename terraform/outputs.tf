# Cloud Run Service URL
output "cloud_run_url" {
  description = "URL of the Cloud Run service"
  value       = google_cloud_run_v2_service.main.uri
}

# Cloud SQL Connection Name
output "cloud_sql_connection_name" {
  description = "Cloud SQL instance connection name"
  value       = google_sql_database_instance.main.connection_name
}

# Cloud SQL Private IP
output "cloud_sql_private_ip" {
  description = "Cloud SQL instance private IP address"
  value       = google_sql_database_instance.main.private_ip_address
}

# Database Name
output "database_name" {
  description = "Database name"
  value       = google_sql_database.database.name
}

# Artifact Registry Repository
output "artifact_registry_repository" {
  description = "Artifact Registry repository URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker_repo.repository_id}"
}

# VPC Connector
output "vpc_connector_id" {
  description = "VPC Connector ID"
  value       = var.enable_vpc_connector ? google_vpc_access_connector.connector[0].id : "VPC connector not enabled"
}

# Service Account Email
output "cloud_run_service_account" {
  description = "Cloud Run service account email"
  value       = google_service_account.cloud_run.email
}

# Secret Manager Secret Names
output "secret_names" {
  description = "Secret Manager secret names"
  value = {
    database_url    = google_secret_manager_secret.database_url.secret_id
    nextauth_secret = google_secret_manager_secret.nextauth_secret.secret_id
    jwt_secret      = google_secret_manager_secret.jwt_secret.secret_id
    session_secret  = google_secret_manager_secret.session_secret.secret_id
  }
}

# Custom Domain (if configured)
output "custom_domain" {
  description = "Custom domain mapping status"
  value       = var.domain_name != "" ? var.domain_name : "No custom domain configured"
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
  value = <<-EOT
  
  🎉 Infrastructure deployed successfully!
  
  📋 Next Steps:
  
  1. Access your application:
     ${google_cloud_run_v2_service.main.uri}
  
  2. Run database migrations:
     gcloud run jobs execute ${var.app_name}-migrations --region ${var.region}
  
  3. Access Cloud SQL:
     gcloud sql connect ${google_sql_database_instance.main.name} --user=${var.db_user}
  
  4. View secrets:
     gcloud secrets versions access latest --secret=${var.app_name}-database-url
  
  5. View logs:
     gcloud run services logs read ${var.app_name}-service --region ${var.region}
  
  6. (Optional) Add custom domain:
     gcloud run domain-mappings create --service ${var.app_name}-service --domain your-domain.com
  
  EOT
}

