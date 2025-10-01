import { useQuery } from "@tanstack/react-query";
import { getGroupes } from "@/services/controllers/groupe.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer la liste de tous les groupes.
 *
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useGroupes = () => {
  return useQuery({
    queryKey: createQueryKey("groupes"),
    queryFn: getGroupes,
  });
};
