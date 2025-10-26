import { useQuery } from "@tanstack/react-query";
import { getEnfantResume } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer le résumé/statistiques de l'enfant actif.
 * @param enabled - Si false, la requête ne sera pas exécutée
 * @returns Le résumé de l'enfant avec les états de chargement
 */
export const useEnfantResume = (enabled: boolean = true) => {
  return useQuery({
    queryKey: createQueryKey("parent", "enfant", "resume"),
    queryFn: getEnfantResume,
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes (refresh plus fréquent pour les stats)
  });
};
