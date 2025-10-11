import { NiveauEndpoints } from "@/constants/endpoints";
import { request } from "@/lib/request";
import { Niveau } from "./types/auth.types";

/**
 * endpoint relatif à la récupération de tous les niveaux
 * @returns un tableau de niveaux
 */
export const getLevels = async () => {
  return request.get<Niveau[]>(NiveauEndpoints.GET_ALL);
};

/**
 * endpoint relatif à la récupération d'un niveau par son id
 * @param niveauId
 * @returns
 */
export const getLevelById = async (niveauId: number) => {
  const endpoint = NiveauEndpoints.GET_ONE.replace(
    "{niveau_id}",
    niveauId.toString(),
  );
  return request.get<Niveau>(endpoint);
};

/**
 * endpoint relatif à la mise à jour du niveau d'un utilisateur
 * Nb : il ne peut mettre à jour son niveau qu'une seule fois au cours de l'année scolaire
 * après son inscription on lui permet de mettre à jour son niveau
 * @param niveauId
 * @returns une promesse de mise à jour du niveau
 */
export const updateLevel = async (niveauId: number) => {
  return request.put<{ message: string }>(NiveauEndpoints.UPDATE, {
    niveau_id: niveauId,
  });
};
