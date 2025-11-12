import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { updateEvaluation } from "@/services/controllers/professeur.controller";
import { UpdateEvaluationPayload, UpdateEvaluationResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseUpdateEvaluationParams {
  classeId: number;
  evaluationId: number;
  payload: UpdateEvaluationPayload;
}

export const useUpdateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateEvaluationResponse, unknown, UseUpdateEvaluationParams>({
    mutationFn: ({ classeId, evaluationId, payload }) =>
      updateEvaluation(classeId, evaluationId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Évaluation mise à jour avec succès !",
      });

      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", variables.classeId.toString(), "evaluations"),
      });
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", variables.classeId.toString(), "evaluations", variables.evaluationId.toString(), "notes"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la mise à jour de l'évaluation.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
