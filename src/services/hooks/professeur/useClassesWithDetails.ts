import { useQuery } from "@tanstack/react-query";
import { getClassesWithDetails } from "@/services/controllers/professeur.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer la liste de toutes les classes du professeur avec leurs détails (membres).
 * Utilise PromiseExecutor pour charger les détails de toutes les classes en parallèle.
 *
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 *          Les données retournées sont des classes avec leurs membres inclus.
 */
export const useClassesWithDetails = () => {
  return useQuery({
    queryKey: createQueryKey("professeur", "classes", "with-details"),
    queryFn: getClassesWithDetails,
  });
};

