import { AuditFields } from "@/constants/audit.types";
import { Matiere } from "./matiere.types";

export type Chapitre = {
  id: number;
  libelle: string;
  niveau_id: number;
  matiere_id: number;
  matiere?: Matiere;
  fichier: string;
} & AuditFields;
