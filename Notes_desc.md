# Routes Complètes - Gestion des Évaluations et Notes

## Base URL
```
{{base_url}} = http://localhost:8000/api
```

## Headers requis
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

---

## 1. Créer une évaluation (sans notes)

**POST** `{{base_url}}/prof/classes/{classe_id}/evaluations`

### Payload
```json
{
  "type_evaluation": "Devoir",
  "matiere_id": 102,
  "chapitres_ids": [3001, 3005],
  "date_evaluation": "2025-10-28",
  "commentaire": "Devoir sur dérivées et applications"
}
```

### Réponse 201 Created
```json
{
  "message": "Évaluation créée avec succès.",
  "evaluation": {
    "id": 50,
    "classe_id": 1,
    "professeur_id": 123,
    "matiere_id": 102,
    "type_evaluation": "Devoir",
    "date_evaluation": "2025-10-28",
    "commentaire": "Devoir sur dérivées et applications",
    "chapitres_ids": [3001, 3005],
    "is_active": true,
    "created_at": "2025-01-16T10:00:00.000000Z",
    "updated_at": "2025-01-16T10:00:00.000000Z",
    "matiere": {
      "id": 102,
      "libelle": "Mathématiques"
    },
    "classe": {
      "id": 1,
      "nom": "Terminale S1"
    }
  }
}
```

