import axios from "axios";
import { createRequestMiddlewareChain } from "@/services/middlewares/services/request-middleware-chain.service";
import { requestHeaderMiddleware } from "@/services/middlewares/requests/request-header.middleware";
import { createResponseMiddlewareChain } from "@/services/middlewares/services/response-middlewae-chain.service";
import { errorHandlingMiddleware } from "@/services/middlewares/error-handling.middleware";
import { tokenMiddleware } from "@/services/middlewares/token-manager.middleware";
import ENVIRONNEMENTS from "@/constants/environnement";

// Configuration de base
const api = axios.create({
  baseURL: ENVIRONNEMENTS.API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Création des chaînes de middlewares
const requestMiddlewareChain = createRequestMiddlewareChain([
  requestHeaderMiddleware,
]);
const responseMiddlewareChain = createResponseMiddlewareChain([
  tokenMiddleware,
  errorHandlingMiddleware,
]);

// Application des middlewares
api.interceptors.request.use(requestMiddlewareChain, (error) =>
  Promise.reject(error),
);
api.interceptors.response.use(responseMiddlewareChain, (error) =>
  Promise.reject(error),
);

// Intercepteur simple pour les logs en développement
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

// Fonctions utilitaires simples
export const request = {
  get: async <T>(url: string): Promise<T> => {
    const response = await api.get<T>(url);
    return response.data;
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete<T>(url);
    return response.data;
  },

  postWithFile: async <T>(
    url: string,
    data: Record<string, any>,
    file: File,
  ): Promise<T> => {
    const formData = new FormData();

    // Ajoute le fichier
    formData.append("photo", file);

    // Ajoute les autres données
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        // Gérer les tableaux (ex: hobbies)
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

// Helper pour créer des clés de cache TanStack Query
export const createQueryKey = (...parts: (string | number)[]): string[] => {
  return parts.map((part) => String(part));
};
