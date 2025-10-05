# Statut d'Implémentation - Quiz de Groupe

Ce document résume les fonctionnalités implémentées pour la gestion des quiz de groupe et détaille les tâches restantes.

---

## ✅ Fonctionnalités Implémentées

Le flux principal de création et de passation de quiz de groupe est fonctionnel.

### 1. Flux de Passation de Quiz
- **Démarrage :** Un utilisateur peut lancer un quiz depuis la page de détails du groupe.
- **Passation :** Une page dédiée (`/groups/.../quiz/...`) a été créée pour passer le quiz, en réutilisant le design de la page de quiz individuelle.
- **Soumission :** L'utilisateur peut soumettre ses réponses.
- **Résultats Immédiats :** Une page de résultats (`/groups/.../results/...`) a été créée pour afficher les corrections immédiatement après la soumission.

### 2. Création de Quiz de Groupe
- **Modale de Création :** La modale de création de quiz est fonctionnelle et son style a été harmonisé avec celui de la création de groupe.
- **Loader de Génération :** Le loader `GenerationLoadingOverlay` est intégré pour gérer les temps de génération de l'API.
- **Logique de Retry :** Le hook `useCreateGroupQuiz` inclut une stratégie de nouvelles tentatives automatiques pour pallier les erreurs serveur temporaires (Erreur 500).

### 3. Composants et Logique UI
- **`QuizCard` :** La carte de quiz a été mise à jour pour gérer plusieurs états :
  - Affiche "Lancer le quiz" si le quiz n'a pas été fait.
  - Affiche un bouton désactivé "Déjà passé" si le quiz a été fait.
  - Affiche un bouton "Voir les notes" (actuellement inactif) si tous les membres ont terminé le quiz.
  - La largeur et la position des boutons ont été ajustées pour une meilleure expérience.
- **Page de Détails du Groupe :**
  - Correction du bug du bouton "Créer un Quiz" dupliqué.
  - Correction du crash dû à la donnée `niveau` manquante dans la réponse de l'API.

### 4. Harmonisation des Styles
- **Page de Révision :** Le style des sélections de matière et de chapitre a été mis à jour pour correspondre à celui de la page de quiz.

### 5. Infrastructure Technique
- **Types :** Les types TypeScript pour les nouvelles réponses de l'API (`StartGroupQuizResponse`, `SubmitGroupQuizResponse`) ont été créés.
- **Controllers :** Les fonctions d'appel à l'API (`startGroupQuiz`, `submitGroupQuiz`) ont été ajoutées.
- **Hooks :** Les hooks TanStack Query (`useStartGroupQuiz`, `useSubmitGroupQuiz`, `useCreateGroupQuiz`) ont été créés et implémentés.

---

## ⏳ Tâches Restantes / Futures Améliorations

### 1. Consultation des Résultats Passés (En attente du Backend)

La fonctionnalité la plus importante restante est la possibilité pour un utilisateur de consulter les résultats d'un quiz qu'il a déjà terminé.

- **Problème Actuel :** L'API ne fournit pas de route pour récupérer les notes/corrections d'une soumission passée. Ces informations ne sont disponibles qu'une seule fois, juste après la soumission.
- **Préparation Côté Frontend :**
  - Le bouton "Voir les notes" est déjà en place sur la `QuizCard` et apparaît correctement lorsque tous les membres ont passé le quiz.
  - La prop `onViewGrades` est déjà passée au composant.
- **Prochaines Étapes (une fois l'API prête) :**
  1.  **Créer un nouveau hook** (ex: `useGroupQuizNote`) qui appellera la nouvelle route backend (ex: `GET /api/quizzes/{quizId}/my-note`).
  2.  **Créer/Modifier la page de résultats** pour qu'elle utilise ce hook afin de récupérer les données d'une soumission passée, au lieu de les lire depuis `sessionStorage`.
  3.  **Connecter le bouton "Voir les notes"** pour qu'il redirige vers cette page de résultats persistante.
