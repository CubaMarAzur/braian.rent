# Cloud Run Service
resource "google_cloud_run_v2_service" "main" {
  name     = "${var.app_name}-service"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.cloud_run.email

    # VPC Connector for private Cloud SQL access
    vpc_access {
      connector = var.enable_vpc_connector ? google_vpc_access_connector.connector[0].id : null
      egress    = "PRIVATE_RANGES_ONLY"
    }

    # Scaling configuration
    scaling {
      min_instance_count = var.cloud_run_min_instances
      max_instance_count = var.cloud_run_max_instances
    }

    # Timeout
    timeout = "${var.cloud_run_timeout}s"

    containers {
      # Image will be updated by CI/CD
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker_repo.repository_id}/${var.app_name}:latest"

      # Resources
      resources {
        limits = {
          cpu    = var.cloud_run_cpu
          memory = var.cloud_run_memory
        }
        cpu_idle          = true
        startup_cpu_boost = true
      }

      # Port
      ports {
        container_port = 8080
      }

      # Environment variables
      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "PORT"
        value = "8080"
      }

      env {
        name  = "NEXTAUTH_URL"
        value = "https://${google_cloud_run_v2_service.main.uri}"
      }

      env {
        name  = "LOG_LEVEL"
        value = "info"
      }

      # Secrets from Secret Manager
      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.database_url.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "NEXTAUTH_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.nextauth_secret.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.jwt_secret.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "SESSION_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.session_secret.secret_id
            version = "latest"
          }
        }
      }

      # Startup probe (health check)
      startup_probe {
        http_get {
          path = "/api/health"
          port = 8080
        }
        initial_delay_seconds = 10
        timeout_seconds       = 3
        period_seconds        = 10
        failure_threshold     = 3
      }

      # Liveness probe
      liveness_probe {
        http_get {
          path = "/api/health"
          port = 8080
        }
        initial_delay_seconds = 0
        timeout_seconds       = 3
        period_seconds        = 30
        failure_threshold     = 3
      }
    }

    # Cloud SQL connection
    containers {
      name = "cloud-sql-proxy"
      
      # Note: This is an alternative approach using sidecar
      # For direct connection, use the annotation below instead
    }
  }

  # Cloud SQL connections via Unix sockets
  # This is the recommended approach
  depends_on = [
    google_sql_database_instance.main,
    google_project_service.required_apis
  ]
}

# Annotation for Cloud SQL connection (alternative to sidecar)
resource "google_cloud_run_v2_service" "main_with_sql" {
  count = 0 # Disabled - we use VPC connector instead
  
  # If you prefer Cloud SQL Proxy sidecar instead of VPC:
  # 1. Set count = 1
  # 2. Remove VPC connector from template above
  # 3. Add this annotation:
  # metadata {
  #   annotations = {
  #     "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.main.connection_name
  #   }
  # }
}

# IAM policy for public access (unauthenticated)
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.main.location
  name     = google_cloud_run_v2_service.main.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Custom domain mapping (optional)
resource "google_cloud_run_domain_mapping" "main" {
  count = var.domain_name != "" ? 1 : 0

  location = var.region
  name     = var.domain_name

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.main.name
  }
}

