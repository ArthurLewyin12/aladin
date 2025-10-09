import { toast } from "@/lib/toast";
import { ResponseMiddleware } from "./types/response.middleware";
import { refreshToken } from "../controllers/auth.controller";
import Cookies from "js-cookie";
import ENVIRONNEMENTS from "@/constants/environnement";
import { request } from "@/lib/request";

let isRefreshing = false;
let failedQueue: any[] = [];

/**
 * Traite la file d'attente des requêtes qui ont échoué pendant le rafraîchissement du token.
 * Pour chaque requête en attente, elle la rejette avec l'erreur ou la résout avec le nouveau token.
 *
 * @param {any} error - L'erreur survenue lors du rafraîchissement du token, ou null si réussie.
 * @param {string | null} [token=null] - Le nouveau token d'accès si le rafraîchissement a réussi.
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
export const errorHandlingMiddleware: ResponseMiddleware = async (
  response,
  next,
) => {
  if (!response) {
    // Cas d'une erreur réseau où le serveur n'a pas répondu
    if (typeof window !== "undefined") {
      toast({
        variant: "error",
        title: "Erreur réseau",
        message: "Le serveur ne répond pas ou est indisponible.",
      });
    }
    return Promise.reject(new Error("Erreur réseau ou serveur indisponible."));
  }

  const originalRequest = response.config;

  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          return request.get(originalRequest.url!);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    isRefreshing = true;
    const refresh_token = Cookies.get(
      "refreshToken_" + ENVIRONNEMENTS.UNIVERSE,
    );
    if (!refresh_token) {
      isRefreshing = false;
      // Gérer la déconnexion de l'utilisateur ici si nécessaire
      return Promise.reject(new Error("Session expirée."));
    }

    try {
      const refreshResponse = await refreshToken(refresh_token);
      if (refreshResponse.succes) {
        processQueue(null, refreshResponse.token);
        return request.get(originalRequest.url!); // Relancer la requête originale
      } else {
        throw new Error(refreshResponse.message);
      }
    } catch (error: any) {
      processQueue(error, null);
      // Gérer la déconnexion de l'utilisateur ici
      Cookies.remove("token_" + ENVIRONNEMENTS.UNIVERSE);
      Cookies.remove("refreshToken_" + ENVIRONNEMENTS.UNIVERSE);
      window.location.href = "/login"; // Redirection vers la page de login
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }

  // Si le statut est une erreur (ex: 4xx, 5xx)
  if (response.status >= 400) {
    // Si le backend renvoie des erreurs structurées (message, errors)
    if (response.data) {
      const message =
        response.data.message ||
        `Erreur ${response.status}: ${response.statusText}`;
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
      toast({
        variant: "error",
        title: `Erreur ${response.status}`,
        message: response.statusText,
      });
    }
    return Promise.reject(new Error(genericMessage));
  }

  // Pour les réponses de succès (2xx)
  return next(response);
};
