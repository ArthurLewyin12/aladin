import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { updateAllGrades } from "@/services/controllers/professeur.controller";
import { UpdateAllGradesPayload, UpdateAllGradesResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseUpdateAllGradesParams {
  classeId: number;
  evaluationId: number;
  payload: UpdateAllGradesPayload;
}

export const useUpdateAllGrades = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateAllGradesResponse, unknown, UseUpdateAllGradesParams>({
    mutationFn: ({ classeId, evaluationId, payload }) =>
      updateAllGrades(classeId, evaluationId, payload),
    onSuccess: (data, variables) => {
      const message = data.total_errors > 0
        ? `${data.total_updated} note(s) mise(s) à jour. ${data.total_errors} erreur(s).`
        : `${data.total_updated} note(s) mise(s) à jour avec succès !`;

      toast({
        variant: data.total_errors > 0 ? "default" : "success",
        message,
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
        "Une erreur est survenue lors de la mise à jour des notes.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
