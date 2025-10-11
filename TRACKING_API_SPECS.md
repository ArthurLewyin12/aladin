# 📊 Spécifications API - Tracking du temps d'étude

## Vue d'ensemble

Cette fonctionnalité permet de tracker en temps réel le temps que les utilisateurs passent sur les quiz et les révisions (cours). Les données sont accumulées côté frontend et envoyées périodiquement au backend pour éviter de surcharger l'API.

---

## 🔌 Endpoint à créer

### **POST** `/api/tracking/time`

**Description:** Sauvegarde les sessions de tracking du temps d'étude

**Authentication:** Required (Bearer Token)

---

## 📥 Format de la requête

### Headers
```
Content-Type: application/json
Authorization: Bearer {token}
```

### Body
```json
{
  "sessions": [
    {
      "type": "quiz",
      "resource_id": 123,
      "chapitre_id": 45,
      "duration": 245,
      "metadata": {
        "difficulte": "Moyen"
      }
    },
    {
      "type": "revision",
      "resource_id": 67,
      "chapitre_id": 45,
      "duration": 180,
      "metadata": {}
    }
  ]
}
```

### Schéma du payload

| Champ | Type | Required | Description |
|-------|------|----------|-------------|
| `sessions` | Array | ✅ | Liste des sessions de tracking |

#### Objet Session

| Champ | Type | Required | Description | Exemple |
|-------|------|----------|-------------|---------|
| `type` | String (enum) | ✅ | Type d'activité | `"quiz"` ou `"revision"` |
| `resource_id` | Integer | ✅ | ID de la ressource (quiz_id ou cours_id) | `123` |
| `chapitre_id` | Integer | ✅ | ID du chapitre étudié | `45` |
| `duration` | Integer | ✅ | Durée en secondes | `245` |
| `metadata` | Object | ❌ | Métadonnées additionnelles | `{ "difficulte": "Moyen" }` |

#### metadata (optionnel)

| Champ | Type | Description |
|-------|------|-------------|
| `difficulte` | String | Niveau de difficulté du quiz (si `type === "quiz"`) |

---

## 📤 Format de la réponse

### Succès (200 OK)

```json
{
  "success": true,
  "message": "Sessions de tracking sauvegardées avec succès",
  "saved_sessions": 2
}
```

| Champ | Type | Description |
|-------|------|-------------|
| `success` | Boolean | Indique si l'opération a réussi |
| `message` | String | Message de confirmation |
| `saved_sessions` | Integer | Nombre de sessions sauvegardées |

### Erreur (400 Bad Request)

```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": {
    "sessions": ["Le champ sessions est requis"],
    "sessions.0.type": ["Le type doit être 'quiz' ou 'revision'"]
  }
}
```

### Erreur (401 Unauthorized)

```json
{
  "success": false,
  "message": "Non authentifié"
}
```

### Erreur (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Erreur lors de la sauvegarde des données de tracking"
}
```

---

## 💾 Modèle de base de données suggéré

### Table: `time_tracking` (ou `study_time_tracking`)

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | Primary Key, Auto-increment |
| `user_id` | BIGINT UNSIGNED | NO | Foreign Key vers `users.id` |
| `type` | ENUM('quiz', 'revision') | NO | Type d'activité |
| `resource_id` | BIGINT UNSIGNED | NO | ID de la ressource (quiz ou cours) |
| `chapitre_id` | BIGINT UNSIGNED | NO | Foreign Key vers `chapitres.id` |
| `duration` | INTEGER UNSIGNED | NO | Durée en secondes |
| `difficulte` | VARCHAR(50) | YES | Niveau de difficulté (pour les quiz) |
| `created_at` | TIMESTAMP | NO | Date de création |
| `updated_at` | TIMESTAMP | NO | Date de modification |

### Indexes recommandés

```sql
INDEX idx_user_type (user_id, type)
INDEX idx_user_chapitre (user_id, chapitre_id)
INDEX idx_created_at (created_at)
```

---

## 🔍 Règles de validation

### Sessions
- **Required:** Le tableau `sessions` doit contenir au moins 1 session
- **Max:** Maximum 100 sessions par requête (pour éviter les abus)

### Session individuelle
- **type:** Required, doit être `"quiz"` ou `"revision"`
- **resource_id:** Required, Integer > 0
- **chapitre_id:** Required, Integer > 0, doit exister dans la table `chapitres`
- **duration:** Required, Integer >= 0, Maximum raisonnable (ex: 86400 = 24h)
- **metadata.difficulte:** Optionnel, String, max 50 caractères

---

## 🎯 Logique métier suggérée

1. **Validation des données:**
   - Valider le format et les types
   - Vérifier que le `user_id` correspond à l'utilisateur authentifié
   - Vérifier que `chapitre_id` existe
   - Optionnel: Vérifier que `resource_id` existe dans la table correspondante

2. **Sauvegarde:**
   - Créer une entrée par session dans la table `time_tracking`
   - Utiliser une transaction pour garantir l'atomicité

3. **Optimisations possibles:**
   - Insertion en batch (INSERT multiple)
   - Queue asynchrone pour ne pas bloquer la réponse

4. **Sécurité:**
   - Vérifier que l'utilisateur a accès au chapitre
   - Rate limiting recommandé (ex: 60 requêtes/minute)

---

## 📊 Exemples d'utilisation

### Exemple 1: Quiz seul
```json
{
  "sessions": [
    {
      "type": "quiz",
      "resource_id": 42,
      "chapitre_id": 12,
      "duration": 300,
      "metadata": {
        "difficulte": "Facile"
      }
    }
  ]
}
```

### Exemple 2: Multiple sessions (quiz + révision)
```json
{
  "sessions": [
    {
      "type": "revision",
      "resource_id": 15,
      "chapitre_id": 8,
      "duration": 450
    },
    {
      "type": "quiz",
      "resource_id": 89,
      "chapitre_id": 8,
      "duration": 120,
      "metadata": {
        "difficulte": "Difficile"
      }
    }
  ]
}
```

---

## 🔄 Comportement côté Frontend

Le frontend envoie les données dans ces situations:
1. **Fin d'activité:** Quand l'utilisateur termine un quiz ou ferme un cours
2. **Auto-send:** Automatiquement toutes les 5 minutes si l'utilisateur reste sur la même page
3. **Avant de quitter:** Event `beforeunload` pour capturer les données avant fermeture

Les données sont accumulées toutes les 10 secondes côté client avant d'être envoyées.

---

## ✅ Tests suggérés

1. **Test succès:** Envoi d'1 session valide
2. **Test succès:** Envoi de plusieurs sessions valides
3. **Test erreur:** Sessions vide `[]`
4. **Test erreur:** Type invalide (`"invalid"`)
5. **Test erreur:** `chapitre_id` inexistant
6. **Test erreur:** `duration` négatif
7. **Test erreur:** Utilisateur non authentifié
8. **Test limite:** Envoi de 100 sessions (limite max)
9. **Test limite:** Envoi de 101 sessions (devrait échouer)
