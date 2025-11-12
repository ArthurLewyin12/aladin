import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { updateGrade } from "@/services/controllers/professeur.controller";
import { UpdateGradePayload, UpdateGradeResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseUpdateGradeParams {
  classeId: number;
  noteId: number;
  payload: UpdateGradePayload;
  evaluationId?: number; // Optionnel, pour invalider le cache approprié
}

export const useUpdateGrade = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateGradeResponse, unknown, UseUpdateGradeParams>({
    mutationFn: ({ classeId, noteId, payload }) =>
      updateGrade(classeId, noteId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Note mise à jour avec succès !",
      });

      // Invalider les queries pour rafraîchir les données
      if (variables.evaluationId) {
        queryClient.invalidateQueries({
          queryKey: createQueryKey("professeur", "classes", variables.classeId.toString(), "evaluations", variables.evaluationId.toString(), "notes"),
        });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la mise à jour de la note.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
