import { useQuery } from "@tanstack/react-query";
import { getEnfants } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer tous les enfants du parent (utilisateurs + manuels).
 *
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useEnfants = () => {
  return useQuery({
    queryKey: createQueryKey("enfants"),
    queryFn: getEnfants,
  });
};
