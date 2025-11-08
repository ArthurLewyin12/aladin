# 📚 API Backend - Gestion des Cours

Documentation technique pour l'implémentation des endpoints de gestion des cours.

---

## 🗄️ Structure de la base de données

### Table `cours`

```sql
CREATE TABLE cours (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    classe_id BIGINT UNSIGNED NOT NULL,
    chapitre_id BIGINT UNSIGNED NOT NULL,
    professeur_id BIGINT UNSIGNED NOT NULL,

    -- Contenu (stockage JSON et Text)
    lexical_state JSON NOT NULL,
    html LONGTEXT NOT NULL,
    plain_text LONGTEXT NOT NULL,
    metadata JSON NOT NULL,

    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (chapitre_id) REFERENCES chapitres(id) ON DELETE CASCADE,
    FOREIGN KEY (professeur_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_classe_id (classe_id),
    INDEX idx_chapitre_id (chapitre_id),
    INDEX idx_professeur_id (professeur_id),
    FULLTEXT INDEX idx_plain_text (plain_text)
);
```

**Champs importants :**
- `lexical_state` : État JSON de l'éditeur Lexical (pour ré-édition)
- `html` : Version HTML du contenu (pour affichage rapide)
- `plain_text` : Texte brut (pour recherche full-text)
- `metadata` : Statistiques JSON (nombre de mots, images, etc.)

---

## 🔌 Endpoints à implémenter

### 1. Liste des cours du professeur

```
GET /api/prof/cours
```

**Headers :**
```
Authorization: Bearer {token}
```

**Réponse (200 OK) :**
```json
{
  "courses": [
    {
      "id": 123,
      "titre": "Introduction aux équations",
      "classe": {
        "id": 45,
        "nom": "Terminale S1"
      },
      "chapitre": {
        "id": 12,
        "libelle": "Équations du second degré"
      },
      "is_active": true,
      "created_at": "2025-11-08T10:30:00Z",
      "updated_at": "2025-11-08T15:45:00Z"
    }
  ],
  "count": 15
}
```

---

### 2. Récupérer un cours spécifique

```
GET /api/prof/cours/{cours_id}
```

**Headers :**
```
Authorization: Bearer {token}
```

**Réponse (200 OK) :**
```json
{
  "id": 123,
  "titre": "Introduction aux équations",
  "classe_id": 45,
  "chapitre_id": 12,
  "professeur_id": 35,
  "content": {
    "lexical_state": {
      "root": {
        "children": [...],
        "direction": "ltr",
        "type": "root",
        "version": 1
      }
    },
    "html": "<p>Contenu en HTML...</p>",
    "plain_text": "Contenu en texte brut...",
    "metadata": {
      "word_count": 450,
      "character_count": 3200,
      "has_images": true,
      "has_tables": false,
      "has_videos": true,
      "has_math": true,
      "image_count": 3,
      "video_count": 1,
      "table_count": 0
    }
  },
  "is_active": true,
  "created_at": "2025-11-08T10:30:00Z",
  "updated_at": "2025-11-08T15:45:00Z"
}
```

**Erreurs :**
- `404` : Cours non trouvé
- `403` : Le cours n'appartient pas au professeur

---

### 3. Créer un cours

```
POST /api/prof/classes/{classe_id}/cours
```

**Headers :**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body :**
```json
{
  "titre": "Introduction aux équations",
  "chapitre_id": 12,
  "content": {
    "lexical_state": {
      "root": {
        "children": [...],
        "direction": "ltr",
        "type": "root",
        "version": 1
      }
    },
    "html": "<p>Contenu HTML...</p>",
    "plain_text": "Contenu texte brut...",
    "metadata": {
      "word_count": 450,
      "character_count": 3200,
      "has_images": true,
      "has_tables": false,
      "has_videos": true,
      "has_math": true,
      "image_count": 3,
      "video_count": 1,
      "table_count": 0
    }
  }
}
```

**Réponse (201 Created) :**
```json
{
  "message": "Cours créé avec succès !",
  "cours": {
    "id": 123,
    "titre": "Introduction aux équations",
    "classe_id": 45,
    "chapitre_id": 12,
    "professeur_id": 35,
    "content": {...},
    "is_active": true,
    "created_at": "2025-11-08T10:30:00Z"
  }
}
```

**Validation :**
- `titre` : requis, string, max 255 caractères
- `chapitre_id` : requis, doit exister
- `content.lexical_state` : requis, doit être un JSON valide
- `content.html` : requis, string
- `content.plain_text` : requis, string
- `content.metadata` : requis, JSON

**Erreurs :**
- `422` : Validation échouée
- `403` : La classe n'appartient pas au professeur
- `404` : Classe ou chapitre non trouvé

---

### 4. Mettre à jour un cours

```
PUT /api/prof/classes/{classe_id}/cours/{cours_id}
```

**Headers :**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (tous les champs sont optionnels) :**
```json
{
  "titre": "Nouveau titre",
  "content": {
    "lexical_state": {...},
    "html": "<p>...</p>",
    "plain_text": "...",
    "metadata": {...}
  }
}
```

