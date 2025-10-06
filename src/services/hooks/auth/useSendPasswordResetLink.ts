import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetLink } from "@/services/controllers/auth.controller";
import {
  SendPasswordResetLinkRequest,
  SendPasswordResetLinkResponse,
} from "@/services/controllers/types/auth.types";

/**
 * Hook de mutation pour gérer l'envoi du lien de réinitialisation de mot de passe.
 *
 * @returns Une mutation que vous pouvez déclencher avec `mutate(payload)`.
 */
export const useSendPasswordResetLink = () => {
  return useMutation<
    SendPasswordResetLinkResponse,
    Error,
    SendPasswordResetLinkRequest
  >({
    mutationFn: async (payload: SendPasswordResetLinkRequest) => {
      return sendPasswordResetLink(payload);
    },
  });
};
