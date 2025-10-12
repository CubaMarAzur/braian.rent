# Enable required APIs
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

  service            = each.key
  disable_on_destroy = false
}

# VPC Network for private services
resource "google_compute_network" "vpc" {
  name                    = "${var.app_name}-vpc"
  auto_create_subnetworks = false

  depends_on = [google_project_service.required_apis]
}

# VPC Connector for Cloud Run to Cloud SQL private IP
# Recommended approach: Let Google Cloud automatically allocate IP range
# This prevents conflicts with other resources in the project
resource "google_vpc_access_connector" "connector" {
  count = var.enable_vpc_connector ? 1 : 0

  name    = "${var.app_name}-vpc-connector"
  region  = var.region
  network = google_compute_network.vpc.name
  
  # No ip_cidr_range specified - GCP will auto-allocate a free /28 range
  # This is the recommended approach per Google Cloud best practices

  depends_on = [
    google_project_service.required_apis,
    google_compute_network.vpc
  ]
}

# Reserved IP range for Cloud SQL Private Service Access
# Using explicit 10.20.0.0/20 to ensure no conflicts with auto-allocated connector range
resource "google_compute_global_address" "private_service_access" {
  name          = "${var.app_name}-psa-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 20
  address       = "10.20.0.0"
  network       = google_compute_network.vpc.id

  depends_on = [google_project_service.required_apis]
}

# Private Service Connection for Cloud SQL
# This establishes VPC peering with Google's service network
resource "google_service_networking_connection" "private_service_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_service_access.name]

  depends_on = [
    google_project_service.required_apis,
    google_compute_global_address.private_service_access
  ]
}