**Réponse (200 OK) :**
```json
{
  "message": "Cours mis à jour avec succès !",
  "cours": {
    "id": 123,
    "titre": "Nouveau titre",
    "content": {...},
    "updated_at": "2025-11-08T15:45:00Z"
  }
}
```

**Erreurs :**
- `404` : Cours non trouvé
- `403` : Le cours n'appartient pas au professeur
- `422` : Validation échouée

---

### 5. Upload d'image

```
POST /api/prof/cours/upload-image
```

**Headers :**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (FormData) :**
```
image: File (JPG, PNG, GIF, WebP)
cours_id: number (optionnel)
```

**Validation :**
- Formats acceptés : JPG, JPEG, PNG, GIF, WebP
- Taille max : 5 MB
- Générer un nom unique (UUID)
- Stocker dans `storage/cours/images/`

**Réponse (200 OK) :**
```json
{
  "message": "Image uploadée avec succès !",
  "url": "https://aladin.yira.pro/storage/cours/images/abc123.jpg",
  "path": "/storage/cours/images/abc123.jpg",
  "filename": "abc123.jpg",
  "size": 245678
}
```

**Erreurs :**
- `422` : Format invalide ou fichier trop volumineux
- `413` : Fichier trop volumineux
- `500` : Erreur lors de l'upload

---

### 6. Activer un cours

```
POST /api/prof/classes/{classe_id}/cours/{cours_id}/activer
```

**Headers :**
```
Authorization: Bearer {token}
```

**Réponse (200 OK) :**
```json
{
  "message": "Cours activé avec succès !"
}
```

**Action :** Met `is_active = true` et envoie les notifications aux élèves.

---

### 7. Désactiver un cours

```
POST /api/prof/classes/{classe_id}/cours/{cours_id}/desactiver
```

**Headers :**
```
Authorization: Bearer {token}
```

**Réponse (200 OK) :**
```json
{
  "message": "Cours désactivé avec succès !"
}
```

**Action :** Met `is_active = false`.

---

## ⚠️ Format des erreurs

Toutes les erreurs doivent suivre ce format :

```json
{
  "message": "Message d'erreur principal",
  "error": "Détails de l'erreur",
  "errors": {
    "field_name": ["Erreur 1", "Erreur 2"]
  }
}
```

**Codes HTTP :**
- `200` : OK
- `201` : Created
- `400` : Bad Request
- `401` : Unauthorized
- `403` : Forbidden
- `404` : Not Found
- `413` : Payload Too Large
- `422` : Unprocessable Entity
- `500` : Internal Server Error

---

## 📝 Notes importantes

### 1. Structure du contenu

Le frontend envoie **4 versions** du contenu :

1. **`lexical_state`** (JSON) : Pour ré-éditer le cours plus tard
2. **`html`** (string) : Pour afficher rapidement sans re-render
3. **`plain_text`** (string) : Pour la recherche full-text
4. **`metadata`** (JSON) : Statistiques pré-calculées

**Important** : Ne PAS recalculer ces données côté backend. Le frontend les envoie déjà pré-calculées.

### 2. Métadonnées (metadata)

Structure :
```json
{
  "word_count": 450,
  "character_count": 3200,
  "has_images": true,
  "has_tables": false,
  "has_videos": true,
  "has_math": true,
  "image_count": 3,
  "video_count": 1,
  "table_count": 0
}
```

Ces métadonnées sont calculées automatiquement par le frontend.

### 3. Vidéos

**Les vidéos ne sont PAS uploadées.**

Le professeur insère des URLs (YouTube, Vimeo, etc.) qui sont stockées dans le `lexical_state`.

Exemple :
```json
{
  "type": "youtube",
  "videoID": "dQw4w9WgXcQ"
}
```

### 4. Sécurité

**Validations requises :**
- ✅ Vérifier que le professeur est propriétaire de la classe
- ✅ Vérifier que le chapitre existe
- ✅ Valider les formats d'image (JPG, PNG, GIF, WebP)
- ✅ Limiter la taille des uploads (5 MB max)
- ✅ Générer des noms de fichiers uniques (UUID)

---

## ✅ Checklist d'implémentation

- [ ] Créer la migration pour la table `cours`
- [ ] Créer le model `Cours`
- [ ] Implémenter `GET /api/prof/cours` (liste)
- [ ] Implémenter `GET /api/prof/cours/{id}` (détail)
- [ ] Implémenter `POST /api/prof/classes/{classe_id}/cours` (création)
- [ ] Implémenter `PUT /api/prof/classes/{classe_id}/cours/{cours_id}` (mise à jour)
- [ ] Implémenter `POST /api/prof/cours/upload-image` (upload image)
- [ ] Implémenter `POST .../activer` (activation)
- [ ] Implémenter `POST .../desactiver` (désactivation)
- [ ] Tester tous les endpoints avec Postman
- [ ] Documenter dans Swagger/Postman

---
