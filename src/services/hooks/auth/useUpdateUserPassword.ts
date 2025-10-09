import { useMutation } from "@tanstack/react-query";
import { UpdateUserPassword } from "@/services/controllers/user.controller";
import { UpdateUserPasswordPayload } from "@/services/controllers/types/common/user.type";

/**
 * Hook de mutation pour gérer la mise à jour du password du user
 *
 * @returns Une mutation que vous pouvez déclencher avec `mutate(payload)`.
 */
export const useUpdateUserPassword = () => {
  return useMutation({
    mutationFn: async (payload: UpdateUserPasswordPayload) => {
      return UpdateUserPassword(payload);
    },
  });
};
