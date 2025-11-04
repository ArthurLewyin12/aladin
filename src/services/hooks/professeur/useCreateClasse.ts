import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClasse } from "@/services/controllers/professeur.controller";
import { toast } from "@/lib/toast";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de mutation pour créer une nouvelle classe.
 * Gère l'appel à l'API et fournit des retours à l'utilisateur via des toasts.
 * Invalide la liste des classes en cache en cas de succès pour forcer un rafraîchissement.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useCreateClasse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClasse,
    onSuccess: (data) => {
      toast({
        variant: "success",
        message: data.message || "Classe créée avec succès !",
      });
      // Invalider la requête qui récupère la liste des classes pour la mettre à jour
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes"),
      });
      // Invalider aussi la version avec détails
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", "with-details"),
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la création de la classe", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la création de la classe.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
