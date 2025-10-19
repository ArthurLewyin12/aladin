import { useQuery } from "@tanstack/react-query";
import { getParentEnfantNotes } from "@/services/controllers/note.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer les notes d'un enfant spécifique
 * @param enfantId - L'ID de l'enfant
 * @returns Query result avec les notes de l'enfant
 */
export const useParentEnfantNotes = (enfantId: number) => {
  return useQuery({
    queryKey: createQueryKey("parent-enfant-notes", enfantId),
    queryFn: () => getParentEnfantNotes(enfantId),
    enabled: !!enfantId,
  });
};
