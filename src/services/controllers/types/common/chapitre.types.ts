import { AuditFields } from "@/constants/audit.types";
import { Matiere } from "./matiere.types";
import { Niveau } from "./niveau.types";

export type Chapitre = {
  id: number;
  libelle: string;
  niveau_id: number;
  matiere_id: number;
  matiere?: Matiere;
  niveau?: Niveau;
  fichier: string;
} & AuditFields;
