import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { activateQuiz } from "@/services/controllers/professeur.controller";
import { ActivateQuizResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseActivateQuizParams {
  classeId: number;
  quizId: number;
}

export const useActivateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<ActivateQuizResponse, unknown, UseActivateQuizParams>({
    mutationFn: ({ classeId, quizId }) => activateQuiz(classeId, quizId),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Quiz activé avec succès !",
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
        "Une erreur est survenue lors de l'activation du quiz.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};

