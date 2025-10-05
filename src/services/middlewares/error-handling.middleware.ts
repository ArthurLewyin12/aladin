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
    // Si le backend renvoie des erreurs structurées (message, errors)
    if (response.data) {
      const message = response.data.message || `Erreur ${response.status}: ${response.statusText}`;
      // Créer un objet Error personnalisé et y attacher la réponse complète
      const customError = new Error(message);
      (customError as any).response = response; // Attacher la réponse Axios complète

      if (typeof window !== "undefined") {
        // Optionnel: afficher un toast générique ici, ou laisser le composant gérer
        // toast.error(message);
      }
      return Promise.reject(customError);
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
