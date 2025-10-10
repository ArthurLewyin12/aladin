import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getEleveStats } from "@/services/controllers/stats.controller";
import { createQueryKey } from "@/lib/request";
import { EleveStatsResponse } from "@/services/controllers/types/common/stats.type";

/**
 * Hook pour récupérer les statistiques d'évolution des notes et les meilleures matières d'un élève.
 * @param {number} eleveId - L'ID de l'élève pour lequel récupérer les statistiques.
 * @returns {UseQueryResult<EleveStatsResponse, Error>} Un objet de requête TanStack Query contenant les données, l'état de chargement, les erreurs, etc.
 */
export const useEleveStats = (
  eleveId: number,
): UseQueryResult<EleveStatsResponse, Error> => {
  return useQuery({
    queryKey: createQueryKey("eleveStats", eleveId),
    queryFn: () => getEleveStats(eleveId),
    enabled: !!eleveId, // Only run the query if eleveId is provided
  });
};
