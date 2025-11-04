import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setSubjects } from "@/services/controllers/professeur.controller";
import { toast } from "@/lib/toast";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour définir les matières enseignées par le professeur.
 * Invalide le cache des matières en cas de succès.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useSetSubjects = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setSubjects,
    onSuccess: (data) => {
      toast({
        variant: "success",
        message: data.message || "Matières mises à jour avec succès !",
      });
      // Invalider la requête qui récupère les matières pour la mettre à jour
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "subjects"),
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la mise à jour des matières", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la mise à jour des matières.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
