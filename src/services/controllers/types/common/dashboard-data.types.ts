/**
 * Type de période pour les dashboards
 */
export type DashboardPeriod = "week" | "month" | "quarter" | "semester" | "year";

/**
 * Point de données pour une série (date + count)
 */
export type DataPoint = {
  date: string;
  count: number;
};

/**
 * Evolution des créations avec labels et séries
 */
export type EvolutionCreations = {
  period: DashboardPeriod;
  labels: string[];
  series: {
    quiz: DataPoint[];
    cours: DataPoint[];
    groupes: DataPoint[];
  };
};

/**
 * Répartition par matière (pour parent dashboard)
 */
export type RepartitionParMatiere = {
  matiere: string;
  count: number;
};

/**
 * Répartition par niveau (pour répétiteur dashboard)
 */
export type RepartitionParNiveau = {
  niveau: string;
  count: number;
};

/**
 * Référence à un enfant dans le tableau d'activités parent
 */
export type EnfantReference = {
  id: number;
  type: "utilisateur" | "manuel";
};

/**
 * Référence à un élève dans le tableau d'activités répétiteur
 */
export type EleveReference = string | {
  id: number;
  type: "utilisateur" | "manuel";
};

/**
 * Activité du parent (quiz, cours ou groupe)
 */
export type ParentActivity = {
  type: "quiz" | "cours" | "groupe";
  id: number;
  nom: string;
  date_creation: string;
  matiere: string;
  chapitre: string | null;
  niveau: string;
  enfant: EnfantReference;
  statut: "actif" | "inactif";
};

/**
 * Activité du répétiteur (quiz, cours ou groupe)
 */
export type RepetiteurActivity = {
  type: "quiz" | "cours" | "groupe";
  id: number;
  titre: string;
  date_creation: string;
  matiere: string;
  chapitre: string | null;
  niveau: string;
  eleve: EleveReference;
  difficulte: string | null;
  statut: "actif" | "inactif";
};

/**
 * Compteurs du dashboard parent
 */
export type ParentCounters = {
  enfants_geres: number;
  groupes_crees: number;
  quiz_crees: number;
  cours_crees: number;
};

/**
 * Compteurs du dashboard répétiteur
 */
export type RepetiteurCounters = {
  eleves_geres: number;
  quiz_crees: number;
  cours_crees: number;
  groupes_crees: number;
};

/**
 * Graphiques du dashboard parent
 */
export type ParentGraphiques = {
  evolution_creations: EvolutionCreations;
  repartition_par_matiere: RepartitionParMatiere[];
};

/**
 * Graphiques du dashboard répétiteur
 */
export type RepetiteurGraphiques = {
  evolution_creations: EvolutionCreations;
  repartition_par_niveau: RepartitionParNiveau[];
};

/**
 * Réponse complète du dashboard parent
 * GET /api/parents/{parentId}/dashboard?period={period}
 */
export type GetParentDashboardResponse = {
  parent_id: number;
  period: DashboardPeriod;
  counters: ParentCounters;
  graphiques: ParentGraphiques;
  tableau_activites: ParentActivity[];
};

/**
 * Réponse complète du dashboard répétiteur
 * GET /api/repetiteurs/{repetiteurId}/dashboard?period={period}
 */
export type GetRepetiteurDashboardResponse = {
  repetiteur_id: number;
  period: DashboardPeriod;
  counters: RepetiteurCounters;
  graphiques: RepetiteurGraphiques;
  tableau_activites: RepetiteurActivity[];
};
