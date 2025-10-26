import { useQuery } from "@tanstack/react-query";
import { getEnfantQuiz } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer les quiz créés pour l'enfant actif.
 * @param enabled - Si false, la requête ne sera pas exécutée
 * @returns Les quiz de l'enfant avec les états de chargement
 */
export const useEnfantQuiz = (enabled: boolean = true) => {
  return useQuery({
    queryKey: createQueryKey("parent", "enfant", "quiz"),
    queryFn: getEnfantQuiz,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
