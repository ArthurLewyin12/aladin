import { useMutation, useQueryClient } from "@tanstack/react-query";
import { associerAutomatiquement } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";
import { toast } from "@/lib/toast";

/**
 * Hook de mutation pour associer automatiquement les enfants.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useAssocierAutomatiquement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: associerAutomatiquement,
    onSuccess: (data) => {
      toast({
        variant: "success",
        title: "Association réussie",
        message:
          data.message ||
          `${data.enfants_associes} enfant(s) associé(s) automatiquement.`,
      });
      // Invalider les queries pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: createQueryKey("enfants") });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Erreur",
        message:
          error?.response?.data?.message ||
          "Une erreur est survenue lors de l'association automatique.",
      });
    },
  });
};
