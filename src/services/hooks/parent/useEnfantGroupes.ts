import { useQuery } from "@tanstack/react-query";
import { getEnfantGroupes } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer les groupes créés pour l'enfant actif.
 * @param enabled - Si false, la requête ne sera pas exécutée
 * @returns Les groupes de l'enfant avec les états de chargement
 */
export const useEnfantGroupes = (enabled: boolean = true) => {
  return useQuery({
    queryKey: createQueryKey("parent", "enfant", "groupes"),
    queryFn: getEnfantGroupes,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
