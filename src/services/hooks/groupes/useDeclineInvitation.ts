import { useMutation, useQueryClient } from "@tanstack/react-query";
import { declineInvitation } from "@/services/controllers/groupe.controller";
import { toast } from "@/lib/toast";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour décliner une invitation à un groupe.
 * Gère l'appel à l'API et fournit des retours à l'utilisateur via des toasts.
 * Invalide la liste des groupes en cache et le groupe spécifique en cas de succès pour forcer un rafraîchissement.
 *
 * @param options - Options optionnelles incluant un callback onSuccess
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useDeclineInvitation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: number) => declineInvitation(invitationId),
    onSuccess: (data) => {
      toast({ message: data.message || "Invitation déclinée avec succès !", variant: "success" });
      // Invalider la requête qui récupère la liste des groupes pour la mettre à jour
      queryClient.invalidateQueries({ queryKey: createQueryKey("groupes") });
      // Appeler le callback onSuccess si fourni
      options?.onSuccess?.();
      // Note: We don't have the groupeId here, so we can't invalidate a specific group query.
      // If the API returned the groupeId in the response, we could use it.
    },
    onError: (error) => {
      console.error("Erreur lors du déclin de l'invitation", error);
      toast({ message: "Une erreur est survenue lors du déclin de l'invitation.", variant: "error" });
    },
  });
};
