import { useQuery } from "@tanstack/react-query";
import { getLevels } from "@/services/controllers/niveau.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les niveaux (classes).
 * Utilise TanStack Query pour gérer la mise en cache, le rechargement et les états de la requête.
 *
 * Caractéristiques :
 * - Récupère la liste des niveaux via l'API `getLevels`.
 * - Met en cache les résultats pour des performances optimales.
 * - Gère les états de chargement et d'erreur.
 * La requête est automatiquement désactivée si `niveauId` n'est pas fourni.
 *

 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useNiveau = () => {
  return useQuery({
    queryKey: createQueryKey("matieres"),
    queryFn: async () => getLevels(),
  });
};
