## Spécification API - Quiz de groupe (Backoffice -> Front)

Cette documentation décrit les endpoints et les formats de données pour la gestion des quiz de groupe afin que le front sache quels payloads envoyer et quelles réponses attendre. Toutes les routes listées ci‑dessous (sauf mention contraire) sont protégées par l'auth Sanctum et nécessitent un utilisateur connecté.

### Rôles et notions clés
- **Groupe**: contient des membres (élèves) et un chef (`chief_user`). Le groupe doit être actif pour toute action.
- **Quiz de groupe**: entrées dans `quizzes` associées à `groupe_id`. Les questions sont stockées dans `reponse_quizzes`.
- **Note**: une soumission de quiz par utilisateur (empêche de recommencer le même quiz).

---

## Groupes

### Lister mes groupes
- **GET** `/api/groupes`
- Retourne pour chaque groupe: `groupe`, `utilisateurs` (actifs), `niveau`, `matieres` (du niveau), `quizzes` (actifs), `isChief`, `members_count`, `is_active`, `status`.

Exemple de réponse (200):
```json
[
  {
    "groupe": { "id": 12, "nom": "Groupe A", "niveau_id": 3, "chief_user": 5, "is_active": true },
    "utilisateurs": [ { "id": 7, "nom": "KONE", "prenom": "Awa", "mail": "...", "niveau_id": 3 } ],
    "niveau": { "id": 3, "libelle": "3ème" },
    "matieres": [ { "id": 9, "libelle": "Maths" } ],
    "quizzes": [ { "id": 81, "titre": "Chap. 1 - Facile", "is_active": true } ],
    "isChief": true,
    "members_count": 3,
    "is_active": true,
    "status": "active"
  }
]
```

### Créer un groupe
- **POST** `/api/groupes`
- Payload:
```json
{ "nom": "string", "description": "string", "niveau_id": 1 }
```
- Réponse (201): `{ message, groupe }`

### Détails d’un groupe (membre requis, groupe actif)
- **GET** `/api/groupes/{groupe}`
- Retourne: `groupe`, `utilisateurs` (actifs), `niveau`, `matieres`, `quizzes` (actifs)

### Détails enrichis (statut de complétion)
- **GET** `/api/groupes/{groupe}/details` (alias `/detailed`)
- Pré‑requis: être membre; groupe actif
- Retourne en plus par quiz: `submission_count`, `submissions` (liste des membres ayant soumis)

---

## Invitations

### Inviter des membres par email
- **POST** `/api/groupes/{groupe}/invitations`
- Payload:
```json
{ "member_emails": ["eleve1@mail.com", "eleve2@mail.com"] }
```
- Règles: niveau identique au groupe; max 5 membres; empêche doublons; crée soit une `Invitation` (utilisateur existant) soit une `PendingInvitation` (nouvel utilisateur) avec un token.
- Réponse (200) possible:
```json
{
  "message": "1 invitation(s) de groupe envoyée(s) et 1 invitation(s) d'inscription envoyée(s).",
  "group_invitations_sent": 1,
  "registration_invitations_sent": 1,
  "errors": []
}
```

### Récupérer une invitation par token (lien email)
- Public pour lecture, mais utilisé côté app:
  - **GET** `/api/invitations/token?token=...` ou `/api/invitations/{token}`
- Réponses:
  - Utilisateur existant:
```json
{ "invitation": {"token": "...", "reponse": "en attente"}, "groupe": {...}, "inviteur": {...}, "status": "en attente", "type": "existing_user" }
```
  - Nouvel utilisateur:
```json
{ "invitation": {"token": "..."}, "groupe": {...}, "email": "invite@mail.com", "type": "new_user" }
```

### Accepter / Décliner une invitation par token
- **POST** `/api/invitations/token/accept`
- **POST** `/api/invitations/token/decline`
- Payload commun:
```json
{ "token": "string" }
```
- Réponses: 200 avec message; erreurs 403/404/410 selon cas (non destiné, introuvable, expiré, plein, déjà membre).

### Accepter / Décliner par id d’invitation
- **POST** `/api/invitations/{invitation}/accept`
- **POST** `/api/invitations/{invitation}/decline`

### Notifications d’invitations reçues (en attente)
- **GET** `/api/notifications`
- Réponse: `{ invitations: [ { invitation, groupe, userEnvoie } ] }`

---

## Quiz de groupe

### Générer un quiz pour un groupe
- **POST** `/api/quizzes/generate/group`
- Payload:
```json
{
  "group_id": 12,
  "chapter_id": 345,
  "difficulty": "Facile|Moyen|Difficile",
  "title": "Chapitre 1 - Facile",
  "nombre_questions": 5,   // 5 à 10
  "temps": 40              // secondes, >= 30
}
```
- Règles: l’utilisateur doit être membre; groupe actif. Sert un quiz existant si même `(chapitre, difficulté, groupe)` déjà actif, sinon génère et enregistre.
- Réponses:
  - 201 (nouveau):
```json
{
  "quiz": { "id": 81, "titre": "Chapitre 1 - Facile", "groupe_id": 12, "is_active": true, "temps": 40, "chapitre_id": 345, "difficulte": "Facile" },
  "questions": [ { "question": "...", "propositions": {"a":"..","b":"..","c":"..","d":".."}, "bonne_reponse": "b" } ],
  "questions_approfondissement": [ { "question": "Pourquoi...", "reponse": "..." } ],
  "message": "Quiz généré avec succès et notifications envoyées aux membres du groupe."
}
```
  - 200 (existant):
