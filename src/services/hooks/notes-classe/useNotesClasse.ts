import { useQuery } from "@tanstack/react-query";
import { getNotesClasse } from "@/services/controllers/note.controller";
import { createQueryKey } from "@/lib/request";
import { NotesClasseFilters } from "@/services/controllers/types/common";

/**
 * Hook de requête pour récupérer les notes de classe de l'élève authentifié.
 * Supporte les filtres par matière, période et pagination.
 *
 * @param {NotesClasseFilters} filters - Filtres optionnels (matiere_id, date_debut, date_fin, page).
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useNotesClasse = (filters?: NotesClasseFilters) => {
  return useQuery({
    queryKey: createQueryKey("notes-classe", filters),
    queryFn: () => getNotesClasse(filters),
  });
};
