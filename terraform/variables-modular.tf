# Root-level variables for modular Terraform configuration

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region for resources"
  type        = string
  default     = "europe-west3"
}

variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "braian-rent"
}

# Networking variables
variable "enable_vpc_connector" {
  description = "Enable VPC Access Connector"
  type        = bool
  default     = true
}

variable "vpc_connector_cidr" {
  description = "CIDR range for VPC Access Connector"
  type        = string
  default     = "10.11.0.0/28"
}

variable "psa_address" {
  description = "Starting IP for Private Service Access"
  type        = string
  default     = "10.20.0.0"
}

variable "psa_prefix_length" {
  description = "Prefix length for PSA range"
  type        = number
  default     = 20
}

# Database variables
variable "db_instance_tier" {
  description = "Cloud SQL instance tier"
  type        = string
  default     = "db-f1-micro"
}

variable "db_disk_size" {
  description = "Database disk size in GB"
  type        = number
  default     = 10
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "braian_prod"
}

variable "db_user" {
  description = "Database user"
  type        = string
  default     = "braian_app"
}

variable "max_connections" {
  description = "Max database connections"
  type        = string
  default     = "100"
}

# Application variables
variable "image_tag" {
  description = "Docker image tag (use SHA-based for immutability)"
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello" # Placeholder
}

variable "nextauth_url" {
  description = "NextAuth URL for the application"
  type        = string
  default     = "https://placeholder.run.app"
}

variable "cloud_run_cpu" {
  description = "Cloud Run CPU allocation"
  type        = string
  default     = "1"
}

variable "cloud_run_memory" {
  description = "Cloud Run memory allocation"
  type        = string
  default     = "512Mi"
}

variable "cloud_run_min_instances" {
  description = "Minimum Cloud Run instances"
  type        = number
  default     = 0
}

variable "cloud_run_max_instances" {
  description = "Maximum Cloud Run instances"
  type        = number
  default     = 10
}

variable "cloud_run_timeout" {
  description = "Cloud Run request timeout in seconds"
  type        = number
  default     = 300
}

variable "log_level" {
  description = "Application log level"
  type        = string
  default     = "info"
}

