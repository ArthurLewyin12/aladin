import { UserStatus } from "@/constants/user-status";
import { AuditFields } from "@/constants/audit.types";

export type LoginPayload = {
  username: string;
  password: string;
};

export type User = {
  id: number;
  nom: string;
  prenom: string;
  statut: UserStatus;
  numero: string;
  mail: string;
  matiere_id: number | null;
  date_debut_abonnement: string;
  date_fin_abonnement: string;
  niveau_id: number;
  nombre_modification_niveau: number | null;
  preference: string | null;
  email_verified_at: string | null;
  code: string | null;
  is_active: boolean;
  tentatives: number;
} & AuditFields;

export type LoginResponse = {
  success: boolean;
  message: string;
  token: string;
  refresh_token: string;
  user: User;
};
