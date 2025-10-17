output "instance_name" {
  description = "Cloud SQL instance name"
  value       = google_sql_database_instance.main.name
}

output "instance_connection_name" {
  description = "Cloud SQL connection name"
  value       = google_sql_database_instance.main.connection_name
}

output "database_name" {
  description = "Database name"
  value       = google_sql_database.database.name
}

output "database_user" {
  description = "Database user name"
  value       = google_sql_user.user.name
}

output "database_password" {
  description = "Database password (sensitive)"
  value       = random_password.db_password.result
  sensitive   = true
}

output "database_url" {
  description = "Full DATABASE_URL connection string for Prisma"
  value       = local.database_url
  sensitive   = true
}

