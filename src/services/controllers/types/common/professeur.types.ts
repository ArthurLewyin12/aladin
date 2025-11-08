import { AuditFields } from "@/constants/audit.types";
import { Matiere } from "./matiere.types";
import { Niveau } from "./niveau.types";
import { AuthUser } from "./user.type";
import { QuizDefinition } from "./quiz.types";
import { Course } from "./cours.type";

/**
 * Types pour les matières enseignées
 */
export type MatiereEnseignee = {
  id: number;
  libelle: string;
  niveau_id: number;
  niveau: Niveau;
};

export type GetSubjectsResponse = {
  matieres: MatiereEnseignee[];
  libelles?: number[]; // IDs des matières enseignées (nouveau format backend)
  count: number;
  max: number;
};

export type SetSubjectsPayload = {
  matieres: string[];
};

export type SetSubjectsResponse = {
  message: string;
  matieres: MatiereEnseignee[];
};

export type MatiereGeneric = {
  id: number;
  libelle: string;
};

export type GetSubjectsGenericResponse = {
  matieres: MatiereGeneric[];
  count: number;
};

/**
 * Types pour les classes
 */
export type Classe = {
  id: number;
  nom: string;
  description: string;
  professeur_id: number;
  niveau_id: number;
  matiere_ids: number[];
  is_active: boolean;
} & AuditFields;

export type ClasseMember = {
  id: number;
  eleve_id: number;
  classe_id: number;
  is_active: boolean;
  eleve: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    numero?: string;
    parent_mail?: string;
    parent_numero?: string;
    niveau_id?: number;
    type: "utilisateur" | "manuel";
    user_id?: number;
    is_active?: boolean;
  };
};

export type GetClassesResponse = Classe[];

export type CreateClassePayload = {
  nom: string;
  description?: string;
  niveau_id: number;
  matiere_ids: number[];
};

export type CreateClasseResponse = {
  message: string;
  classe: Classe;
};

// Type pour la réponse brute de l'API (structure réelle)
export type GetClasseRawResponse = {
  classe: Classe;
  niveau?: {
    id: number;
    libelle: string;
    created_at?: string;
    updated_at?: string;
  };
  matieres?: Array<{
    id: number;
    libelle: string;
    niveau_id?: number;
  }>;
  eleves?: Array<{
    id: number;
    eleve_id: number;
    classe_id: number;
    is_active: boolean;
    eleve: {
      id: number;
      nom: string;
      prenom: string;
      email: string;
      numero?: string;
      parent_mail?: string;
      parent_numero?: string;
      niveau_id?: number;
      type: "utilisateur" | "manuel";
      user_id?: number;
      is_active?: boolean;
    };
  }>;
  quizzes?: ClasseQuiz[];
};

// Type pour la réponse normalisée (format attendu par les composants)
export type GetClasseResponse = Classe & {
  members: ClasseMember[];
  niveau?: Niveau;
  quizzes?: ClasseQuiz[];
  matieres?: Matiere[];
};

export type UpdateClassePayload = {
  nom?: string;
  description?: string;
  niveau_id?: number;
  matiere_ids?: number[];
};

export type UpdateClasseResponse = {
  message: string;
  classe: Classe;
};

export type DeactivateClasseResponse = {
  message: string;
};

export type ReactivateClasseResponse = {
  message: string;
};

/**
 * Types pour la gestion des élèves
 */
export type CheckEleveResponse = {
  exists: boolean;
  eleve?: {
    nom: string;
    prenom: string;
    email: string;
    niveau_id: number;
    niveau: Niveau;
    numero?: string;
    parent_mail?: string;
    parent_numero?: string;
    type: "utilisateur" | "manuel";
    user_id?: number;
    is_active?: boolean;
  };
};

export type AddMemberPayload = {
  email: string;
  nom?: string;
  prenom?: string;
  niveau_id?: number;
  numero?: string;
  parent_mail?: string;
  parent_numero?: string;
};

export type AddMemberResponse = {
  message: string;
  eleve: ClasseMember;
};

export type DeactivateMemberResponse = {
  message: string;
};

export type ReactivateMemberResponse = {
  message: string;
};

/**
 * Types pour les quiz de classe
 */
export type ClasseQuiz = {
  id: number;
  titre: string;
  difficulte: string;
  temps: number;
  matiere_id: number;
  chapitres_ids: number[];
  classe_id: number;
  is_active: boolean;
  type?: "manual" | "ai"; // Type du quiz: manuel ou généré par IA
  data?: {
    qcm: Array<{
      question: string;
      reponses: Array<{
        texte: string;
        correct: boolean;
      }>;
    }>;
    questions_approfondissement: Array<{
      question: string;
      reponse: string;
    }>;
  };
  created_at: string;
  updated_at?: string;
};

