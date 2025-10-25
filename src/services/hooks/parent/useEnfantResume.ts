import { useQuery } from "@tanstack/react-query";
import { getEnfantResume } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer le résumé/statistiques de l'enfant actif.
 * @returns Le résumé de l'enfant avec les états de chargement
 */
export const useEnfantResume = () => {
  return useQuery({
    queryKey: createQueryKey("parent", "enfant", "resume"),
    queryFn: getEnfantResume,
    staleTime: 1000 * 60 * 2, // 2 minutes (refresh plus fréquent pour les stats)
  });
};
