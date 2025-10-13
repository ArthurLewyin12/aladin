import { AuditFields } from "@/constants/audit.types";
import { Chapitre } from "./chapitre.types";

export interface QuestionReponse {
  question: string;
  reponse: string;
}

export interface CoursData {
  text: string;
  questions: QuestionReponse[];
}

export interface UserCours {
  id: number;
  user_id: number;
  chapitre_id: number;
  data: CoursData;
  time: number;
  created_at: string;
  updated_at: string;
}

export interface GenerateCoursPayload {
  chapter_id: number;
  document_file?: File; // Optionnel: fichier pour génération basée sur document
}

export interface GenerateCoursSuccessResponse {
  cours_id: number;
  text: string;
  questions: QuestionReponse[];
  served: "existing" | "generated";
  document: boolean; // Indique si la génération est basée sur un document
  message?: string;
}

/**
 * Réponse d'erreur pour la génération de cours
 */
export interface GenerateCoursErrorResponse {
  error: string; // Message d'erreur
  detail?: string; // Détail technique (pour erreurs 500)
}

/**
 * Union type pour toutes les réponses possibles
 */
export type GenerateCoursResponse =
  | GenerateCoursSuccessResponse
  | GenerateCoursErrorResponse;

export type Course = {
  id: number;
  chapitre: Chapitre;
  text_preview: string;
  questions_count: number;
  time: number;
} & AuditFields;

export type Courses = {
  courses: Course[];
};
