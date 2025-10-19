import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNoteClasse } from "@/services/controllers/note.controller";
import { toast } from "@/lib/toast";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour ajouter une nouvelle note de classe.
 * Gère l'appel à l'API et fournit des retours à l'utilisateur via des toasts.
 * Invalide le cache des notes et des statistiques en cas de succès pour forcer un rafraîchissement.
 * Déclenche automatiquement une notification au parent si son email correspond à un compte existant.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useAddNoteClasse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNoteClasse,
    onSuccess: (data) => {
      toast({
        variant: "success",
        message: data.message || "Note enregistrée avec succès !",
      });

      // Invalider les requêtes liées aux notes pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: createQueryKey("notes-classe"),
      });
      queryClient.invalidateQueries({
        queryKey: createQueryKey("notes-classe-stats"),
      });

      // Si le parent a été notifié, afficher un message
      if (data.data.notifie_parent) {
        toast({
          variant: "default",
          title: "Parent notifié",
          message: "Votre parent a été notifié par email.",
        });
      }
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout de la note", error);
      toast({
        variant: "error",
        message: "Une erreur est survenue lors de l'enregistrement de la note.",
      });
    },
  });
};
