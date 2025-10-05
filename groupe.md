# Demandes d'Évolution API pour la Gestion des Quiz de Groupe

Ce document détaille les modifications et ajouts nécessaires à l'API backend pour supporter pleinement la gestion des quiz au sein des groupes. L'objectif est de permettre à chaque membre d'un groupe de démarrer, passer et consulter les résultats d'un quiz de manière indépendante, tout en offrant une vue d'ensemble de la progression du groupe.

---

## Contexte Important

*   **Quiz de Groupe** : Un quiz est créé pour un groupe spécifique.
*   **Tentatives Indépendantes** : Chaque membre du groupe passe le quiz de manière indépendante. Une "instance de quiz utilisateur" (`userQuizId`) est créée pour chaque tentative.
*   **Lien au Groupe** : Les tentatives de quiz des membres sont liées au quiz du groupe.
*   **Définition du Quiz** : La définition du quiz (questions, durée, matière, etc.) est unique pour le quiz du groupe.

---

## 1. Endpoint pour "Démarrer un Quiz de Groupe"

Actuellement, l'endpoint `POST /api/quizzes/{quizId}/start` est utilisé pour les quiz individuels. Pour les quiz de groupe, nous avons besoin d'un endpoint qui retourne les informations nécessaires pour la page de prise de quiz, y compris un `userQuizId` spécifique à la tentative de l'utilisateur dans le contexte du groupe.

**Endpoint Proposé :**

*   `POST /api/groupes/{groupId}/quizzes/{quizId}/start`
    *   **Description** : Démarre une nouvelle tentative de quiz pour l'utilisateur authentifié au sein du groupe spécifié.
    *   **Paramètres de chemin** :
        *   `groupId` (number) : L'ID du groupe.
        *   `quizId` (number) : L'ID du quiz de groupe à démarrer.
    *   **Authentification** : Requise (utilisateur doit être membre du groupe).
    *   **Réponse Attendue (JSON)** :
        ```json
        {
          "userQuizId": 123, // ID unique de l'instance de quiz créée pour la tentative de cet utilisateur
          "questions": [
            // Tableau d'objets QuizQuestion (combiné QCM et questions_approfondissement pour simplifier le frontend)
            {
              "id": "q_1",
              "question": "Quelle est la capitale de la France ?",
              "propositions": [
                {"id": "a", "text": "Berlin"},
                {"id": "b", "text": "Madrid"},
                {"id": "c", "text": "Paris"},
                {"id": "d", "text": "Rome"}
              ],
              "bonne_reponse_id": "c"
            }
            // ... autres questions
          ],
          "quizDefinition": {
            "id": 1,
            "titre": "Test Quiz pour le Groupe 1",
            "nombre_questions": 10,
            "temps": 30,
            "niveau_id": 2,
            "matiere_id": 12,
            "chapitre_id": 234,
            "difficulte": "Facile",
            "groupe_id": 1,
            "is_active": true,
            "matiere": { // CRUCIAL : Inclure l'objet matière complet ici
              "id": 12,
              "libelle": "Anglais"
            }
            // ... autres propriétés de QuizDefinition
          },
          "timeLimit": 30 // Limite de temps en minutes pour cette tentative
        }
        ```
    *   **Détails Importants** :
        *   `userQuizId` : Cet ID est **essentiel** pour les requêtes de soumission et de récupération des notes spécifiques à la tentative de l'utilisateur.
        *   `questions` : Le frontend a besoin de toutes les questions pour les afficher. Il est préférable de les combiner en un seul tableau `QuizQuestion[]` pour simplifier la logique frontend.
        *   `quizDefinition.matiere` : L'objet `matiere` complet (avec `id` et `libelle`) doit être inclus dans `quizDefinition` pour afficher le nom de la matière sur la page de prise de quiz sans appel API supplémentaire.

---

## 2. Endpoint pour "Soumettre un Quiz de Groupe"

Une fois qu'un utilisateur a terminé un quiz de groupe, ses réponses doivent être soumises.

**Endpoint Proposé :**

