import { NiveauEndpoints } from "@/constants/endpoints";
import { request } from "@/lib/request";
import { Niveau } from "./types/auth.types";

export const getLevels = async () => {
  return request.get<Niveau[]>(NiveauEndpoints.GET_ALL);
};

export const getLevelById = async (niveauId: number) => {
  const endpoint = NiveauEndpoints.GET_ONE.replace(
    "{niveau_id}",
    niveauId.toString(),
  );
  return request.get<Niveau>(endpoint);
};
