import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudyPlan } from "@/services/controllers/study-plan.controller";
import { CreateStudyPlanPayload } from "@/services/controllers/types/common/study-plan.types";
import { toast } from "sonner";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour créer un nouveau créneau dans le planning.
 */
export const useCreateStudyPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStudyPlanPayload) => createStudyPlan(payload),
    onSuccess: (data) => {
      // L'API renvoie 201 en cas de succès
      if (data.success) {
        toast.success("Créneau ajouté au planning avec succès !");
        queryClient.invalidateQueries({
          queryKey: createQueryKey("study-plans"),
        });
      }
    },
    onError: (error: any) => {
      const responseData = error?.response?.data;

      // Gère l'erreur de conflit (422) renvoyée par l'API
      if (
        responseData &&
        responseData.success === false &&
        responseData.conflict
      ) {
        toast.error(responseData.message || "Conflit de planning détecté.", {
          description: responseData.suggestion,
        });
      } else {
        // Gère les autres erreurs
        const message =
          responseData?.message || error.message || "Une erreur est survenue.";
        toast.error("Erreur", {
          description: message,
        });
      }
    },
  });
};
