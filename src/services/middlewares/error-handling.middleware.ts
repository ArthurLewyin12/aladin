import { toast } from "sonner";
import { ResponseMiddleware } from "./types/response.middleware";

export const errorHandlingMiddleware: ResponseMiddleware = (response, next) => {
  if (!response) {
    // Cas d'une erreur réseau où le serveur n'a pas répondu
    if (typeof window !== "undefined") {
      toast.error("Erreur réseau ou serveur indisponible.");
    }
    return Promise.reject(response);
  }

  // Cas où le serveur a répondu avec un format d'erreur spécifique
  if (response.data?.error) {
    const message = response.data.message || "Une erreur est survenue";

    // Protection SSR : on n'affiche le toast que sur le client
    if (typeof window !== "undefined") {
      toast.error(message);
    }

    // On rejette la promesse pour que les autres parties du code (ex: React Query)
    // sachent que la requête a échoué.
    return Promise.reject(new Error(message));
  }

  return next(response); // Changed 'data' to 'response'
};
