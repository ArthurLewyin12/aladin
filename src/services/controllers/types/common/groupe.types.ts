import { AuditFields } from "@/constants/audit.types";
import { AuthUser } from "./user.type";
import { QuizDefinition } from "./quiz.types";
import { Matiere } from "./matiere.types";
import { Niveau } from "./niveau.types";

export type Groupe = {
  id: number;
  nom: string;
  description: string;
  niveau_id: number;
  user_id: string; // JSON stringified array of user IDs
  chief_user: number;
} & AuditFields;

export type CreateGroupePayload = {
  nom: string;
  description: string;
  niveau_id: string;
};

export type CreateGroupeResponse = {
  message: string;
  groupe: Groupe;
};

export type GroupeWithDetails = {
  groupe: Groupe;
  utilisateurs: AuthUser[];
  niveau: Niveau;
  matieres: Matiere[];
  quizzes: QuizDefinition[];
  isChief: boolean;
  members_count: number;
};

export type GetGroupesResponse = GroupeWithDetails[];

export type GetGroupeResponse = Groupe;

export type UpdateGroupePayload = {
  nom: string;
  description: string;
};

export type UpdateGroupeResponse = {
  message: string;
  groupe: Groupe;
};

export type DeleteGroupeResponse = {
  message: string;
};

export type QuitGroupeResponse = {
  message: string;
};

export type InviteUsersToGroupePayload = {
  phone_numbers?: string[];
  invited_emails?: string[];
};

export type InviteUsersToGroupeResponse = {
  message: string;
  errors: string[]; // Assuming the API returns an array of errors if any
};

export type AcceptInvitationResponse = {
  message: string;
};

export type GetDetailedGroupeResponse = {
  groupe: Groupe;
  utilisateurs: AuthUser[]; // Using AuthUser for detailed user info
  quizzes: QuizDefinition[]; // Using QuizDefinition for quiz details
  matieres: Matiere[];
  difficultes: string[];
  quizzesPasses: number[];
};

export type DeclineInvitationResponse = {
  message: string;
};

export type Invitation = {
  id: number;
  id_user_envoie: number;
  id_user_invite: number;
  groupe_id: number;
  reponse: string; // e.g., "en attente", "acceptée", "déclinée"
  created_at: string;
  updated_at: string;
  groupe: Groupe;
  user_envoie: AuthUser;
};

export type GetNotificationsResponse = {
  invitations: Invitation[];
};
