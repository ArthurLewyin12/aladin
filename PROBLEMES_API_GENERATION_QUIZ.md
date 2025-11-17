# 🐛 Problèmes API - Génération de Quiz

## Résumé
Lors de la génération d'un quiz via l'API, plusieurs problèmes ont été identifiés concernant les données retournées par le backend.

---

## 📋 Endpoint concerné
**POST** `/api/quizzes/generate`

---

## 🔴 Problèmes identifiés

### 1. Objet Quiz incomplet dans la réponse
**Problème :** Le backend ne retourne pas l'objet quiz complet après la génération.

**Payload envoyé :**
```json
{
  "chapter_id": 284,
  "classe_id": 3,
  "difficulty": "Moyen",
  "nombre_questions": 10,
  "temps": 600,
  "title": "quiz de test 2"
}
```

**Réponse actuelle :**
```json
{
  "quiz_id": 24,
  "questions": [...],
  "questions_approfondissement": [...],
  "time": 40,
  "served": "generated",
  "document": false,
  "message": "Quiz généré avec succès. Modifiez-le puis activez-le pour le partager aux élèves."
}
```

**❌ Champs manquants dans la réponse :**
- `titre` : Le titre envoyé ("quiz de test 2") n'apparaît nulle part
- `nombre_questions` : Pas retourné explicitement (doit compter manuellement dans `questions`)
- `temps` : Retourne 40 au lieu de 600
- `difficulte` : Non retourné
- `matiere_id` : Non retourné
- `chapitre_id` : Non retourné
- `classe_id` : Non retourné
- `is_active` : Non retourné
- `is_manual` : Non retourné
- `data` : Non retourné (structure complète du quiz)
- `created_at` : Non retourné
- `updated_at` : Non retourné

---

### 2. Nombre de questions incorrect
**Problème :** Le backend génère moins de questions que demandé.

- **Demandé :** `nombre_questions: 10`
- **Reçu :** 5 questions seulement dans le tableau `questions`

---

### 3. Temps incorrect
**Problème :** Le temps retourné ne correspond pas au temps envoyé.

- **Envoyé :** `temps: 600` (secondes)
- **Reçu :** `time: 40` (secondes)

---

### 4. Format du champ `data` dans GET classe
**Problème :** Quand on récupère les quiz via `GET /api/professeur/classes/{classe_id}`, le champ `data` est une **STRING JSON** au lieu d'un objet.

**Exemple actuel :**
```json
{
  "id": 24,
  "titre": "Quiz généré",
  "data": "{\"qcm\":[{\"question\":\"...\",\"propositions\":{...}}]}"  // ❌ STRING
}
```

**Attendu :**
```json
{
  "id": 24,
  "titre": "Quiz généré",
  "data": {  // ✅ OBJET
    "qcm": [{
      "question": "...",
      "propositions": {...}
    }]
  }
}
```

---

## ✅ Solution attendue

### Réponse complète après génération de quiz

```json
{
  "message": "Quiz généré avec succès. Modifiez-le puis activez-le pour le partager aux élèves.",
  "quiz_id": 24,
  "quiz": {
    "id": 24,
    "titre": "quiz de test 2",
    "nombre_questions": 10,
    "temps": 600,
    "difficulte": "Moyen",
    "niveau_id": 3,
    "matiere_id": 29,
    "chapitre_id": 284,
    "classe_id": 3,
    "is_active": false,
    "is_manual": false,
    "data": {
      "qcm": [
        {
          "question": "Quelles sont les principales aires culturelles de la Côte d'Ivoire ?",
          "propositions": {
            "a": "Les aires culturelles du Nord et du Sud",
            "b": "Les aires culturelles de l'Est et de l'Ouest",
            "c": "Les aires culturelles de l'Ouest, du Centre et de l'Est",
            "d": "Les aires culturelles de l'Est et du Centre"
          },
          "bonne_reponse": "c"
        }
        // ... 9 autres questions (total 10)
      ],
      "questions_approfondissement": [
        {
          "question": "Pourquoi la réponse correcte de la question 1 est-elle la bonne ?",
          "reponse": "La réponse correcte est c) ..."
        }
        // ... 9 autres questions d'approfondissement
      ]
    },
    "groupe_id": null,
    "delai_soumission_jours": null,
    "parent_id": null,
    "enfant_id": null,
    "enfant_type": null,
    "trimestre": null,
    "created_at": "2025-11-17T21:30:26.000000Z",
    "updated_at": "2025-11-17T21:30:26.000000Z"
  }
}
```

---

## 🎯 Actions requises

### 1. Retourner l'objet quiz complet
Après la génération, le backend doit retourner **l'objet quiz complet** tel qu'il a été sauvegardé en base de données, avec tous les champs.

### 2. Respecter les paramètres envoyés
- Si `nombre_questions: 10` → Générer **10 questions**
- Si `temps: 600` → Sauvegarder et retourner **600 secondes**
- Si `title: "quiz de test 2"` → Sauvegarder et retourner **ce titre exact**

### 3. Parser le champ `data` avant de le retourner
Le champ `data` doit être un **objet JSON parsé**, pas une string JSON. Cela s'applique à :
- La réponse de création (`POST /api/quizzes/generate`)
- La liste des quiz (`GET /api/professeur/classes/{classe_id}`)
- Les détails d'un quiz (`GET /api/quizzes/{quiz_id}`)

### 4. Uniformiser le nom du champ temps
Utiliser `temps` partout (pas `time` dans certaines réponses et `temps` dans d'autres).

---

## 📝 Impact frontend

**Sans ces corrections, le frontend ne peut pas :**
- Afficher le titre correct du quiz
- Afficher le nombre de questions correct
- Afficher la durée correcte
- Calculer le temps par question (cause des "Infinity min NaN sec")
- Parser les questions du quiz (car `data` est une string)

---

## 🧪 Cas de test

### Test 1 : Génération de quiz
```bash
POST /api/quizzes/generate
Content-Type: application/json

{
  "chapter_id": 284,
  "classe_id": 3,
  "difficulty": "Moyen",
  "nombre_questions": 10,
  "temps": 600,
  "title": "Mon quiz de test"
}
```

**Vérifications :**
- ✅ La réponse contient un objet `quiz` complet
- ✅ `quiz.titre === "Mon quiz de test"`
- ✅ `quiz.nombre_questions === 10`
- ✅ `quiz.temps === 600`
- ✅ `quiz.data.qcm.length === 10`
- ✅ `typeof quiz.data === "object"` (pas une string)

### Test 2 : Récupération des quiz d'une classe
```bash
GET /api/professeur/classes/3
```

**Vérifications :**
- ✅ Chaque quiz a un champ `data` de type objet
- ✅ `typeof quiz.data === "object"` (pas une string)
- ✅ Les champs `titre`, `nombre_questions`, `temps` sont présents et corrects

---
