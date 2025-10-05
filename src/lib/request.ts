import axios from "axios";
import { createRequestMiddlewareChain } from "@/services/middlewares/services/request-middleware-chain.service";
import { requestHeaderMiddleware } from "@/services/middlewares/requests/request-header.middleware";
import { createResponseMiddlewareChain } from "@/services/middlewares/services/response-middlewae-chain.service";
import { errorHandlingMiddleware } from "@/services/middlewares/error-handling.middleware";
import { tokenMiddleware } from "@/services/middlewares/token-manager.middleware";
import ENVIRONNEMENTS from "@/constants/environnement";

/**
 * Instance Axios pré-configurée pour tous les appels API de l'application.
 * Définit l'URL de base, un timeout et les en-têtes par défaut.
 */
const api = axios.create({
  baseURL: ENVIRONNEMENTS.API_URL || "",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: () => true, // Toujours résoudre la promesse pour gérer les erreurs dans les middlewares
});

/**
 * Chaîne de middlewares exécutée sur chaque requête sortante.
 * Utilise `requestHeaderMiddleware` pour ajouter le token d'authentification.
 */
const requestMiddlewareChain = createRequestMiddlewareChain([
  requestHeaderMiddleware,
]);

/**
 * Chaîne de middlewares exécutée sur chaque réponse entrante.
 * Utilise `tokenMiddleware` pour la gestion du token et `errorHandlingMiddleware` pour la gestion des erreurs.
 */
const responseMiddlewareChain = createResponseMiddlewareChain([
  tokenMiddleware,
  errorHandlingMiddleware,
]);

// Applique les chaînes de middlewares comme intercepteurs Axios.
api.interceptors.request.use(requestMiddlewareChain, (error) =>
  Promise.reject(error),
);
api.interceptors.response.use(responseMiddlewareChain, (error) =>
  Promise.reject(error),
);

/**
 * En environnement de développement, cet intercepteur loggue les informations
 * de base de chaque requête et réponse pour faciliter le débogage.
 */
if (process.env.NODE_ENV === "development") {
  api.interceptors.request.use((config) => {
    console.log(` ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      console.log(
        ` ${response.config.method?.toUpperCase()} ${response.config.url}`,
      );
      return response;
    },
    (error) => {
      console.error(
        ` ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.message,
      );
      return Promise.reject(error);
    },
  );
}

/**
 * Un objet wrapper autour d'Axios pour simplifier les appels HTTP courants.
 * Chaque méthode retourne directement la propriété `data` de la réponse Axios.
 */
export const request = {
  /**
   * Exécute une requête GET.
   * @template T Le type de données attendu dans la réponse.
   * @param {string} url L'URL de l'endpoint.
   * @returns {Promise<T>} Une promesse qui se résout avec les données de la réponse.
   */
  get: async <T>(url: string): Promise<T> => {
    const response = await api.get<T>(url);
    return response.data;
  },

  /**
   * Exécute une requête POST.
   * @template T Le type de données attendu dans la réponse.
   * @param {string} url L'URL de l'endpoint.
   * @param {unknown} [data] Le corps de la requête.
   * @returns {Promise<T>} Une promesse qui se résout avec les données de la réponse.
   */
  post: async <T>(
    url: string,
    data?: unknown,
    config?: import("axios").AxiosRequestConfig,
  ): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  /**
   * Exécute une requête PUT.
   * @template T Le type de données attendu dans la réponse.
   * @param {string} url L'URL de l'endpoint.
   * @param {unknown} [data] Le corps de la requête.
   * @returns {Promise<T>} Une promesse qui se résout avec les données de la réponse.
   */
  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  /**
   * Exécute une requête DELETE.
   * @template T Le type de données attendu dans la réponse.
   * @param {string} url L'URL de l'endpoint.
   * @returns {Promise<T>} Une promesse qui se résout avec les données de la réponse.
   */
  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete<T>(url);
    return response.data;
  },

  /**
   * Exécute une requête POST avec des données `multipart/form-data`, typiquement pour un upload de fichier.
   * @template T Le type de données attendu dans la réponse.
   * @param {string} url L'URL de l'endpoint.
   * @param {Record<string, any>} data Un objet contenant les paires clé-valeur à envoyer.
   * @param {File} file Le fichier à uploader.
   * @returns {Promise<T>} Une promesse qui se résout avec les données de la réponse.
   */
  postWithFile: async <T>(
    url: string,
    data: Record<string, any>,
    file: File,
  ): Promise<T> => {
    const formData = new FormData();

    formData.append("photo", file);

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    }

    const response = await api.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};

/**
 * Fonction utilitaire pour créer des clés de requête pour TanStack Query.
 * Convertit toutes les parties en chaînes de caractères.
 * @param {...(string | number)[]} parts Les segments qui composent la clé.
 * @returns {string[]} Un tableau de chaînes de caractères à utiliser comme clé de requête.
 */
export const createQueryKey = (...parts: (string | number)[]): string[] => {
  return parts.map((part) => String(part));
};
