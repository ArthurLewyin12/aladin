import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { deactivateQuiz } from "@/services/controllers/professeur.controller";
import { DeactivateQuizResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseDeactivateQuizParams {
  classeId: number;
  quizId: number;
}

export const useDeactivateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<DeactivateQuizResponse, unknown, UseDeactivateQuizParams>({
    mutationFn: ({ classeId, quizId }) => deactivateQuiz(classeId, quizId),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Quiz désactivé avec succès !",
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
        "Une erreur est survenue lors de la désactivation du quiz.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};

