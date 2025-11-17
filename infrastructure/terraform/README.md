# Infrastructure as Code

This directory contains Terraform configuration for AWS infrastructure.

## Prerequisites

- Terraform >= 1.5.0
- AWS CLI configured
- S3 bucket for Terraform state

## Setup

1. Create S3 bucket for Terraform state:
```bash
aws s3 mb s3://fitness-platform-terraform-state
```

2. Initialize Terraform:
```bash
terraform init
```

3. Create `terraform.tfvars`:
```hcl
aws_region      = "us-east-1"
environment     = "dev"
project_name    = "fitness-platform"
db_instance_class = "db.t3.micro"
db_username     = "admin"
db_password     = "your-secure-password"
redis_node_type = "cache.t3.micro"
```

4. Plan and apply:
```bash
terraform plan
terraform apply
```

## Resources Created

- VPC with public and private subnets
- RDS PostgreSQL instance (multi-AZ)
- ElastiCache Redis cluster
- S3 bucket for media storage
- CloudFront CDN distribution
- Security groups and networking


