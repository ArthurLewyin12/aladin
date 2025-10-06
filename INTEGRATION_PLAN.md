# Plan d'Intégration Frontend pour les Abonnements et Paiements

Ce document détaille les étapes d'intégration frontend pour les fonctionnalités d'abonnement, de paiement Wave et de gestion des coupons, en se basant sur le `REGISTER_MANAGEMENT_FLOW.md` et les composants/hooks/contrôleurs préparés.

## 1. Prérequis (Déjà effectués)

*   Mise à jour de `src/constants/endpoints.ts` avec toutes les routes nécessaires.
*   Création/Mise à jour des types dans `src/services/controllers/types/common/` (`auth.type.ts`, `payment.type.ts`, `donateur.type.ts`, `trial.type.ts`).
*   Création des contrôleurs dans `src/services/controllers/` (`auth.controller.ts`, `payment.controller.ts`, `donateur.controller.ts`, `trial.controller.ts`).
*   Création des hooks dans `src/services/hooks/` (`auth/useActivateCoupon.ts`, `payments/useWaveCheckout.ts`, `payments/useWaveCallback.ts`, `donateurs/useInitiateDonation.ts`, `trial/useTrialStatus.ts`).
*   Correction de la gestion des erreurs dans `src/components/pages/auth/student/register.tsx`.
*   Correction de l'encodage de l'email dans l'URL de redirection de `src/components/pages/auth/student/register.tsx`.
*   Correction de la redirection absolue dans `src/components/guards/auth-guard.tsx`.

## 2. Intégration du Flux de Paiement Direct Wave (Élève)

### 2.1. Intégration dans `PricingCard` (`src/components/pages/landing/pricing/pricing-card.tsx`)

**Objectif :** Permettre à un utilisateur authentifié d'initier un paiement Wave depuis une carte de prix.

**Étapes :**
1.  **Vérification d'authentification :**
    *   Utiliser `useSession` pour déterminer l'état d'authentification de l'utilisateur.
    *   Si l'utilisateur n'est pas authentifié et clique sur le bouton "S'abonner" :
        *   Afficher un `toast.info("Veuillez vous connecter ou créer un compte pour continuer.")`.
        *   Rediriger l'utilisateur vers `/login`.
    *   Désactiver le bouton (`disabled={isPending || isSessionLoading}`) pendant le chargement de la session ou l'initiation du paiement.
2.  **Initiation du paiement :**
    *   Si l'utilisateur est authentifié, le `onClick` du bouton appellera la fonction `handleCheckout`.
    *   `handleCheckout` utilisera `useWaveCheckout` pour appeler `POST /api/payments/wave/user/checkout` avec le `amount` (tiré de `tier.price[paymentFrequency.value]`) et `currency: "XOF"`.
3.  **Gestion de la réponse :**
    *   **`onSuccess` :** Si `data.launch_url` est reçu, rediriger l'utilisateur vers cette URL (`router.push(data.launch_url)`).
    *   **`onError` :** Afficher un `toast.error` avec le message d'erreur de l'API ou un message générique.

### 2.2. Création de la Page de Statut de Paiement (`src/app/(default)/paiement-status/page.tsx`)

**Objectif :** Gérer les retours de Wave après un paiement et afficher le statut à l'utilisateur.

**Étapes :**
1.  **Créer le fichier :** `src/app/(default)/paiement-status/page.tsx`.
2.  **Récupération des paramètres d'URL :**
    *   Utiliser `useSearchParams` pour récupérer `status` et `token` de l'URL (ex: `?status=success&token=XYZ`).
3.  **Appel du hook de callback :**
    *   Utiliser `useWaveCallback({ token, isSuccessCallback: status === "success" })`.
    *   Gérer les états de chargement (`isLoading`), succès (`isSuccess`), erreur (`isError`) et données (`data`).
