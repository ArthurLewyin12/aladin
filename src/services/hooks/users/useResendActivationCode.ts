import { useMutation } from "@tanstack/react-query";
import { resendActivationCode } from "@/services/controllers/user.controller";
import { ResendActivationCodeRequest } from "@/services/controllers/types/common/user.type";

/**
 * Hook de mutation pour gérer le renvoi du code d'activation.
 *
 * @returns Une mutation que vous pouvez déclencher avec `mutate(payload)`.
 */
export const useResendActivationCode = () => {
  return useMutation({
    mutationFn: async (payload: ResendActivationCodeRequest) => {
      return resendActivationCode(payload);
    },
  });
};