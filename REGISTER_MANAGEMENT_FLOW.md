### Parcours abonnements et coupons – Guide d’intégration Front

#### Vue d’ensemble
- Deux façons d’activer un abonnement élève:
  - Par code promo (coupon) fourni par un donateur.
  - Par paiement direct Wave (checkout + redirection).

- Accès aux services:
  - Essai gratuit: 7 jours, géré par `trial_start`/`trial_end`.
  - Accès accordé si `has_paid = true` OU essai actif.

- Durées:
  - Activation par coupon: 1 an.
  - Activation par paiement direct: 1 an.

---

## Authentification (Sanctum)
- Login: `POST /api/auth/login`
- Register: `POST /api/auth/register`
- Me: `GET /api/auth/me` (protégé)
- Les endpoints protégés nécessitent le header `Authorization: Bearer <token>`.

Exemples
- Login request:
```json
{
  "username": "eleve@example.com ou 0500000000",
  "password": "Password12345!"
}
```
- Login response (extrait):
```json
{
  "success": true,
  "token": "ACCESS_TOKEN",
  "refresh_token": "REFRESH_TOKEN",
  "user": { "id": 1, "mail": "..." }
}
```

---

## Activation par code promo (élève)

### Endpoint (protégé)
- `POST /api/auth/activate/coupon`
- Body:
```json
{ "coupon_code": "ABCD1234EFGH" }
```

Règles côté serveur
- Refus si `statut=parent`, si compte non vérifié (`is_verify=false`), ou déjà actif (`is_active=true`).
- Cherche un `Coupon` avec `code` (uppercased) et `statut=unused`.

Réponse (succès)
```json
{
  "success": true,
  "message": "Compte activé par code promo.",
  "subscription": { "start": "2025-10-05T...", "end": "2026-07-05T..." }
}
```

Effets
- `Utilisateur`:
  - `is_active = true`
  - `has_paid = true`
  - `date_debut_abonnement = now()`
  - `date_fin_abonnement = now() + 9 mois`
- `Coupon`:
  - `statut = "used"`
  - `utilisateur_*` renseignés
  - `used_at = now()`

Erreurs fréquentes
- 401 si non authentifié
- 403 si parent
- 423 si non vérifié
- 400 si déjà actif
- 422 si code invalide/déjà utilisé

---

## Paiement direct (Wave) – élève

### 1) Démarrer un checkout Wave (protégé)
- `POST /api/payments/wave/user/checkout`
- Body:
```json
{ "amount": 500, "currency": "XOF" }
```
- Réponse:
```json
{
  "launch_url": "https://checkout.wave.com/...",
  "payment_token": "random_token"
}
```
- Front: rediriger l’utilisateur vers `launch_url`.

Notes
- `amount` provient de votre formulaire.
- Le backend enregistre un `Payment` en `pending` avec `provider_session_id` retourné par Wave.

### 2) Redirections de Wave (publiques)
- Succès: `GET /api/payments/wave/user/success/{token}`
- Erreur: `GET /api/payments/wave/user/error/{token}`

Réponses
- Succès:
```json
{
  "status": "success",
  "subscription": { "start": "...", "end": "..." }
}
```
- Erreur:
```json
{ "status": "error", "message": "Paiement annulé ou refusé" }
```

Effets (succès)
- `Payment`:
  - `status = "success"`
  - `paid_at = now()`
- `Utilisateur`:
  - `is_active = true`
  - `has_paid = true`
  - `date_debut_abonnement = now()`
  - `date_fin_abonnement = now() + 1 an`

Effets (erreur)
- `Payment.status = "failed"`
- `error_message = "cancelled or refused"`

Redirection finale (option)
- Vous pouvez faire suivre ces callbacks en redirection front, par exemple:
  - `https://votre-front/paiement-status?status=success`
  - `https://votre-front/paiement-status?status=error`
- À implémenter côté front selon votre UX.

---

## Achat de coupons (donateurs)

### Initier un achat (public)
- `POST /api/donateurs/initiate`
- Body minimal:
```json
{
  "type": "entreprise | particulier",
  "nom": "Nom Entreprise/Donateur",
  "email": "donor@example.com",
  "nombre_coupons": 100,
  "currency": "XOF"
}
```
- Réponse:
```json
{
  "donateur": { "public_id": "XXXXXXXXXX" }
}
```
- Front: le backend appelle Wave et retourne l’URL de lancement (selon version du contrôleur); il faut rediriger. Les callbacks backend généreront les coupons.

### Callbacks Wave Donateurs (public)
- Succès: `GET /api/donateurs/wave/success/{public_id}`
  - Effets: `wave_status = "paid"`, génération de `nombre_coupons` codes `unused`, envoi email d’accès.
- Erreur: `GET /api/donateurs/wave/error/{public_id}`

---

## Modèles et champs clés

### Utilisateur (`utilisateur`)
- Accès et abonnement:
  - `is_verify` (bool), `is_active` (bool), `has_paid` (bool)
  - `trial_start`, `trial_end` (essai 7 jours)
  - `date_debut_abonnement`, `date_fin_abonnement`
- Helper:
  - Accès autorisé si `isOnTrial()` ou `has_paid`.

### Coupon (`coupons`)
- `code` (unique), `statut` = `unused | used`
- Liaison utilisateur (une fois utilisé): `utilisateur_id`, `utilisateur_nom`, `utilisateur_mail`, `used_at`

### Payment (`payments`)
- `user_id`, `amount`, `currency`
- `provider = "wave"`, `provider_session_id`
- `status = "pending | success | failed"`, `paid_at`
- `error_message`, `meta` (JSON, ex: URLs de callback)

---

## Récap des endpoints front

- Auth
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `GET /api/auth/me` (Bearer)

- Coupon (élève)
  - `POST /api/auth/activate/coupon` (Bearer)

- Paiement élève (Wave)
  - `POST /api/payments/wave/user/checkout` (Bearer)
  - `GET /api/payments/wave/user/success/{token}`
  - `GET /api/payments/wave/user/error/{token}`

- Donateurs & Coupons
  - `POST /api/donateurs/initiate`
  - `GET /api/donateurs/wave/success/{id}`
  - `GET /api/donateurs/wave/error/{id}`

---

## Intégration front – flux recommandés

- Activation par coupon:
  - Demander `coupon_code` → `POST /api/auth/activate/coupon` → afficher message succès/erreur, rafraîchir profil.

- Paiement direct:
  - `POST /api/payments/wave/user/checkout` → rediriger `launch_url`
  - À la redirection callback, afficher statut (ou faire redirect serveur vers vos pages front) → rafraîchir profil pour voir abonnement actif.

- Affichage statut essai/paiement:
  - `GET /api/trial/status` (Bearer)
  - Réponse: `is_on_trial`, `has_access`, `has_paid`, `trial_start`, `trial_end`, `days_remaining`.
