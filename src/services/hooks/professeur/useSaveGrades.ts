import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { saveGrades } from "@/services/controllers/professeur.controller";
import { SaveGradesPayload, SaveGradesResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseSaveGradesParams {
  classeId: number;
  payload: SaveGradesPayload;
}

export const useSaveGrades = () => {
  const queryClient = useQueryClient();

  return useMutation<SaveGradesResponse, unknown, UseSaveGradesParams>({
    mutationFn: ({ classeId, payload }) => saveGrades(classeId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Notes sauvegardées avec succès !",
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
        "Une erreur est survenue lors de la sauvegarde des notes.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
