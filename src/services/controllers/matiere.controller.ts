import { request } from "@/lib/request";
import { MatiereEndpoints } from "@/constants/endpoints";
import { GetMatieresByNiveauResponse } from "./types/common";

export const getMatieresByNiveau = async (
  niveauId: number,
): Promise<GetMatieresByNiveauResponse> => {
  const endpoint = MatiereEndpoints.MATIERES_BY_NIVEAU.replace(
    "{niveau_id}",
    niveauId.toString(),
  );
  return request.get<GetMatieresByNiveauResponse>(endpoint);
};
