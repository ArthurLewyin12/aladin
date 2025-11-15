# 🚀 DÉPLOIEMENT IMMÉDIAT - Instructions pour le serveur

## ✅ L'image Docker est prête !

**Image Docker Hub (multi-architecture):**
- Repository: `sminth/aladin-frontend:latest`
- Plateformes supportées: AMD64 (serveur Ubuntu) + ARM64
- Digest: `sha256:64fa765244c99536b2ef8db829a6e66ed37746c6245a9730f9f84c14082d9059`
- Status: ✅ Buildée, testée et poussée

## 📋 Commandes à exécuter sur le serveur Ubuntu

```bash
# 1. Se connecter au serveur
ssh devops@vps107338

# 2. Aller dans le répertoire du projet
cd /home/akilyum/domains/aladin.akilyum.site/public_html/aladin

# 3. Pull les derniers fichiers depuis git
git pull

# 4. Pull l'image Docker depuis Docker Hub (AMD64 - compatible avec votre serveur)
docker compose -f docker-compose.prod.yml pull

# 5. Lancer l'application
docker compose -f docker-compose.prod.yml up -d

# 6. Vérifier que c'est lancé
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

## ✅ Résultat attendu

L'application sera accessible sur:
- **Local serveur:** http://localhost:12000
- **Externe:** http://aladin.akilyum.site:12000 (si le port est ouvert dans le firewall)

## 🔍 Vérification

```bash
# Tester localement
curl http://localhost:12000

# Voir les logs en temps réel
docker compose -f docker-compose.prod.yml logs -f

# Voir le statut du conteneur
docker compose -f docker-compose.prod.yml ps

# Voir les ressources utilisées
docker stats aladin-frontend
```

## 🛑 En cas de problème

```bash
# Arrêter le conteneur
docker compose -f docker-compose.prod.yml down

# Nettoyer et redémarrer
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## 📚 Documentation complète

- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **Guide complet:** [DEPLOY.md](DEPLOY.md)
- **Dépannage:** [DOCKER_TROUBLESHOOTING.md](DOCKER_TROUBLESHOOTING.md)
- **Informations:** [DOCKER_INFO.md](DOCKER_INFO.md)

---

**Note:** Cette image a été buildée avec `docker buildx` pour supporter à la fois AMD64 et ARM64.
Le problème précédent (no matching manifest for linux/amd64) est maintenant résolu.
