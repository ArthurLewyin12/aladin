import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/controllers/auth.controller";
import {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/services/controllers/types/auth.types";

/**
 * Hook de mutation pour gérer la réinitialisation du mot de passe.
 *
 * @returns Une mutation que vous pouvez déclencher avec `mutate(payload)`.
 */
export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: async (payload: ResetPasswordRequest) => {
      return resetPassword(payload);
    },
  });
};
