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
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "braian-rent"
}

variable "db_instance_tier" {
  description = "Cloud SQL instance tier"
  type        = string
  default     = "db-f1-micro" # For production use db-custom-2-4096 or higher
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
  description = "Minimum number of Cloud Run instances"
  type        = number
  default     = 0
}

variable "cloud_run_max_instances" {
  description = "Maximum number of Cloud Run instances"
  type        = number
  default     = 10
}

variable "cloud_run_timeout" {
  description = "Cloud Run request timeout in seconds"
  type        = number
  default     = 300
}

variable "domain_name" {
  description = "Custom domain name (optional)"
  type        = string
  default     = ""
}

variable "enable_vpc_connector" {
  description = "Enable VPC connector for Cloud SQL private IP"
  type        = bool
  default     = true
}

