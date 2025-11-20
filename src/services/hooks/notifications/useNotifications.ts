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
    queryFn: async () => {
      const data = await getNotifications(params);

      // Trier les notifications générales par date de création (plus récentes en premier)
      if (data?.notifications_generales?.data) {
        data.notifications_generales.data = data.notifications_generales.data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      // Trier les invitations de groupe par date de création (plus récentes en premier)
      if (data?.invitations_groupes) {
        data.invitations_groupes = data.invitations_groupes.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      return data;
    },
    // Rafraîchir automatiquement toutes les 10 secondes pour une meilleure réactivité
    refetchInterval: 10000,
    // Rafraîchir quand la fenêtre retrouve le focus
    refetchOnWindowFocus: true,
    // Rafraîchir quand on reconnecte internet
    refetchOnReconnect: true,
  });
};
