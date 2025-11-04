import { useMutation } from "@tanstack/react-query";
import { checkEleve } from "@/services/controllers/professeur.controller";

/**
 * Hook de mutation pour vérifier si un email correspond à un élève existant.
 * Utilisé avant d'ajouter un élève à une classe.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useCheckEleve = () => {
  return useMutation({
    mutationFn: (email: string) => checkEleve(email),
    onError: (error: any) => {
      console.error("Erreur lors de la vérification de l'élève", error);
    },
  });
};
