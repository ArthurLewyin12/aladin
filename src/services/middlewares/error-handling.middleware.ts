import { toast } from "sonner";
import { ResponseMiddleware } from "./types/response.middleware";

export const errorHandlingMiddleware: ResponseMiddleware = (data, next) => {
  const response = data.response;
  if (!response) {
    return Promise.reject(data);
  }
  if (response.data) {
    const isError = response.data.error;
    if (isError) {
      const message = response.data.message;
      try {
        toast.error(message);
        throw new Error(message);
      } catch (error) {
        console.log(error);
      }
    }
    return Promise.reject(response.data.error);
  }

  return next(data);
};
