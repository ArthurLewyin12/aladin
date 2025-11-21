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

/**
 * Types pour la gestion des documents côté élève
 */
export type EleveDocument = {
  id: number;
  nom: string;
  nom_fichier: string;
  description?: string;
  file_type: "pdf" | "doc" | "docx" | "txt";
  file_size: number;
  mime_type: string;
  classe: {
    id: number;
    nom: string;
  };
  uploaded_by: {
    id: number;
    nom: string;
    prenom: string;
  };
  created_at: string;
  download_url: string;
};

export type GetEleveDocumentsResponse = {
  documents: EleveDocument[];
  count: number;
  classes: Array<{
    id: number;
    nom: string;
    description: string;
  }>;
};
