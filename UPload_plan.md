# Intégration Front – Documents de Classe


## 1. Professeur – Upload d’un document

- **Route** : `POST /api/prof/classes/{classeId}/documents`
- **Auth** : jeton professeur requis
- **Payload (multipart/form-data)** :
  - `file` *(obligatoire)* : fichier `pdf`, `doc`, `docx` ou `txt`, max `5 MB`
  - `nom` *(optionnel)* : string ≤ 255 caractères
  - `description` *(optionnel)* : string ≤ 1000 caractères
- **Réponse 201** :

```json
{
  "message": "Document uploadé avec succès.",
  "document": {
    "id": 42,
    "classe": { "id": 8, "nom": "Terminale A" },
    "utilisateur": { "id": 17, "nom": "Diallo", "prenom": "Aïssatou" },
    "nom_fichier": "cours-physique.pdf",
    "file_type": "pdf",
    "file_size": 482394,
    "description": "TP semaine 3",
    "created_at": "2025-11-21T10:35:12.000000Z"
  }
}
```

> ⚠️ Chaque professeur est limité à **10 documents** au total. Afficher le message d’erreur retourné si la limite est atteinte (`403`).

## 2. Professeur – Liste des documents d’une classe

- **Route** : `GET /api/prof/classes/{classeId}/documents`
- **Réponse 200** :

```json
{
  "documents": [
    {
      "id": 42,
      "nom": "TP semaine 3",
      "nom_fichier": "cours-physique.pdf",
      "description": "TP semaine 3",
      "file_type": "pdf",
      "file_size": 482394,
      "mime_type": "application/pdf",
      "uploaded_by": { "id": 17, "nom": "Diallo", "prenom": "Aïssatou" },
      "created_at": "2025-11-21T10:35:12.000000Z",
      "download_url": "https://.../api/prof/classes/8/documents/42/download"
    }
  ],
  "total_professor_documents": 6,
  "limit": 10
}
```

> Utiliser `download_url` pour déclencher le téléchargement direct (méthode `GET` authentifiée).

## 3. Professeur – Suppression / Téléchargement

- **Télécharger** : `GET /api/prof/classes/{classeId}/documents/{documentId}/download`
- **Supprimer** : `DELETE /api/prof/classes/{classeId}/documents/{documentId}`

Afficher une confirmation avant suppression. Après succès (`200`, message `"Document supprimé avec succès."`), rafraîchir la liste.

## 4. Élève – Liste consolidée

- **Route** : `GET /api/eleves/{eleveId}/classes/documents`
- **Réponse 200** :

```json
{
  "documents": [
    {
      "id": 42,
      "nom": "TP semaine 3",
      "classe": { "id": 8, "nom": "Terminale A" },
      "uploaded_by": { "id": 17, "nom": "Diallo", "prenom": "Aïssatou" },
      "download_url": "https://.../api/eleves/34/classes/documents/42/download"
    }
  ],
  "count": 4,
  "classes": [
    { "id": 8, "nom": "Terminale A", "description": "Sciences" }
  ]
}
```

Utiliser cette route pour un onglet “Tous les documents”. Chaque entrée possède son `download_url`.

## 5. Élève – Documents d’une classe précise

- **Route** : `GET /api/eleves/{eleveId}/classes/{classeId}/documents`
- **Réponse 200** similaire à la liste mais scoping classe.

## 6. Élève – Téléchargement

- **Route** : `GET /api/eleves/{eleveId}/classes/documents/{documentId}/download`

Déclencher un téléchargement classique (fenêtre navigateur). Les élèves doivent être authentifiés (jeton).
