import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/controllers/auth.controller";
import { LoginPayload } from "@/services/controllers/types/auth.types";

/**
 * Hook de mutation pour gérer la connexion de l'utilisateur.
 * Encapsule l'appel à l'API de login dans une mutation TanStack Query.
 *
 * @returns Une mutation que vous pouvez déclencher avec `mutate(payload)`.
 *          Expose des états comme `isPending`, `isError`, `isSuccess`.
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      return login(payload);
    },
  });
};
