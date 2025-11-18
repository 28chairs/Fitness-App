#!/bin/bash

set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}

echo "Deploying to $ENVIRONMENT environment with version $VERSION"

# Build Docker images
echo "Building Docker images..."
docker build -f infrastructure/docker/Dockerfile.production -t fitness-api:$VERSION .
docker build -f infrastructure/docker/Dockerfile.web.production -t fitness-web:$VERSION .

# Tag images
docker tag fitness-api:$VERSION your-registry/fitness-api:$VERSION
docker tag fitness-web:$VERSION your-registry/fitness-web:$VERSION

# Push to registry
echo "Pushing images to registry..."
docker push your-registry/fitness-api:$VERSION
docker push your-registry/fitness-web:$VERSION

# Update Kubernetes deployments
if [ "$ENVIRONMENT" = "production" ]; then
  kubectl set image deployment/fitness-api api=your-registry/fitness-api:$VERSION -n production
  kubectl set image deployment/fitness-web web=your-registry/fitness-web:$VERSION -n production
  kubectl rollout status deployment/fitness-api -n production
  kubectl rollout status deployment/fitness-web -n production
else
  kubectl set image deployment/fitness-api api=your-registry/fitness-api:$VERSION -n staging
  kubectl set image deployment/fitness-web web=your-registry/fitness-web:$VERSION -n staging
  kubectl rollout status deployment/fitness-api -n staging
  kubectl rollout status deployment/fitness-web -n staging
fi

echo "Deployment completed successfully!"

