import { useMutation, useQueryClient } from "@tanstack/react-query";
import { selectionnerEnfant } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";
import { toast } from "@/lib/toast";

/**
 * Hook de mutation pour sélectionner un enfant comme enfant actif.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useSelectionnerEnfant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: selectionnerEnfant,
    onSuccess: (data) => {
      toast({
        variant: "success",
        title: "Enfant sélectionné",
        message: data.message || "L'enfant a été sélectionné avec succès.",
      });
      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: createQueryKey("enfants") });
      queryClient.invalidateQueries({
        queryKey: createQueryKey("enfant-actif"),
      });
    },
    onError: (error: any) => {
      toast({
        variant: "error",
        title: "Erreur",
        message:
          error?.response?.data?.message ||
          "Une erreur est survenue lors de la sélection de l'enfant.",
      });
    },
  });
};
