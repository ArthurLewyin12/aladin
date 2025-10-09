import { useMutation } from "@tanstack/react-query";
import { UpdateUserInfo } from "@/services/controllers/user.controller";
import { UpdateUserInfoPayload } from "@/services/controllers/types/common/user.type";

/**
 * Hook de mutation pour gérer la mise à jour des infos utilisateurs
 *
 * @returns Une mutation que vous pouvez déclencher avec `mutate(payload)`.
 */
export const useUpdateUserInfo = () => {
  return useMutation({
    mutationFn: async (payload: UpdateUserInfoPayload) => {
      return UpdateUserInfo(payload);
    },
  });
};
