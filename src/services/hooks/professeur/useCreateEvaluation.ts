import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { createEvaluation } from "@/services/controllers/professeur.controller";
import { CreateEvaluationPayload, CreateEvaluationResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseCreateEvaluationParams {
  classeId: number;
  payload: CreateEvaluationPayload;
}

export const useCreateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEvaluationResponse, unknown, UseCreateEvaluationParams>({
    mutationFn: ({ classeId, payload }) => createEvaluation(classeId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Évaluation créée avec succès !",
      });

      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", variables.classeId.toString(), "evaluations"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la création de l'évaluation.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
