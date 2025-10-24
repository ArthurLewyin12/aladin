import { useQuery } from "@tanstack/react-query";
import { getEleveResume } from "@/services/controllers/repetiteur.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer le résumé de l'élève sélectionné.
 *
 * @param enabled - Active ou désactive la requête (par défaut true)
 * @returns Le résultat de la requête TanStack Query.
 */
export const useEleveResume = (enabled: boolean = true) => {
  return useQuery({
    queryKey: createQueryKey("eleve-resume"),
    queryFn: getEleveResume,
    enabled,
  });
};

