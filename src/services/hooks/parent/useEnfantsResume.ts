import { useQuery } from "@tanstack/react-query";
import { getEnfantsResume } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer le résumé/statistiques de tous les enfants du parent.
 * @param enabled - Si false, la requête ne sera pas exécutée
 * @returns Les résumés de tous les enfants avec les états de chargement
 */
export const useEnfantsResume = (enabled: boolean = true) => {
  return useQuery({
    queryKey: createQueryKey("parent", "enfants", "resume"),
    queryFn: getEnfantsResume,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
