import { useMutation, useQueryClient } from "@tanstack/react-query";
import { selectionnerEleve } from "@/services/controllers/repetiteur.controller";
import { SelectionnerElevePayload } from "@/services/controllers/types/common/repetiteur.types";
import { createQueryKey } from "@/lib/request";
import { toast } from "@/lib/toast";

/**
 * Hook de mutation pour sélectionner un élève actif.
 *
 * @returns Le résultat de la mutation TanStack Query.
 */
export const useSelectionnerEleve = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SelectionnerElevePayload) =>
      selectionnerEleve(payload),
    onSuccess: async (data) => {
      // Invalider ET refetch la liste des élèves pour mettre à jour l'élève actif
      await queryClient.refetchQueries({
        queryKey: createQueryKey("eleves"),
      });

      // Invalider toutes les queries liées aux contenus de l'élève
      await queryClient.invalidateQueries({
        queryKey: createQueryKey("eleve-cours"),
      });
      await queryClient.invalidateQueries({
        queryKey: createQueryKey("eleve-quiz"),
      });
      await queryClient.invalidateQueries({
        queryKey: createQueryKey("eleve-resume"),
      });
      await queryClient.invalidateQueries({
        queryKey: createQueryKey("eleve-groupes"),
      });

      toast({
        variant: "success",
        title: "Succès",
        message: data.message || "Élève sélectionné avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Erreur",
        message:
          error?.response?.data?.message ||
          "Erreur lors de la sélection de l'élève",
      });
    },
  });
};
