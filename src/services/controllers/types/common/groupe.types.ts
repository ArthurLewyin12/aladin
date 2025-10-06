import { AuditFields } from "@/constants/audit.types";
import { AuthUser } from "./user.type";
import { QuizDefinition } from "./quiz.types";
import { Matiere } from "./matiere.types";
import { Niveau } from "./niveau.types";

export type Groupe = {
  id: number;
  nom: string;
  description: string;
  is_active: boolean;
  niveau_id: number;
  user_id: string;
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
  quizzes: GroupQuiz[];
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
  // phone_numbers?: string[];
  member_emails: string[];
  invitation_page_url: string; // URL de la page d'invitation
  register_page_url: string; // URL de la page d'inscription
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
  quizzes: GroupQuiz[]; // Using GroupQuiz for quiz details
  matieres: Matiere[];
  niveau: Niveau; // Ajout de la propriété manquante
  difficultes: string[];
  quizzesPasses: number[];
};

export type DeclineInvitationResponse = {
  message: string;
};

export type InvitationDetails = {
  id: number;
  status: "pending" | "accepted" | "declined";
  groupe: {
    nom: string;
  };
  invited_by: {
    prenom: string;
    nom: string;
  };
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

export type GroupQuiz = {
  id: number;
  titre: string;
  nombre_questions: number;
  temps: number;
  niveau_id: number;
  matiere_id: number;
  chapitre_id: number;
  difficulte: string;
  groupe_id: number;
  is_active: boolean;
  parent_id: number | null;
  classe_id: number | null;
  trimestre: string | null;
  created_at: string;
  updated_at: string;
  submission_count: number;
  submissions: { user_id: number }[];
};

export type CreateGroupQuizPayload = {
  group_id: number;
  chapter_id: number;
  difficulty: string;
  title: string;
  nombre_questions: number;
  temps: number;
};

export type CreateGroupQuizResponse = {
  quiz: GroupQuiz;
  questions: any[];
  questions_approfondissement: any[];
  message: string;
};

// Pas de payload pour la requête (GET, pas de body)
export type GetAllQuizNotesRequest = Record<string, never>; // Vide, ou query params optionnels si ajoutés plus tard

// Interface pour le payload de réponse en cas de succès
export interface GetAllQuizNotesSuccessResponse {
  notes: Array<{
    id: number;
    user_id: number;
    quiz_id: number;
    note: number; // Score (ex. 15.5/20)
    created_at: string; // ISO date
    user: {
      id: number;
      nom: string;
      prenom: string;
    };
  }>; // Trié par created_at desc
  corrections: Array<{
    id?: number;
    question: string; // Texte nettoyé (LaTeX -> MathJax)
    reponses: Array<{
      texte: string; // Options nettoyées
      // Autres champs possibles (ex. correct: boolean)
    }>;
    // Autres champs question (ex. type, explication)
  }>;
  questions_approfondissement: Array<{
    // Structure similaire à corrections, pour questions ouvertes
    question: string;
    // ...
  }>;
}

// Interface pour le payload de réponse en cas d'erreur d'autorisation
export interface GetAllQuizNotesAuthErrorResponse {
  error: "Seul le chef du groupe peut voir toutes les notes.";
}

// Interface pour le payload de réponse en cas de quiz introuvable
export interface GetAllQuizNotesNotFoundResponse {
  error: "Quiz introuvable.";
}

// Interface générique pour les réponses d'erreur (ex. 403/404)
export interface GetAllQuizNotesErrorResponse {
  error: string; // Message d'erreur générique
}