### Validation
- `type_evaluation` : **requis** (string, max: 100)
- `matiere_id` : **requis** (integer, existe dans matieres)
- `chapitres_ids` : optionnel (array d'IDs de chapitres)
- `date_evaluation` : optionnel (date, défaut: aujourd'hui)
- `commentaire` : optionnel (string)

---

## 2. Créer une évaluation avec notes (en une seule opération)

**POST** `{{base_url}}/prof/classes/{classe_id}/class-evaluation`

### Payload
```json
{
  "type_evaluation": "Devoir",
  "matiere_id": 102,
  "chapitres_ids": [3001, 3005],
  "date_evaluation": "2025-10-28",
  "commentaire": "Devoir sur dérivées et applications",
  "grades": [
    { "user_id": 2001, "note": 16.5 },
    { "user_id": 2002, "note": 12.0 }
  ]
}
```

### Réponse 200 OK
```json
{
  "message": "Évaluation enregistrée et notifications envoyées.",
  "evaluation": {
    "id": 50,
    "classe_id": 1,
    "professeur_id": 123,
    "matiere_id": 102,
    "type_evaluation": "Devoir",
    "date_evaluation": "2025-10-28",
    "commentaire": "Devoir sur dérivées et applications",
    "chapitres_ids": [3001, 3005],
    "is_active": true,
    "matiere": {
      "id": 102,
      "libelle": "Mathématiques"
    },
    "classe": {
      "id": 1,
      "nom": "Terminale S1"
    }
  },
  "notes": [
    {
      "id": 2001,
      "evaluation_id": 50,
      "eleve_id": 2001,
      "note": 16.5,
      "notifie_parent": false,
      "created_at": "2025-01-16T10:00:00.000000Z"
    },
    {
      "id": 2002,
      "evaluation_id": 50,
      "eleve_id": 2002,
      "note": 12.0,
      "notifie_parent": false,
      "created_at": "2025-01-16T10:00:00.000000Z"
    }
  ],
  "total_notes": 2
}
```

### Validation
- `type_evaluation` : **requis**
- `matiere_id` : **requis**
- `grades` : **requis** (array d'au moins 1 note)
- `grades.*.user_id` : **requis** (integer)
- `grades.*.note` : **requis** (numeric, min: 0, max: 20)

---

## 3. Ajouter des notes à une évaluation existante

**POST** `{{base_url}}/prof/classes/{classe_id}/evaluations/{evaluation_id}/grades`

### Payload
```json
{
  "grades": [
    { "user_id": 2003, "note": 14.5 },
    { "user_id": 2004, "note": 18.0 }
  ]
}
```

### Réponse 201 Created
```json
{
  "message": "2 note(s) ajoutée(s) avec succès.",
  "notes": [
    {
      "id": 2003,
      "evaluation_id": 50,
      "eleve_id": 2003,
      "note": 14.5,
      "notifie_parent": false,
      "created_at": "2025-01-16T11:00:00.000000Z"
    },
    {
      "id": 2004,
      "evaluation_id": 50,
      "eleve_id": 2004,
      "note": 18.0,
      "notifie_parent": false,
      "created_at": "2025-01-16T11:00:00.000000Z"
    }
  ],
  "total_notes": 2
}
```

### Validation
- `grades` : **requis** (array d'au moins 1 note)
- `grades.*.user_id` : **requis** (integer)
- `grades.*.note` : **requis** (numeric, min: 0, max: 20)

### Notes
- Ignore les élèves qui ne sont pas dans la classe
- Ignore les notes qui existent déjà pour cet élève dans cette évaluation
- Envoie des notifications pour chaque note ajoutée

---

## 4. Lister toutes les évaluations d'une classe

**GET** `{{base_url}}/prof/classes/{classe_id}/evaluations`

### Réponse 200 OK
```json
{
  "evaluations": [
    {
      "id": 50,
      "classe_id": 1,
      "professeur_id": 123,
      "matiere_id": 102,
      "type_evaluation": "Devoir",
      "date_evaluation": "2025-10-28",
      "commentaire": "Devoir sur dérivées et applications",
      "chapitres_ids": [3001, 3005],
      "is_active": true,
      "created_at": "2025-01-16T10:00:00.000000Z",
      "updated_at": "2025-01-16T10:00:00.000000Z",
      "matiere": {
        "id": 102,
        "libelle": "Mathématiques"
      },
      "classe": {
        "id": 1,
        "nom": "Terminale S1"
      },
      "notes_count": 4,
      "moyenne": 15.25
    },
    {
      "id": 51,
      "classe_id": 1,
      "professeur_id": 123,
      "matiere_id": 103,
      "type_evaluation": "Contrôle",
      "date_evaluation": "2025-10-25",
      "commentaire": null,
      "chapitres_ids": [3010],
      "is_active": true,
      "created_at": "2025-01-15T10:00:00.000000Z",
      "updated_at": "2025-01-15T10:00:00.000000Z",
      "matiere": {
        "id": 103,
        "libelle": "Physique"
      },
      "classe": {
        "id": 1,
        "nom": "Terminale S1"
      },
      "notes_count": 3,
      "moyenne": 13.5
    }
  ],
  "total": 2
}
```

### Notes
- Triées par date d'évaluation (plus récentes en premier)
- Inclut le nombre de notes et la moyenne pour chaque évaluation

---

## 5. Récupérer les notes d'une évaluation

**GET** `{{base_url}}/prof/classes/{classe_id}/evaluations/{evaluation_id}/notes`

### Réponse 200 OK
```json
{
  "evaluation": {
    "id": 50,
    "type_evaluation": "Devoir",
    "matiere": {
      "id": 102,
      "libelle": "Mathématiques"
    },
    "date_evaluation": "2025-10-28",
    "commentaire": "Devoir sur dérivées et applications",
    "chapitres_ids": [3001, 3005],
    "chapitres": [
      {
        "id": 3001,
        "libelle": "Dérivées"
      },
      {
        "id": 3005,
        "libelle": "Applications des dérivées"
      }
    ],
    "is_active": true
  },
  "notes": [
    {
      "id": 2001,
      "evaluation_id": 50,
      "eleve_id": 2001,
      "note": 16.5,
      "notifie_parent": true,
      "created_at": "2025-01-16T10:00:00.000000Z",
      "updated_at": "2025-01-16T10:00:00.000000Z",
      "eleve": {
        "id": 2001,
        "nom": "Kouassi",
        "prenom": "Jean",
        "mail": "eleve1@example.com"
      }
    },
    {
      "id": 2002,
      "evaluation_id": 50,
      "eleve_id": 2002,
      "note": 12.0,
      "notifie_parent": true,
      "created_at": "2025-01-16T10:00:00.000000Z",
      "updated_at": "2025-01-16T10:00:00.000000Z",
      "eleve": {
        "id": 2002,
        "nom": "Traore",
        "prenom": "Marie",
        "mail": "eleve2@example.com"
      }
    }
  ],
  "total_notes": 2,
  "moyenne": 14.25
}
```

---

## 6. Modifier une évaluation

**PUT** `{{base_url}}/prof/classes/{classe_id}/evaluations/{evaluation_id}`

### Payload
```json
{
  "type_evaluation": "Contrôle",
  "matiere_id": 102,
  "chapitres_ids": [3001, 3005, 3006],
  "date_evaluation": "2025-10-29",
  "commentaire": "Commentaire modifié",
  "is_active": true
}
```

### Réponse 200 OK
```json
{
  "message": "Évaluation modifiée avec succès.",
  "evaluation": {
    "id": 50,
    "classe_id": 1,
    "professeur_id": 123,
    "matiere_id": 102,
    "type_evaluation": "Contrôle",
    "date_evaluation": "2025-10-29",
    "commentaire": "Commentaire modifié",
    "chapitres_ids": [3001, 3005, 3006],
    "is_active": true,
    "updated_at": "2025-01-16T12:00:00.000000Z",
    "matiere": {
      "id": 102,
      "libelle": "Mathématiques"
    },
    "classe": {
      "id": 1,
      "nom": "Terminale S1"
    }
  }
}
```

### Validation
- Tous les champs sont **optionnels**
- Si `matiere_id` est fourni, il doit être valide et correspondre au niveau de la classe

---

## 7. Modifier une note individuelle

**PUT** `{{base_url}}/prof/classes/{classe_id}/grades/{note_id}`

### Payload
```json
{
  "note": 17.0
}
```

### Réponse 200 OK
```json
{
  "message": "Note modifiée avec succès.",
  "note": {
    "id": 2001,
    "evaluation_id": 50,
    "eleve_id": 2001,
    "note": 17.0,
    "notifie_parent": true,
    "created_at": "2025-01-16T10:00:00.000000Z",
    "updated_at": "2025-01-16T12:00:00.000000Z",
    "eleve": {
      "id": 2001,
      "nom": "Kouassi",
      "prenom": "Jean",
      "mail": "eleve1@example.com"
    },
    "evaluation": {
      "id": 50,
      "type_evaluation": "Devoir",
      "matiere": {
        "id": 102,
        "libelle": "Mathématiques"
      }
    }
  }
}
```

### Validation
- `note` : **requis** (numeric, min: 0, max: 20)

---

## 8. Modifier toutes les notes d'une évaluation

**PUT** `{{base_url}}/prof/classes/{classe_id}/evaluations/{evaluation_id}/grades`

### Payload
```json
{
  "grades": [
    {
      "note_classe_id": 2001,
      "note": 17.5
    },
    {
      "note_classe_id": 2002,
      "note": 13.0
    }
  ]
}
```

### Réponse 200 OK
```json
{
  "message": "2 note(s) modifiée(s) avec succès.",
  "notes": [
    {
      "id": 2001,
      "evaluation_id": 50,
      "eleve_id": 2001,
      "note": 17.5,
      "notifie_parent": true,
      "created_at": "2025-01-16T10:00:00.000000Z",
      "updated_at": "2025-01-16T12:00:00.000000Z",
      "eleve": {
        "id": 2001,
        "nom": "Kouassi",
        "prenom": "Jean",
        "mail": "eleve1@example.com"
      },
      "evaluation": {
        "id": 50,
        "type_evaluation": "Devoir",
        "matiere": {
          "id": 102,
          "libelle": "Mathématiques"
        }
      }
    },
    {
      "id": 2002,
      "evaluation_id": 50,
      "eleve_id": 2002,
      "note": 13.0,
      "notifie_parent": true,
      "created_at": "2025-01-16T10:00:00.000000Z",
      "updated_at": "2025-01-16T12:00:00.000000Z",
      "eleve": {
        "id": 2002,
        "nom": "Traore",
        "prenom": "Marie",
        "mail": "eleve2@example.com"
      },
      "evaluation": {
        "id": 50,
        "type_evaluation": "Devoir",
        "matiere": {
          "id": 102,
          "libelle": "Mathématiques"
        }
      }
    }
  ],
  "errors": [],
  "total_updated": 2,
  "total_errors": 0
}
```

### Validation
- `grades` : **requis** (array d'au moins 1 note)
- `grades.*.note_classe_id` : **requis** (integer, existe dans notes_classe)
- `grades.*.note` : **requis** (numeric, min: 0, max: 20)

### Exemple avec erreurs
```json
{
  "message": "1 note(s) modifiée(s) avec succès.",
  "notes": [...],
  "errors": [
    "Note ID 2003 introuvable.",
    "La note ID 2004 n'appartient pas à cette évaluation."
  ],
  "total_updated": 1,
  "total_errors": 2
}
```

---

## 9. Récupérer les élèves d'une classe

**GET** `{{base_url}}/prof/classes/{classe_id}/members`

### Réponse 200 OK
```json
{
  "eleves": [
    {
      "id": 2001,
      "nom": "Kouassi",
      "prenom": "Jean",
      "mail": "eleve1@example.com",
      "numero": "+2250700000001",
      "statut": "eleve",
      "is_active": true,
      "is_active_in_classe": true,
      "niveau": {
        "id": 5,
        "libelle": "Terminale"
      },
      "created_at": "2025-01-10T10:00:00.000000Z"
    },
    {
      "id": 2002,
      "nom": "Traore",
      "prenom": "Marie",
      "mail": "eleve2@example.com",
      "numero": "+2250700000002",
      "statut": "eleve",
      "is_active": true,
      "is_active_in_classe": true,
      "niveau": {
        "id": 5,
        "libelle": "Terminale"
      },
      "created_at": "2025-01-10T10:00:00.000000Z"
    }
  ],
  "total": 2,
  "classe": {
    "id": 1,
    "nom": "Terminale S1"
  }
}
```

### Notes
- Retourne uniquement les élèves actifs de la classe
- Inclut le statut `is_active_in_classe` pour chaque élève
- Inclut les informations du niveau de chaque élève

---

## Codes de statut HTTP

| Code | Signification | Utilisation |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée avec succès |
| 403 | Forbidden | Non autorisé (pas le professeur de la classe) |
| 404 | Not Found | Ressource introuvable |
| 422 | Unprocessable Entity | Erreur de validation |

---

## Workflow recommandé

### Créer une évaluation et ajouter des notes

**Option 1 : En une seule opération**
```
POST /prof/classes/{classe}/class-evaluation
Body: { type_evaluation, matiere_id, grades: [...] }
```

**Option 2 : En deux étapes**
```
1. POST /prof/classes/{classe}/evaluations
   Body: { type_evaluation, matiere_id, ... }
   → Retourne evaluation_id

2. POST /prof/classes/{classe}/evaluations/{evaluation_id}/grades
   Body: { grades: [...] }
```

### Modifier une évaluation et ses notes

```
1. PUT /prof/classes/{classe}/evaluations/{evaluation_id}
   Body: { type_evaluation, date_evaluation, ... }
   → Modifier les informations de l'évaluation

2. PUT /prof/classes/{classe}/evaluations/{evaluation_id}/grades
   Body: { grades: [{ note_classe_id, note }, ...] }
   → Modifier toutes les notes en une fois

OU

PUT /prof/classes/{classe}/grades/{note_id}
Body: { note: 17.0 }
→ Modifier une note individuelle
```

---

## Notes importantes

1. **Sécurité** : Toutes les routes vérifient que l'utilisateur est le professeur de la classe
2. **Notifications** : Les modifications de notes déclenchent automatiquement des emails aux élèves et parents
3. **Validation** : Les matières doivent correspondre au niveau de la classe et être parmi celles enseignées par le professeur
4. **Élèves** : Seuls les élèves actifs de la classe peuvent recevoir des notes
5. **Duplication** : L'ajout de notes ignore automatiquement les notes déjà existantes pour un élève dans une évaluation