4.  **Affichage du statut :**
    *   Pendant le chargement, afficher un spinner ou un message "Vérification du statut de paiement...".
    *   En cas de succès (`isSuccess` et `data.status === "success"`), afficher un message de succès (ex: "Votre abonnement a été activé !"). Afficher les détails de l'abonnement (`data.subscription.start`, `data.subscription.end`).
    *   En cas d'erreur (`isError` ou `data.status === "error"`), afficher un message d'erreur (ex: "Le paiement a échoué : [message d'erreur]").
5.  **Redirection post-affichage :**
    *   Après un succès, rediriger l'utilisateur vers son tableau de bord (`/student/dashboard`) après un court délai.
    *   Après un échec, rediriger vers la page de tarification (`/tarifs`) ou une page d'aide.

## 3. Intégration du Flux d'Activation par Code Promo (Élève)

**Objectif :** Permettre à un utilisateur authentifié d'activer un abonnement via un code promo.

**Étapes :**
1.  **Choix de l'emplacement :**
    *   Proposer un modal sur la page de tarification (`/tarifs`) ou une section dédiée dans le tableau de bord de l'utilisateur (`/student/dashboard`) ou les paramètres.
    *   Pour ce plan, nous allons supposer un modal sur la page `/tarifs`.
2.  **Création du composant Modal :**
    *   Créer un composant `ActivateCouponModal.tsx` (par exemple dans `src/components/pages/payments/`).
    *   Ce modal contiendra un champ de saisie pour le `coupon_code` et un bouton "Activer".
3.  **Logique d'activation :**
    *   Utiliser `useActivateCoupon` dans le modal.
    *   Lors de la soumission du formulaire du modal, appeler `mutate` de `useActivateCoupon` avec le `coupon_code`.
4.  **Gestion de la réponse :**
    *   **`onSuccess` :** Afficher un `toast.success("Votre abonnement a été activé par code promo !")`. Fermer le modal. Rafraîchir les données de session de l'utilisateur (si nécessaire, via `queryClient.invalidateQueries(['session'])` ou une redirection).
    *   **`onError` :** Afficher un `toast.error` avec le message d'erreur de l'API (ex: "Code invalide ou déjà utilisé").

## 4. Intégration du Statut d'Essai/Abonnement

**Objectif :** Afficher le statut d'abonnement de l'utilisateur dans l'interface (ex: tableau de bord, navbar).

**Étapes :**
1.  **Utilisation du hook :**
    *   Utiliser `useTrialStatus` dans les composants où le statut d'abonnement doit être affiché (ex: `src/components/layouts/navbar.tsx`, `src/app/(account)/student/dashboard/page.tsx`).
2.  **Affichage conditionnel :**
    *   Afficher des messages ou des éléments d'interface différents selon `is_on_trial`, `has_access`, `has_paid`, `days_remaining`.
    *   Exemple : "Essai gratuit : X jours restants", "Abonnement actif jusqu'au Y", "Abonnement expiré".

## 5. Intégration du Flux Donateurs (Achat de Coupons)

**Objectif :** Permettre aux donateurs d'acheter des coupons.

**Étapes :**
1.  **Création d'une page dédiée :**
    *   Créer une page `src/app/(default)/donateurs/page.tsx` ou `src/app/(default)/acheter-coupons/page.tsx`.
2.  **Formulaire d'initiation :**
    *   Cette page contiendra un formulaire pour `type`, `nom`, `email`, `nombre_coupons`, `currency`.
    *   Utiliser `useInitiateDonation`.
    *   Lors de la soumission, appeler `mutate` de `useInitiateDonation`.
3.  **Gestion de la réponse :**
    *   **`onSuccess` :** Le backend devrait renvoyer une `launch_url` (le `.md` dit "le backend appelle Wave et retourne l’URL de lancement"). Rediriger l'utilisateur vers cette URL.
    *   **`onError` :** Afficher un `toast.error`.
4.  **Pages de callback Donateurs :**
    *   Les callbacks `GET /api/donateurs/wave/success/{public_id}` et `GET /api/donateurs/wave/error/{public_id}` sont gérés par le backend.
    *   Si le backend redirige vers le frontend après ces callbacks, il faudra créer des pages frontend correspondantes (similaires à `paiement-status`) pour afficher le résultat de l'achat de coupons.
