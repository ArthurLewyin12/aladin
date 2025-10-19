import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNoteClasse } from "@/services/controllers/note.controller";
import { toast } from "@/lib/toast";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour modifier une note de classe existante.
 * Gère l'appel à l'API et fournit des retours à l'utilisateur via des toasts.
 * Invalide le cache des notes et des statistiques en cas de succès pour forcer un rafraîchissement.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useUpdateNoteClasse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, payload }: { noteId: number; payload: any }) =>
      updateNoteClasse(noteId, payload),
    onSuccess: (data) => {
      toast({
        variant: "success",
        message: data.message || "Note modifiée avec succès !",
      });

      // Invalider les requêtes liées aux notes pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: createQueryKey("notes-classe"),
      });
      queryClient.invalidateQueries({
        queryKey: createQueryKey("note-classe", data.data.id),
      });
      queryClient.invalidateQueries({
        queryKey: createQueryKey("notes-classe-stats"),
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la modification de la note", error);
      toast({
        variant: "error",
        message: "Une erreur est survenue lors de la modification de la note.",
      });
    },
  });
};
