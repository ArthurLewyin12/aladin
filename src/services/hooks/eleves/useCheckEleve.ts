import { useMutation } from "@tanstack/react-query";
import { checkEleveByEmail } from "@/services/controllers/eleve.controller";

/**
 * Hook de mutation pour vérifier si un élève existe par son email.
 *
 * @returns Une mutation que vous pouvez déclencher avec `mutate(email)`.
 */
export const useCheckEleveByEmail = () => {
  return useMutation({
    mutationFn: (email: string) => checkEleveByEmail(email),
  });
};
