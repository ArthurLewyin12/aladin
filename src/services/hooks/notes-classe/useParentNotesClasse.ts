import { useQuery } from "@tanstack/react-query";
import { getParentNotesClasse } from "@/services/controllers/note.controller";
import { createQueryKey } from "@/lib/request";
import type { ParentNotesClasseFilters } from "@/services/controllers/types/common";

/**
 * Hook pour récupérer les notes de classe de tous les enfants du parent
 * @param filters - Filtres optionnels (eleve_id, matiere_id, date_debut, date_fin, page)
 * @returns Query result avec la liste paginée des notes des enfants
 */
export const useParentNotesClasse = (filters?: ParentNotesClasseFilters) => {
  return useQuery({
    queryKey: createQueryKey("parent-notes-classe", filters),
    queryFn: () => getParentNotesClasse(filters),
  });
};
