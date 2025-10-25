## 🎯 Vue d'ensemble

Le système parent-enfant permet aux parents de :
- **Associer** leurs enfants (utilisateurs enregistrés ou manuels)
- **Sélectionner** un enfant actif
- **Créer du contenu** (groupes, quiz, cours) pour cet enfant
- **Consulter** tous les contenus créés pour l'enfant

### Types d'Enfants
- **Utilisateur** : Enfant qui a un compte sur la plateforme
- **Manuel** : Enfant ajouté manuellement par le parent (max 3)

---

## 🔐 Authentification et Statuts

### Headers Requis
```javascript
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};
```

### Statuts Utilisateur
- `parent` : Utilisateur parent
- `eleve` : Utilisateur élève

---

## 👨‍👩‍👧‍👦 Gestion des Enfants

### 1. Récupérer la Liste des Enfants

**Endpoint :** `GET /api/parent/enfants`

**Réponse :**
```json
{
    "success": true,
    "enfants": [
        {
            "id": 1,
            "nom": "Martin",
            "prenom": "Lucas",
            "niveau_id": 2,
            "niveau": {
                "id": 2,
                "libelle": "5eme"
            },
            "type": "manuel",
            "email": "lucas@example.com",
            "numero": "0987654321"
        }
    ],
    "count": 1
}
```

### 2. Ajouter un Enfant Manuel

**Endpoint :** `POST /api/parent/enfants/ajouter-manuel`

**Body :**
```json
{
    "nom": "Martin",
    "prenom": "Lucas",
    "niveau_id": 2,
    "email": "lucas@example.com",
    "numero": "0987654321"
}
```

**Limitations :**
- Maximum 3 enfants manuels par parent
- Niveau doit correspondre aux `parent_niveau_ids` du parent

### 3. Sélectionner un Enfant Actif

**Endpoint :** `POST /api/parent/enfants/selectionner`

**Body :**
```json
{
    "enfant_id": "1",
    "type": "manuel"
}
```

**Types :**
- `"utilisateur"` : Pour les enfants avec compte
- `"manuel"` : Pour les enfants ajoutés manuellement

### 4. Récupérer l'Enfant Actif

**Endpoint :** `GET /api/parent/enfant-actif`

**Réponse :**
```json
{
    "success": true,
    "enfant": {
        "id": 1,
        "nom": "Martin",
        "prenom": "Lucas",
        "type": "manuel",
        "niveau": {
            "id": 2,
            "libelle": "5eme"
        }
    }
}
```

---

## 🎯 Sélection d'Enfant

### Interface Utilisateur Recommandée

```javascript
// Composant de sélection d'enfant
const EnfantSelector = () => {
    const [enfants, setEnfants] = useState([]);
    const [enfantActif, setEnfantActif] = useState(null);

    // Récupérer la liste des enfants
    const fetchEnfants = async () => {
        const response = await fetch('/api/parent/enfants', { headers });
        const data = await response.json();
        setEnfants(data.enfants);
    };

    // Sélectionner un enfant
    const selectEnfant = async (enfant) => {
        const response = await fetch('/api/parent/enfants/selectionner', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                enfant_id: enfant.id,
                type: enfant.type
            })
        });

        if (response.ok) {
            setEnfantActif(enfant);
            // Recharger les contenus de l'enfant
            fetchContenusEnfant();
        }
    };

    return (
        <div className="enfant-selector">
            <h3>Enfant Actif : {enfantActif ? `${enfantActif.prenom} ${enfantActif.nom}` : 'Aucun'}</h3>
            <div className="enfants-list">
                {enfants.map(enfant => (
                    <button
                        key={`${enfant.type}-${enfant.id}`}
                        onClick={() => selectEnfant(enfant)}
                        className={enfantActif?.id === enfant.id ? 'active' : ''}
                    >
                        {enfant.prenom} {enfant.nom} ({enfant.niveau.libelle})
                    </button>
                ))}
            </div>
        </div>
    );
};
```

---

## 🛠️ Création de Contenu

### 1. Créer un Groupe

**Endpoint :** `POST /api/groupe`

**Body (Simplifié pour Parent) :**
```json
{
    "nom": "Groupe Mathématiques",
    "description": "Groupe pour réviser les maths"
}
```

**Note :** Le `niveau_id` est automatiquement défini selon l'enfant sélectionné.

### 2. Générer un Quiz Personnel

**Endpoint :** `POST /api/quiz/generate`

**Body :**
```json
{
    "chapter_id": 1,
    "difficulty": "Moyen"
}
```

**Note :** Le chapitre doit correspondre au niveau de l'enfant sélectionné.

### 3. Générer un Quiz pour Groupe

**Endpoint :** `POST /api/quiz/generate-for-group`

**Body :**
```json
{
    "group_id": 1,
    "chapter_id": 1,
    "difficulty": "Moyen",
    "title": "Quiz Révision",
    "nombre_questions": 5,
    "temps": 30
}
```

### 4. Générer un Cours

**Endpoint :** `POST /api/cours/expliquer`

**Body :**
```json
{
    "chapter_id": 1
}
```

