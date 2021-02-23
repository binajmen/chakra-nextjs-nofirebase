#!/bin/bash

# image tag is the last commit hash
IMAGE_TAG=$(git rev-parse HEAD)
REPO_NAME="orderbru"
GCP_PROJECT_NAME="orderbru"

docker push eu.gcr.io/$GCP_PROJECT_NAME/$REPO_NAME:$IMAGE_TAG

gcloud run deploy $REPO_NAME \
    --image eu.gcr.io/$GCP_PROJECT_NAME/$REPO_NAME:$IMAGE_TAG \
    --project $GCP_PROJECT_NAME \
    --platform managed \
    --region europe-west1 \
    --allow-unauthenticated
