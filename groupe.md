# Routes de Groupe - Problèmes et Raisons Probables

## 1. GET /api/notifications

**Statut:** Ne fonctionne pas (Retourne `NotFoundHttpException`)

**Raison Probable:**
*   L'endpoint `/api/notifications` n'est pas implémenté sur le backend.
*   Le nom de l'endpoint est incorrect.
*   L'endpoint nécessite des paramètres ou des en-têtes spécifiques qui n'ont pas été fournis.

**Impact:** Impossible de récupérer dynamiquement les `invitationId` pour les utilisateurs existants, ce qui rend difficile le test des routes d'acceptation et de déclin d'invitation sans un `invitationId` fourni manuellement.

## 2. GET /api/groupes/{id}/detailed

**Statut:** Ne fonctionne pas (Retourne `NotFoundHttpException`)

**Raison Probable:**
*   La route n'est pas encore active sur le backend et doit être ajoutée dans `routes/api.php` comme spécifié.

**Impact:** Impossible de récupérer les détails complets d'un groupe via l'API.