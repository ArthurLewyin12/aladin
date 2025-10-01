import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quitGroupe } from "@/services/controllers/groupe.controller";
import { toast } from "sonner";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour quitter un groupe.
 * Gère l'appel à l'API et fournit des retours à l'utilisateur via des toasts.
 * Invalide la liste des groupes en cache et le groupe spécifique en cas de succès pour forcer un rafraîchissement.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useQuitGroupe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupeId: number) => quitGroupe(groupeId),
    onSuccess: (data, groupeId) => {
      toast.success(data.message || "Vous avez quitté le groupe avec succès !");
      // Invalider la requête qui récupère la liste des groupes pour la mettre à jour
      queryClient.invalidateQueries({ queryKey: createQueryKey("groupes") });
      // Invalider la requête qui récupère le groupe spécifique pour la mettre à jour
      queryClient.invalidateQueries({
        queryKey: createQueryKey("groupes", groupeId),
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la tentative de quitter le groupe", error);
      toast.error(
        "Une erreur est survenue lors de la tentative de quitter le groupe.",
      );
    },
  });
};