export type CreateManualQuizPayload = {
  titre: string;
  difficulte: string;
  temps: number;
  matiere_id: number;
  chapitres_ids: number[];
  data: {
    qcm: Array<{
      question: string;
      reponses: Array<{
        texte: string;
        correct: boolean;
      }>;
    }>;
    questions_approfondissement: Array<{
      question: string;
      reponse: string;
    }>;
  };
};

export type CreateManualQuizResponse = {
  message: string;
  quiz: QuizDefinition & { classe_id: number };
};

export type GenerateQuizPayload = {
  chapter_id: number;
  difficulty: string;
  title: string;
  nombre_questions: number;
  temps: number;
  document_file?: File;
};

export type GenerateQuizResponse = {
  message: string;
  quiz: QuizDefinition & { classe_id: number };
};

export type UpdateQuizPayload = {
  titre?: string;
  data?: {
    qcm: Array<{
      question: string;
      reponses: Array<{
        texte: string;
        correct: boolean;
      }>;
    }>;
    questions_approfondissement: Array<{
      question: string;
      reponse: string;
    }>;
  };
  temps?: number;
};

export type UpdateQuizResponse = {
  message: string;
  quiz: QuizDefinition;
};

export type ActivateQuizResponse = {
  message: string;
};

export type DeactivateQuizResponse = {
  message: string;
};

export type GetQuizNotesResponse = {
  quiz: {
    id: number;
    titre: string;
    nombre_questions: number;
    notes: Array<{
      id: number;
      note: number;
      user: {
        id: number;
        nom: string;
        prenom: string;
        mail: string;
      };
      created_at: string;
    }>;
  };
};

/**
 * Types pour les cours de classe
 */

/**
 * Métadonnées extraites du contenu Lexical
 */
export type CourseContentMetadata = {
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

/**
 * Contenu du cours avec état Lexical et métadonnées
 */
export type CourseContent = {
  lexical_state: any; // JSON sérialisé de l'état Lexical
  html: string; // Version HTML pour affichage
  plain_text: string; // Texte brut pour recherche
  metadata: CourseContentMetadata;
};

/**
 * Payload pour créer un cours manuellement avec l'éditeur Lexical
 */
export type CreateManualCoursePayload = {
  titre: string;
  chapitre_id: number;
  content: CourseContent;
  questions?: Array<{
    question: string;
    reponse: string;
  }>;
};

export type CreateManualCourseResponse = {
  message: string;
  cours: Course & { classe_id: number };
};

export type GenerateCoursePayload = {
  chapter_id: number;
  document_file?: File;
};

export type GenerateCourseResponse = {
  message: string;
  cours: Course & { classe_id: number };
};

/**
 * Payload pour mettre à jour un cours
 */
export type UpdateCoursePayload = {
  titre?: string;
  content?: CourseContent;
  questions?: Array<{
    question: string;
    reponse: string;
  }>;
};

export type UpdateCourseResponse = {
  message: string;
  cours: Course;
};

/**
 * Payload pour uploader une image dans le cours
 */
export type UploadCourseImagePayload = {
  image: File;
  cours_id?: number; // Optionnel si l'image est uploadée avant la création du cours
};

export type UploadCourseImageResponse = {
  message: string;
  url: string; // URL de l'image uploadée
  path: string; // Chemin relatif de l'image
  filename: string;
  size: number;
};

export type ActivateCourseResponse = {
  message: string;
};

export type DeactivateCourseResponse = {
  message: string;
};

/**
 * Types pour les notes et évaluations
 */
export type SaveGradesPayload = {
  quiz_id: number;
  grades: Array<{
    user_id: number;
    note: number;
  }>;
};

export type SaveGradesResponse = {
  message: string;
  notes: Array<{
    id: number;
    user_id: number;
    note: number;
    quiz_id: number;
    created_at: string;
  }>;
};

export type CreateClassEvaluationPayload = {
  type_evaluation: string;
  matiere_id: number;
  chapitres_ids: number[];
  date_evaluation: string;
  commentaire?: string;
  grades: Array<{
    user_id: number;
    note: number;
  }>;
};

export type CreateClassEvaluationResponse = {
  message: string;
  notes: Array<{
    id: number;
    user_id: number;
    note: number;
    type_evaluation: string;
    matiere_id: number;
    chapitres_ids: number[];
    date_evaluation: string;
    created_at: string;
  }>;
};
