import { useQuery } from "@tanstack/react-query";
import { getParentNoteClasseStats } from "@/services/controllers/note.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les statistiques des notes de tous les enfants du parent authentifié.
 * Inclut les statistiques par enfant et la moyenne générale de tous les enfants.
 *
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useParentNoteClasseStats = () => {
  return useQuery({
    queryKey: createQueryKey("parent-notes-classe-stats"),
    queryFn: getParentNoteClasseStats,
  });
};
