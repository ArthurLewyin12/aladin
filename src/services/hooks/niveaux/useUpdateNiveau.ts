import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLevel } from "@/services/controllers/niveau.controller";
import { createQueryKey } from "@/lib/request";
import { getMe } from "@/services/controllers/auth.controller";
import Cookies from "js-cookie";
import ENVIRONNEMENTS from "@/constants/environnement";
import { toast } from "@/lib/toast";

/**
 * Hook de mutation pour mettre à jour le niveau d'un élève.
 * Gère l'appel à l'API et fournit des retours à l'utilisateur via des toasts.
 * Invalide le cache de l'utilisateur et met à jour le cookie en cas de succès.
 *
 * Note : Un élève ne peut mettre à jour son niveau qu'une seule fois par année scolaire.
 *
 * @returns Le résultat de la mutation TanStack Query, incluant `mutate`, `isPending`, etc.
 */
export const useUpdateNiveau = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (niveauId: number) => {
      return updateLevel(niveauId);
    },
    onSuccess: async (data) => {
      toast({
        variant: "success",
        title: "Niveau mis à jour",
        message: data?.message || "Votre niveau a été mis à jour avec succès !",
      });

      // Récupérer les informations utilisateur mises à jour
      const response = await getMe();
      const updatedUser = response.user;

      console.log("Updated user after niveau update:", updatedUser);

      // Mettre à jour le cookie utilisateur
      Cookies.set(
        "user_" + ENVIRONNEMENTS.UNIVERSE,
        JSON.stringify(updatedUser),
      );

      // Mettre à jour le cache de l'utilisateur
      queryClient.setQueryData(createQueryKey("me"), updatedUser);

      // Invalider la liste des niveaux au cas où
      queryClient.invalidateQueries({ queryKey: createQueryKey("niveaux") });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la mise à jour du niveau", error);
      toast({
        variant: "error",
        title: "Erreur",
        message:
          error?.response?.data?.message ||
          "Une erreur est survenue lors de la mise à jour du niveau.",
      });
    },
  });
};
