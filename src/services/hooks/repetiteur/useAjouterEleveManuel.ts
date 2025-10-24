import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ajouterEleveManuel } from "@/services/controllers/repetiteur.controller";
import { AjouterEleveManuelPayload } from "@/services/controllers/types/common/repetiteur.types";
import { createQueryKey } from "@/lib/request";
import { toast } from "@/lib/toast";

/**
 * Hook de mutation pour ajouter un élève manuellement.
 *
 * @returns Le résultat de la mutation TanStack Query.
 */
export const useAjouterEleveManuel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AjouterEleveManuelPayload) =>
      ajouterEleveManuel(payload),
    onSuccess: (data) => {
      // Invalider la liste des élèves pour la rafraîchir
      queryClient.invalidateQueries({
        queryKey: createQueryKey("eleves"),
      });

      toast({
        variant: "success",
        title: "Succès",
        message: data.message || "Élève ajouté avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Erreur",
        message:
          error?.response?.data?.message ||
          "Erreur lors de l'ajout de l'élève",
      });
    },
  });
};

