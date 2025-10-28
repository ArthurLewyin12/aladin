## 🎯 **Route 1: Dashboard Parent**

### Endpoint
```
GET /api/parents/{parentId}/dashboard
```

### Paramètres de requête
- `period` (optionnel): Période d'analyse
  - `week` : Semaine en cours
  - `month` : Mois en cours (défaut)
  - `quarter` : Trimestre en cours
  - `semester` : Semestre en cours
  - `year` : Année en cours

### Exemple de requête
```bash
GET /api/parents/123/dashboard?period=month
```

### Réponse JSON

```json
{
  "parent_id": 123,
  "period": "month",
  "counters": {
    "enfants_geres": 3,
    "groupes_crees": 5,
    "quiz_crees": 12,
    "cours_crees": 8
  },
  "graphiques": {
    "evolution_creations": {
      "period": "month",
      "labels": ["S1","S2","S3","S4","S5"],
      "series": {
        "quiz": [
          {"date": "2024-01-15", "count": 2},
          {"date": "2024-01-20", "count": 1}
        ],
        "cours": [
          {"date": "2024-01-15", "count": 1},
          {"date": "2024-01-22", "count": 2}
        ],
        "groupes": [
          {"date": "2024-01-10", "count": 1}
        ]
      }
    },
    "repartition_par_matiere": [
      {"matiere": "Mathématiques", "count": 8},
      {"matiere": "Français", "count": 5},
      {"matiere": "SVT", "count": 7}
    ]
  },
  "tableau_activites": [
    {
      "type": "quiz",
      "id": 456,
      "nom": "Quiz Mathématiques - Géométrie",
      "date_creation": "2024-01-22T10:30:00",
      "matiere": "Mathématiques",
      "chapitre": null,
      "niveau": "5ème",
      "enfant": {
        "id": 789,
        "type": "utilisateur"
      },
      "statut": "actif"
    },
    {
      "type": "cours",
      "id": 457,
      "nom": "Géométrie dans l'espace",
      "date_creation": "2024-01-20T14:15:00",
      "matiere": "Mathématiques",
      "chapitre": "Géométrie dans l'espace",
      "niveau": "5ème",
      "enfant": {
        "id": 789,
        "type": "utilisateur"
      },
      "statut": "actif"
    }
  ]
}
```

### Description des données

#### Counters (4 chiffres)
- **enfants_geres** : Nombre total d'enfants (utilisateurs + manuels)
- **groupes_crees** : Nombre de groupes créés par le parent
- **quiz_crees** : Nombre de quiz créés par le parent
- **cours_crees** : Nombre de cours générés par le parent

#### Graphiques

**1. evolution_creations**
- Évolution temporelle des créations (quiz, cours, groupes)
- Trois séries de données par période
- Labels adaptés selon la période

**2. repartition_par_matiere**
- Répartition des créations par matière
- Combinaison quiz + cours

#### Tableau activites
- Liste des 20 dernières activités du parent
- Types : groupe, quiz, cours
- Inclut : nom, date, matière, chapitre, niveau, enfant concerné, statut

---

## 🎯 **Route 2: Dashboard Répétiteur**

### Endpoint
```
GET /api/repetiteurs/{repetiteurId}/dashboard
```

### Paramètres de requête
- `period` (optionnel): Période d'analyse
  - `week` : Semaine en cours
  - `month` : Mois en cours (défaut)
  - `quarter` : Trimestre en cours
  - `semester` : Semestre en cours
  - `year` : Année en cours

### Exemple de requête
```bash
GET /api/repetiteurs/456/dashboard?period=month
```

### Réponse JSON

```json
{
  "repetiteur_id": 456,
  "period": "month",
  "counters": {
    "eleves_geres": 8,
    "quiz_crees": 25,
    "cours_crees": 15,
    "groupes_crees": 3
  },
  "graphiques": {
    "evolution_creations": {
      "period": "month",
      "labels": ["S1","S2","S3","S4","S5"],
      "series": {
        "quiz": [
          {"date": "2024-01-15", "count": 3},
          {"date": "2024-01-20", "count": 2}
        ],
        "cours": [
          {"date": "2024-01-15", "count": 2},
          {"date": "2024-01-22", "count": 3}
        ],
        "groupes": [
          {"date": "2024-01-10", "count": 1}
        ]
      }
    },
    "repartition_par_niveau": [
      {"niveau": "5ème", "count": 12},
      {"niveau": "4ème", "count": 8},
      {"niveau": "3ème", "count": 5}
    ]
  },
  "tableau_activites": [
    {
      "type": "quiz",
      "id": 789,
      "titre": "Quiz Math - Algèbre",
      "date_creation": "2024-01-22T10:30:00",
      "matiere": "Mathématiques",
      "chapitre": null,
      "niveau": "5ème",
      "eleve": "Tous",
      "difficulte": "Moyen",
      "statut": "actif"
    },
    {
      "type": "cours",
      "id": 790,
      "titre": "Équations du second degré",
      "date_creation": "2024-01-20T14:15:00",
      "matiere": "Mathématiques",
      "chapitre": "Équations du second degré",
      "niveau": "4ème",
      "eleve": {
        "id": 123,
        "type": "utilisateur"
      },
      "difficulte": null,
      "statut": "actif"
    }
  ]
}
```

### Description des données

#### Counters (4 chiffres)
- **eleves_geres** : Nombre d'élèves actifs suivis
- **quiz_crees** : Nombre de quiz créés par le répétiteur
- **cours_crees** : Nombre de cours générés par le répétiteur
- **groupes_crees** : Nombre de groupes créés par le répétiteur

#### Graphiques

**1. evolution_creations**
- Évolution temporelle des créations pédagogiques
- Trois séries : quiz, cours, groupes

**2. repartition_par_niveau**
- Répartition des créations par niveau scolaire
- Aide à identifier les spécialisations

#### Tableau activites
- Liste des 20 dernières activités du répétiteur
- Inclut : type, titre, date, matière, chapitre, niveau, élève, difficulté (pour quiz), statut
