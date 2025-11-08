import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";
import { getChapitresByMatiere } from "@/services/controllers/chapitre.controller";

/**
 * Hook pour récupérer les chapitres d'une matière.
 *
 * @param {number | null} matiereId - ID de la matière.
 * @returns Le résultat de la requête TanStack Query.
 *
 * @example
 * const { data: chapitres, isLoading } = useChapitres(12);
 */
export const useChapitres = (matiereId: number | null) => {
  return useQuery({
    queryKey: createQueryKey("chapitres", "matiere", matiereId),
    queryFn: () => getChapitresByMatiere(matiereId!),
    enabled: matiereId !== null,
  });
};
