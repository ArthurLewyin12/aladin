import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/services/controllers/notification.controller";
import { toast } from "@/lib/toast";

/**
 * Hook pour marquer une notification comme lue.
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalider les requêtes de notifications pour forcer un rafraîchissement
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["eleve-notifications"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Impossible de marquer la notification comme lue.";

      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