*   `POST /api/groupes/{groupId}/quizzes/{userQuizId}/submit`
    *   **Description** : Soumet les réponses d'une tentative de quiz spécifique (`userQuizId`) pour l'utilisateur authentifié au sein du groupe.
    *   **Paramètres de chemin** :
        *   `groupId` (number) : L'ID du groupe.
        *   `userQuizId` (number) : L'ID de l'instance de quiz utilisateur à soumettre (obtenu via l'endpoint `start`).
    *   **Corps de la Requête (JSON)** :
        ```json
        {
          "score": 8 // Le score calculé par le frontend (ou les réponses brutes si le backend recalcule)
          // ... (autres données si le backend a besoin des réponses brutes pour les corrections)
        }
        ```
    *   **Authentification** : Requise.
    *   **Réponse Attendue (JSON)** :
        ```json
        {
          "message": "Quiz submitted successfully!",
          "score": 8,
          "corrections": [
            // Tableau d'objets QuizQuestion avec les bonnes réponses et/ou explications
            // Similaire à la structure de `QuizSubmitResponse` actuelle
          ],
          "userQuizResultId": 456 // ID du résultat enregistré pour cette tentative
        }
        ```
    *   **Détails Importants** :
        *   `userQuizResultId` : L'ID du résultat enregistré, utile pour la navigation vers la page des notes.

---

## 3. Endpoint pour "Obtenir les Notes/Résultats d'un Quiz de Groupe"

Pour permettre à un utilisateur de consulter ses notes après avoir passé un quiz de groupe.

**Endpoint Proposé :**

*   `GET /api/groupes/{groupId}/quizzes/{userQuizResultId}/notes`
    *   **Description** : Récupère les notes et les corrections d'une tentative de quiz spécifique (`userQuizResultId`) pour l'utilisateur authentifié au sein du groupe.
    *   **Paramètres de chemin** :
        *   `groupId` (number) : L'ID du groupe.
        *   `userQuizResultId` (number) : L'ID du résultat de l'instance de quiz utilisateur (obtenu via l'endpoint `submit`).
    *   **Authentification** : Requise.
    *   **Réponse Attendue (JSON)** :
        ```json
        {
          "userQuizResult": {
            "id": 456,
            "user_id": 789,
            "quiz_id": 1, // L'ID du quiz de groupe original
            "score": 8,
            "created_at": "...",
            // ... autres détails pertinents sur la tentative de l'utilisateur
          },
          "corrections": [
            // Tableau d'objets QuizQuestion avec les bonnes réponses et/ou explications
            // Similaire à la structure de `QuizNotesResponse` actuelle
          ]
        }
        ```

---

## 4. Amélioration de l'Endpoint `GET /api/groupes/{groupId}/detailed`

L'endpoint actuel `GET /api/groupes/{groupId}/detailed` retourne déjà une liste de `GroupQuiz` avec `submissions: { user_id: number }[]`.

*   **Confirmation** : Veuillez confirmer que la structure `GroupQuiz` retournée par cet endpoint continuera d'inclure `submissions: { user_id: number }[]` pour chaque quiz. Cette information est cruciale pour le frontend afin de déterminer :
    *   Si l'utilisateur actuel a passé le quiz.
    *   Si tous les membres du groupe ont passé le quiz (en comparant `submissions.length` avec le nombre total de membres du groupe).

---

## 5. Amélioration de l'Endpoint `GET /api/quizzes/{quiz_id}`

L'endpoint `GET /api/quizzes/{quiz_id}` retourne actuellement une `QuizDefinition` sans l'objet `matiere` complet.

*   **Demande** : Veuillez modifier cet endpoint pour que la `QuizDefinition` retournée inclue l'objet `matiere` complet (avec `id` et `libelle`). Cela assurera la cohérence et sera utile si le frontend a besoin d'afficher les détails d'un quiz sans le démarrer.

---

Ce document couvre les besoins pour un flux complet de quiz de groupe, de la création à la consultation des notes, en respectant l'indépendance des tentatives de chaque utilisateur.
