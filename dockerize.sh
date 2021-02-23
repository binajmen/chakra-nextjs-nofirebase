#!/bin/bash

# image tag is the last commit hash
IMAGE_TAG=$(git rev-parse HEAD)
REPO_NAME="orderbru"
GCP_PROJECT_NAME="orderbru"

docker build . --tag "eu.gcr.io/$GCP_PROJECT_NAME/$REPO_NAME:$IMAGE_TAG"
