import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptGroupInvitation } from "@/services/controllers/notification.controller";
import { AcceptGroupInvitationResponse } from "@/services/controllers/types/common/notification.types";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour accepter une invitation de groupe.
 * @returns Mutation pour accepter une invitation de groupe.
 */
export const useAcceptGroupInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: number) => acceptGroupInvitation(invitationId),
    onSuccess: () => {
      // Invalider le cache des notifications pour les rafraîchir
      queryClient.invalidateQueries({
        queryKey: createQueryKey("notifications"),
      });
    },
  });
};
