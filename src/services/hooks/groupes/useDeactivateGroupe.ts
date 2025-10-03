import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateGroupe } from "@/services/controllers/groupe.controller";
import { toast } from "sonner";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour désactiver un groupe existant.
 * Gère l'appel à l'API et fournit des retours à l'utilisateur via des toasts.
 * Invalide la liste des groupes en cache et le groupe spécifique en cas de succès pour forcer un rafraîchissement.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useDeactivateGroupe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupeId: number) => deactivateGroupe(groupeId),
    onSuccess: (data, groupeId) => {
      toast.success("Groupe désactivé avec succès !");
      // Invalider la requête qui récupère la liste des groupes pour la mettre à jour
      queryClient.invalidateQueries({ queryKey: createQueryKey("groupes") });
      // Invalider la requête qui récupère le groupe spécifique pour la mettre à jour
      queryClient.invalidateQueries({
        queryKey: createQueryKey("detailedGroupe", groupeId),
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la désactivation du groupe", error);
      toast.error("Une erreur est survenue lors de la désactivation du groupe.");
    },
  });
};
