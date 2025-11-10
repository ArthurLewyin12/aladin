import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteUsersToGroupe } from "@/services/controllers/groupe.controller";
import { toast } from "@/lib/toast";
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
        data.errors.forEach((error) =>
          toast({
            variant: "error",
            message: error,
          })
        );
      } else {
        toast({
          variant: "success",
          message: data.message || "Invitation(s) envoyée(s) avec succès !",
        });
      }
      // Invalider la requête qui récupère la liste des groupes pour la mettre à jour
      queryClient.invalidateQueries({ queryKey: createQueryKey("groupes") });
      // Invalider la requête qui récupère le groupe spécifique pour la mettre à jour
      queryClient.invalidateQueries({
        queryKey: createQueryKey("groupes", variables.groupeId),
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de l'envoi des invitations", error);

      // Extraire le message d'erreur du backend - priorité aux messages spécifiques du tableau errors
      const errorMessage =
        (error?.response?.data?.errors && error.response.data.errors[0]) ||
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de l'envoi des invitations.";

      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
