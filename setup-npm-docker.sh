#!/bin/bash

# Script pour préparer le build Docker avec npm
# Convertit le projet de pnpm à npm pour Docker uniquement

set -e

echo "🔧 Preparing npm-based Docker build..."

# Vérifier si package-lock.json existe
if [ ! -f "package-lock.json" ]; then
    echo "📦 Generating package-lock.json from pnpm-lock.yaml..."

    # Option 1: Si npm est disponible localement
    if command -v npm &> /dev/null; then
        npm install --package-lock-only --legacy-peer-deps
        echo "✅ package-lock.json generated"
    else
        echo "❌ npm not found. Please install Node.js/npm first."
        exit 1
    fi
else
    echo "✅ package-lock.json already exists"
fi

echo ""
echo "📋 Files ready for Docker build:"
echo "  - Dockerfile.npm (npm-based build)"
echo "  - docker-compose.npm.yml (compose config)"
echo "  - package-lock.json (dependencies lock)"
echo ""
echo "🚀 To build and run:"
echo "  docker compose -f docker-compose.npm.yml up -d --build"
echo ""
