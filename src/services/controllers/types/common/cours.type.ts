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
  chapitre: Chapitre; // L'API renvoie l'objet chapitre complet, pas juste l'ID
  text?: string; // Le texte du cours directement (pas dans data)
  questions: QuestionReponse[]; // Les questions directement (pas dans data)
  time: number;
  created_at: string;
  updated_at: string;
  course_data?: CourseStructuredData; // Optionnel: nouveau format structuré
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

/**
 * Type pour un cours complet du professeur (avec contenu Lexical)
 */
export type ProfesseurCourse = {
  id: number;
  titre: string;
  classe_id: number;
  chapitre_id: number;
  professeur_id: number;
  classe?: {
    id: number;
    nom: string;
  };
  chapitre?: Chapitre;
  content?: {
    lexical_state: any;
    html: string;
    plain_text: string;
    metadata: {
      word_count: number;
      character_count: number;
      has_images: boolean;
      has_tables: boolean;
      has_videos: boolean;
      has_math: boolean;
      image_count: number;
      video_count: number;
      table_count: number;
    };
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Types pour le nouveau format structuré des cours générés
 */

export interface CourseExample {
  exemple?: string;
  [key: string]: string | undefined;
}

export interface CourseNotion {
  titre: string;
  explication: string;
  exemples?: {
    [key: string]: CourseExample | string;
  };
}

export interface CourseDeveloppement {
  [key: string]: CourseNotion;
}

export interface CourseStructuredData {
  "Titre de la lecon": string;
  "Titre de la leçon"?: string; // Support for version with accent
  Introduction: string;
  "developpement du cours": CourseDeveloppement;
  "Synthese ce qu'il faut retenir": string;
  illustrations?: {
    [key: string]: string;
  };
}

export interface GenerateCoursStructuredSuccessResponse {
  cours_id: number;
  questions: QuestionReponse[];
  served: "existing" | "generated";
  document: boolean;
  message?: string;
  illustrations_pending?: boolean;
  structured: boolean;
  course_data: CourseStructuredData;
}
