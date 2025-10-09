import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/controllers/groupe.controller";
import { createQueryKey } from "@/lib/request";
import { useEffect, useRef } from "react";
import { toast } from "@/lib/toast";

/**
 * Hook de requête pour récupérer les notifications d'invitation pour l'utilisateur authentifié.
 * Affiche également un toast pour chaque nouvelle invitation reçue.
 *
 * @returns Le résultat de la requête TanStack Query.
 */
export const useNotifications = () => {
  const queryResult = useQuery({
    queryKey: createQueryKey("notifications"),
    queryFn: getNotifications,
    refetchInterval: 60000, // Récupérer les notifications toutes les minutes
  });

  const toastedIds = useRef(new Set<number>());

  useEffect(() => {
    const invitations = queryResult.data?.invitations || [];
    const pendingInvitations = invitations.filter(
      (inv) => inv.reponse === "en attente",
    );

    pendingInvitations.forEach((invitation) => {
      if (!toastedIds.current.has(invitation.id)) {
        toast({
          variant: "default",
          title: "Nouvelle invitation de groupe",
          message: `${invitation.user_envoie.prenom} vous invite à rejoindre ${invitation.groupe.nom}`,
          duration: 6000, // Laisser le temps de lire
        });
        toastedIds.current.add(invitation.id);
      }
    });

    // Nettoyer la ref des IDs qui ne sont plus dans la liste des invitations en attente
    const currentPendingIds = new Set(pendingInvitations.map((inv) => inv.id));
    toastedIds.current.forEach((id) => {
      if (!currentPendingIds.has(id)) {
        toastedIds.current.delete(id);
      }
    });
  }, [queryResult.data]);

  return queryResult;
};
