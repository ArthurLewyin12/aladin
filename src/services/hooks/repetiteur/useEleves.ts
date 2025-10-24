import { useQuery } from "@tanstack/react-query";
import { getEleves } from "@/services/controllers/repetiteur.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer tous les élèves du répétiteur (utilisateurs + manuels).
 *
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useEleves = () => {
  return useQuery({
    queryKey: createQueryKey("eleves"),
    queryFn: getEleves,
  });
};

