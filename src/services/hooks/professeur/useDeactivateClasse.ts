import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateClasse } from "@/services/controllers/professeur.controller";
import { toast } from "@/lib/toast";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour désactiver une classe.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useDeactivateClasse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classeId: number) => deactivateClasse(classeId),
    onSuccess: (data, classeId) => {
      toast({
        variant: "success",
        message: data.message || "Classe désactivée avec succès !",
      });
      // Invalider la liste des classes et la classe spécifique
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes"),
      });
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", classeId.toString()),
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la désactivation de la classe", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la désactivation de la classe.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
