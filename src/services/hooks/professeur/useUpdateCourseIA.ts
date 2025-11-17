import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourseIA } from "@/services/controllers/professeur.controller";
import { UpdateCourseIAPayload } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";
import { toast } from "@/lib/toast";

interface UpdateCourseIAParams {
  courseId: number;
  classeId: number;
  payload: UpdateCourseIAPayload;
}

/**
 * Hook pour mettre à jour un cours IA (structuré)
 */
export const useUpdateCourseIA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, classeId, payload }: UpdateCourseIAParams) =>
      updateCourseIA(classeId, courseId, payload),
    onSuccess: (_, variables) => {
      // Invalider les caches pertinents
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "cours", variables.courseId),
      });
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "courses"),
      });
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classe", variables.classeId),
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la mise à jour du cours IA:", error);
      toast({
        variant: "error",
        message:
          error.message || "Une erreur est survenue lors de la mise à jour.",
      });
    },
  });
};
