import { Niveau } from "./niveau.types";

// Types pour les quiz de groupe

export interface ApprofondissementQuestion {
  question: string;
  reponse: string;
}

export interface GroupQuizData {
  qcm: {
    question: string;
    propositions: Record<string, string>;
    bonne_reponse: string;
  }[];
  questions_approfondissement: ApprofondissementQuestion[];
}

export interface GroupeWithNiveau {
  id: number;
  nom: string;
  description: string;
  niveau_id: number;
  user_id: string;
  chief_user: number;
  is_active: boolean;
  members_status: any | null;
  group_type: string;
  created_at: string;
  updated_at: string;
  niveau: Niveau;
}

export interface GroupQuizDefinition {
  id: number;
  titre: string;
  nombre_questions: number;
  temps: number;
  niveau_id: number;
  matiere_id: number;
  chapitre_id: number;
  difficulte: string;
  data: string; // JSON stringified GroupQuizData
  groupe_id: number;
  is_active: boolean;
  parent_id: number | null;
  classe_id: number | null;
  trimestre: string | null;
  created_at: string;
  updated_at: string;
  groupe: GroupeWithNiveau;
}

export interface GroupeInfo {
  id: number;
  nom: string;
  description: string;
  niveau: Niveau;
  group_type: string;
  isChief: boolean;
}

export interface GroupQuizItem {
  quiz: GroupQuizDefinition;
  groupe: GroupeInfo;
  is_completed: boolean;
}

export interface GroupQuizzesResponse {
  quizzes: GroupQuizItem[];
  total: number;
}

export interface GenerateGroupQuizPayload {
  group_id: number;
  chapter_id: number;
  difficulty: "Facile" | "Moyen" | "Difficile";
  title: string;
  nombre_questions: number; // 5-10
  temps: number; // en minutes
  document_file?: File; // Optionnel: fichier pour génération basée sur document
}

export interface GenerateGroupQuizResponse {
  quiz: {
    id: number;
    groupe_id: number;
    is_active: boolean;
    data: string; // JSON stringified
  };
  questions: {
    question: string;
    propositions: Record<string, string>;
    bonne_reponse: string;
  }[];
  questions_approfondissement: ApprofondissementQuestion[];
  document: boolean; // Indique si la génération est basée sur un document
  message: string;
}
