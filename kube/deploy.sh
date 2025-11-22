#!/usr/bin/env bash

# Exit on any error
set -e

# Detect deployment type and set image name
export TAG=$1
export GOOGLE_PROJECT_ID=$2
export SERVICE_NAME=$3
export IMAGE="asia-south1-docker.pkg.dev/idfy-gitlab/idfy/cookie-manager-backend-service:$TAG"
export NAMESPACE="cookie-manager"

echo "Deploying $TAG"

kubectl set image deployment ${SERVICE_NAME} "$SERVICE_NAME=$IMAGE" --namespace=${NAMESPACE} --record
kubectl rollout status deployment $SERVICE_NAME --namespace=$NAMESPACE

echo "Deployment finished"
