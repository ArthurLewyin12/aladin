import { useQuery } from "@tanstack/react-query";
import { getChapitresByMatiere } from "@/services/controllers/chapitre.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les chapitres associés à une matière spécifique.
 * La requête est automatiquement désactivée si `matiereId` n'est pas fourni.
 *
 * @param {number} matiereId - L'ID de la matière pour laquelle récupérer les chapitres.
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useChapitresByMatiere = (matiereId: number) => {
  return useQuery({
    queryKey: createQueryKey("chapitres", matiereId),
    queryFn: () => getChapitresByMatiere(matiereId),
    enabled: !!matiereId, // La requête ne s'exécute que si matiereId est fourni.
  });
};
