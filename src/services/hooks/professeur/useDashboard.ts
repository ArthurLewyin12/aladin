import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/services/controllers/professeur.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer les données du dashboard du professeur.
 * @returns {UseQueryResult} Données du dashboard avec statistiques.
 */
export const useDashboard = () => {
  return useQuery({
    queryKey: createQueryKey("professeur-dashboard"),
    queryFn: getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
