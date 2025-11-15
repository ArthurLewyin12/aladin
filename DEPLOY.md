# Guide de déploiement Docker - Aladin Frontend

## Prérequis

- Docker et Docker Compose installés sur le serveur
- Accès git au dépôt
- Port 12000 disponible (ou modifier dans docker-compose.yml)

## ✅ Déploiement RAPIDE (Recommandé)

**Utilise l'image pré-buildée depuis Docker Hub - Pas de build nécessaire sur le serveur !**

### 1. Sur le serveur Ubuntu

```bash
# Se placer dans le répertoire du projet
cd /home/akilyum/domains/aladin.akilyum.site/public_html/aladin

# Pull les dernières modifications
git pull

# Configurer les variables d'environnement (optionnel)
# Si non configurées, les valeurs par défaut seront utilisées
export NEXT_PUBLIC_API_BASE_URL=https://aladin.yira.pro
export NEXT_PUBLIC_UNIVERSE=PROD

# Pull et lancer l'image depuis Docker Hub (RAPIDE - pas de build)
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

**Avantages :**
- ✅ Pas de build sur le serveur (évite tous les problèmes réseau)
- ✅ Déploiement ultra-rapide (juste pull + run)
- ✅ Image testée et validée
- ✅ Utilise moins de ressources serveur

## Alternative : Build local sur le serveur

Si vous préférez builder localement :

```bash
# Build et lancer (SANS CACHE pour éviter les problèmes)
docker compose -f docker-compose.npm.yml build --no-cache
docker compose -f docker-compose.npm.yml up -d
```

### 2. Vérifier le déploiement

```bash
# Voir les logs
docker compose -f docker-compose.npm.yml logs -f

# Vérifier que le conteneur tourne
docker compose -f docker-compose.npm.yml ps

# Tester l'application
curl http://localhost:12000
```

### 3. Accès

L'application sera accessible sur:
- **Local**: http://localhost:12000
- **Externe**: http://aladin.akilyum.site:12000 (si le port est ouvert)

## Configuration DNS Docker (Solution permanente aux problèmes réseau)

Si vous rencontrez toujours des erreurs DNS, configurez les DNS de Docker:

```bash
# Créer ou éditer la configuration Docker
sudo nano /etc/docker/daemon.json
```

Contenu:
```json
{
  "dns": ["8.8.8.8", "8.8.4.4", "1.1.1.1"]
}
```

Redémarrer Docker:
```bash
sudo systemctl restart docker
```

Après cela, vous pourrez utiliser le Dockerfile standard avec pnpm:
```bash
docker compose up -d --build
```

## Commandes utiles

### Gestion du conteneur

```bash
# Arrêter
docker compose -f docker-compose.npm.yml down

# Redémarrer
docker compose -f docker-compose.npm.yml restart

# Voir les logs en temps réel
docker compose -f docker-compose.npm.yml logs -f aladin-frontend

# Rebuild complet
docker compose -f docker-compose.npm.yml down
docker compose -f docker-compose.npm.yml build --no-cache
docker compose -f docker-compose.npm.yml up -d
```

### Debug

```bash
# Entrer dans le conteneur
docker compose -f docker-compose.npm.yml exec aladin-frontend sh

# Voir les ressources utilisées
docker stats

# Nettoyer les images inutilisées
docker system prune -a
```

## Mise à jour de l'application

### Avec l'image Docker Hub (Recommandé)

```bash
cd /home/akilyum/domains/aladin.akilyum.site/public_html/aladin

# Pull les dernières modifications
git pull

# Pull la nouvelle image et redémarrer
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### Avec build local

```bash
cd /home/akilyum/domains/aladin.akilyum.site/public_html/aladin
git pull
docker compose -f docker-compose.npm.yml build --no-cache
docker compose -f docker-compose.npm.yml up -d
```

## Publication d'une nouvelle version (Développeur)

Pour builder et publier une nouvelle version de l'image :

```bash
# Sur votre machine de développement
docker build -t sminth/aladin-frontend:latest \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://aladin.yira.pro \
  --build-arg NEXT_PUBLIC_UNIVERSE=PROD \
  -f Dockerfile.npm .

# Pousser sur Docker Hub
docker push sminth/aladin-frontend:latest

# Optionnel: créer un tag de version
docker tag sminth/aladin-frontend:latest sminth/aladin-frontend:v1.0.0
docker push sminth/aladin-frontend:v1.0.0
```

## Configuration Nginx (reverse proxy)

Pour exposer l'application via un nom de domaine:

```nginx
server {
    listen 80;
    server_name aladin.akilyum.site;

    location / {
        proxy_pass http://localhost:12000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Troubleshooting

Voir [DOCKER_TROUBLESHOOTING.md](DOCKER_TROUBLESHOOTING.md) pour les problèmes courants.

### Erreur "next: not found"
- Rebuild sans cache: `docker compose -f docker-compose.npm.yml build --no-cache`

### Erreur DNS / EAI_AGAIN
- Configurer les DNS Docker (voir section "Configuration DNS Docker")
- Ou augmenter les timeouts dans .npmrc

### Port déjà utilisé
- Modifier le port dans docker-compose.npm.yml (ligne `"12000:3000"`)
