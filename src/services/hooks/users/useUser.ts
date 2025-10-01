import { useMutation } from "@tanstack/react-query";
import {
  activateAccount,
  register,
} from "@/services/controllers/user.controller";
import {
  ActivationAccountDto,
  ActivateResponseDto,
  CreateUserDto,
  RegisterResponseDto,
} from "@/services/controllers/types/common/user.type";

/**
 * Hook de mutation pour gérer l'initation du process de création du compte user.
 * Encapsule l'appel à l'API de login dans une mutation TanStack Query.
 *
 * @returns Une mutation que vous pouvez déclencher avec `mutate(payload)`.
 *          Expose des états comme `isPending`, `isError`, `isSuccess`.
 */
export const useRegister = () => {
  return useMutation<RegisterResponseDto, Error, CreateUserDto>({
    mutationFn: async (payload: CreateUserDto) => {
      return register(payload);
    },
  });
};

export const useActivate = () => {
  return useMutation<ActivateResponseDto, Error, ActivationAccountDto>({
    mutationFn: async (payload: ActivationAccountDto) => {
      return activateAccount(payload);
    },
  });
};
