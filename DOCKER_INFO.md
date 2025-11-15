# 🐳 Docker - Informations complètes

## 📦 Image Docker Hub

**Repository:** [`sminth/aladin-frontend`](https://hub.docker.com/r/sminth/aladin-frontend)

```bash
docker pull sminth/aladin-frontend:latest
```

### Informations sur l'image

- **Tag:** `latest`
- **Base:** node:20-slim (Debian)
- **Taille:** ~200MB (compressée)
- **Plateformes:** linux/amd64, linux/arm64
- **Architecture:** Multi-stage build
- **Sécurité:** Utilisateur non-root (nextjs:1001)
- **Healthcheck:** Intégré

## 📁 Fichiers Docker du projet

| Fichier | Usage |
|---------|-------|
| `Dockerfile` | Build avec pnpm (optimal mais nécessite bon réseau) |
| `Dockerfile.npm` | Build avec npm (utilisé pour l'image Docker Hub) |
| `docker-compose.yml` | Compose pour build pnpm local |
| `docker-compose.npm.yml` | Compose pour build npm local |
| `docker-compose.prod.yml` | **Compose production (Docker Hub) - RECOMMANDÉ** |
| `.dockerignore` | Exclut fichiers inutiles du build |
| `.npmrc` | Configuration npm (timeouts augmentés) |

## 🎯 Choix de déploiement

### Option 1: Docker Hub (RECOMMANDÉ) ⭐

```bash
docker compose -f docker-compose.prod.yml up -d
```

**Avantages:**
- ✅ Pas de build sur le serveur
- ✅ Déploiement ultra-rapide (< 1 min)
- ✅ Évite problèmes réseau/DNS
- ✅ Image testée et validée
- ✅ Économise ressources serveur

**Inconvénients:**
- ❌ Dépend de Docker Hub

### Option 2: Build local avec npm

```bash
docker compose -f docker-compose.npm.yml build
docker compose -f docker-compose.npm.yml up -d
```

**Avantages:**
- ✅ Indépendant de Docker Hub
- ✅ Contrôle total du build

**Inconvénients:**
- ❌ Build lent (~2-5 min)
- ❌ Peut échouer si problèmes réseau
- ❌ Consomme ressources serveur

### Option 3: Build local avec pnpm

```bash
docker compose build
docker compose up -d
```

**Note:** Nécessite configuration DNS Docker (voir DOCKER_TROUBLESHOOTING.md)

## 🔧 Variables d'environnement

Variables injectées au **build time** (ARG):
```bash
NEXT_PUBLIC_API_BASE_URL=https://aladin.yira.pro
NEXT_PUBLIC_UNIVERSE=PROD
```

Variables au **runtime** (ENV):
```bash
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://aladin.yira.pro
NEXT_PUBLIC_UNIVERSE=PROD
```

## 🌐 Ports

- **Interne:** 3000 (Next.js)
- **Externe:** 12000 (mappé depuis docker-compose)

Modifier dans docker-compose si nécessaire:
```yaml
ports:
  - "VOTRE_PORT:3000"
```

## 📊 Monitoring

### Healthcheck

Vérifie toutes les 30s que l'app répond sur le port 3000:
```bash
# Voir le statut health
docker compose -f docker-compose.prod.yml ps
```

### Logs

```bash
# Logs temps réel
docker compose -f docker-compose.prod.yml logs -f

# Dernières 100 lignes
docker compose -f docker-compose.prod.yml logs --tail=100

# Logs d'un service spécifique
docker logs aladin-frontend
```

### Ressources

```bash
# Utilisation CPU/RAM/Réseau
docker stats aladin-frontend

# Informations détaillées
docker inspect aladin-frontend
```

## 🔄 Workflow de mise à jour

### Pour le développeur (publier une nouvelle version)

```bash
# 1. Faire les modifications dans le code
# 2. Commit et push vers git

# 3. Builder la nouvelle image (multi-plateforme: AMD64 + ARM64)
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://aladin.yira.pro \
  --build-arg NEXT_PUBLIC_UNIVERSE=PROD \
  -t sminth/aladin-frontend:latest \
  -f Dockerfile.npm \
  --push \
  .

# 4. Optionnel: créer un tag de version
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://aladin.yira.pro \
  --build-arg NEXT_PUBLIC_UNIVERSE=PROD \
  -t sminth/aladin-frontend:v1.0.0 \
  -t sminth/aladin-frontend:latest \
  -f Dockerfile.npm \
  --push \
  .

# 5. Vérifier les plateformes
docker buildx imagetools inspect sminth/aladin-frontend:latest

# 6. Informer l'équipe du nouveau déploiement
```

### Pour le serveur de production (déployer la mise à jour)

```bash
cd /home/akilyum/domains/aladin.akilyum.site/public_html/aladin

# 1. Pull la nouvelle image
docker compose -f docker-compose.prod.yml pull

# 2. Redémarrer avec la nouvelle version
docker compose -f docker-compose.prod.yml up -d

# 3. Vérifier les logs
docker compose -f docker-compose.prod.yml logs -f
```

## 🧹 Maintenance

```bash
# Nettoyer les images inutilisées
docker image prune -a

# Nettoyer tout (images, conteneurs, volumes)
docker system prune -a --volumes

# Voir l'espace utilisé
docker system df
```

## 🔐 Sécurité

- ✅ Utilisateur non-root (nextjs:nodejs)
- ✅ Multi-stage build (images intermédiaires non incluses)
- ✅ Pas de secrets dans l'image
- ✅ Healthcheck pour détecter les crashes
- ✅ Restart automatique (unless-stopped)

## 📚 Documentation complète

- **Démarrage rapide:** [QUICKSTART.md](QUICKSTART.md)
- **Guide complet:** [DEPLOY.md](DEPLOY.md)
- **Dépannage:** [DOCKER_TROUBLESHOOTING.md](DOCKER_TROUBLESHOOTING.md)
- **Docker Hub:** [README.docker.md](README.docker.md)

## 🆘 Support

En cas de problème:
1. Consulter [DOCKER_TROUBLESHOOTING.md](DOCKER_TROUBLESHOOTING.md)
2. Vérifier les logs: `docker compose -f docker-compose.prod.yml logs -f`
3. Vérifier le statut: `docker compose -f docker-compose.prod.yml ps`
4. Tester le healthcheck: `docker inspect aladin-frontend | grep -A 10 Health`
