# 🚀 Quick Start - Déploiement en 2 minutes

## Sur le serveur Ubuntu

```bash
# 1. Aller dans le répertoire
cd /home/akilyum/domains/aladin.akilyum.site/public_html/aladin

# 2. Récupérer les derniers fichiers
git pull

# 3. Lancer l'application (utilise l'image Docker Hub)
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# 4. Vérifier que ça tourne
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

## ✅ C'est tout !

L'application sera disponible sur **http://localhost:12000**

## Commandes utiles

```bash
# Arrêter
docker compose -f docker-compose.prod.yml down

# Redémarrer
docker compose -f docker-compose.prod.yml restart

# Voir les logs
docker compose -f docker-compose.prod.yml logs -f

# Mettre à jour vers la dernière version
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## Problèmes ?

Consultez [DEPLOY.md](DEPLOY.md) ou [DOCKER_TROUBLESHOOTING.md](DOCKER_TROUBLESHOOTING.md)
