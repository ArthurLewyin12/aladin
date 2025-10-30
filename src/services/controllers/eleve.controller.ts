import { request } from "@/lib/request";
import { EleveEndpoints } from "@/constants/endpoints";
import { CheckEleveResponse } from "./types/common/eleve.types";

/**
 * Vérifie si un élève existe par son adresse email.
 * @param {string} email - L'email de l'élève à vérifier.
 * @returns {Promise<CheckEleveResponse>} Une promesse résolue avec le statut d'existence et les données de l'élève si trouvé.
 */
export const checkEleveByEmail = async (
  email: string,
): Promise<CheckEleveResponse> => {
  return request.get<CheckEleveResponse>(EleveEndpoints.CHECK_EMAIL, {
    params: { email },
  });
};
