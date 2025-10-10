import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getEleveDashboard } from "@/services/controllers/stats.controller";
import { createQueryKey } from "@/lib/request";
import { DashboardResponse } from "@/services/controllers/types/common/stats.type";

/**
 * Hook pour récupérer les données complètes du tableau de bord d'un élève, avec un filtre de période optionnel.
 * @param {number} eleveId - L'ID de l'élève pour lequel récupérer le tableau de bord.
 * @param {'week' | 'month' | 'quarter' | 'semester' | 'year'} [period='week'] - La période pour laquelle récupérer les données (par défaut : 'week').
 * @returns {UseQueryResult<DashboardResponse, Error>} Un objet de requête TanStack Query contenant les données, l'état de chargement, les erreurs, etc.
 */
export const useEleveDashboard = (
  eleveId: number,
  period: "week" | "month" | "quarter" | "semester" | "year" = "week",
): UseQueryResult<DashboardResponse, Error> => {
  return useQuery({
    queryKey: createQueryKey("eleveDashboard", eleveId, period),
    queryFn: () => getEleveDashboard(eleveId, period),
    enabled: !!eleveId, // Only run the query if eleveId is provided
  });
};
