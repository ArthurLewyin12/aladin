import { request } from "@/lib/request";
import { ChapitreEndpoints } from "@/constants/endpoints";
import { Chapitre } from "./types/common";

/**
 * Récupère la liste des chapitres pour une matière donnée.
 * @param {number} matiereId - L'ID de la matière.
 * @returns {Promise<Chapitre[]>} Une promesse résolue avec la liste des chapitres.
 */
export const getChapitresByMatiere = async (
  matiereId: number,
): Promise<Chapitre[]> => {
  const endpoint = ChapitreEndpoints.CHAPITRES_BY_MATIERE.replace(
    "{matiere_id}",
    matiereId.toString(),
  );
  return request.get<Chapitre[]>(endpoint);
};