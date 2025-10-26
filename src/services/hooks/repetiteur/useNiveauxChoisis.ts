import { useQuery } from "@tanstack/react-query";
import { getNiveauxChoisis } from "@/services/controllers/repetiteur.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les niveaux choisis par le répétiteur.
 *
 * @returns Le résultat de la requête TanStack Query.
 */
export const useNiveauxChoisis = () => {
  return useQuery({
    queryKey: createQueryKey("niveaux-choisis"),
    queryFn: getNiveauxChoisis,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