### Vérifications Automatiques

Le système vérifie automatiquement :
- ✅ Un enfant est sélectionné
- ✅ Le chapitre correspond au niveau de l'enfant
- ✅ Le contenu est associé au parent ET à l'enfant

---

## 📊 Récupération de Contenu

### 1. Récupérer les Groupes de l'Enfant

**Endpoint :** `GET /api/parent/enfant/groupes`

**Réponse :**
```json
{
    "success": true,
    "enfant": {
        "id": 1,
        "nom": "Martin",
        "prenom": "Lucas",
        "type": "manuel",
        "niveau": { "id": 2, "libelle": "5eme" }
    },
    "groupes": [
        {
            "id": 1,
            "nom": "Groupe Mathématiques",
            "description": "Groupe pour réviser les maths",
            "niveau": { "id": 2, "libelle": "5eme" },
            "nombre_membres": 5,
            "group_type": "parent",
            "is_active": true,
            "created_at": "2025-10-22T16:00:00.000000Z"
        }
    ],
    "count": 1
}
```

### 2. Récupérer les Quiz de l'Enfant

**Endpoint :** `GET /api/parent/enfant/quiz`

**Réponse :**
```json
{
    "success": true,
    "enfant": { /* ... */ },
    "quiz_personnels": [
        {
            "id": 1,
            "type": "personnel",
            "chapitre": {
                "id": 1,
                "libelle": "Les Fractions",
                "matiere": { "id": 1, "libelle": "Mathématiques" },
                "niveau": { "id": 2, "libelle": "5eme" }
            },
            "difficulte": "Moyen",
            "time": 30,
            "created_at": "2025-10-22T16:00:00.000000Z"
        }
    ],
    "quiz_groupes": [
        {
            "id": 2,
            "type": "groupe",
            "titre": "Quiz Révision",
            "nombre_questions": 5,
            "temps": 30,
            "difficulte": "Moyen",
            "chapitre": { /* ... */ },
            "groupe": { "id": 1, "nom": "Groupe Mathématiques" },
            "is_active": true
        }
    ],
    "count": {
        "personnels": 1,
        "groupes": 1,
        "total": 2
    }
}
```

### 3. Récupérer les Cours de l'Enfant

**Endpoint :** `GET /api/parent/enfant/cours`

**Réponse :**
```json
{
    "success": true,
    "enfant": { /* ... */ },
    "cours": [
        {
            "id": 1,
            "chapitre": {
                "id": 1,
                "libelle": "Les Fractions",
                "matiere": { "id": 1, "libelle": "Mathématiques" },
                "niveau": { "id": 2, "libelle": "5eme" }
            },
            "time": 0,
            "has_content": true,
            "has_questions": true,
            "created_at": "2025-10-22T16:00:00.000000Z"
        }
    ],
    "count": 1
}
```

### 4. Récupérer le Résumé de l'Enfant

**Endpoint :** `GET /api/parent/enfant/resume`

**Réponse :**
```json
{
    "success": true,
    "enfant": { /* ... */ },
    "statistiques": {
        "groupes": 2,
        "quiz_personnels": 5,
        "quiz_groupes": 3,
        "quiz_total": 8,
        "cours": 4,
        "total_contenus": 14
    }
}
```

---

## 🔄 Flux d'Utilisation

### 1. Connexion Parent
```javascript
// Après connexion, vérifier le statut
const user = await fetch('/api/user', { headers });
if (user.statut === 'parent') {
    // Afficher l'interface parent
    showParentInterface();
}
```

### 2. Initialisation
```javascript
const initializeParent = async () => {
    // 1. Récupérer les enfants
    const enfants = await fetchEnfants();

    // 2. Vérifier l'enfant actif
    const enfantActif = await fetchEnfantActif();

    // 3. Si aucun enfant actif, demander la sélection
    if (!enfantActif && enfants.length > 0) {
        showEnfantSelector(enfants);
    }

    // 4. Charger les contenus de l'enfant actif
    if (enfantActif) {
        await loadContenusEnfant();
    }
};
```

### 3. Création de Contenu
```javascript
const createGroupe = async (data) => {
    // Vérifier qu'un enfant est sélectionné
    if (!enfantActif) {
        showError('Veuillez sélectionner un enfant');
        return;
    }

    // Créer le groupe (niveau automatique)
    const response = await fetch('/api/groupe', {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });

    if (response.ok) {
        // Recharger les groupes
        await fetchGroupesEnfant();
        showSuccess('Groupe créé avec succès');
    }
};
```

---

## ⚠️ Gestion d'Erreurs

### Erreurs Communes

#### 1. Aucun Enfant Sélectionné
```json
{
    "success": false,
    "message": "Vous devez sélectionner un enfant avant de créer un groupe."
}
```

#### 2. Chapitre Incompatible
```json
{
    "success": false,
    "message": "Ce chapitre ne correspond pas au niveau de votre enfant sélectionné."
}
```

#### 3. Limite d'Enfants Atteinte
```json
{
    "success": false,
    "message": "Vous avez atteint la limite de 3 enfants manuels."
}
```
