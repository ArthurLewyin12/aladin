export interface EleveStatsResponse {
  period: {
    start: string; // ex: "2025-08-01"
    end: string; // ex: "2025-10-31"
  };
  notesEvolution: Array<{
    month: string; // ex: "2025-08"
    avg_note: number; // ex: 14.5 (moyenne sur /20)
  }>;
  bestSubjects: Array<{
    matiere: string; // ex: "Mathématiques"
    avg_note: number; // ex: 17.3
  }>; // Limité à 5, trié décroissant
}

export interface DashboardResponse {
  user: {
    id: number;
    nom: string;
    prenom: string;
    niveau: {
      id: number;
      libelle: string;
      created_at: string;
      updated_at: string;
    };
  };
  counters: {
    cours: number; // Total chapitres disponibles
    invitations: number;
    groupes: number;
    classes: number;
    quiz: number; // Total quizzes faits
    documents: number;
  };
  limites: {
    nombre_quiz: number;
    nombre_revision: number;
    nombre_quiz_groupe: number;
  };
  temps_restant: string; // ex: "2 days" (jusqu'au reset hebdo)
  study_time: {
    period: string; // "week" | "month" | etc.
    labels: string[]; // ex: ["Mon", "Tue", ...] (dépend de la période)
    series: Array<{
      bucket: string; // ex: "2025-10-07" (date ou mois)
      matiere: string; // ex: "Maths"
      seconds: number; // Temps en secondes
    }>;
  };
  best_subject: Array<{
    matiere: string;
    avg_note: number; // Moyenne /20
  }>; // Trié décroissant
  notes_evolution: Array<{
    date: string; // ex: "2025-10-01"
    matiere: string;
    note: number; // /20
    chapitre: string;
    niveau: string; // "facile" | "moyen" | "difficile"
  }>; // Pour l'année en cours, trié par date croissante
  all_notes: Array<{
    matiere: string;
    chapitre: string;
    niveau: string;
    note: number;
    nombre_questions: number;
    date: string; // ISO date
  }>; // Toutes notes historiques, trié par date décroissante
}

export interface ClassesResponse {
  // Array de classes (structure Eloquent basique)
  id: number;
  nom: string; // ou libelle
  user_id: number[] | string; // Array IDs ou JSON string
  // Autres champs : niveau_id, etc.
}
[];
