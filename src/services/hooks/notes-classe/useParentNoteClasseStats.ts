import { useQuery } from "@tanstack/react-query";
import { getParentNoteClasseStats } from "@/services/controllers/note.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer les statistiques des notes de classe de tous les enfants du parent
 * @returns Query result avec les statistiques (moyennes, évolution, etc.)
 */
export const useParentNoteClasseStats = () => {
  return useQuery({
    queryKey: createQueryKey("parent-note-classe-stats"),
    queryFn: getParentNoteClasseStats,
  });
};
