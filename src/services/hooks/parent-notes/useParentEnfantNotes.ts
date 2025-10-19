import { useQuery } from "@tanstack/react-query";
import { getParentEnfantNotes } from "@/services/controllers/note.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer les notes d'un enfant spécifique.
 * La requête est automatiquement désactivée si `enfantId` n'est pas fourni.
 *
 * @param {number | undefined} enfantId - L'ID de l'enfant dont on veut récupérer les notes.
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useParentEnfantNotes = (enfantId?: number) => {
  return useQuery({
    queryKey: enfantId
      ? createQueryKey("parent-enfant-notes", enfantId)
      : ["parent-enfant-notes"],
    queryFn: () => getParentEnfantNotes(enfantId!),
    enabled: !!enfantId, // La requête ne s'exécute que si enfantId est fourni
  });
};
