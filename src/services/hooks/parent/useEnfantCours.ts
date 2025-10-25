import { useQuery } from "@tanstack/react-query";
import { getEnfantCours } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer les cours créés pour l'enfant actif.
 * @returns Les cours de l'enfant avec les états de chargement
 */
export const useEnfantCours = () => {
  return useQuery({
    queryKey: createQueryKey("parent", "enfant", "cours"),
    queryFn: getEnfantCours,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
