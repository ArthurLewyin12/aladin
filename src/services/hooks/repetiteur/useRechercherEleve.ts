import { useMutation } from "@tanstack/react-query";
import { rechercherEleve } from "@/services/controllers/repetiteur.controller";
import { RechercherElevePayload } from "@/services/controllers/types/common/repetiteur.types";

/**
 * Hook de mutation pour rechercher un élève existant par email ou numéro.
 *
 * @returns Le résultat de la mutation TanStack Query.
 */
export const useRechercherEleve = () => {
  return useMutation({
    mutationFn: (payload: RechercherElevePayload) => rechercherEleve(payload),
  });
};

