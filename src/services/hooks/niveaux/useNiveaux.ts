import { useQuery } from "@tanstack/react-query";
import { getLevels } from "@/services/controllers/niveau.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer tous les niveaux.
 *
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useNiveaux = () => {
  return useQuery({
    queryKey: createQueryKey("niveaux"),
    queryFn: async () => {
      const data = await getLevels();
      return { niveaux: data };
    },
  });
};
