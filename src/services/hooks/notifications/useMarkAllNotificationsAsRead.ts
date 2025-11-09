import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsAsRead } from "@/services/controllers/notification.controller";
import { toast } from "@/lib/toast";

/**
 * Hook pour marquer toutes les notifications comme lues.
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: (data) => {
      // Invalider les requêtes de notifications pour forcer un rafraîchissement
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["eleve-notifications"] });

      toast({
        variant: "success",
        message: data.message || "Toutes les notifications ont été marquées comme lues.",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Impossible de marquer toutes les notifications comme lues.";

      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
