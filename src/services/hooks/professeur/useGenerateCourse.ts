import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateCourse } from "@/services/controllers/professeur.controller";
import { toast } from "@/lib/toast";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour générer un cours avec IA pour une classe.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useGenerateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classeId,
      payload,
    }: {
      classeId: number;
      payload: any;
    }) => generateCourse(classeId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Cours généré avec succès !",
      });
      // Invalider les détails de la classe pour recharger les cours
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", variables.classeId.toString()),
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la génération du cours", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la génération du cours.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
