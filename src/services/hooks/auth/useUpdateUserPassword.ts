import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserPassword } from "@/services/controllers/user.controller";
import { UpdateUserPasswordPayload } from "@/services/controllers/types/common/user.type";
import { createQueryKey } from "@/lib/request";
import { getMe } from "@/services/controllers/auth.controller";
import Cookies from "js-cookie";
import ENVIRONNEMENTS from "@/constants/environnement";

/**
 * Hook de mutation pour gérer la mise à jour du password du user
 *
 * @returns Une mutation que vous pouvez déclencher avec `mutate(payload)`.
 */
export const useUpdateUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserPasswordPayload) => {
      return UpdateUserPassword(payload);
    },
    onSuccess: async () => {
      const response = await getMe();
      const updatedUser = response.user; // Extract the user object
      console.log("Updated user after password update:", updatedUser);
      Cookies.set(
        "user_" + ENVIRONNEMENTS.UNIVERSE,
        JSON.stringify(updatedUser),
      );
      queryClient.setQueryData(createQueryKey("me"), updatedUser);
    },
  });
};
