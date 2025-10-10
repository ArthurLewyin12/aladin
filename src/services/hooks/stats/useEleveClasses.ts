import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getEleveClasses } from "@/services/controllers/stats.controller";
import { createQueryKey } from "@/lib/request";
import { ClassesResponse } from "@/services/controllers/types/common/stats.type";

/**
 * Hook pour récupérer la liste des classes auxquelles un élève est inscrit.
 * @param {number} eleveId - L'ID de l'élève pour lequel récupérer les classes.
 * @returns {UseQueryResult<ClassesResponse, Error>} Un objet de requête TanStack Query contenant les données, l'état de chargement, les erreurs, etc.
 */
export const useEleveClasses = (
  eleveId: number,
): UseQueryResult<ClassesResponse, Error> => {
  return useQuery({
    queryKey: createQueryKey("eleveClasses", eleveId),
    queryFn: () => getEleveClasses(eleveId),
    enabled: !!eleveId, // Only run the query if eleveId is provided
  });
};
