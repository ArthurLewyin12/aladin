#!/bin/bash

# Script de build Docker avec gestion d'erreurs
# Usage: ./docker-build.sh

set -e

echo "🐳 Building Aladin Frontend Docker Image..."

# Charger les variables d'environnement si .env existe
if [ -f .env ]; then
    echo "📦 Loading environment variables from .env..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# Variables par défaut
NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-https://aladin.yira.pro}
NEXT_PUBLIC_UNIVERSE=${NEXT_PUBLIC_UNIVERSE:-PROD}

echo "🔧 Configuration:"
echo "  - API URL: $NEXT_PUBLIC_API_BASE_URL"
echo "  - Universe: $NEXT_PUBLIC_UNIVERSE"

# Build avec docker compose
echo "🚀 Starting build..."
docker compose build \
    --build-arg NEXT_PUBLIC_API_BASE_URL="$NEXT_PUBLIC_API_BASE_URL" \
    --build-arg NEXT_PUBLIC_UNIVERSE="$NEXT_PUBLIC_UNIVERSE" \
    --progress=plain

echo "✅ Build completed successfully!"
echo "📝 To start the container, run: docker compose up -d"
