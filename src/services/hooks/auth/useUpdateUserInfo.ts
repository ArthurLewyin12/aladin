import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserInfo } from "@/services/controllers/user.controller";
import { UpdateUserInfoPayload } from "@/services/controllers/types/common/user.type";
import { createQueryKey } from "@/lib/request";
import { getMe } from "@/services/controllers/auth.controller";
import Cookies from "js-cookie";
import ENVIRONNEMENTS from "@/constants/environnement";

/**
 * Hook de mutation pour gérer la mise à jour des infos utilisateurs
 *
 * @returns Une mutation que vous pouvez déclencher avec `mutate(payload)`.
 */
export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<UpdateUserInfoPayload>) => {
      return UpdateUserInfo(payload);
    },
    onSuccess: async () => {
      const response = await getMe();
      const updatedUser = response.user; // Extract the user object
      console.log("Updated user after info update:", updatedUser);
      Cookies.set(
        "user_" + ENVIRONNEMENTS.UNIVERSE,
        JSON.stringify(updatedUser),
      );
      queryClient.setQueryData(createQueryKey("me"), updatedUser);
    },
  });
};
