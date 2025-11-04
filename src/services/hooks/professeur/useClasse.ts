import { useQuery } from "@tanstack/react-query";
import { getClasse } from "@/services/controllers/professeur.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les détails d'une classe spécifique.
 *
 * @param {number} classeId - ID de la classe.
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useClasse = (classeId: number) => {
  return useQuery({
    queryKey: createQueryKey("professeur", "classes", classeId.toString()),
    queryFn: () => getClasse(classeId),
    enabled: !!classeId,
  });
};
