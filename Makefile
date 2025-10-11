.PHONY: help dev build start test lint format docker-build docker-run terraform-init terraform-plan terraform-apply deploy clean

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)Braian.rent - Available Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Development
dev: ## Start development server
	npm run dev

build: ## Build production bundle
	npm run build

start: ## Start production server
	npm run start

test: ## Run tests (when implemented)
	npm test

lint: ## Run linter
	npm run lint

format: ## Format code with Prettier
	npm run format

# Docker
docker-build: ## Build Docker image
	docker build -t braian-rent:latest .

docker-run: ## Run Docker container locally
	docker run -p 3000:8080 \
		-e DATABASE_URL="${DATABASE_URL}" \
		-e NEXTAUTH_SECRET="${NEXTAUTH_SECRET}" \
		-e JWT_SECRET="${JWT_SECRET}" \
		-e SESSION_SECRET="${SESSION_SECRET}" \
		braian-rent:latest

docker-compose-up: ## Start Docker Compose (database + app)
	docker-compose up -d

docker-compose-down: ## Stop Docker Compose
	docker-compose down

# Database
db-migrate: ## Run database migrations
	npx prisma migrate dev

db-migrate-prod: ## Run production migrations
	npx prisma migrate deploy

db-seed: ## Seed database with test data
	npx prisma db seed

db-studio: ## Open Prisma Studio
	npx prisma studio

db-reset: ## Reset database (WARNING: deletes all data)
	npx prisma migrate reset --force

# Terraform
terraform-init: ## Initialize Terraform
	cd terraform && terraform init

terraform-plan: ## Plan Terraform changes
	cd terraform && terraform plan

terraform-apply: ## Apply Terraform changes
	cd terraform && terraform apply

terraform-destroy: ## Destroy Terraform infrastructure
	cd terraform && terraform destroy

terraform-output: ## Show Terraform outputs
	cd terraform && terraform output

# GCP Deployment
gcp-auth: ## Authenticate to GCP
	gcloud auth login
	gcloud auth application-default login

gcp-setup: ## Initial GCP setup
	@echo "$(YELLOW)Setting up GCP project...$(NC)"
	@echo "Enter your GCP Project ID:"
	@read PROJECT_ID; \
	gcloud config set project $$PROJECT_ID; \
	gcloud services enable compute.googleapis.com run.googleapis.com sqladmin.googleapis.com

deploy: ## Full deployment to GCP
	@echo "$(BLUE)Starting deployment...$(NC)"
	@make docker-build
	@make terraform-init
	@make terraform-apply
	@echo "$(GREEN)Deployment completed!$(NC)"

# Cleanup
clean: ## Clean build artifacts
	rm -rf .next
	rm -rf node_modules
	rm -rf dist
	rm -rf build

clean-docker: ## Clean Docker images and containers
	docker-compose down -v
	docker system prune -af

# Setup
setup: ## Initial project setup
	@echo "$(BLUE)Setting up Braian.rent project...$(NC)"
	npm install
	cp .env.example .env
	@echo "$(YELLOW)Please edit .env file with your credentials$(NC)"
	@echo "$(GREEN)Setup completed! Run 'make dev' to start$(NC)"

# Quick commands
quick-start: ## Quick start (db + dev server)
	docker-compose up -d db
	npm run dev

full-reset: ## Full reset (clean + setup + migrate + seed)
	@make clean
	@make setup
	@make docker-compose-up
	sleep 3
	@make db-migrate
	@make db-seed
	@echo "$(GREEN)Full reset completed!$(NC)"

# CI/CD
ci-lint: ## Run CI lint checks
	npm run lint
	npm run format:check

ci-test: ## Run CI tests
	npm run lint
	npm run test:run
	npx tsc --noEmit

ci-build: ## Build for CI
	npm run build

ci-check: ## Run all CI checks locally (exactly like GitHub Actions)
	@echo "$(BLUE)Running CI checks...$(NC)"
	@echo "$(YELLOW)1/5 Linting...$(NC)"
	@npm run lint
	@echo "$(YELLOW)2/5 Format check...$(NC)"
	@npm run format:check
	@echo "$(YELLOW)3/5 TypeScript check...$(NC)"
	@npx tsc --noEmit
	@echo "$(YELLOW)4/5 Tests...$(NC)"
	@npm run test:run
	@echo "$(YELLOW)5/5 Build...$(NC)"
	@npm run build
	@echo "$(GREEN)✅ All CI checks passed!$(NC)"

# Logs
logs-cloudrun: ## View Cloud Run logs
	gcloud run services logs read braian-rent-service --region europe-west1 --limit 100

logs-cloudsql: ## View Cloud SQL logs
	gcloud sql operations list --instance braian-rent-db-prod

logs-local: ## View local development logs
	tail -f logs/*.log

# Health checks
health-local: ## Check local health
	curl http://localhost:3000/api/health | jq '.'

health-prod: ## Check production health
	@CLOUD_RUN_URL=$$(gcloud run services describe braian-rent-service --region europe-west1 --format='value(status.url)'); \
	curl "$$CLOUD_RUN_URL/api/health" | jq '.'

# Default target
.DEFAULT_GOAL := help

