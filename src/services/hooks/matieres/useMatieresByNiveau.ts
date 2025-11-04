import { useQuery } from "@tanstack/react-query";
import { getMatieresByNiveau } from "@/services/controllers/matiere.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les matières d'un niveau spécifique.
 *
 * @param {number | null} niveauId - ID du niveau.
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useMatieresByNiveau = (niveauId: number | null) => {
  return useQuery({
    queryKey: createQueryKey("matieres", "niveau", niveauId?.toString() || ""),
    queryFn: () => getMatieresByNiveau(niveauId!),
    enabled: !!niveauId,
  });
};
