# Explication de l'erreur 419 et de la protection CSRF

## Le problème : Erreur 419

Lorsque vous essayez de vous connecter, vous rencontrez une erreur `419`. Cette erreur n'est pas un code HTTP standard, mais elle est souvent utilisée par les frameworks backend, comme Laravel, pour indiquer une **inadéquation du jeton CSRF (Cross-Site Request Forgery)**.

## Qu'est-ce que le CSRF ?

Le CSRF est un type d'attaque où un utilisateur malveillant tente de faire effectuer des actions non désirées à un utilisateur authentifié sur une application web. Par exemple, un attaquant pourrait essayer de forcer le navigateur d'un utilisateur à envoyer une requête pour changer son mot de passe ou effectuer un virement.

Pour se protéger contre cela, les applications web utilisent des jetons CSRF. Le principe est simple :

1.  Pour chaque session utilisateur, le backend génère un jeton unique et secret.
2.  Ce jeton est envoyé au frontend.
3.  Pour chaque requête "sensible" (comme `POST`, `PUT`, `DELETE`), le frontend doit inclure ce jeton dans les en-têtes de la requête.
4.  Le backend vérifie que le jeton reçu correspond à celui qu'il a généré pour la session. S'il ne correspond pas, la requête est rejetée avec une erreur (dans notre cas, 419).

## La solution avec Laravel Sanctum

Notre backend utilise **Laravel Sanctum** pour gérer l'authentification et la protection CSRF pour les applications SPA (Single Page Application) comme la nôtre.

Pour que cela fonctionne, le frontend doit suivre un processus spécifique :

### 1. Récupérer le cookie CSRF

Avant de pouvoir envoyer des requêtes authentifiées, le frontend doit d'abord contacter un point de terminaison spécifique sur le backend pour initialiser la protection CSRF. Avec Sanctum, ce point de terminaison est typiquement :

```
/sanctum/csrf-cookie
```

En appelant cette route, le backend va générer un jeton CSRF et l'envoyer au navigateur sous la forme d'un cookie nommé `XSRF-TOKEN`.

### 2. Envoyer le jeton avec les requêtes

Une fois que le cookie `XSRF-TOKEN` est présent dans le navigateur, des bibliothèques comme `axios` sont assez intelligentes pour le gérer automatiquement. Pour chaque requête envoyée au même domaine, `axios` va lire la valeur du cookie `XSRF-TOKEN` et l'ajouter dans un en-tête HTTP nommé `X-XSRF-TOKEN`.

Le backend Laravel va alors automatiquement comparer la valeur de cet en-tête avec le jeton de la session pour valider la requête.

## Configuration requise côté Backend (Laravel)

Pour que le point de terminaison `/sanctum/csrf-cookie` soit disponible et que le système fonctionne, le backend Laravel doit être configuré correctement :

1.  **Installer et configurer Sanctum** : Assurez-vous que `laravel/sanctum` est installé et que ses fichiers de configuration et de migration ont été publiés.

2.  **Activer le middleware `EnsureFrontendRequestsAreStateful`** : Dans `app/Http/Kernel.php`, ce middleware doit être activé pour le groupe de routes `api`. C'est lui qui gère la session et la protection CSRF pour les SPA.

    ```php
    'api' => [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        // ... autres middlewares
    ],
    ```

3.  **Configurer les domaines "Stateful"** : Dans le fichier `.env` du backend, l'URL du frontend doit être ajoutée à la variable `SANCTUM_STATEFUL_DOMAINS`. Cela indique à Sanctum quels domaines sont autorisés à effectuer des requêtes authentifiées de type "stateful".

    ```.env
    SANCTUM_STATEFUL_DOMAINS=localhost:3000
    ```

4.  **Configurer les CORS** : Le fichier `config/cors.php` doit autoriser les requêtes depuis l'URL du frontend, et surtout, autoriser l'envoi des "credentials" (comme les cookies).

    ```php
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'supports_credentials' => true,
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
    ```

## Implémentation Côté Frontend

Dans notre code, nous avons modifié le hook `useLogin` pour qu'il appelle d'abord la fonction `getCsrfCookie` avant de tenter la connexion. Cette fonction fait simplement une requête `GET` sur `/sanctum/csrf-cookie` pour que le processus décrit ci-dessus puisse se mettre en place.

```typescript
// src/services/hooks/auth/useLogin.ts

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      await getCsrfCookie(); // On récupère le cookie CSRF d'abord
      return login(payload); // Ensuite on se connecte
    },
  });
};
```
