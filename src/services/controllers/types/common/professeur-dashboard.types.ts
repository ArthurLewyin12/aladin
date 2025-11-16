/**
 * Types pour la réponse du dashboard professeur
 */

export interface StatistiquesGenerales {
  nombre_classes: number;
  nombre_eleves: number;
  nombre_cours: number;
  nombre_quiz: number;
}

export interface RepartitionQuiz {
  manuel: number;
  genere: number;
  document: number;
}

export interface DetailsActivite {
  quiz: number;
  cours_manuels: number;
  cours_generes: number;
  messages: number;
  notes_quiz: number;
  notes_classe: number;
}

export interface EvolutionMois {
  mois: string; // Format: "2025-11"
  date: string; // Format: "2025-11-01"
  nombre_activites: number;
  details: DetailsActivite;
}

export interface EvolutionActivitesClasse {
  classe_id: number;
  classe_nom: string;
  evolution: EvolutionMois[];
}

export interface EvolutionMoyennesMois {
  mois: string; // Format: "2025-11"
  date: string; // Format: "2025-11-01"
  moyenne_generale: number | null;
  moyenne_quiz: number | null;
  moyenne_classe: number | null;
}

export interface EvolutionMoyennesClasse {
  classe_id: number;
  classe_nom: string;
  evolution: EvolutionMoyennesMois[];
}

export interface NoteEleve {
  id: number;
  evaluation_id: number;
  type: "evaluation" | "quiz";
  note: number;
  eleve_id: number;
  eleve_nom: string;
  eleve_prenom: string;
  matiere_id: number;
  matiere_libelle: string;
  type_evaluation: string; // Ex: "Devoir", "Contrôle", etc.
  classe_id: number;
  classe_nom: string;
  date: string; // Format: "2025-10-28"
  created_at: string;
}

export interface DashboardResponse {
  success: boolean;
  statistiques_generales: StatistiquesGenerales;
  repartition_quiz: RepartitionQuiz;
  evolution_activites_par_classe: EvolutionActivitesClasse[];
  evolution_moyennes_par_classe: EvolutionMoyennesClasse[];
  tableau_notes_eleves: NoteEleve[];
}
