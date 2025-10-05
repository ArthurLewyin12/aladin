import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteUsersToGroupe } from "@/services/controllers/groupe.controller";
import { toast } from "sonner";
import { createQueryKey } from "@/lib/request";
import { InviteUsersToGroupePayload } from "@/services/controllers/types/common";

/**
 * Hook de mutation pour inviter des utilisateurs à un groupe.
 * Gère l'appel à l'API et fournit des retours à l'utilisateur via des toasts.
 * Invalide la liste des groupes en cache et le groupe spécifique en cas de succès pour forcer un rafraîchissement.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useInviteUsersToGroupe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      { groupeId, payload }: 
      { groupeId: number; payload: InviteUsersToGroupePayload }
    ) =>
      inviteUsersToGroupe(groupeId, payload),
    onSuccess: (data, variables) => {
      if (data.errors && data.errors.length > 0) {
        data.errors.forEach((error) => toast.error(error));
      } else {
        toast.success(data.message || "Invitation(s) envoyée(s) avec succès !");
      }
      // Invalider la requête qui récupère la liste des groupes pour la mettre à jour
      queryClient.invalidateQueries({ queryKey: createQueryKey("groupes") });
      // Invalider la requête qui récupère le groupe spécifique pour la mettre à jour
      queryClient.invalidateQueries({
        queryKey: createQueryKey("groupes", variables.groupeId),
      });
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi des invitations", error);
      toast.error("Une erreur est survenue lors de l'envoi des invitations.");
    },
  });
};
