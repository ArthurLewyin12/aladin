import { useMutation, useQueryClient } from "@tanstack/react-query";
import { retirerEnfant } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";
import { toast } from "@/lib/toast";

/**
 * Hook de mutation pour retirer un enfant de la liste.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useRetirerEnfant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: retirerEnfant,
    onSuccess: (data) => {
      toast({
        variant: "success",
        title: "Enfant retiré",
        message: data.message || "L'enfant a été retiré avec succès.",
      });
      // Invalider les queries pour rafraîchir la liste
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
          "Une erreur est survenue lors du retrait de l'enfant.",
      });
    },
  });
};
