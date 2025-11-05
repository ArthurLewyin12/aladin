import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { updateQuiz } from "@/services/controllers/professeur.controller";
import {
  UpdateQuizPayload,
  UpdateQuizResponse,
} from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseUpdateQuizParams {
  classeId: number;
  quizId: number;
  payload: UpdateQuizPayload;
}

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateQuizResponse, unknown, UseUpdateQuizParams>({
    mutationFn: ({ classeId, quizId, payload }) =>
      updateQuiz(classeId, quizId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Quiz mis à jour avec succès !",
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
        "Une erreur est survenue lors de la mise à jour du quiz.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};

