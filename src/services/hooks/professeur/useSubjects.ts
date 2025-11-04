import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "@/services/controllers/professeur.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les matières enseignées par le professeur.
 *
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useSubjects = () => {
  return useQuery({
    queryKey: createQueryKey("professeur", "subjects"),
    queryFn: getSubjects,
  });
};
