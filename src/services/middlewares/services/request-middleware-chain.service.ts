import { RequestMiddleware } from "../types/request.middleware";

export const createRequestMiddlewareChain = (
  middlewares: RequestMiddleware[],
) => {
  return async (config: any) => {
    const executeMiddleware = async (
      index: number,
      currentConfig: any,
    ): Promise<any> => {
      if (index >= middlewares.length) {
        return currentConfig;
      }

      const next = async (modifiedConfig: any) => {
        return executeMiddleware(index + 1, modifiedConfig);
      };

      return middlewares[index](currentConfig, next);
    };

    return executeMiddleware(0, config);
  };
};
