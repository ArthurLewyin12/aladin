import { AuditFields } from "@/constants/audit.types";

export type Matiere = {
  id: number;
  libelle: string;
  niveau_id: number;
} & AuditFields;
