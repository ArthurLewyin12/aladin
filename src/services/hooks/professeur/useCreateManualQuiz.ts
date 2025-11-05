import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { createManualQuiz } from "@/services/controllers/professeur.controller";
import {
  CreateManualQuizPayload,
  CreateManualQuizResponse,
} from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseCreateManualQuizParams {
  classeId: number;
  payload: CreateManualQuizPayload;
}

export const useCreateManualQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateManualQuizResponse, unknown, UseCreateManualQuizParams>({
    mutationFn: ({ classeId, payload }) => createManualQuiz(classeId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Quiz manuel créé avec succès !",
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
        "Une erreur est survenue lors de la création du quiz.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
