# Data Module - Cloud SQL PostgreSQL Database
# Manages database instance, databases, users, and connection strings

# Random password for database user
resource "random_password" "db_password" {
  length  = 32
  special = true
}

# Cloud SQL Instance
resource "google_sql_database_instance" "main" {
  name             = "${var.app_name}-db-${var.environment}"
  database_version = "POSTGRES_15"
  region           = var.region
  project          = var.project_id

  settings {
    tier              = var.db_instance_tier
    availability_type = var.environment == "production" ? "REGIONAL" : "ZONAL"
    disk_type         = "PD_SSD"
    disk_size         = var.db_disk_size
    disk_autoresize   = true

    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = var.environment == "production"
      transaction_log_retention_days = 7
      backup_retention_settings {
        retained_backups = 7
        retention_unit   = "COUNT"
      }
    }

    ip_configuration {
      ipv4_enabled    = true
      require_ssl     = true
      authorized_networks {
        name  = "cloud-run"
        value = "0.0.0.0/0"  # Cloud Run will use Cloud SQL Auth Proxy
      }
    }

    insights_config {
      query_insights_enabled  = true
      query_plans_per_minute  = 5
      query_string_length     = 1024
      record_application_tags = true
    }

    database_flags {
      name  = "max_connections"
      value = var.max_connections
    }

    database_flags {
      name  = "log_checkpoints"
      value = "on"
    }

    maintenance_window {
      day          = 7 # Sunday
      hour         = 3
      update_track = "stable"
    }
  }

  deletion_protection = var.environment == "production"

  # Critical: Wait for PSA connection before creating instance
  depends_on = [var.psa_connection_id]
}

# Database
resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.main.name
  project  = var.project_id
}

# Database User
resource "google_sql_user" "user" {
  name     = var.db_user
  instance = google_sql_database_instance.main.name
  password = random_password.db_password.result
  project  = var.project_id
}

# Construct DATABASE_URL for Prisma (public IP with Cloud SQL Auth Proxy)
locals {
  database_url = format(
    "postgresql://%s:%s@/%s?host=/cloudsql/%s:%s:%s",
    google_sql_user.user.name,
    random_password.db_password.result,
    google_sql_database.database.name,
    var.project_id,
    var.region,
    google_sql_database_instance.main.name
  )
}

