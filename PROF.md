## Matières enseignées

### Obtenir les matières enseignées
**GET** `{{base_url}}/prof/subjects`

**Réponse 200 OK:**
```json
{
  "matieres": [
    {
      "id": 102,
      "libelle": "Mathématiques",
      "niveau_id": 5,
      "niveau": {
        "id": 5,
        "label": "Terminale"
      }
    },
    {
      "id": 103,
      "libelle": "Physique",
      "niveau_id": 5,
      "niveau": {
        "id": 5,
        "label": "Terminale"
      }
    }
  ],
  "count": 2,
  "max": 3
}
```

---

### Définir les matières enseignées
**POST** `{{base_url}}/prof/subjects`

**Body:**
```json
{
  "matiere_ids": [102, 103]
}
```

**Réponse 200 OK:**
```json
{
  "message": "Matières mises à jour.",
  "matieres": [
    { "id": 102, "libelle": "Mathématiques" },
    { "id": 103, "libelle": "Physique" }
  ]
}
```

**Réponses:**
- `200 OK`: Matières mises à jour
- `403 Forbidden`: Changement déjà effectué cette année (hors période d'essai)
  ```json
  {
    "error": "Changement de matières déjà effectué cette année."
  }
  ```
- `422 Unprocessable Entity`: Erreur de validation
  ```json
  {
    "message": "Certaines matières ne sont pas associées à un niveau.",
    "errors": {
      "matiere_ids": ["Matières sans niveau: Mathématiques"]
    }
  }
  ```

**Règles importantes:**
- Maximum 3 matières (`max: 3`)
- Pendant la période d'essai: changements illimités
- Après l'essai: **1 changement par année civile**
- Les matières doivent avoir un `niveau_id` associé

---

## Classes - CRUD

### Lister les classes
**GET** `{{base_url}}/prof/classes`

**Réponse 200 OK:**
```json
[
  {
    "id": 1,
    "nom": "Terminale S1",
    "description": "Classe scientifique 2025",
    "professeur_id": 123,
    "niveau_id": 5,
    "matiere_ids": [102, 103],
    "is_active": true,
    "created_at": "2025-01-15T10:00:00.000000Z",
    "updated_at": "2025-01-15T10:00:00.000000Z"
  }
]
```

---

### Créer une classe
**POST** `{{base_url}}/prof/classes`

**Body:**
```json
{
  "nom": "Terminale S1",
  "description": "Classe scientifique 2025",
  "niveau_id": 5,
  "matiere_ids": [102, 103]
}
```

**Réponse 201 Created:**
```json
{
  "message": "Classe créée.",
  "classe": {
    "id": 1,
    "nom": "Terminale S1",
    "description": "Classe scientifique 2025",
    "professeur_id": 123,
    "niveau_id": 5,
    "matiere_ids": [102, 103],
    "is_active": true,
    "created_at": "2025-01-15T10:00:00.000000Z"
  }
}
```

**Réponses:**
- `201 Created`: Classe créée
- `403 Forbidden`: Non autorisé (pas professeur)
- `422 Unprocessable Entity`: Erreur de validation
  ```json
  {
    "error": "Les matières doivent être parmi celles que vous enseignez ET correspondre au niveau de la classe.",
    "message": "Veuillez choisir parmi les matières valides.",
    "matieres_valides": [
      { "id": 102, "libelle": "Mathématiques" },
      { "id": 103, "libelle": "Physique" }
    ]
  }
  ```

**Validation:**
- `niveau_id` est **requis**
- `matiere_ids` doit contenir uniquement des IDs (1-3 matières)
- Les matières doivent:
  1. Être associées au `niveau_id` de la classe
  2. Être parmi celles enseignées par le professeur
- En cas d'erreur, l'API retourne `matieres_valides` (matières enseignées ET du niveau) ou `matieres_enseignees`

---

### Voir les détails d'une classe
**GET** `{{base_url}}/prof/classes/{{classe_id}}`

**Réponse 200 OK:**
```json
{
  "id": 1,
  "nom": "Terminale S1",
  "description": "Classe scientifique 2025",
  "professeur_id": 123,
  "niveau_id": 5,
  "matiere_ids": [102, 103],
  "is_active": true,
  "members": [
    {
      "id": 100,
      "eleve_id": 456,
      "classe_id": 1,
      "is_active": true,
      "eleve": {
        "id": 456,
        "nom": "Kouassi",
        "prenom": "Jean",
        "email": "eleve@example.com"
      }
    }
  ],
  "created_at": "2025-01-15T10:00:00.000000Z"
}
```

**Réponses:**
- `200 OK`: Détails de la classe
- `403 Forbidden`: Non autorisé (classe d'un autre professeur)
- `404 Not Found`: Classe introuvable

---

### Mettre à jour une classe
**PUT** `{{base_url}}/prof/classes/{{classe_id}}`

**Body:**
```json
{
  "nom": "Terminale S1 - Maths",
  "description": "Mise à jour",
  "matiere_ids": [102],
  "niveau_id": 5
}
```

**Réponse 200 OK:**
```json
{
  "message": "Classe mise à jour.",
  "classe": {
    "id": 1,
    "nom": "Terminale S1 - Maths",
    "description": "Mise à jour",
    "niveau_id": 5,
    "matiere_ids": [102],
    "updated_at": "2025-01-16T10:00:00.000000Z"
  }
}
```

**Validation:**
- Les `matiere_ids` doivent:
  1. Correspondre au `niveau_id` (nouveau ou existant)
  2. Être parmi celles enseignées par le professeur
- En cas d'erreur: retourne `matieres_valides` ou `matieres_enseignees` selon le cas

---

### Désactiver une classe
**POST** `{{base_url}}/prof/classes/{{classe_id}}/deactivate`

**Réponse 200 OK:**
```json
{
  "message": "Classe désactivée."
}
```

**Réponses:**
- `200 OK`: Classe désactivée
- `400 Bad Request`: Classe déjà désactivée
  ```json
  {
    "error": "Classe déjà désactivée."
  }
  ```

---

### Réactiver une classe
**POST** `{{base_url}}/prof/classes/{{classe_id}}/reactivate`

**Réponse 200 OK:**
```json
{
  "message": "Classe réactivée."
}
```

**Réponses:**
- `200 OK`: Classe réactivée
- `400 Bad Request`: Classe déjà active

---

## Gestion des élèves

### Vérifier si un email correspond à un élève
**GET** `{{base_url}}/eleves/check?email=eleve@example.com`

**Route publique** (sans authentification)

**Réponse si l'élève existe (200 OK):**
```json
{
  "exists": true,
  "eleve": {
    "nom": "Kouassi",
    "prenom": "Jean",
    "email": "eleve@example.com",
    "niveau_id": 5,
    "niveau": {
      "id": 5,
      "label": "Terminale"
    },
    "numero": "+2250700000000",
    "parent_mail": "parent@example.com",
    "parent_numero": "+2250700000001",
    "type": "utilisateur",
    "user_id": 456,
    "is_active": true
  }
}
```

**Réponse si l'élève n'existe pas (200 OK):**
```json
{
  "exists": false
}
```

**Workflow recommandé:**
1. Prof entre l'email → appel à `/eleves/check`
2. Si `exists: true` → auto-remplir les champs avec les données retournées
3. Si `exists: false` → prof saisit nom, prénom, niveau, etc.
4. Appel à `/prof/classes/{classe}/members/add` pour enregistrer

---

### Ajouter un élève à une classe
**POST** `{{base_url}}/prof/classes/{{classe_id}}/members/add`

**Cas 1: Élève utilisateur existant (juste l'email)**
```json
{
  "email": "eleve1@example.com"
}
```

**Réponse 200 OK:**
```json
{
  "message": "Élève (utilisateur) ajouté à la classe.",
  "eleve": {
    "id": 100,
    "eleve_id": 456,
    "classe_id": 1,
    "is_active": true,
    "eleve": {
      "id": 456,
      "nom": "Kouassi",
      "prenom": "Jean",
      "email": "eleve@example.com"
    }
  }
}
```

**Cas 2: Nouvel élève manuel (création complète)**
```json
{
  "email": "nouvel.eleve@example.com",
  "nom": "Kouassi",
  "prenom": "Jean",
  "niveau_id": 5,
  "numero": "+2250700000000",
  "parent_mail": "parent@example.com",
  "parent_numero": "+2250700000001"
}
```

**Réponse 200 OK:**
```json
{
  "message": "Élève (manuel) ajouté à la classe.",
  "eleve": {
    "id": 101,
    "eleve_id": 789,
    "classe_id": 1,
    "is_active": true,
    "eleve": {
      "id": 789,
      "nom": "Kouassi",
      "prenom": "Jean",
      "email": "nouvel.eleve@example.com",
      "type": "manuel"
    }
  }
}
```

**Réponses:**
- `200 OK`: Élève ajouté
- `403 Forbidden`: Non autorisé
- `404 Not Found`: Classe introuvable
- `422 Unprocessable Entity`: Erreur de validation
  ```json
  {
    "message": "Erreur de validation",
    "errors": {
      "niveau_id": ["Le champ niveau id est requis."],
      "email": ["L'email est déjà utilisé."]
    }
  }
  ```

---

### Désactiver un membre
**POST** `{{base_url}}/prof/classes/{{classe_id}}/members/{{member_id}}/deactivate`

**Réponse 200 OK:**
```json
{
  "message": "Élève désactivé."
}
```

---

### Réactiver un membre
**POST** `{{base_url}}/prof/classes/{{classe_id}}/members/{{member_id}}/reactivate`

**Réponse 200 OK:**
```json
{
  "message": "Élève réactivé."
}
```

---

## Quiz de classe

### Créer un quiz manuel
**POST** `{{base_url}}/prof/classes/{{classe_id}}/quizzes/manual`

**Body:**
```json
{
  "titre": "QCM – Dérivées",
  "difficulte": "Moyen",
  "temps": 30,
  "matiere_id": 101,
  "chapitres_ids": [45, 46],
  "data": {
    "qcm": [
      {
        "question": "Soit f(x)=x^2, f'(x) = ?",
        "reponses": [
          { "texte": "2x", "correct": true },
          { "texte": "x", "correct": false },
          { "texte": "x^2", "correct": false }
        ]
      }
    ],
    "questions_approfondissement": []
  }
}
```

**Réponse 201 Created:**
```json
{
  "message": "Quiz créé.",
  "quiz": {
    "id": 555,
    "titre": "QCM – Dérivées",
    "difficulte": "Moyen",
    "temps": 30,
    "matiere_id": 101,
    "chapitres_ids": [45, 46],
    "classe_id": 1,
    "is_active": false,
    "created_at": "2025-01-15T10:00:00.000000Z"
  }
}
```

**Validation:**
- `matiere_id` est **requis**
- `chapitres_ids` est **requis** (array d'au moins 1 chapitre)
- Tous les chapitres doivent appartenir à la matière choisie
- La matière doit être enseignée par le professeur ET dans la classe
- Le quiz est créé **inactif** (`is_active=false`), le prof doit l'activer après

**Réponses:**
- `201 Created`: Quiz créé
- `422 Unprocessable Entity`: Erreur de validation
  ```json
  {
    "error": "Tous les chapitres doivent appartenir à la matière choisie.",
    "message": "Veuillez choisir parmi les chapitres de cette matière.",
    "chapitres_valides": [
      { "id": 45, "libelle": "Dérivées" },
      { "id": 46, "libelle": "Applications des dérivées" }
    ]
  }
  ```

---

### Générer un quiz avec IA
**POST** `{{base_url}}/prof/classes/{{classe_id}}/quizzes/generate`

**Body (form-data ou multipart/form-data):**
```
chapter_id: 45
difficulty: Moyen
title: Quiz sur les dérivées
nombre_questions: 5
temps: 40
document_file: [fichier PDF/DOC/DOCX/TXT optionnel]
```

**Réponse 201 Created:**
```json
{
  "message": "Quiz généré.",
  "quiz": {
    "id": 556,
    "titre": "Quiz sur les dérivées",
    "difficulte": "Moyen",
    "temps": 40,
    "matiere_id": 101,
    "chapitres_ids": [45],
    "classe_id": 1,
    "is_active": false,
    "data": {
      "qcm": [
        {
          "question": "...",
          "reponses": [...]
        }
      ],
      "questions_approfondissement": []
    },
    "created_at": "2025-01-15T10:00:00.000000Z"
  }
}
```

**Notes:**
- Le quiz est créé **inactif**, le prof peut le modifier puis l'activer
- `document_file` est optionnel

---

### Modifier un quiz
**PUT** `{{base_url}}/prof/classes/{{classe_id}}/quizzes/{{quiz_id}}`

**Body:**
```json
{
  "titre": "Titre modifié",
  "data": {
    "qcm": [
      {
        "question": "Question modifiée",
        "reponses": [...]
      }
    ],
    "questions_approfondissement": []
  },
  "temps": 45
}
```

**Réponse 200 OK:**
```json
{
  "message": "Quiz mis à jour.",
  "quiz": {
    "id": 555,
    "titre": "Titre modifié",
    "temps": 45,
    "updated_at": "2025-01-16T10:00:00.000000Z"
  }
}
```

**Note:** Un quiz actif peut toujours être modifié, mais il est recommandé de modifier avant activation.

---

### Activer un quiz
**POST** `{{base_url}}/prof/classes/{{classe_id}}/quizzes/{{quiz_id}}/activate`

**Réponse 200 OK:**
```json
{
  "message": "Quiz activé et notifications envoyées."
}
```

**Effets:**
- Active le quiz (`is_active = true`)
- Envoie automatiquement des emails à tous les élèves actifs de la classe

**Réponses:**
- `200 OK`: Quiz activé
- `400 Bad Request`: Quiz déjà actif
  ```json
  {
    "error": "Quiz déjà actif."
  }
  ```

---

### Désactiver un quiz
**POST** `{{base_url}}/prof/classes/{{classe_id}}/quizzes/{{quiz_id}}/deactivate`

**Réponse 200 OK:**
```json
{
  "message": "Quiz désactivé."
}
```

---

### Voir les notes d'un quiz
**GET** `{{base_url}}/prof/classes/{{classe_id}}/quizzes/{{quiz_id}}/notes`

**Réponse 200 OK:**
```json
{
  "quiz": {
    "id": 555,
    "titre": "QCM – Dérivées",
    "nombre_questions": 1,
    "notes": [
      {
        "id": 1001,
        "note": 15.5,
        "user": {
          "id": 2001,
          "nom": "Kouassi",
          "prenom": "Jean",
          "mail": "eleve1@example.com"
        },
        "created_at": "2025-01-16T10:00:00.000000Z"
      },
      {
        "id": 1002,
        "note": 12.0,
        "user": {
          "id": 2002,
          "nom": "Traore",
          "prenom": "Marie",
          "mail": "eleve2@example.com"
        },
        "created_at": "2025-01-16T10:00:00.000000Z"
      }
    ]
  }
}
```

---

## Cours de classe

### Créer un cours manuel
**POST** `{{base_url}}/prof/classes/{{classe_id}}/courses/manual`

**Body:**
```json
{
  "titre": "Cours sur les dérivées",
  "chapitre_id": 45,
  "text": "**INTRODUCTION**\n\nCe cours traite des dérivées...",
  "questions": [
    {
      "question": "Qu'est-ce qu'une dérivée ?",
      "reponse": "La dérivée mesure la variation instantanée d'une fonction..."
    }
  ]
}
```

**Réponse 201 Created:**
```json
{
  "message": "Cours créé.",
  "cours": {
    "id": 777,
    "titre": "Cours sur les dérivées",
    "chapitre_id": 45,
    "classe_id": 1,
    "is_active": false,
    "data": {
      "text": "**INTRODUCTION**\n\nCe cours traite des dérivées...",
      "questions": [
        {
          "question": "Qu'est-ce qu'une dérivée ?",
          "reponse": "La dérivée mesure..."
        }
      ]
    },
    "created_at": "2025-01-15T10:00:00.000000Z"
  }
}
```

**Note:** Le cours est créé **inactif**, le prof doit l'activer.

---

### Générer un cours avec IA
**POST** `{{base_url}}/prof/classes/{{classe_id}}/courses/generate`

**Body (form-data ou multipart/form-data):**
```
chapter_id: 45
document_file: [fichier PDF/DOC/DOCX/TXT optionnel]
```

**Réponse 201 Created:**
```json
{
  "message": "Cours généré.",
  "cours": {
    "id": 778,
    "titre": "Cours sur les dérivées",
    "chapitre_id": 45,
    "classe_id": 1,
    "is_active": false,
    "data": {
      "text": "Contenu généré par IA...",
      "questions": [...]
    },
    "created_at": "2025-01-15T10:00:00.000000Z"
  }
}
```

**Note:** Le cours est créé **inactif**, le prof peut le modifier puis l'activer.

---

### Modifier un cours
**PUT** `{{base_url}}/prof/classes/{{classe_id}}/courses/{{cours_id}}`

**Body:**
```json
{
  "text": "Texte modifié...",
  "questions": [
    {
      "question": "Question modifiée",
      "reponse": "Réponse modifiée"
    }
  ]
}
```

**Réponse 200 OK:**
```json
{
  "message": "Cours mis à jour.",
  "cours": {
    "id": 777,
    "updated_at": "2025-01-16T10:00:00.000000Z"
  }
}
```

---

### Activer un cours
**POST** `{{base_url}}/prof/classes/{{classe_id}}/courses/{{cours_id}}/activate`

**Réponse 200 OK:**
```json
{
  "message": "Cours activé et notifications envoyées."
}
```

**Effets:**
- Active le cours (`is_active = true`)
- Envoie automatiquement des emails à tous les élèves actifs de la classe

**Réponses:**
- `200 OK`: Cours activé
- `400 Bad Request`: Cours déjà actif
  ```json
  {
    "error": "Cours déjà actif."
  }
  ```

---

### Désactiver un cours
**POST** `{{base_url}}/prof/classes/{{classe_id}}/courses/{{cours_id}}/deactivate`

**Réponse 200 OK:**
```json
{
  "message": "Cours désactivé."
}
```

---

## Notes et évaluations

### Saisie des notes en masse pour un quiz
**POST** `{{base_url}}/prof/classes/{{classe_id}}/grades`

**Body:**
```json
{
  "quiz_id": 555,
  "grades": [
    { "user_id": 2001, "note": 15.5 },
    { "user_id": 2002, "note": 12.0 }
  ]
}
```

**Réponse 200 OK:**
```json
{
  "message": "Notes enregistrées.",
  "notes": [
    {
      "id": 1001,
      "user_id": 2001,
      "note": 15.5,
      "quiz_id": 555,
      "created_at": "2025-01-16T10:00:00.000000Z"
    },
    {
      "id": 1002,
      "user_id": 2002,
      "note": 12.0,
      "quiz_id": 555,
      "created_at": "2025-01-16T10:00:00.000000Z"
    }
  ]
}
```

**Effets:**
- Crée/modifie les notes pour chaque élève
- Envoie un email à l'élève + parent (`parent_mail` si présent)

---

### Créer une évaluation de classe
**POST** `{{base_url}}/prof/classes/{{classe_id}}/class-evaluation`

**Body:**
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

**Réponse 200 OK:**
```json
{
  "message": "Évaluation enregistrée et notifications envoyées.",
  "notes": [
    {
      "id": 2001,
      "user_id": 2001,
      "note": 16.5,
      "type_evaluation": "Devoir",
      "matiere_id": 102,
      "chapitres_ids": [3001, 3005],
      "date_evaluation": "2025-10-28",
      "created_at": "2025-01-16T10:00:00.000000Z"
    },
    {
      "id": 2002,
      "user_id": 2002,
      "note": 12.0,
      "type_evaluation": "Devoir",
      "matiere_id": 102,
      "chapitres_ids": [3001, 3005],
      "date_evaluation": "2025-10-28",
      "created_at": "2025-01-16T10:00:00.000000Z"
    }
  ]
}
```

**Validation:**
- `matiere_id` est **requis** (ID uniquement, pas de libellé)
- La matière doit:
  1. Correspondre au niveau de la classe
  2. Être enseignée par le professeur
  3. Être parmi les matières de la classe (`matiere_ids` de la classe)
- En cas d'erreur: retourne `matieres_enseignees` (matières enseignées dans cette classe) ou `matieres_valides`

**Réponses:**
- `200 OK`: Évaluation créée
- `422 Unprocessable Entity`: Erreur de validation
  ```json
  {
    "error": "La matière doit être parmi celles que vous enseignez dans cette classe.",
    "message": "Veuillez choisir parmi vos matières enseignées de cette classe.",
    "matieres_enseignees": [
      { "id": 102, "libelle": "Mathématiques" },
      { "id": 103, "libelle": "Physique" }
    ]
  }
  ```

**Effets:**
- Crée des enregistrements `notes_classe` pour chaque élève
- Notifie élève + parent par email
