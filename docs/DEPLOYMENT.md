# Deployment Guide

## Prerequisites

- AWS Account with appropriate permissions
- Docker installed
- Kubernetes cluster (optional, for K8s deployment)
- Terraform installed (for infrastructure)
- kubectl installed (for Kubernetes)

## Infrastructure Setup

### 1. Configure Terraform Variables

Copy the example variables file and update with your values:

```bash
cp infrastructure/terraform/production.tfvars.example infrastructure/terraform/production.tfvars
# Edit production.tfvars with your values
```

### 2. Initialize and Apply Terraform

```bash
cd infrastructure/terraform
terraform init
terraform plan -var-file=production.tfvars
terraform apply -var-file=production.tfvars
```

This will create:
- VPC and networking
- RDS PostgreSQL database
- ElastiCache Redis
- Elasticsearch cluster
- S3 buckets
- CloudFront distribution
- ECS/EKS cluster (depending on configuration)

## Database Setup

### 1. Run Migrations

```bash
cd apps/api
npm run migration:run
```

### 2. Seed Initial Data (Optional)

```bash
npm run seed
```

## Application Deployment

### Docker Deployment

#### 1. Build Images

```bash
docker build -f infrastructure/docker/Dockerfile.production -t fitness-api:latest .
docker build -f infrastructure/docker/Dockerfile.web.production -t fitness-web:latest .
```

#### 2. Tag and Push to Registry

```bash
docker tag fitness-api:latest your-registry/fitness-api:latest
docker tag fitness-web:latest your-registry/fitness-web:latest
docker push your-registry/fitness-api:latest
docker push your-registry/fitness-web:latest
```

#### 3. Deploy Using Script

```bash
chmod +x infrastructure/scripts/deploy.sh
./infrastructure/scripts/deploy.sh production latest
```

### Kubernetes Deployment

#### 1. Create Namespace

```bash
kubectl create namespace production
```

#### 2. Create Secrets

```bash
kubectl create secret generic fitness-secrets \
  --from-literal=database-host=your-db-host \
  --from-literal=database-password=your-db-password \
  --from-literal=jwt-secret=your-jwt-secret \
  -n production
```

#### 3. Apply Deployments

```bash
kubectl apply -f infrastructure/kubernetes/api-deployment.yaml
kubectl apply -f infrastructure/kubernetes/web-deployment.yaml
```

#### 4. Check Status

```bash
kubectl get pods -n production
kubectl get services -n production
```

## Environment Variables

### API Environment Variables

Copy `.env.production.example` to `.env.production` and configure:

```bash
cp apps/api/.env.production.example apps/api/.env.production
# Edit .env.production with your values
```

### Web Environment Variables

```bash
cp apps/web/.env.production.example apps/web/.env.production
# Edit .env.production with your values
```

## Health Checks

### API Health Check

```bash
curl https://api.yourdomain.com/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Web Health Check

```bash
curl https://yourdomain.com/
```

## Monitoring

### Application Logs

```bash
# Kubernetes
kubectl logs -f deployment/fitness-api -n production
kubectl logs -f deployment/fitness-web -n production

# Docker
docker logs fitness-api
docker logs fitness-web
```

### Database Monitoring

- RDS Performance Insights
- CloudWatch metrics
- Slow query logs

## Rollback Procedure

### Kubernetes Rollback

```bash
./infrastructure/scripts/rollback.sh production
```

Or manually:

```bash
kubectl rollout undo deployment/fitness-api -n production
kubectl rollout undo deployment/fitness-web -n production
```

### Docker Rollback

Redeploy previous version:

```bash
./infrastructure/scripts/deploy.sh production previous-version
```

## Scaling

### Horizontal Scaling

Update replica count in Kubernetes:

```bash
kubectl scale deployment/fitness-api --replicas=5 -n production
kubectl scale deployment/fitness-web --replicas=5 -n production
```

### Auto-scaling

Configure HPA (Horizontal Pod Autoscaler):

```bash
kubectl autoscale deployment/fitness-api --cpu-percent=70 --min=2 --max=10 -n production
```

## Backup and Recovery

### Database Backups

RDS automated backups are enabled by default. Manual backup:

```bash
aws rds create-db-snapshot \
  --db-instance-identifier fitness-platform-db \
  --db-snapshot-identifier fitness-platform-backup-$(date +%Y%m%d)
```

### Restore from Backup

```bash
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier fitness-platform-db-restored \
  --db-snapshot-identifier fitness-platform-backup-20240101
```

## Security Checklist

- [ ] All secrets stored in secure vault (AWS Secrets Manager)
- [ ] SSL/TLS certificates configured
- [ ] Security groups properly configured
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Security headers set (Helmet)
- [ ] Database encryption enabled
- [ ] Regular security updates applied

