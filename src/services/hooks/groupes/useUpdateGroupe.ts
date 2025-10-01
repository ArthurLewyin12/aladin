import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGroupe } from "@/services/controllers/groupe.controller";
import { toast } from "sonner";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour mettre à jour un groupe existant.
 * Gère l'appel à l'API et fournit des retours à l'utilisateur via des toasts.
 * Invalide la liste des groupes en cache et le groupe spécifique en cas de succès pour forcer un rafraîchissement.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useUpdateGroupe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupeId, payload }: { groupeId: number; payload: any }) =>
      updateGroupe(groupeId, payload),
    onSuccess: (data, variables) => {
      toast.success(data.message || "Groupe mis à jour avec succès !");
      // Invalider la requête qui récupère la liste des groupes pour la mettre à jour
      queryClient.invalidateQueries({ queryKey: createQueryKey("groupes") });
      // Invalider la requête qui récupère le groupe spécifique pour la mettre à jour
      queryClient.invalidateQueries({
        queryKey: createQueryKey("groupes", variables.groupeId),
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du groupe", error);
      toast.error("Une erreur est survenue lors de la mise à jour du groupe.");
    },
  });
};
