import { useQuery } from "@tanstack/react-query";
import { getMatieresByNiveau } from "@/services/controllers/matiere.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les matières associées à un niveau d'étude spécifique.
 * La requête est automatiquement désactivée si `niveauId` n'est pas fourni.
 *
 * @param {number} niveauId - L'ID du niveau pour lequel récupérer les matières.
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useMatieresByNiveau = (niveauId: number) => {
  return useQuery({
    queryKey: createQueryKey("matieres", niveauId),
    queryFn: () => getMatieresByNiveau(niveauId),
    enabled: !!niveauId, // La requête ne s'exécute que si niveauId est fourni.
  });
};
