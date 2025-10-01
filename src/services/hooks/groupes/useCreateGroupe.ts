import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupe } from "@/services/controllers/groupe.controller";
import { toast } from "sonner";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour créer un nouveau groupe.
 * Gère l'appel à l'API et fournit des retours à l'utilisateur via des toasts.
 * Invalide la liste des groupes en cache en cas de succès pour forcer un rafraîchissement.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useCreateGroupe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroupe,
    onSuccess: (data) => {
      toast.success(data.message || "Groupe créé avec succès !");
      // Invalider la requête qui récupère la liste des groupes pour la mettre à jour
      queryClient.invalidateQueries({ queryKey: createQueryKey("groupes") });
    },
    onError: (error) => {
      console.error("Erreur lors de la création du groupe", error);
      toast.error("Une erreur est survenue lors de la création du groupe.");
    },
  });
};
