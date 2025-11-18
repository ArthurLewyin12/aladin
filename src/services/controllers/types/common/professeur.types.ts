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
  libelles?: string[]; // Noms des matières enseignées par le prof (ex: ["Mathematiques", "Physique-Chimie", "SVT"])
  count: number;
  max: number;
  is_on_trial?: boolean;
  modifications_effectuees?: number;
  modifications_restantes?: number;
};

export type SetSubjectsPayload = {
  matieres: string[];
};

export type SetSubjectsResponse = {
  message: string;
  matieres: MatiereEnseignee[];
  libelles?: string[];
  count: number;
  max: number;
  is_on_trial?: boolean;
  modifications_effectuees?: number;
  modifications_restantes?: number;
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
  chapitre?: {
    id: number;
    libelle: string;
  };
  classe_id: number;
  is_active: boolean;
  is_manual: boolean;
  type?: "manual" | "ai"; // Type du quiz: manuel ou généré par IA
  nombre_eleves_soumis?: number; // Nombre d'élèves ayant soumis le quiz
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

export type QuizNoteEleve = {
  id: number;
  note: number;
  eleve: {
    id: number;
    nom: string;
    prenom: string;
    mail: string;
  };
  created_at: string;
  updated_at: string;
};

export type QuizCorrection = {
  questions: Array<{
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
  nombre_questions: number;
};

export type GetQuizNotesResponse = {
  success: boolean;
  quiz: {
    id: number;
    titre: string;
    difficulte: string;
    nombre_questions: number;
    classe_id: number;
  };
  classe: {
    id: number;
    nom: string;
    description: string;
  };
  notes: QuizNoteEleve[];
  statistiques: {
    total_notes: number;
    moyenne_generale: number;
    note_max: number;
    note_min: number;
  };
  corrections: QuizCorrection;
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
  cours: (Course & {
    classe_id: number;
    text?: string;
    questions?: Array<{
      question: string;
      reponse: string;
    }>;
    course_data?: any; // Optionnel: nouveau format structuré des cours IA
  });
};

/**
 * Payload pour mettre à jour un cours manuel (Lexical)
 */
export type UpdateCoursePayload = {
  titre?: string;
  content?: CourseContent;
  questions?: Array<{
    question: string;
    reponse: string;
  }>;
};

/**
 * Payload pour mettre à jour un cours IA (structuré)
 */
export type UpdateCourseIAPayload = {
  titre?: string;
  content?: {
    structured: boolean;
    course_data: {
      TITRE_DE_LA_LECON?: string;
      Introduction?: string;
      DEVELOPPEMENT_DU_COURS?: Record<string, any>;
      SYNTHESE_DU_COURS?: {
        recapitulatif?: string;
        competences_acquises?: string;
        points_de_vigilance?: string;
        ouverture?: string;
      };
    };
  };
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

/**
 * Types pour la gestion complète des évaluations et notes
 */

// Types pour les élèves d'une classe
export type ClassStudentMember = {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
  numero?: string;
  statut: string;
  is_active: boolean;
  is_active_in_classe: boolean;
  niveau?: {
    id: number;
    libelle: string;
  };
  created_at: string;
};

export type GetClassMembersResponse = {
  eleves: ClassStudentMember[];
  total: number;
  classe: {
    id: number;
    nom: string;
  };
};

// Types pour les évaluations
export type Evaluation = {
  id: number;
  classe_id: number;
  professeur_id: number;
  matiere_id: number;
  type_evaluation: string;
  date_evaluation: string;
  commentaire?: string;
  chapitres_ids: number[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  matiere?: {
    id: number;
    libelle: string;
  };
  classe?: {
    id: number;
    nom: string;
  };
  notes_count?: number;
  moyenne?: number;
  grades?: Array<{
    id: number;
    note: number;
    eleve_id: number;
  }>;
};

export type CreateEvaluationPayload = {
  type_evaluation: string;
  matiere_id: number;
  chapitres_ids?: number[];
  date_evaluation?: string;
  commentaire?: string;
};

export type CreateEvaluationResponse = {
  message: string;
  evaluation: Evaluation;
};

export type GetEvaluationsResponse = {
  evaluations: Evaluation[];
  total: number;
};

// Types pour les notes
export type Grade = {
  id: number;
  evaluation_id: number;
  eleve_id: number;
  note: number;
  notifie_parent: boolean;
  created_at: string;
  updated_at?: string;
  eleve?: {
    id: number;
    nom: string;
    prenom: string;
    mail: string;
  };
  evaluation?: {
    id: number;
    type_evaluation: string;
    matiere?: {
      id: number;
      libelle: string;
    };
  };
};

export type GetEvaluationNotesResponse = {
  evaluation: Evaluation & {
    chapitres?: Array<{
      id: number;
      libelle: string;
    }>;
  };
  notes: Grade[];
  total_notes: number;
  moyenne: number;
};

export type AddGradesToEvaluationPayload = {
  grades: Array<{
    user_id: number;
    note: number;
  }>;
};

export type AddGradesToEvaluationResponse = {
  message: string;
  notes: Grade[];
  total_notes: number;
};

export type UpdateEvaluationPayload = {
  type_evaluation?: string;
  matiere_id?: number;
  chapitres_ids?: number[];
  date_evaluation?: string;
  commentaire?: string;
  is_active?: boolean;
};

export type UpdateEvaluationResponse = {
  message: string;
  evaluation: Evaluation;
};

export type UpdateGradePayload = {
  note: number;
};

export type UpdateGradeResponse = {
  message: string;
  note: Grade;
};

export type UpdateAllGradesPayload = {
  grades: Array<{
    note_classe_id: number;
    note: number;
  }>;
};

export type UpdateAllGradesResponse = {
  message: string;
  notes: Grade[];
  errors: string[];
  total_updated: number;
  total_errors: number;
};

/**
 * Types pour les messages de classe
 */
export type ClassMessage = {
  id: number;
  classe_id: number;
  professeur_id: number;
  message: string;
  date_debut: string;
  date_fin: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type GetClassMessagesResponse = {
  messages: ClassMessage[];
  total: number;
};

export type CreateClassMessagePayload = {
  message: string;
  date_debut: string;
  date_fin: string;
};

export type CreateClassMessageResponse = {
  message: string;
  data: ClassMessage;
};

export type UpdateClassMessagePayload = {
  message?: string;
  date_debut?: string;
  date_fin?: string;
};

export type UpdateClassMessageResponse = {
  message: string;
  data: ClassMessage;
};

export type ToggleClassMessageResponse = {
  message: string;
  is_active: boolean;
};
