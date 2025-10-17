variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
}

variable "enable_vpc_connector" {
  description = "Enable VPC Access Connector"
  type        = bool
  default     = true
}

variable "vpc_connector_cidr" {
  description = "CIDR range for VPC Access Connector subnet"
  type        = string
  default     = "10.11.0.0/28"
}

variable "psa_address" {
  description = "Starting IP address for Private Service Access"
  type        = string
  default     = "10.20.0.0"
}

variable "psa_prefix_length" {
  description = "Prefix length for PSA IP range"
  type        = number
  default     = 20
}

