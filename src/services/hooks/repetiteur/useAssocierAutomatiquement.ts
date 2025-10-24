import { useMutation, useQueryClient } from "@tanstack/react-query";
import { associerAutomatiquement } from "@/services/controllers/repetiteur.controller";
import { createQueryKey } from "@/lib/request";
import { toast } from "@/lib/toast";

/**
 * Hook de mutation pour associer automatiquement les élèves.
 *
 * @returns Le résultat de la mutation TanStack Query.
 */
export const useAssocierAutomatiquement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => associerAutomatiquement(),
    onSuccess: (data) => {
      // Invalider la liste des élèves pour la rafraîchir
      queryClient.invalidateQueries({
        queryKey: createQueryKey("eleves"),
      });

      toast({
        variant: "success",
        title: "Succès",
        message:
          data.message ||
          `${data.eleves_associes} élève(s) associé(s) automatiquement`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Erreur",
        message:
          error?.response?.data?.message ||
          "Erreur lors de l'association automatique",
      });
    },
  });
};

