import { AuditFields } from "@/constants/audit.types";

// Represents the Quiz model from the backend (the definition of a quiz)
export type QuizDefinition = {
  id: number;
  titre: string;
  nombre_questions: number;
  temps: number | null;
  niveau_id: number;
  matiere_id: number;
  chapitre_id: number;
  difficulte: string;
  groupe_id: number | null;
  parent_id: number | null;
  classe_id: number | null;
  trimestre: string | null;
} & AuditFields;

export type UserQuizInstance = {
  id: number;
  user_id: number;
  chapitre_id: number;
  difficulte: string;
  data: string;
  time: string | null;
} & AuditFields;

export type ReponseQuiz = {
  quiz_id: number;
  data: Record<string, any>[];
} & AuditFields;

export type QuizHistory = UserQuizInstance[];

export type QuizNotes = {
  score: number;
  total: number;
};

export type QuizStartPayload = {
  matiere_id: number;
  niveau_id: number;
  chapitre_id: number;
  difficulte: string;
};

export type QuizSubmitPayload = {
  quiz_id: number;
  answers: Record<string, any>[];
};