```json
{
  "quiz": { "id": 81, "groupe_id": 12, "is_active": true },
  "questions": [ ... ],
  "questions_approfondissement": [ ... ],
  "message": "Quiz existant servi pour cette combinaison (chapitre + difficulté).",
  "served": "existing"
}
```

### Lister tous les quiz d’un groupe (chef recommandé)
- **GET** `/api/groupes/{groupe}/quizzes/all`
- Réponse: `{ groupe, quizzes: [ { id, titre, is_active, ... } ], message }`

### Démarrer un quiz de groupe (par un membre, si pas encore soumis)
- **POST** `/api/groupes/{groupe}/quizzes/{quiz}/start`
- Règles: membre du groupe; groupe actif; quiz actif; refuse si déjà une `Note` pour ce `(user, quiz)`.
- Réponse (200):
```json
{
  "quiz": { "id": 81, "titre": "...", "description": null, "difficulte": "Facile", "groupe_id": 12, "created_at": "2025-10-05T10:00:00Z" },
  "groupe": { "id": 12, "nom": "Groupe A", "description": "..." },
  "data": [ { "question": "...", "reponses": [ {"texte":"..."} ] } ],
  "questions_approfondissement": [ { "question": "...", "reponse": "..." } ],
  "time": 40,
  "started_at": "2025-10-05T10:00:00Z"
}
```

Remarques format:
- Côté groupe, les données peuvent revenir sous deux formes selon la source:
  - Normalisée: `propositions` + `bonne_reponse` (après `generateForGroup`)
  - Brute (ancien format): `a`, `b`, `c`, `d` et `bonne_reponse`; ou bien `reponses: [{ texte }]` pour certains jeux de données. Le front doit afficher les options dans l’ordre a‑d si présent, sinon lire `propositions`.
- Les contenus LaTeX sont nettoyés pour compatibilité MathJax.

### Soumettre un quiz de groupe
- **POST** `/api/quizzes/{quiz}/submit`
- Payload minimal:
```json
{ "score": 4 }
```
- Effet: crée une `Note` pour `(user, quiz)` et renvoie les corrections. Si le quiz provient de `UserQuiz` (cas personnel), la réponse inclut `userQuiz`; sinon, utilise `ReponseQuiz`.
- Réponses possibles (201):
  - Cas `UserQuiz` (peu probable pour groupe): `{ message, score, note, userQuiz, corrections, questions_approfondissement }`
  - Cas `Quiz` groupe: `{ message, note, corrections }`

### Désactiver / Réactiver un quiz de groupe (chef du groupe uniquement)
- **POST** `/api/quizzes/{quiz}/deactivate`
- **POST** `/api/quizzes/{quiz}/reactivate`
- Réponses: `{ success: true, message, quiz }` ou erreurs 400/403/404.

### Vérifier la disponibilité du contenu d’un quiz (optionnel)
- Public:
- **GET** `/api/quiz/check/{quiz_id}` → `{ ready: boolean }` (clé cache interne)

---

## Codes d’erreur fréquents
- 400: paramètres invalides, déjà soumis, quiz déjà actif/inactif
- 401: non authentifié
- 403: non membre du groupe, groupe désactivé, non chef pour opérations d’admin
- 404: ressource introuvable (groupe, quiz, invitation)
- 410: invitation expirée
- 429: limites hebdo atteintes (si activées)

---

## Flux recommandé côté front
1) Page Groupe:
   - GET `/api/groupes/{groupe}/details` → afficher membres, quiz actifs, statut de complétion.
2) Génération (chef ou membre autorisé du groupe):
   - POST `/api/quizzes/generate/group` avec `{ group_id, chapter_id, difficulty, title, nombre_questions, temps }` → récupérer `quiz` + `questions`.
3) Démarrage par un membre:
   - POST `/api/groupes/{groupe}/quizzes/{quiz}/start` → récupérer `data`, `time`.
4) Soumission:
   - POST `/api/quizzes/{quiz}/submit` avec `{ score }` → afficher corrections et sauvegarder note.
5) Administration:
   - GET `/api/groupes/{groupe}/quizzes/all` pour lister tous les quiz (actifs/inactifs).
   - POST `/api/quizzes/{quiz}/deactivate` ou `/reactivate` selon besoin.

---

## Contraintes et limites
- Taille du groupe: max 5 membres (contrôlé à l’invitation et à l’acceptation).
- Niveau: les invitations imposent le même `niveau_id` que le groupe.
- Limites hebdo: `nombre_quiz_groupe` incrémenté à la génération (le blocage 3/semaine est présent mais commenté côté serveur).
- Anti‑reprise: un membre ne peut pas redémarrer un quiz déjà soumis (`Note` existante).

---

## Notes d’implémentation front
- Toujours envoyer le `score` numérique lors de la soumission.
- Gérer les deux formats de questions: `propositions` vs. `a/b/c/d` (fallback). Prioriser `propositions` si présent.
- Afficher les explications `questions_approfondissement` si disponibles après soumission ou dans les vues de correction.
- Afficher les erreurs serveur et messages métiers (plein, déjà membre, invitation expirée, etc.).
