export interface EleveInfo {
  nom: string;
  prenom: string;
  email: string;
  niveau_id: number;
  numero: string;
  parent_mail: string;
  parent_numero: string;
  type: "utilisateur";
  user_id: number;
}

export type CheckEleveExistsResponse = {
  exists: true;
  eleve: EleveInfo;
};

export type CheckEleveNotExistsResponse = {
  exists: false;
};

export type CheckEleveResponse =
  | CheckEleveExistsResponse
  | CheckEleveNotExistsResponse;
