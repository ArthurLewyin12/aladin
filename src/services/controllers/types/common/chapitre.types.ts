import { AuditFields } from "@/constants/audit.types";

export type Chapitre = {
  id: number;
  libelle: string;
  niveau_id: number;
  matiere_id: number;
  fichier: string;
} & AuditFields;
