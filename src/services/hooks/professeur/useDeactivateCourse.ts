import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { deactivateCourse } from "@/services/controllers/professeur.controller";
import { DeactivateCourseResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseDeactivateCourseParams {
  classeId: number;
  coursId: number;
}

export const useDeactivateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<DeactivateCourseResponse, unknown, UseDeactivateCourseParams>({
    mutationFn: ({ classeId, coursId }) => deactivateCourse(classeId, coursId),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Cours désactivé avec succès !",
      });

      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", variables.classeId.toString()),
      });
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", "with-details"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la désactivation du cours.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
