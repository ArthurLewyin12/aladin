export interface QuestionReponse {
  question: string;
  reponse: string;
}

export interface CoursData {
  text: string; // Cours formaté complet
  questions: QuestionReponse[]; // Array de 5 questions d'approfondissement
}

export interface UserCours {
  id: number; // ID du cours
  user_id: number; // ID de l'utilisateur
  chapitre_id: number; // ID du chapitre
  data: CoursData; // Contenu du cours (casté en array)
  time: number; // Temps associé
  created_at: string; // Date de création ISO
  updated_at: string; // Date de mise à jour ISO
}

export interface GenerateCoursSuccessResponse {
  cours_id: number; // ID du cours créé/récupéré
  text: string; // Contenu du cours formaté
  questions: QuestionReponse[]; // Questions d'approfondissement
  served: "existing" | "generated"; // Type de service
  message?: string; // Message optionnel (si cours existe déjà)
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
