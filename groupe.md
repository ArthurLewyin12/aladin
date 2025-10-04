# Résumé des Tâches Backend pour la Fonctionnalité des Quiz de Groupe

Ce document résume les modifications nécessaires côté backend pour implémenter la logique d'affichage et d'accès aux quiz et aux notes au sein d'un groupe.

---

### 1. (BUG - Priorité Haute) L'endpoint des détails de groupe est introuvable.

*   **Problème :** L'endpoint `GET /api/groupes/{groupeId}/detailed` renvoie actuellement une erreur **404 Not Found**.
*   **Solution :** Activer ou créer cette route.
*   **Ce qu'elle doit retourner :** Elle doit renvoyer une réponse JSON qui correspond à la structure attendue par le frontend (`GetDetailedGroupeResponse`). Le plus important est que cette réponse contienne le champ suivant pour l'utilisateur authentifié :
    *   `quizzesPasses: number[]`: Un tableau contenant les IDs de tous les quiz de groupe que l'utilisateur a déjà terminés.

    *Note : Sans ce champ, il est impossible de savoir si un utilisateur a déjà passé un quiz ou non.*

---

### 2. (FONCTIONNALITÉ - Priorité Normale) Fournir le statut de complétion pour tout le groupe.

*   **Problème :** Pour afficher le bouton "Voir les notes" uniquement lorsque *tous les membres* ont terminé, le frontend a besoin de connaître le statut de chaque membre pour un quiz donné. L'API actuelle ne fournit pas cette information.
*   **Solution :** Enrichir les données de chaque quiz retourné par l'endpoint `GET /api/groupes/{groupeId}/detailed`.
*   **Suggestion d'implémentation :** Pour chaque quiz dans le tableau `quizzes`, ajouter l'une des informations suivantes :
    *   **Option A (préférée) :** Un compteur de soumissions.
        ```json
        "quizzes": [
          {
            "id": 7,
            "titre": "Quiz de test",
            // ... autres champs du quiz
            "submission_count": 3 
          }
        ]
        ```
        Le frontend pourra alors comparer `submission_count` au nombre total de membres du groupe.

    *   **Option B :** La liste des utilisateurs ayant soumis le quiz.
        ```json
        "quizzes": [
          {
            "id": 7,
            "titre": "Quiz de test",
            // ... autres champs du quiz
            "submissions": [
                { "user_id": 1, "status": "completed" },
                { "user_id": 5, "status": "completed" }
            ]
          }
        ]
        ```