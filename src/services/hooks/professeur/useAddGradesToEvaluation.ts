import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { addGradesToEvaluation } from "@/services/controllers/professeur.controller";
import { AddGradesToEvaluationPayload, AddGradesToEvaluationResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseAddGradesToEvaluationParams {
  classeId: number;
  evaluationId: number;
  payload: AddGradesToEvaluationPayload;
}

export const useAddGradesToEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation<AddGradesToEvaluationResponse, unknown, UseAddGradesToEvaluationParams>({
    mutationFn: ({ classeId, evaluationId, payload }) =>
      addGradesToEvaluation(classeId, evaluationId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || `${data.total_notes} note(s) ajoutée(s) avec succès !`,
      });

      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", variables.classeId.toString(), "evaluations", variables.evaluationId.toString(), "notes"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de l'ajout des notes.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
