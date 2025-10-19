import { useQuery } from "@tanstack/react-query";
import { getParentNotesClasse } from "@/services/controllers/note.controller";
import { createQueryKey } from "@/lib/request";
import { ParentNotesClasseFilters } from "@/services/controllers/types/common";

/**
 * Hook de requête pour récupérer les notes de classe de tous les enfants du parent authentifié.
 * Supporte les filtres par enfant, matière, période et pagination.
 *
 * @param {ParentNotesClasseFilters} filters - Filtres optionnels (eleve_id, matiere_id, date_debut, date_fin, page).
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useParentNotesClasse = (filters?: ParentNotesClasseFilters) => {
  return useQuery({
    queryKey: createQueryKey("parent-notes-classe", filters),
    queryFn: () => getParentNotesClasse(filters),
  });
};
