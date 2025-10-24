import { useQuery } from "@tanstack/react-query";
import { getEleveGroupes } from "@/services/controllers/repetiteur.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les groupes de l'élève sélectionné.
 *
 * @param enabled - Active ou désactive la requête (par défaut true)
 * @returns Le résultat de la requête TanStack Query.
 */
export const useEleveGroupes = (enabled: boolean = true) => {
  return useQuery({
    queryKey: createQueryKey("eleve-groupes"),
    queryFn: getEleveGroupes,
    enabled,
  });
};

