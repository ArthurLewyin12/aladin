import { useQuery } from "@tanstack/react-query";
import { getEnfantActif } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer l'enfant actuellement sélectionné.
 *
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useEnfantActif = () => {
  return useQuery({
    queryKey: createQueryKey("enfant-actif"),
    queryFn: getEnfantActif,
  });
};
