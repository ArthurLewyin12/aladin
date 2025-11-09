import { useQuery } from "@tanstack/react-query";
import { getEleveNotifications } from "@/services/controllers/notification.controller";
import { createQueryKey } from "@/lib/request";
import { GetNotificationsParams } from "@/services/controllers/types/common/notification.types";

/**
 * Hook pour récupérer les notifications d'un élève spécifique.
 * @param {number} eleveId - ID de l'élève.
 * @param {GetNotificationsParams} params - Paramètres de pagination et de filtrage.
 * @returns Query result avec les notifications de l'élève.
 */
export const useEleveNotifications = (
  eleveId: number,
  params?: GetNotificationsParams,
) => {
  return useQuery({
    queryKey: createQueryKey("eleve-notifications", eleveId, params),
    queryFn: () => getEleveNotifications(eleveId, params),
    enabled: !!eleveId, // Ne lance la requête que si eleveId est défini
    // Rafraîchir automatiquement toutes les 30 secondes
    refetchInterval: 30000,
  });
};
