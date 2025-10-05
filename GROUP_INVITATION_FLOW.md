# Flux Technique de la Fonctionnalité d'Invitation de Groupe

Ce document décrit le processus technique étape par étape pour inviter des utilisateurs à rejoindre un groupe, en gérant à la fois les utilisateurs existants et les nouveaux.

## Principes Directeurs

- **Logique Côté Backend :** Le backend contrôle toute la logique métier, y compris la génération d'URL et la gestion des tokens.
- **Simplicité du Frontend :** Le frontend est responsable de l'interface utilisateur et des actions de l'utilisateur, mais ne contient pas de logique métier complexe.
- **Expérience Utilisateur Fluide :** Le processus doit être simple et intuitif pour les nouveaux utilisateurs comme pour les utilisateurs existants.

---

## Le Flux

### Étape 1 : Le Chef de Groupe Lance l'Invitation

1.  **Action :** Un chef de groupe clique sur "Inviter" et saisit une ou plusieurs adresses e-mail dans la modale d'invitation.
2.  **Appel API (Frontend vers Backend) :** Le frontend envoie une requête `POST` contenant uniquement les e-mails.

    - **Endpoint :** `POST /api/groupes/{groupeId}/invitations`
    - **Corps de la Requête :**
      ```json
      {
        "member_emails": [
          "utilisateur-existant@example.com",
          "nouvel-utilisateur@example.com"
        ]
      }
      ```

### Étape 2 : Le Backend Traite la Requête

Le backend parcourt le tableau `member_emails` et traite chaque e-mail en fonction de l'existence de l'utilisateur.

#### Cas A : L'Utilisateur Existe (`utilisateur-existant@example.com`)

1.  **Vérification en Base de Données :** Le backend trouve l'utilisateur dans la table `users`.
2.  **Génération de Token :** Il génère un **token d'invitation** unique, sécurisé et à durée de vie limitée.
3.  **Enregistrement en Base de Données :** Il crée un enregistrement dans une table `invitations` avec le `user_id`, le `group_id`, le `token` et un timestamp `expires_at`.
4.  **Construction de l'URL :** Le backend récupère sa propre URL de base à partir de ses variables d'environnement (ex: `APP_URL="https://aladin-qze2.vercel.app"`) et construit l'URL d'invitation complète.
    - **URL :** `[APP_URL]/student/invitations?token=[le-token-invitation]`
5.  **E-mail :** Le backend envoie un e-mail à l'utilisateur existant avec le lien, l'invitant à accepter ou refuser.

#### Cas B : L'Utilisateur N'Existe PAS (`nouvel-utilisateur@example.com`)

1.  **Vérification en Base de Données :** Le backend ne trouve pas l'e-mail dans la table `users`.
2.  **Génération de Token :** Il génère un **token d'inscription** unique, sécurisé et à durée de vie limitée.
3.  **Enregistrement en Base de Données :** Il crée un enregistrement dans une table `pending_invitations` avec l'`email`, le `group_id`, le `token` et un timestamp `expires_at`.
4.  **Construction de l'URL :** Le backend construit l'URL d'inscription complète, qui inclut le token.
    - **URL :** `[APP_URL]/student/register?invitation_token=[le-token-inscription]`
5.  **E-mail :** Le backend envoie un e-mail invitant la personne à s'inscrire, en précisant qu'elle rejoindra également le groupe.

### Étape 3 : Interaction de l'Utilisateur

#### Flux A : L'Utilisateur Existant Accepte l'Invitation

1.  L'utilisateur clique sur le lien dans l'e-mail et arrive sur la page `/student/invitations`.
2.  Le frontend extrait le `token` de l'URL et appelle le backend pour obtenir les détails de l'invitation.
    - **Endpoint :** `GET /api/invitations/{token}`
3.  La page affiche les détails de l'invitation ("Vous avez été invité à...").
4.  L'utilisateur clique sur "Accepter".
5.  Le frontend appelle l'endpoint d'acceptation.
    - **Endpoint :** `POST /api/invitations/{invitationId}/accept`
6.  Le backend valide la requête, ajoute l'utilisateur au groupe et marque l'invitation comme `accepted`.

#### Flux B : Le Nouvel Utilisateur S'inscrit

1.  L'utilisateur clique sur le lien dans l'e-mail et arrive sur la page `/student/register`.
2.  Le frontend détecte l'`invitation_token` dans l'URL et le conserve dans son état.
3.  L'utilisateur remplit le formulaire d'inscription.
4.  Le frontend envoie les données d'inscription, **en incluant le token**.
    - **Endpoint :** `POST /api/auth/register`
    - **Corps de la Requête :**
      ```json
      {
        "name": "...",
        "email": "nouvel-utilisateur@example.com",
        "password": "...",
        "invitation_token": "[le-token-inscription]"
      }
      ```
5.  Le backend crée le nouvel utilisateur. Comme l'`invitation_token` est présent, il trouve la `pending_invitation` correspondante, ajoute le nouvel utilisateur au groupe et marque le token comme utilisé.
6.  **Résultat :** Lorsque le nouvel utilisateur se connecte pour la première fois, il est déjà membre du groupe. L'expérience est transparente.

---

### Résumé des Prérequis pour l'API Backend

1.  **`POST /api/groupes/{groupeId}/invitations`** :
    - Accepte `{ "member_emails": [...] }`.
    - Implémente la logique pour gérer à la fois les utilisateurs existants et les nouveaux.
    - Retourne un résumé des actions (ex: `{ "group_invitations_sent": 1, "registration_invitations_sent": 1, "errors": [] }`).

2.  **`GET /api/invitations/{token}`** :
    - Récupère les détails d'une invitation active pour que l'utilisateur puisse la voir sur le frontend.

3.  **`POST /api/auth/register`** :
    - Est mis à jour pour accepter optionnellement un `invitation_token`. Si le token est présent et valide, le nouvel utilisateur est automatiquement ajouté au groupe correspondant.
