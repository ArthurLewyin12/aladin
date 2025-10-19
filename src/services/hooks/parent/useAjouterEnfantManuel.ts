import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ajouterEnfantManuel } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";
import { toast } from "@/lib/toast";

/**
 * Hook de mutation pour ajouter un enfant manuellement.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useAjouterEnfantManuel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ajouterEnfantManuel,
    onSuccess: (data) => {
      toast({
        variant: "success",
        title: "Enfant ajouté",
        message: data.message || "L'enfant a été ajouté avec succès.",
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
          "Une erreur est survenue lors de l'ajout de l'enfant.",
      });
    },
  });
};
