import { useMutation } from "@tanstack/react-query";
import { getCsrfCookie, login } from "@/services/controllers/auth.controller";
import { LoginPayload } from "@/services/controllers/types/auth.types";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      //  await getCsrfCookie();
      return login(payload);
    },
  });
};
