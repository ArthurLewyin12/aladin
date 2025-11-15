# Docker Build Troubleshooting Guide

## Problèmes de réseau DNS rencontrés

Le serveur Ubuntu rencontre des erreurs DNS (`EAI_AGAIN`) lors de l'accès aux registres npm/Alpine.

### Solutions proposées

#### Option 1: Utiliser Dockerfile.npm (Recommandé pour problèmes réseau)

Utilise npm au lieu de pnpm, évite les dépendances externes:

```bash
# Générer package-lock.json si nécessaire
npm install --package-lock-only

# Build avec npm
docker compose -f docker-compose.npm.yml up -d --build
```

#### Option 2: Configurer les DNS du Docker daemon

Éditez `/etc/docker/daemon.json`:

```json
{
  "dns": ["8.8.8.8", "8.8.4.4", "1.1.1.1"]
}
```

Puis redémarrez Docker:

```bash
sudo systemctl restart docker
```

#### Option 3: Utiliser un proxy/cache npm local

Si vous avez accès à un proxy npm (verdaccio, nexus, etc.):

```bash
docker compose build --build-arg NPM_REGISTRY=http://votre-proxy:4873
```

#### Option 4: Build avec network host

Permet au build d'utiliser le réseau de l'hôte:

```bash
docker compose build --network host
```

### Diagnostic des problèmes réseau

```bash
# Tester la résolution DNS dans un conteneur
docker run --rm node:20-slim sh -c "ping -c 3 registry.npmjs.org"

# Vérifier les DNS du daemon Docker
docker info | grep -i dns

# Tester avec curl
docker run --rm node:20-slim curl -I https://registry.npmjs.org
```

### Configuration serveur Ubuntu

#### Vérifier les DNS système

```bash
# Afficher la configuration DNS
cat /etc/resolv.conf

# Tester la résolution
nslookup registry.npmjs.org
dig registry.npmjs.org
```

#### Problèmes courants

1. **Firewall bloquant les connexions sortantes**
   ```bash
   sudo ufw status
   # Autoriser si nécessaire
   sudo ufw allow out 443/tcp
   ```

2. **Problème de MTU réseau**
   ```bash
   # Réduire le MTU Docker
   # Dans /etc/docker/daemon.json
   {
     "mtu": 1450
   }
   ```

3. **Timeout trop court**
   Déjà configuré dans .npmrc avec timeouts augmentés

### Fichiers de configuration

- **Dockerfile** - Version pnpm (nécessite accès registry npmjs)
- **Dockerfile.npm** - Version npm (plus robuste, pas de pnpm)
- **docker-compose.yml** - Pour Dockerfile avec pnpm
- **docker-compose.npm.yml** - Pour Dockerfile.npm
- **.npmrc** - Configuration npm avec timeouts augmentés

### Commandes utiles

```bash
# Build sans cache
docker compose build --no-cache

# Build avec logs détaillés
docker compose build --progress=plain

# Nettoyer le cache Docker
docker builder prune -af

# Voir les images
docker images

# Voir les conteneurs
docker ps -a
```

### En dernier recours

Si aucune solution ne fonctionne, vous pouvez:

1. Builder l'image sur une machine locale avec bonne connectivité
2. Exporter l'image: `docker save aladin-frontend > aladin.tar`
3. Transférer vers le serveur: `scp aladin.tar user@server:/tmp/`
4. Importer sur le serveur: `docker load < /tmp/aladin.tar`
5. Lancer: `docker compose up -d`
