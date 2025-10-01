import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/controllers/groupe.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les notifications d'invitation pour l'utilisateur authentifié.
 *
 * @returns Le résultat de la requête TanStack Query.
 */
export const useNotifications = () => {
  return useQuery({
    queryKey: createQueryKey("notifications"),
    queryFn: getNotifications,
  });
};
