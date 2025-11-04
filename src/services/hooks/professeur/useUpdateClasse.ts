import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClasse } from "@/services/controllers/professeur.controller";
import { toast } from "@/lib/toast";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour mettre à jour une classe existante.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useUpdateClasse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classeId,
      payload,
    }: {
      classeId: number;
      payload: any;
    }) => updateClasse(classeId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Classe mise à jour avec succès !",
      });
      // Invalider la liste des classes et la classe spécifique
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes"),
      });
      // Invalider aussi la version avec détails
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", "with-details"),
      });
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", variables.classeId.toString()),
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la mise à jour de la classe", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la mise à jour de la classe.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
