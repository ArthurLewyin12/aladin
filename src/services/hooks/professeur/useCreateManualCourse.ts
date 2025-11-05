import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { createManualCourse } from "@/services/controllers/professeur.controller";
import {
  CreateManualCoursePayload,
  CreateManualCourseResponse,
} from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseCreateManualCourseParams {
  classeId: number;
  payload: CreateManualCoursePayload;
}

export const useCreateManualCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateManualCourseResponse,
    unknown,
    UseCreateManualCourseParams
  >({
    mutationFn: ({ classeId, payload }) => createManualCourse(classeId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Cours créé avec succès !",
      });

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
        "Une erreur est survenue lors de la création du cours.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
