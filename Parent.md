#### Obtenir tous les enfants (utilisateurs + manuels)
```
GET /api/parent/enfants
```
**Réponse :**
```json
{
  "success": true,
  "enfants": [
    {
      "id": "123",
      "nom": "Martin",
      "prenom": "Sophie",
      "niveau_id": 1,
      "niveau": {...},
      "type": "utilisateur",
      "email": "sophie@example.com",
      "numero": "0123456789"
    },
    {
      "id": "manuel_456",
      "nom": "Martin",
      "prenom": "Lucas",
      "niveau_id": 2,
      "niveau": {...},
      "type": "manuel",
      "email": "lucas@example.com",
      "numero": "0987654321"
    }
  ],
  "count": 2,
  "enfant_actif": {...},
  "classe_enfant_actif": {...}
}
```

#### Ajouter un enfant manuellement
```
POST /api/parent/enfants/ajouter-manuel
{
  "nom": "Martin",
  "prenom": "Lucas",
  "niveau_id": 2,
  "email": "lucas@example.com",
  "numero": "0987654321"
}
```

#### Sélectionner un enfant actif
```
POST /api/parent/enfants/selectionner
{
  "enfant_id": "123"  // ou "manuel_456" pour un enfant manuel
}
```

#### Obtenir l'enfant actuellement sélectionné
```
GET /api/parent/enfant-actif
```

### Gestion des Relations

#### Ajouter un enfant utilisateur
```
POST /api/parent/enfants/ajouter
{
  "enfant_id": 123
}
```

#### Retirer un enfant
```
DELETE /api/parent/enfants/retirer
{
  "enfant_id": 123
}
```

#### Association automatique
```
POST /api/parent/enfants/associer-automatiquement
```

## 🔧 Logique Métier

### 1. Sélection d'Enfant

**Types d'enfants :**
- **Utilisateurs** : Enfants qui ont créé un compte avec `parent_mail` ou `parent_numero`
- **Manuels** : Enfants ajoutés directement par le parent

**Sélection :**
- Les parents peuvent sélectionner n'importe quel enfant (utilisateur ou manuel)
- L'ID stocké peut être :
  - `"123"` pour un enfant utilisateur
  - `"manuel_456"` pour un enfant manuel

### 2. Actions du Parent

**Vérifications automatiques :**
- Avant de créer un groupe : vérification qu'un enfant est sélectionné
- Avant de générer un quiz : vérification qu'un enfant est sélectionné
- Le niveau utilisé est celui de l'enfant sélectionné


pardon j'etais devant mon ordi et je me suis endormi
