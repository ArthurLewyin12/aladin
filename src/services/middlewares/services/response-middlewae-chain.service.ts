import { ResponseMiddleware } from "../types/response.middleware";

export const createResponseMiddlewareChain = (
  middlewares: ResponseMiddleware[],
) => {
  return async (response: any) => {
    const executeMiddleware = async (
      index: number,
      currentResponse: any,
    ): Promise<any> => {
      // Si on a parcouru tous les middlewares, on retourne la réponse finale
      if (index >= middlewares.length) {
        return currentResponse;
      }

      // Définit la fonction next qui appelle le middleware suivant
      const next = async (modifiedResponse: any) => {
        return executeMiddleware(index + 1, modifiedResponse);
      };

      // Exécute le middleware courant
      return middlewares[index](currentResponse, next);
    };

    return executeMiddleware(0, response);
  };
};
