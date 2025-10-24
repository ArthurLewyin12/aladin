import { useQuery } from "@tanstack/react-query";
import { getEleveQuiz } from "@/services/controllers/repetiteur.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les quiz de l'élève sélectionné.
 *
 * @param enabled - Active ou désactive la requête (par défaut true)
 * @returns Le résultat de la requête TanStack Query.
 */
export const useEleveQuiz = (enabled: boolean = true) => {
  return useQuery({
    queryKey: createQueryKey("eleve-quiz"),
    queryFn: getEleveQuiz,
    enabled,
  });
};

