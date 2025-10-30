import type { Niveau } from "../auth.types";

/**
 * Type d'enfant
 */
export enum EnfantType {
  UTILISATEUR = "utilisateur",
  MANUEL = "manuel",
}

/**
 * Enfant utilisateur (a créé son propre compte)
 */
export type EnfantUtilisateur = {
  id: string | number;
  nom: string;
  prenom: string;
  niveau_id: number;
  niveau?: Niveau;
  type: EnfantType.UTILISATEUR;
  email: string;
  numero: string;
};

/**
 * Enfant ajouté manuellement par le parent
 */
export type EnfantManuel = {
  id: string; // Format: "manuel_456"
  nom: string;
  prenom: string;
  niveau_id: number;
  niveau?: Niveau;
  type: EnfantType.MANUEL;
  email: string;
  numero: string;
};

/**
 * Union type pour n'importe quel type d'enfant
 */
export type Enfant = EnfantUtilisateur | EnfantManuel;

/**
 * Classe de l'enfant actif
 */
export type ClasseEnfantActif = {
  id: number;
  libelle: string;
  // Ajouter d'autres champs si nécessaire
};

/**
 * Réponse GET /api/parent/enfants
 */
export type GetEnfantsResponse = {
  success: boolean;
  enfants: Enfant[];
  count: number;
  enfant_actif: Enfant | null;
  classe_enfant_actif: ClasseEnfantActif | null;
};

/**
 * Payload POST /api/parent/enfants/ajouter-manuel
 */
export type AjouterEnfantManuelPayload = {
  nom: string;
  prenom: string;
  niveau_id: number;
  email: string;
  numero: string;
};

/**
 * Réponse POST /api/parent/enfants/ajouter-manuel
 */
export type AjouterEnfantManuelResponse = {
  success: boolean;
  message: string;
  enfant: EnfantManuel;
};

/**
 * Payload POST /api/parent/enfants/selectionner
 */
export type SelectionnerEnfantPayload = {
  enfant_id: string | number; // "123" ou "manuel_456"
  type: "utilisateur" | "manuel"; // Type de l'enfant
};

/**
 * Réponse POST /api/parent/enfants/selectionner
 */
export type SelectionnerEnfantResponse = {
  success: boolean;
  message: string;
  enfant_actif: Enfant;
};

/**
 * Réponse GET /api/parent/enfant-actif
 */
export type GetEnfantActifResponse = {
  success: boolean;
  enfant_actif: Enfant | null;
  classe_enfant_actif: ClasseEnfantActif | null;
};

/**
 * Payload POST /api/parent/enfants/ajouter
 */
export type AjouterEnfantUtilisateurPayload = {
  enfant_id: number;
};

/**
 * Réponse POST /api/parent/enfants/ajouter
 */
export type AjouterEnfantUtilisateurResponse = {
  success: boolean;
  message: string;
  enfant: EnfantUtilisateur;
};

/**
 * Payload DELETE /api/parent/enfants/retirer
 */
export type RetirerEnfantPayload = {
  enfant_id: number;
};

/**
 * Réponse DELETE /api/parent/enfants/retirer
 */
export type RetirerEnfantResponse = {
  success: boolean;
  message: string;
};

/**
 * Réponse POST /api/parent/enfants/associer-automatiquement
 */
export type AssocierAutomatiquementResponse = {
  success: boolean;
  message: string;
  enfants_associes: number; // Nombre d'enfants associés automatiquement
};

/**
 * Groupe créé par le parent pour un enfant
 */
export type GroupeEnfant = {
  id: number;
  nom: string;
  description: string;
  niveau: Niveau;
  nombre_membres: number;
  group_type: string;
  is_active: boolean;
  created_at: string;
};

/**
 * Quiz personnel créé pour l'enfant
 */
export type QuizPersonnel = {
  id: number;
  type: "personnel";
  chapitre: {
    id: number;
    libelle: string;
    matiere: { id: number; libelle: string };
    niveau: Niveau;
  };
  difficulte: string;
  time: number;
  created_at: string;
};

/**
 * Quiz de groupe créé pour l'enfant
 */
export type QuizGroupe = {
  id: number;
  type: "groupe";
  titre: string;
  nombre_questions: number;
  temps: number;
  difficulte: string;
  chapitre: {
    id: number;
    libelle: string;
    matiere: { id: number; libelle: string };
    niveau: Niveau;
  };
  groupe: { id: number; nom: string };
  is_active: boolean;
};

/**
 * Cours créé pour l'enfant
 */
export type CoursEnfant = {
  id: number;
  chapitre: {
    id: number;
    libelle: string;
    matiere: { id: number; libelle: string };
    niveau: Niveau;
  };
  time: number;
  has_content: boolean;
  has_questions: boolean;
  created_at: string;
};

/**
 * Réponse GET /api/parent/enfant/groupes
 */
export type GetEnfantGroupesResponse = {
  success: boolean;
  enfant: Enfant;
  groupes: GroupeEnfant[];
  count: number;
};

/**
 * Réponse GET /api/parent/enfant/quiz
 */
export type GetEnfantQuizResponse = {
  success: boolean;
  enfant: Enfant;
  quiz_personnels: QuizPersonnel[];
  quiz_groupes: QuizGroupe[];
  count: {
    personnels: number;
    groupes: number;
    total: number;
  };
};

/**
 * Réponse GET /api/parent/enfant/cours
 */
export type GetEnfantCoursResponse = {
  success: boolean;
  enfant: Enfant;
  cours: CoursEnfant[];
  count: number;
};

/**
 * Statistiques de résumé pour un enfant, utilisées dans le dashboard.
 */
export type EnfantDashboardStats = {
  nombre_groupes: number;
  nombre_quiz: number;
  nombre_cours: number;
  heures_etude_hebdomadaires: number;
  tendance: string;
  progression: number;
  moyenne_generale: number | null;
};

/**
 * Réponse GET /api/parent/enfant/resume
 */
export type GetEnfantResumeResponse = {
  success: boolean;
  period: string;
  enfant: Enfant;
  statistiques: {
    heures_etude_hebdomadaires: number;
    nombre_quiz: number;
    nombre_cours: number;
    nombre_groupes: number;
    tendance: string;
    progression: number;
    moyenne_generale: number | null;
  };
};
