import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ajouterEleveUtilisateur } from "@/services/controllers/repetiteur.controller";
import { AjouterEleveUtilisateurPayload } from "@/services/controllers/types/common/repetiteur.types";
import { createQueryKey } from "@/lib/request";
import { toast } from "@/lib/toast";

/**
 * Hook de mutation pour ajouter un élève utilisateur existant.
 *
 * @returns Le résultat de la mutation TanStack Query.
 */
export const useAjouterEleveUtilisateur = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AjouterEleveUtilisateurPayload) =>
      ajouterEleveUtilisateur(payload),
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

