# Aladin Frontend - Docker Image

[![Docker Pulls](https://img.shields.io/docker/pulls/sminth/aladin-frontend)](https://hub.docker.com/r/sminth/aladin-frontend)
[![Docker Image Size](https://img.shields.io/docker/image-size/sminth/aladin-frontend/latest)](https://hub.docker.com/r/sminth/aladin-frontend)

Application Next.js 15 éducative pour les étudiants en Côte d'Ivoire.

## Quick Start

```bash
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://aladin.yira.pro \
  -e NEXT_PUBLIC_UNIVERSE=PROD \
  --name aladin-frontend \
  sminth/aladin-frontend:latest
```

Accédez à l'application sur http://localhost:3000

## Docker Compose

```yaml
services:
  aladin-frontend:
    image: sminth/aladin-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=https://aladin.yira.pro
      - NEXT_PUBLIC_UNIVERSE=PROD
    restart: unless-stopped
```

Lancez avec :

```bash
docker compose up -d
```

## Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | URL de l'API backend | `https://aladin.yira.pro` |
| `NEXT_PUBLIC_UNIVERSE` | Environnement (DEV/PROD) | `PROD` |
| `NODE_ENV` | Mode Node.js | `production` |
| `PORT` | Port interne du conteneur | `3000` |

## Tags disponibles

- `latest` - Dernière version stable
- `v1.x.x` - Versions spécifiques (à venir)

## Caractéristiques

- ✅ Multi-stage build optimisé
- ✅ **Multi-architecture : AMD64 + ARM64**
- ✅ Image basée sur Node.js 20 Slim
- ✅ Utilisateur non-root pour la sécurité
- ✅ Healthcheck intégré
- ✅ Next.js 15 avec standalone output
- ✅ ~200MB (compressed)

## Architecture

```
- Plateformes: linux/amd64, linux/arm64
- Base: node:20-slim
- Runtime: Next.js 15 standalone
- User: nextjs (UID 1001)
- Exposed port: 3000
```

## Build local

```bash
git clone https://github.com/votre-repo/aladin.git
cd aladin
docker build -t sminth/aladin-frontend:latest -f Dockerfile.npm .
```

## Support

- 📚 [Documentation complète](https://github.com/votre-repo/aladin)
- 🐛 [Report issues](https://github.com/votre-repo/aladin/issues)

## License

Propriétaire - Akilyum/Yira
