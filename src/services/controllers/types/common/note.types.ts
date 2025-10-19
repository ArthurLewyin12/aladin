import { AuditFields } from "@/constants/audit.types";
import { Matiere } from "./matiere.types";
import { AuthUser } from "./user.type";

/**
 * Types d'évaluation possibles pour les notes de classe
 */
export type TypeEvaluation =
  | "Contrôle"
  | "Devoir"
  | "Interrogation"
  | "Examen"
  | "TP"
  | "Autre";

/**
 * Structure d'une note de classe
 */
export type NoteClasse = {
  id: number;
  eleve_id: number;
  matiere_id: number;
  note: string; // Décimal sous forme de string (ex: "15.50")
  type_evaluation: TypeEvaluation;
  commentaire?: string;
  date_evaluation: string; // Date au format ISO (YYYY-MM-DD)
  chapitres_ids: number[];
  notifie_parent: boolean;
  matiere?: Matiere;
  eleve?: AuthUser;
} & AuditFields;

/**
 * Payload pour ajouter une nouvelle note de classe
 */
export type AddNoteClassePayload = {
  matiere_id: number;
  note: number; // Numérique entre 0 et 20
  type_evaluation?: TypeEvaluation;
  commentaire?: string;
  date_evaluation: string; // Format YYYY-MM-DD
  chapitres_ids?: number[];
};

/**
 * Payload pour modifier une note existante
 */
export type UpdateNoteClassePayload = AddNoteClassePayload;

/**
 * Réponse après ajout d'une note
 */
export type AddNoteClasseResponse = {
  success: boolean;
  message: string;
  data: NoteClasse;
};

/**
 * Réponse après mise à jour d'une note
 */
export type UpdateNoteClasseResponse = AddNoteClasseResponse;

/**
 * Réponse pour la consultation d'une note spécifique
 */
export type GetNoteClasseResponse = {
  success: boolean;
  message: string;
  data: NoteClasse;
};

/**
 * Réponse paginée pour la liste des notes
 */
export type GetNotesClasseResponse = {
  success: boolean;
  message: string;
  data: {
    data: NoteClasse[];
    current_page: number;
    per_page: number;
    total: number;
    last_page?: number;
    from?: number;
    to?: number;
  };
};

/**
 * Paramètres de filtrage pour les notes de classe
 */
export type NotesClasseFilters = {
  matiere_id?: number;
  date_debut?: string; // Format YYYY-MM-DD
  date_fin?: string; // Format YYYY-MM-DD
  page?: number;
};

/**
 * Moyenne par matière
 */
export type MoyenneParMatiere = {
  matiere_id: number;
  matiere_libelle: string;
  moyenne: number;
  nombre_notes: number;
};

/**
 * Point d'évolution des notes (pour graphiques)
 */
export type EvolutionNote = {
  date: string;
  moyenne: number;
};

/**
 * Statistiques des notes pour un élève
 */
export type NoteClasseStats = {
  moyenne_generale: number;
  moyennes_par_matiere: MoyenneParMatiere[];
  evolution_notes: EvolutionNote[];
  nombre_total_notes: number;
  meilleure_note?: number;
  moins_bonne_note?: number;
};

/**
 * Réponse pour les statistiques
 */
export type GetNoteClasseStatsResponse = {
  success: boolean;
  message: string;
  data: NoteClasseStats;
};

/**
 * Paramètres de filtrage pour les notes (vue parent)
 */
export type ParentNotesClasseFilters = NotesClasseFilters & {
  eleve_id?: number;
};

/**
 * Statistiques par enfant (vue parent)
 */
export type StatsParEnfant = {
  eleve_id: number;
  eleve_nom: string;
  eleve_prenom: string;
  moyenne_generale: number;
  nombre_notes: number;
};

/**
 * Statistiques globales pour un parent
 */
export type ParentNoteClasseStats = {
  stats_par_enfant: StatsParEnfant[];
  nombre_total_notes: number;
  moyenne_generale_tous_enfants?: number;
};

/**
 * Réponse pour les statistiques parent
 */
export type GetParentNoteClasseStatsResponse = {
  success: boolean;
  message: string;
  data: ParentNoteClasseStats;
};

/**
 * Information sur un enfant (vue parent)
 */
export type EnfantInfo = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  niveau_id?: number;
  nombre_notes?: number;
};

/**
 * Réponse pour la liste des enfants du parent
 */
export type GetParentEnfantsResponse = {
  success: boolean;
  message: string;
  data: EnfantInfo[];
};

/**
 * Réponse pour les notes d'un enfant spécifique (vue parent)
 */
export type GetParentEnfantNotesResponse = GetNotesClasseResponse;
