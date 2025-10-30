import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudyPlan } from "@/services/controllers/study-plan.controller";
import { UpdateStudyPlanPayload } from "@/services/controllers/types/common/study-plan.types";
import { toast } from "sonner";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour mettre à jour un créneau dans le planning.
 */
export const useUpdateStudyPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: { id: number; payload: UpdateStudyPlanPayload }) =>
      updateStudyPlan({ id, payload }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Créneau mis à jour avec succès !");
        queryClient.invalidateQueries({
          queryKey: createQueryKey("study-plans"),
        });
      }
    },
    onError: (error: any) => {
      const responseData = error?.response?.data;
      if (responseData && responseData.success === false && responseData.conflict) {
        toast.error(responseData.message || "Conflit de planning détecté.", {
          description: responseData.suggestion,
        });
      } else {
        const message =
          responseData?.message ||
          error.message ||
          "Une erreur est survenue.";
        toast.error("Erreur", {
          description: message,
        });
      }
    },
  });
};
