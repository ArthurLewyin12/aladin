import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { activateCourse } from "@/services/controllers/professeur.controller";
import { ActivateCourseResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseActivateCourseParams {
  classeId: number;
  coursId: number;
}

export const useActivateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<ActivateCourseResponse, unknown, UseActivateCourseParams>({
    mutationFn: ({ classeId, coursId }) => activateCourse(classeId, coursId),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Cours activé avec succès !",
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
        "Une erreur est survenue lors de l'activation du cours.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
