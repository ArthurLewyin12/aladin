import { useMutation, useQueryClient } from "@tanstack/react-query";
import { definirNiveaux } from "@/services/controllers/repetiteur.controller";
import { DefinirNiveauxPayload } from "@/services/controllers/types/common/repetiteur.types";
import { createQueryKey } from "@/lib/request";
import { toast } from "@/lib/toast";

/**
 * Hook de mutation pour définir les niveaux d'enseignement du répétiteur.
 *
 * @returns Le résultat de la mutation TanStack Query.
 */
export const useDefinirNiveaux = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DefinirNiveauxPayload) => definirNiveaux(payload),
    onSuccess: (data) => {
      // Invalider les niveaux choisis pour forcer un refetch
      queryClient.invalidateQueries({
        queryKey: createQueryKey("niveaux-choisis"),
      });

      toast({
        variant: "success",
        title: "Succès",
        message: data.message || "Niveaux définis avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Erreur",
        message:
          error?.response?.data?.message ||
          "Erreur lors de la définition des niveaux",
      });
    },
  });
};

