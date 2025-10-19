import { useQuery } from "@tanstack/react-query";
import { getParentEnfants } from "@/services/controllers/note.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer la liste des enfants du parent authentifié.
 * Utile pour afficher les filtres par enfant dans l'interface des notes.
 *
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useParentEnfantsNotes = () => {
  return useQuery({
    queryKey: createQueryKey("parent-enfants-notes"),
    queryFn: getParentEnfants,
  });
};
