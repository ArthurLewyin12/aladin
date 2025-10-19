import { useQuery } from "@tanstack/react-query";
import { getNoteClasseStats } from "@/services/controllers/note.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les statistiques des notes de classe de l'élève authentifié.
 * Inclut la moyenne générale, les moyennes par matière et l'évolution des notes.
 *
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useNoteClasseStats = () => {
  return useQuery({
    queryKey: createQueryKey("notes-classe-stats"),
    queryFn: getNoteClasseStats,
  });
};
