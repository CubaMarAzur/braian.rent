# Networking Module - VPC, PSA, VPC Access Connector
# Manages all network infrastructure for Cloud Run and Cloud SQL connectivity

# VPC Network
resource "google_compute_network" "vpc" {
  name                    = "${var.app_name}-vpc-new"
  auto_create_subnetworks = false
  project                 = var.project_id
}

# VPC Access Connector - Bridge between Cloud Run and VPC
# Connector creates its own subnet automatically
resource "google_vpc_access_connector" "connector" {
  count = var.enable_vpc_connector ? 1 : 0

  name          = "${var.app_name}-vpc-conn"
  region        = var.region
  network       = google_compute_network.vpc.name
  ip_cidr_range = var.vpc_connector_cidr
  project       = var.project_id

  depends_on = [google_compute_network.vpc]
}

# Reserved IP range for Cloud SQL Private Service Access
resource "google_compute_global_address" "psa_range" {
  name          = "${var.app_name}-psa-range-v2"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = var.psa_prefix_length
  address       = var.psa_address
  network       = google_compute_network.vpc.id
  project       = var.project_id
}

# Private Service Connection - VPC Peering with Google Services
resource "google_service_networking_connection" "psa_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.psa_range.name]
}

