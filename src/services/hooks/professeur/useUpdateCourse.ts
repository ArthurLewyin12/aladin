import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse } from "@/services/controllers/professeur.controller";
import { toast } from "@/lib/toast";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour mettre à jour un cours.
 *
 * @example
 * const { mutate: updateCourseMutation, isPending } = useUpdateCourse();
 *
 * updateCourseMutation(
 *   { classeId: 1, coursId: 123, payload: { titre: "Nouveau titre", content: {...} } },
 *   {
 *     onSuccess: () => {
 *       console.log("Cours mis à jour !");
 *     }
 *   }
 * );
 */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classeId,
      coursId,
      payload,
    }: {
      classeId: number;
      coursId: number;
      payload: Parameters<typeof updateCourse>[2];
    }) => updateCourse(classeId, coursId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Cours mis à jour avec succès !",
      });
      // Invalider les requêtes pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "cours"),
      });
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "cours", variables.coursId),
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la mise à jour du cours", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la mise à jour du cours.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
