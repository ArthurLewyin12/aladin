import type { Niveau } from "../auth.types";

/**
 * Type d'élève
 */
export enum EleveType {
  UTILISATEUR = "utilisateur",
  MANUEL = "manuel",
}

/**
 * Élève utilisateur (a créé son propre compte)
 */
export type EleveUtilisateur = {
  id: string | number;
  nom: string;
  prenom: string;
  niveau_id: number;
  niveau?: Niveau;
  type: EleveType.UTILISATEUR;
  email: string;
  numero: string;
};

/**
 * Élève ajouté manuellement par le répétiteur
 */
export type EleveManuel = {
  id: string; // Format: "manuel_456"
  nom: string;
  prenom: string;
  niveau_id: number;
  niveau?: Niveau;
  type: EleveType.MANUEL;
  email: string;
  numero: string;
};

/**
 * Union type pour n'importe quel type d'élève
 */
export type Eleve = EleveUtilisateur | EleveManuel;

/**
 * Classe de l'élève actif
 */
export type ClasseEleveActif = {
  id: number;
  libelle: string;
};

/**
 * Réponse GET /api/repetiteur/eleves
 */
export type GetElevesResponse = {
  success: boolean;
  eleves: Eleve[];
  count: number;
  eleve_actif: Eleve | null;
  classe_eleve_actif: ClasseEleveActif | null;
};

/**
 * Payload POST /api/repetiteur/eleves/ajouter-manuel
 */
export type AjouterEleveManuelPayload = {
  nom: string;
  prenom: string;
  niveau_id: number;
  email: string;
  numero: string;
};

/**
 * Réponse POST /api/repetiteur/eleves/ajouter-manuel
 */
export type AjouterEleveManuelResponse = {
  success: boolean;
  message: string;
  eleve: EleveManuel;
};

/**
 * Payload POST /api/repetiteur/eleves/selectionner
 */
export type SelectionnerElevePayload = {
  eleve_id: string | number;
  type: "utilisateur" | "manuel";
};

/**
 * Réponse POST /api/repetiteur/eleves/selectionner
 */
export type SelectionnerEleveResponse = {
  success: boolean;
  message: string;
  eleve_actif: Eleve;
};

/**
 * Réponse GET /api/repetiteur/eleve-actif
 */
export type GetEleveActifResponse = {
  success: boolean;
  eleve_actif: Eleve | null;
  classe_eleve_actif: ClasseEleveActif | null;
};

/**
 * Payload POST /api/repetiteur/eleves/ajouter
 */
export type AjouterEleveUtilisateurPayload = {
  eleve_id: number;
};

/**
 * Réponse POST /api/repetiteur/eleves/ajouter
 */
export type AjouterEleveUtilisateurResponse = {
  success: boolean;
  message: string;
  eleve: EleveUtilisateur;
};

/**
 * Payload DELETE /api/repetiteur/eleves/retirer
 */
export type RetirerElevePayload = {
  eleve_id: number;
  type: "utilisateur" | "manuel";
};

/**
 * Réponse DELETE /api/repetiteur/eleves/retirer
 */
export type RetirerEleveResponse = {
  success: boolean;
  message: string;
};

/**
 * Payload POST /api/repetiteur/eleves/rechercher
 */
export type RechercherElevePayload = {
  email?: string;
  numero?: string;
};

/**
 * Réponse POST /api/repetiteur/eleves/rechercher
 */
export type RechercherEleveResponse = {
  success: boolean;
  eleve?: EleveUtilisateur;
  message?: string;
};

/**
 * Réponse POST /api/repetiteur/eleves/associer-automatiquement
 */
export type AssocierAutomatiquementResponse = {
  success: boolean;
  message: string;
  eleves_associes: number;
};

/**
 * Statistiques du répétiteur
 */
export type RepetiteurStats = {
  nombre_eleves: number;
  nombre_eleves_actifs: number;
  total_quiz_crees: number;
  total_cours_crees: number;
};

/**
 * Réponse GET /api/repetiteurs/{id}/stats
 */
export type GetRepetiteurStatsResponse = {
  success: boolean;
  stats: RepetiteurStats;
};

/**
 * Dashboard du répétiteur
 */
export type RepetiteurDashboard = {
  eleves_recents: Eleve[];
  activites_recentes: any[];
  statistiques: RepetiteurStats;
};

/**
 * Réponse GET /api/repetiteurs/{id}/dashboard
 */
export type GetRepetiteurDashboardResponse = {
  success: boolean;
  dashboard: RepetiteurDashboard;
};

/**
 * Réponse GET /api/repetiteur/eleve/groupes
 */
export type GetEleveGroupesResponse = {
  success: boolean;
  groupes: any[];
};

/**
 * Réponse GET /api/repetiteur/eleve/quiz
 */
export type GetEleveQuizResponse = {
  success: boolean;
  quiz: any[];
};

/**
 * Réponse GET /api/repetiteur/eleve/cours
 */
export type GetEleveCoursResponse = {
  success: boolean;
  cours: any[];
};

/**
 * Statistiques de résumé pour un élève, utilisées dans le dashboard du répétiteur.
 */
export type EleveDashboardStats = {
  nombre_groupes: number;
  nombre_quiz: number;
  nombre_cours: number;
  moyenne_generale: number | null;
  heures_etude_hebdomadaires: number;
  tendance: string;
  progression: number;
};

/**
 * Réponse GET /api/repetiteur/eleve/resume
 */
export type GetEleveResumeResponse = {
  success: boolean;
  period: string;
  eleve: Eleve;
  statistiques: {
    moyenne_generale: number | null;
    heures_etude_hebdomadaires: number;
    nombre_quiz: number;
    nombre_cours: number;
    nombre_groupes: number;
    tendance: string;
    progression: number;
  };
};

/**
 * Réponse GET /api/relations-repetiteur/statistiques
 */
export type GetRelationsStatistiquesResponse = {
  success: boolean;
  statistiques: {
    total_relations: number;
    relations_actives: number;
    relations_par_niveau: any[];
  };
};

// ========================================
// Niveaux du répétiteur
// ========================================

export interface RepetiteurNiveau {
  id: number;
  libelle: string;
  created_at: string;
  updated_at: string;
}

export interface DefinirNiveauxPayload {
  niveaux: number[];
}

export interface DefinirNiveauxResponse {
  success: boolean;
  message: string;
  niveaux: RepetiteurNiveau[];
}

export interface GetNiveauxChoisisResponse {
  success: boolean;
  niveaux: RepetiteurNiveau[];
  nombre_niveaux: number;
  a_defini_niveaux: boolean;
}

