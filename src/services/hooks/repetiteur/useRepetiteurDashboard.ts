import { useQuery } from "@tanstack/react-query";
import { getRepetiteurDashboard } from "@/services/controllers/repetiteur.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer le dashboard du répétiteur.
 *
 * @param repetiteurId - L'ID du répétiteur
 * @returns Le résultat de la requête TanStack Query.
 */
export const useRepetiteurDashboard = (repetiteurId: number) => {
  return useQuery({
    queryKey: createQueryKey("repetiteur-dashboard", repetiteurId),
    queryFn: () => getRepetiteurDashboard(repetiteurId),
    enabled: !!repetiteurId,
  });
};

