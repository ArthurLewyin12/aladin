import { toast } from "sonner";
import { ResponseMiddleware } from "./types/response.middleware";

/**
 * Middleware de réponse pour la gestion centralisée des erreurs.
 * Il intercepte les réponses pour identifier les erreurs réseau ou les erreurs
 * structurées renvoyées par l'API, affiche une notification (toast) à l'utilisateur
 * côté client, et rejette une promesse pour signaler l'échec de la requête.
 *
 * @param response L'objet de réponse Axios, ou une valeur falsy en cas d'erreur réseau.
 * @param next La fonction pour passer au middleware suivant dans la chaîne.
 * @returns Le résultat du middleware suivant en cas de succès, ou une promesse rejetée en cas d'erreur.
 */
export const errorHandlingMiddleware: ResponseMiddleware = (response, next) => {
  if (!response) {
    // Cas d'une erreur réseau où le serveur n'a pas répondu
    if (typeof window !== "undefined") {
      toast.error("Erreur réseau ou serveur indisponible.");
    }
    return Promise.reject(new Error("Erreur réseau ou serveur indisponible."));
  }

  // Si le statut est une erreur (ex: 4xx, 5xx)
  if (response.status >= 400) {
    // Cas où le serveur a répondu avec un format d'erreur spécifique
    if (response.data?.error) {
      // Si le backend renvoie à la fois `error` et `errors`, il s'agit d'une
      // réponse "réussie" du point de vue de la requête, mais avec des erreurs
      // métier (ex: invitation déjà envoyée). On laisse le `onSuccess` du hook
      // `useMutation` gérer ces cas en continuant la chaîne.
      if (Array.isArray(response.data.errors) && response.data.errors.length > 0) {
        return next(response);
      }

      const message = response.data.message || "Une erreur est survenue";

      if (typeof window !== "undefined") {
        toast.error(message);
      }

      return Promise.reject(new Error(message));
    }

    // Pour les autres erreurs non structurées (ex: 500 Internal Server Error)
    const genericMessage = `Erreur ${response.status}: ${response.statusText}`;
    if (typeof window !== "undefined") {
      toast.error(genericMessage);
    }
    return Promise.reject(new Error(genericMessage));
  }

  // Pour les réponses de succès (2xx)
  return next(response);
};
