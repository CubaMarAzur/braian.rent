output "vpc_id" {
  description = "VPC network ID"
  value       = google_compute_network.vpc.id
}

output "vpc_name" {
  description = "VPC network name"
  value       = google_compute_network.vpc.name
}

output "vpc_connector_id" {
  description = "VPC Access Connector ID"
  value       = var.enable_vpc_connector ? google_vpc_access_connector.connector[0].id : null
}

output "psa_connection_id" {
  description = "Private Service Access connection ID"
  value       = google_service_networking_connection.psa_connection.id
}

output "psa_range_name" {
  description = "PSA IP range name"
  value       = google_compute_global_address.psa_range.name
}

