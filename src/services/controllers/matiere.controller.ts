import { request } from "@/lib/request";
import { MatiereEndpoints } from "@/constants/endpoints";
import { GetMatieresByNiveauResponse } from "./types/common";

/**
 * Récupère la liste des matières pour un niveau d'étude donné.
 * @param {number} niveauId - L'ID du niveau.
 * @returns {Promise<GetMatieresByNiveauResponse>} Une promesse résolue avec la liste des matières.
 */
export const getMatieresByNiveau = async (
  niveauId: number,
): Promise<GetMatieresByNiveauResponse> => {
  const endpoint = MatiereEndpoints.MATIERES_BY_NIVEAU.replace(
    "{niveau_id}",
    niveauId.toString(),
  );
  return request.get<GetMatieresByNiveauResponse>(endpoint);
};