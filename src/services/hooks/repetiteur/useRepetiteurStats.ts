import { useQuery } from "@tanstack/react-query";
import { getRepetiteurStats } from "@/services/controllers/repetiteur.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les statistiques du répétiteur.
 *
 * @param repetiteurId - L'ID du répétiteur
 * @returns Le résultat de la requête TanStack Query.
 */
export const useRepetiteurStats = (repetiteurId: number) => {
  return useQuery({
    queryKey: createQueryKey("repetiteur-stats", repetiteurId),
    queryFn: () => getRepetiteurStats(repetiteurId),
    enabled: !!repetiteurId,
  });
};

