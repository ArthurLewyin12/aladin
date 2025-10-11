import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";
import { getLevelById } from "@/services/controllers/niveau.controller";

/**
 * Hook de requête pour récupérer  un niveau d'étude spécifique.
 * La requête est automatiquement désactivée si `niveauId` n'est pas fourni.
 *
 * @param {number} niveauId - L'ID du niveau pour recuperer le niveau en particulier.
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useNiveauById = (niveauId: number) => {
  return useQuery({
    queryKey: createQueryKey("niveaux", niveauId),
    queryFn: () => getLevelById(niveauId),
    enabled: !!niveauId, // La requête ne s'exécute que si niveauId est fourni.
  });
};
