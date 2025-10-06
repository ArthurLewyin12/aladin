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

// Interface pour le payload de la requête (body de la POST request)
export interface SendPasswordResetLinkRequest {
  mail: string; // Email valide et existant dans la DB
}

// Interface pour le payload de réponse en cas de succès
interface SendPasswordResetLinkSuccessResponse {
  success: true;
  message: "Lien de réinitialisation envoyé par email.";
}

// Interface pour le payload de réponse en cas d'erreur d'envoi email (toujours success: true pour sécurité)
interface SendPasswordResetLinkErrorResponse {
  success: true;
  message: "Lien de réinitialisation généré (erreur d'envoi email).";
  reset_url: string; // URL complète du lien de reset
  error: string; // Détails de l'erreur (ex. exception message)
}

// Interface générique pour les réponses d'erreur de validation (422)
export interface SendPasswordResetLinkValidationErrorResponse {
  success: false;
  message: string; // Ex. "Les identifiants sont incorrects." ou erreur email
}

// Interface pour le payload de la requête (body de la POST request)
export interface ResetPasswordRequest {
  token: string; // Token brut du lien email
  mail: string; // Email valide et existant dans la DB
  password: string; // Nouveau mot de passe (min 8 chars, avec maj/min/chiffre/symbole)
  password_confirmation: string; // Confirmation du mot de passe (doit matcher)
}

// Interface pour le payload de réponse en cas de succès
export interface ResetPasswordSuccessResponse {
  success: true;
  message: "Réinitialisation du mot de passe réussie.";
}

// Interface pour le payload de réponse en cas d'erreur de token
export interface ResetPasswordTokenErrorResponse {
  success: false;
  message: "Token invalide ou expiré." | "Token expiré.";
}

// Interface pour le payload de réponse en cas d'utilisateur introuvable
export interface ResetPasswordUserErrorResponse {
  success: false;
  message: "Utilisateur introuvable.";
}

// Interface générique pour les réponses d'erreur de validation (422)
export interface ResetPasswordValidationErrorResponse {
  success: false;
  message: string; // Ex. erreurs sur password (trop faible) ou champs manquants
}

export type SendPasswordResetLinkResponse =
  | SendPasswordResetLinkSuccessResponse
  | SendPasswordResetLinkErrorResponse
  | SendPasswordResetLinkValidationErrorResponse;

export type ResetPasswordResponse =
  | ResetPasswordSuccessResponse
  | ResetPasswordTokenErrorResponse
  | ResetPasswordUserErrorResponse
  | ResetPasswordValidationErrorResponse;
