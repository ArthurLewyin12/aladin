import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/controllers/notification.controller";
import { createQueryKey } from "@/lib/request";
import { GetNotificationsParams } from "@/services/controllers/types/common/notification.types";

/**
 * Hook pour récupérer les notifications de l'utilisateur connecté.
 * @param {GetNotificationsParams} params - Paramètres de pagination et de filtrage.
 * @returns Query result avec les notifications.
 */
export const useNotifications = (params?: GetNotificationsParams) => {
  return useQuery({
    queryKey: createQueryKey("notifications", params),
    queryFn: () => getNotifications(params),
    // Rafraîchir automatiquement toutes les 30 secondes pour avoir les nouvelles notifications
    refetchInterval: 30000,
  });
};
