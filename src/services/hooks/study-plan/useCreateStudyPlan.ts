import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudyPlan } from "@/services/controllers/study-plan.controller";
import { CreateStudyPlanPayload } from "@/services/controllers/types/common/study-plan.types";
import { toast } from "@/lib/toast";
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
        toast({ message: "Créneau ajouté au planning avec succès !", variant: "success" });
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
        toast({ message: `${responseData.message || "Conflit de planning détecté."} ${responseData.suggestion || ""}`, variant: "error" });
      } else {
        // Gère les autres erreurs
        const message =
          responseData?.message || error.message || "Une erreur est survenue.";
        toast({ message: `Erreur: ${message}`, variant: "error" });
      }
    },
  });
};
