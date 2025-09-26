import { request } from "@/lib/request";
import { ChapitreEndpoints } from "@/constants/endpoints";
import { Chapitre } from "./types/common";

export const getChapitresByMatiere = async (
  matiereId: number,
): Promise<Chapitre[]> => {
  const endpoint = ChapitreEndpoints.CHAPITRES_BY_MATIERE.replace(
    "{matiere_id}",
    matiereId.toString(),
  );
  return request.get<Chapitre[]>(endpoint);
};
