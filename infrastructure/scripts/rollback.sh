#!/bin/bash

set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-previous}

echo "Rolling back $ENVIRONMENT environment to version $VERSION"

if [ "$ENVIRONMENT" = "production" ]; then
  kubectl rollout undo deployment/fitness-api -n production
  kubectl rollout undo deployment/fitness-web -n production
  kubectl rollout status deployment/fitness-api -n production
  kubectl rollout status deployment/fitness-web -n production
else
  kubectl rollout undo deployment/fitness-api -n staging
  kubectl rollout undo deployment/fitness-web -n staging
  kubectl rollout status deployment/fitness-api -n staging
  kubectl rollout status deployment/fitness-web -n staging
fi

echo "Rollback completed successfully!"

