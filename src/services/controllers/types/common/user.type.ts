import type { AuditFields } from "@/constants/audit.types";
import { UserStatus } from "@/constants/user-status";

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  date_debut_abonnement: string | null;
  date_fin_abonnement: string | null;
  is_active: false;
} & AuditFields;

export type CreateUserDto = {
  nom: string;
  prenom: string;
  statut: UserStatus.ELEVE;
  niveau_id: number;
  numero: string;
  parent_numero: string;
  parent_mail: string;
  mail: string;
  password: string;
};

export type ActivationAccountDto = {
  mail: string;
  code: string;
};

export type AuthUser = {
  id: number;
  nom: string;
  prenom: string;
  statut: UserStatus;
  numero: string;
  mail: string;
  parent_mail: string;
  parent_numero: string;
  date_debut_abonnement: string | null;
  date_fin_abonnement: string | null;
  niveau_id: number;
  matiere_id: number | null;
  preference: string | null;
  is_active: boolean;
  tentatives: number;
  code: string;
  updated_at: string;
  created_at: string;
};

export type RegisterResponseDto = {
  success: boolean;
  message: string;
  token: string;
  refresh_token: string;
  user: AuthUser;
};

export type ActivateResponseDto = {
  success: boolean;
  message: string;
};

// Interface pour le payload de la requête (body de la POST request)
export interface ResendActivationCodeRequest {
  mail: string; // Email valide et existant dans la DB (compte non vérifié)
}

// Interface pour le payload de réponse en cas de succès
export interface ResendActivationCodeSuccessResponse {
  success: true;
  message: "Code d'activation envoyé.";
}

// Interface pour le payload de réponse en cas de compte déjà vérifié
export interface ResendActivationCodeAlreadyVerifiedResponse {
  success: false;
  message: "Ce compte est déjà vérifié.";
}

// Interface pour le payload de réponse en cas de trop de demandes
export interface ResendActivationCodeRateLimitResponse {
  success: false;
  message: "Trop de demandes. Réessayez dans X secondes."; // X est dynamique (ex. '30')
}

// Interface générique pour les réponses d'erreur de validation (422)
export interface ResendActivationCodeValidationErrorResponse {
  success: false;
  message: string; // Ex. email invalide ou inexistant
}
