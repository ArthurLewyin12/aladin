import { useQuery } from "@tanstack/react-query";
import { getClasses } from "@/services/controllers/professeur.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer la liste de toutes les classes du professeur.
 *
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useClasses = () => {
  return useQuery({
    queryKey: createQueryKey("professeur", "classes"),
    queryFn: getClasses,
  });
};
