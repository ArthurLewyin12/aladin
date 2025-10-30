## API Planning d'études (Élève)

Endpoints protégés par `auth:sanctum`.

- GET `api/study-plans`
  - Retourne tous les créneaux hebdomadaires de l'élève (triés jour/heure).
  - Format de réponse:
  ```json
  {
    "success": true,
    "plans": [
      {
        "id": 1,
        "weekday": 4,
        "start_time": "18:30:00",
        "end_time": "19:30:00",
        "matiere": { "id": 12, "label": "Mathématiques" },
        "chapitre_ids": [101, 102],
        "chapitres": [
          { "id": 101, "libelle": "Equations du 1er degré" },
          { "id": 102, "libelle": "Inéquations" }
        ]
      }
    ]
  }
  ```

- POST `api/study-plans`
  - Body JSON:
  ```json
  {
    "weekday": 4,
    "start_time": "18:30",
    "end_time": "19:30",
    "matiere_id": 12,
    "chapitre_ids": [101, 102]
  }
  ```
  - Règles de validation:
    - `weekday`: entier 1..7 (1=lundi … 7=dimanche)
    - `start_time`: HH:mm
    - `end_time`: HH:mm, après `start_time`
    - `matiere_id`: doit exister dans `matieres.id` ET appartenir au `niveau_id` de l'élève connecté
    - `chapitre_ids[]`: ids de chapitres existants
  - Conflits (chevauchements sur le même `weekday` pour cet élève):
    - Si un créneau existe et recouvre l'intervalle demandé, l'API retourne 422:
    ```json
    {
      "success": false,
      "message": "Chevauchement détecté avec un programme existant.",
      "conflict": {
        "id": 12,
        "weekday": 1,
        "start_time": "10:00:00",
        "end_time": "11:00:00"
      },
      "suggestion": "Choisissez une heure de début après 11:00"
    }
    ```

- PUT `api/study-plans/{id}`
  - Body: mêmes champs, tous optionnels.
  - Les mêmes validations et vérifications de chevauchement s'appliquent (l'API renvoie 422 en cas de conflit).

- DELETE `api/study-plans/{id}`





EMAIL VERIFICATION

verifier si le mail existe :
GET http://127.0.0.1:8000/api/eleves/check?email=yeogneneman24@gmail.com

{
    "exists": true,
    "eleve": {
        "nom": "Yeo",
        "prenom": "François",
        "email": "yeogneneman24@gmail.com",
        "niveau_id": 2,
        "numero": "0505661140",
        "parent_mail": "yeognenema34@gmail.com",
        "parent_numero": "0700334455",
        "type": "utilisateur",
        "user_id": 8
    }
}

Dans le cas contraire

{
    "exists": false
}
