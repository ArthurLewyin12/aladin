import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudyPlan } from "@/services/controllers/study-plan.controller";
import { toast } from "sonner";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour supprimer un créneau du planning.
 */
export const useDeleteStudyPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteStudyPlan(id),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Créneau supprimé avec succès !");
        queryClient.invalidateQueries({
          queryKey: createQueryKey("study-plans"),
        });
      } else {
        toast.error(data.message || "La suppression a échoué.");
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Une erreur est survenue.";
      toast.error("Erreur", {
        description: message,
      });
    },
  });
};
