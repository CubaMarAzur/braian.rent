# Main Terraform Configuration - Modular Architecture
# This file orchestrates all modules for clean separation of concerns

# Enable required APIs first
resource "google_project_service" "required_apis" {
  for_each = toset([
    "compute.googleapis.com",
    "vpcaccess.googleapis.com",
    "sqladmin.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "servicenetworking.googleapis.com",
  ])

  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}

# Module 1: Networking
# VPC, subnets, PSA, VPC Access Connector
module "networking" {
  source = "./modules/networking"

  project_id           = var.project_id
  region               = var.region
  app_name             = var.app_name
  enable_vpc_connector = var.enable_vpc_connector
  vpc_connector_cidr   = var.vpc_connector_cidr
  psa_address          = var.psa_address
  psa_prefix_length    = var.psa_prefix_length

  depends_on = [google_project_service.required_apis]
}

# Artifact Registry for Docker images
resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.region
  repository_id = "${var.app_name}-images"
  description   = "Docker repository for ${var.app_name}"
  format        = "DOCKER"
  project       = var.project_id

  cleanup_policies {
    id     = "keep-minimum-versions"
    action = "KEEP"
    most_recent_versions {
      keep_count = 10
    }
  }

  cleanup_policies {
    id     = "delete-old-untagged"
    action = "DELETE"
    condition {
      tag_state  = "UNTAGGED"
      older_than = "2592000s" # 30 days
    }
  }

  depends_on = [google_project_service.required_apis]
}

# Module 2: Data Layer
# Cloud SQL instance, database, users
module "data" {
  source = "./modules/data"

  project_id         = var.project_id
  region             = var.region
  app_name           = var.app_name
  environment        = var.environment
  vpc_id             = module.networking.vpc_id
  psa_connection_id  = module.networking.psa_connection_id
  db_instance_tier   = var.db_instance_tier
  db_disk_size       = var.db_disk_size
  db_name            = var.db_name
  db_user            = var.db_user
  max_connections    = var.max_connections

  depends_on = [
    module.networking,
    google_project_service.required_apis
  ]
}

# Module 3: Application Layer
# Cloud Run service, migration job, secrets
module "app" {
  source = "./modules/app"

  project_id        = var.project_id
  region            = var.region
  app_name          = var.app_name
  environment       = var.environment
  image_tag         = var.image_tag
  vpc_connector_id  = module.networking.vpc_connector_id
  database_url      = module.data.database_url
  nextauth_url      = var.nextauth_url
  cpu               = var.cloud_run_cpu
  memory            = var.cloud_run_memory
  min_instances     = var.cloud_run_min_instances
  max_instances     = var.cloud_run_max_instances
  timeout           = var.cloud_run_timeout
  log_level         = var.log_level

  depends_on = [
    module.data,
    google_artifact_registry_repository.docker_repo,
    google_project_service.required_apis
  ]
}

