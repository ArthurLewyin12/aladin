# Plan d'implémentation : Abonnements et Coupons

**STATUT : En pause.** Le travail sur cette fonctionnalité est mis en pause. On reprendra plus tard.

Ce document suit l'avancement de l'implémentation des fonctionnalités de paiement et de coupons.

---

### Chantier 1 : Activation de l'abonnement pour l'élève

- [x] **Créer un composant `SubscriptionManager.tsx`**
  - Affiche le statut de l'abonnement (période d'essai, etc.).
  - Sert de conteneur pour les options d'activation.

- [x] **Créer le composant `CouponActivator.tsx`**
  - Formulaire pour activer un abonnement via un code promo.
  - Utilise le hook `useActivateCoupon`.

- [x] **Créer le composant `DirectPayment.tsx`**
  - Bouton pour lancer le paiement direct via Wave.
  - Utilise le hook `useWaveCheckout`.

- [x] **Créer les pages de callback de paiement**
  - Page `success/page.tsx` pour les paiements réussis.
  - Page `error/page.tsx` pour les paiements échoués.
  - Utilisent le hook `useWaveCallback`.

- [ ] **Intégrer `SubscriptionManager.tsx` dans le tableau de bord de l'élève (EN ATTENTE)**
  - Afficher le composant si `has_paid = false`.

---

### Chantier 2 : Achat de coupons pour les donateurs

- [x] **Créer le composant `DonationForm.tsx`**
  - Formulaire pour l'achat de coupons par les donateurs.
  - Utilise le hook `useInitiateDonation`.

- [x] **Créer la page `/donate`**
  - Page dédiée hébergeant le formulaire de don.
  - Reprend le style de la page des tarifs.

- [x] **Mettre à jour la `PricingCard.tsx`**
  - Le bouton du forfait "Entreprise" redirige vers la page `/donate`.

---

### Chantier 3 : Gardien d'accès (Access Guard) (EN ATTENTE)

- [ ] **Mettre à jour le `AuthGuard` (`src/components/guards/auth-guard.tsx`)**
  - Utiliser `useTrialStatus` ou `useSession` pour vérifier si l'utilisateur a un accès valide (`isOnTrial()` ou `has_paid`).
  - Rediriger vers le tableau de bord si l'accès est invalide.
