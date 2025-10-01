import { useQuery } from "@tanstack/react-query";
import { getDetailedGroupe } from "@/services/controllers/groupe.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les détails détaillés d'un groupe spécifique par son ID.
 * La requête est automatiquement désactivée si `groupeId` n'est pas fourni.
 *
 * @param {number} groupeId - L'ID du groupe à récupérer.
 * @returns Le résultat de la requête TanStack Query.
 */
export const useDetailedGroupe = (groupeId: number) => {
  return useQuery({
    queryKey: createQueryKey("detailedGroupe", groupeId),
    queryFn: () => getDetailedGroupe(groupeId),
    enabled: !!groupeId, // La requête ne s'exécute que si groupeId est fourni.
  });
};
