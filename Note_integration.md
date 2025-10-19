# Documentation - Fonctionnalité Notes de Classe

## Vue d'ensemble

Cette fonctionnalité permet aux élèves d'enregistrer leurs notes de classe et de notifier automatiquement leurs parents si ceux-ci ont un compte sur la plateforme.

## Fonctionnalités principales

### Pour les élèves :
- ✅ Ajouter une nouvelle note de classe
- ✅ Consulter toutes leurs notes avec filtres
- ✅ Modifier une note existante
- ✅ Consulter les statistiques (moyennes, évolution)

### Pour les parents :
- ✅ Consulter les notes de tous leurs enfants
- ✅ Voir les statistiques globales et par enfant
- ✅ Recevoir des notifications par email lors de nouvelles notes
- ✅ Filtrer les notes par enfant, matière, période

## Structure de la base de données

### Table `notes_classe`

```sql
- id (bigint, primary key)
- eleve_id (foreign key vers utilisateur)
- matiere_id (foreign key vers matieres)
- note (decimal 5,2) - Note sur 20
- type_evaluation (string) - Type d'évaluation (Contrôle, Devoir, etc.)
- commentaire (text) - Commentaire facultatif
- date_evaluation (date) - Date de l'évaluation
- chapitres_ids (json) - IDs des chapitres concernés
- notifie_parent (boolean) - Si le parent a été notifié
- created_at, updated_at (timestamps)
```

## API Endpoints

### Routes pour les élèves (authentification requise)

#### 1. Lister les notes de classe
```
GET /api/notes-classe
```
**Paramètres de requête :**
- `matiere_id` (optionnel) - Filtrer par matière
- `date_debut` (optionnel) - Date de début de période
- `date_fin` (optionnel) - Date de fin de période

**Réponse :**
```json
{
  "success": true,
  "message": "Notes de classe récupérées avec succès",
  "data": {
    "data": [...],
    "current_page": 1,
    "per_page": 15,
    "total": 25
  }
}
```

#### 2. Ajouter une nouvelle note
```
POST /api/notes-classe
```
**Corps de la requête :**
```json
{
  "matiere_id": 1,
  "note": 15.5,
  "type_evaluation": "Contrôle",
  "commentaire": "Bien réussi",
  "date_evaluation": "2025-10-17",
  "chapitres_ids": [1, 2, 3]
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Note de classe enregistrée avec succès",
  "data": {
    "id": 1,
    "eleve_id": 1,
    "matiere_id": 1,
    "note": "15.50",
    "type_evaluation": "Contrôle",
    "commentaire": "Bien réussi",
    "date_evaluation": "2025-10-17",
    "chapitres_ids": [1, 2, 3],
    "notifie_parent": true,
    "matiere": {...},
    "eleve": {...}
  }
}
```

#### 3. Consulter les statistiques
```
GET /api/notes-classe/statistiques
```

**Réponse :**
```json
{
  "success": true,
  "message": "Statistiques récupérées avec succès",
  "data": {
    "moyenne_generale": 14.25,
    "moyennes_par_matiere": [...],
    "evolution_notes": [...]
  }
}
```

#### 4. Consulter une note spécifique
```
GET /api/notes-classe/{id}
```

#### 5. Modifier une note
```
PUT /api/notes-classe/{id}
```


### Routes pour les parents (authentification requise)

#### 1. Consulter les notes de tous les enfants
```
GET /api/parent/notes-classe
```
**Paramètres de requête :**
- `eleve_id` (optionnel) - Filtrer par enfant
- `matiere_id` (optionnel) - Filtrer par matière
- `date_debut` (optionnel) - Date de début de période
- `date_fin` (optionnel) - Date de fin de période

#### 2. Consulter les statistiques des enfants
```
GET /api/parent/notes-classe/statistiques
```

#### 3. Lister les enfants du parent
```
GET /api/parent/notes-classe/enfants
```

#### 4. Consulter les notes d'un enfant spécifique
```
GET /api/parent/notes-classe/enfant/{enfantId}
```

## Système de notification

### Fonctionnement
1. Quand un élève ajoute une note, le système vérifie si son `parent_mail` correspond à un utilisateur existant
2. Si un compte parent est trouvé avec le même email, une notification est envoyée
3. La notification contient tous les détails de la note (matière, note, chapitres, etc.)
4. Le champ `notifie_parent` est mis à `true` pour tracker l'envoi

### Email de notification
Le parent reçoit un email avec :
- Nom et prénom de l'enfant
- Matière et note obtenue
- Type d'évaluation
- Date d'évaluation
- Chapitres concernés (si spécifiés)
- Commentaire (si fourni)
- Date d'enregistrement de la note

## Règles de validation

### Pour l'ajout de notes :
- `matiere_id` : obligatoire, doit exister dans la table matieres
- `note` : obligatoire, numérique entre 0 et 20, format décimal (ex: 15.5)
- `type_evaluation` : optionnel, valeurs autorisées : Contrôle, Devoir, Interrogation, Examen, TP, Autre
- `commentaire` : optionnel, maximum 1000 caractères
- `date_evaluation` : obligatoire, date valide, ne peut pas être dans le futur
- `chapitres_ids` : optionnel, tableau d'IDs de chapitres existants

### Autorisation :
- Seuls les élèves (`statut = 'eleve'`) peuvent ajouter/modifier leurs notes
- Les parents ne peuvent que consulter les notes de leurs enfants

## Sécurité

### Contrôles d'accès :
- Authentification requise pour toutes les routes
- Les élèves ne peuvent accéder qu'à leurs propres notes
- Les parents ne peuvent accéder qu'aux notes de leurs enfants (vérification par `parent_mail`)


## Exemples d'utilisation

### Frontend - Ajouter une note
```javascript
const response = await fetch('/api/notes-classe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    matiere_id: 1,
    note: 16.5,
    type_evaluation: 'Contrôle',
    commentaire: 'Très bien réussi',
    date_evaluation: '2025-10-17',
    chapitres_ids: [1, 2]
  })
});

const data = await response.json();
if (data.success) {
  console.log('Note ajoutée avec succès');
  // Le parent sera automatiquement notifié par email
}
```

### Frontend - Consulter les notes avec filtres
```javascript
const params = new URLSearchParams({
  matiere_id: 1,
  date_debut: '2025-10-01',
  date_fin: '2025-10-31'
});

const response = await fetch(`/api/notes-classe?${params}`, {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

const data = await response.json();
```
