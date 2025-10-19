import { useQuery } from "@tanstack/react-query";
import { getNoteClasse } from "@/services/controllers/note.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer une note de classe spécifique par son ID.
 * La requête est automatiquement désactivée si `noteId` n'est pas fourni.
 *
 * @param {number | undefined} noteId - L'ID de la note à récupérer.
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useNoteClasse = (noteId?: number) => {
  return useQuery({
    queryKey: noteId
      ? createQueryKey("note-classe", noteId)
      : ["note-classe"],
    queryFn: () => getNoteClasse(noteId!),
    enabled: !!noteId, // La requête ne s'exécute que si noteId est fourni
  });
};
