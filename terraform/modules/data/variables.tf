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

variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
}

variable "vpc_id" {
  description = "VPC network ID for private IP"
  type        = string
}

variable "psa_connection_id" {
  description = "Private Service Access connection ID (for depends_on)"
  type        = any
}

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
  description = "Maximum database connections"
  type        = string
  default     = "100"
}

