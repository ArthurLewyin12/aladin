import { useQuery } from "@tanstack/react-query";
import { getEnfantCours } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer les cours créés pour l'enfant actif.
 * @param enabled - Si false, la requête ne sera pas exécutée
 * @returns Les cours de l'enfant avec les états de chargement
 */
export const useEnfantCours = (enabled: boolean = true) => {
  return useQuery({
    queryKey: createQueryKey("parent", "enfant", "cours"),
    queryFn: getEnfantCours,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
