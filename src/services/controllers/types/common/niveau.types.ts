import { AuditFields } from "@/constants/audit.types";
import { Matiere } from "./matiere.types";

export type Niveau = {
  id: number;
  libelle: string;
  matieres: Matiere[];
} & AuditFields;

export type GetMatieresByNiveauResponse = {
  niveau: Niveau;
  matieres: Matiere[];
};
