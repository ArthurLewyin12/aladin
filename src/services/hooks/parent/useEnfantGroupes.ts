import { useQuery } from "@tanstack/react-query";
import { getEnfantGroupes } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer les groupes créés pour l'enfant actif.
 * @returns Les groupes de l'enfant avec les états de chargement
 */
export const useEnfantGroupes = () => {
  return useQuery({
    queryKey: createQueryKey("parent", "enfant", "groupes"),
    queryFn: getEnfantGroupes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
