import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMember } from "@/services/controllers/professeur.controller";
import { toast } from "@/lib/toast";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour ajouter un élève à une classe.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useAddMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classeId,
      payload,
    }: {
      classeId: number;
      payload: any;
    }) => addMember(classeId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Élève ajouté avec succès !",
      });
      // Invalider les détails de la classe pour recharger les membres
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", variables.classeId.toString()),
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de l'ajout de l'élève", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Une erreur est survenue lors de l'ajout de l'élève.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
