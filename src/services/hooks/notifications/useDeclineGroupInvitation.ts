import { useMutation, useQueryClient } from "@tanstack/react-query";
import { declineGroupInvitation } from "@/services/controllers/notification.controller";
import { DeclineGroupInvitationResponse } from "@/services/controllers/types/common/notification.types";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour refuser une invitation de groupe.
 * @returns Mutation pour refuser une invitation de groupe.
 */
export const useDeclineGroupInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: number) => declineGroupInvitation(invitationId),
    onSuccess: () => {
      // Invalider le cache des notifications pour les rafraîchir
      queryClient.invalidateQueries({
        queryKey: createQueryKey("notifications"),
      });
    },
  });
};
