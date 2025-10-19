import { request } from "@/lib/request";
import {
  NoteClasseEndpoints,
  ParentNoteClasseEndpoints,
} from "@/constants/endpoints";
import {
  AddNoteClassePayload,
  AddNoteClasseResponse,
  GetNoteClasseResponse,
  GetNotesClasseResponse,
  UpdateNoteClassePayload,
  UpdateNoteClasseResponse,
  GetNoteClasseStatsResponse,
  NotesClasseFilters,
  ParentNotesClasseFilters,
  GetParentNoteClasseStatsResponse,
  GetParentEnfantsResponse,
  GetParentEnfantNotesResponse,
} from "./types/common";

// ============================================
// CONTROLLERS POUR LES ÉLÈVES
// ============================================

/**
 * Récupère la liste des notes de classe de l'élève authentifié.
 * Supporte les filtres par matière et période.
 * @param {NotesClasseFilters} filters - Filtres optionnels (matiere_id, date_debut, date_fin, page).
 * @returns {Promise<GetNotesClasseResponse>} Une promesse résolue avec la liste paginée des notes.
 */
export const getNotesClasse = async (
  filters?: NotesClasseFilters,
): Promise<GetNotesClasseResponse> => {
  const params = new URLSearchParams();

  if (filters?.matiere_id) {
    params.append("matiere_id", filters.matiere_id.toString());
  }
  if (filters?.date_debut) {
    params.append("date_debut", filters.date_debut);
  }
  if (filters?.date_fin) {
    params.append("date_fin", filters.date_fin);
  }
  if (filters?.page) {
    params.append("page", filters.page.toString());
  }

  const endpoint = `${NoteClasseEndpoints.GET_ALL}${params.toString() ? `?${params.toString()}` : ""}`;
  return request.get<GetNotesClasseResponse>(endpoint);
};

/**
 * Ajoute une nouvelle note de classe pour l'élève authentifié.
 * Déclenche automatiquement une notification au parent si son email correspond à un compte existant.
 * @param {AddNoteClassePayload} payload - Les données de la note à créer.
 * @returns {Promise<AddNoteClasseResponse>} Une promesse résolue avec la note créée.
 */
export const addNoteClasse = async (
  payload: AddNoteClassePayload,
): Promise<AddNoteClasseResponse> => {
  return request.post<AddNoteClasseResponse>(
    NoteClasseEndpoints.CREATE,
    payload,
  );
};

/**
 * Récupère une note de classe spécifique par son ID.
 * @param {number} noteId - L'ID de la note à récupérer.
 * @returns {Promise<GetNoteClasseResponse>} Une promesse résolue avec les détails de la note.
 */
export const getNoteClasse = async (
  noteId: number,
): Promise<GetNoteClasseResponse> => {
  const endpoint = NoteClasseEndpoints.GET_ONE.replace(
    "{id}",
    noteId.toString(),
  );
  return request.get<GetNoteClasseResponse>(endpoint);
};

/**
 * Met à jour une note de classe existante.
 * @param {number} noteId - L'ID de la note à modifier.
 * @param {UpdateNoteClassePayload} payload - Les nouvelles données de la note.
 * @returns {Promise<UpdateNoteClasseResponse>} Une promesse résolue avec la note mise à jour.
 */
export const updateNoteClasse = async (
  noteId: number,
  payload: UpdateNoteClassePayload,
): Promise<UpdateNoteClasseResponse> => {
  const endpoint = NoteClasseEndpoints.UPDATE.replace(
    "{id}",
    noteId.toString(),
  );
  return request.put<UpdateNoteClasseResponse>(endpoint, payload);
};

/**
 * Récupère les statistiques des notes de l'élève authentifié.
 * Inclut la moyenne générale, les moyennes par matière et l'évolution des notes.
 * @returns {Promise<GetNoteClasseStatsResponse>} Une promesse résolue avec les statistiques.
 */
export const getNoteClasseStats =
  async (): Promise<GetNoteClasseStatsResponse> => {
    return request.get<GetNoteClasseStatsResponse>(
      NoteClasseEndpoints.GET_STATS,
    );
  };

// ============================================
// CONTROLLERS POUR LES PARENTS
// ============================================

/**
 * Récupère la liste des notes de classe de tous les enfants du parent authentifié.
 * Supporte les filtres par enfant, matière et période.
 * @param {ParentNotesClasseFilters} filters - Filtres optionnels (eleve_id, matiere_id, date_debut, date_fin, page).
 * @returns {Promise<GetNotesClasseResponse>} Une promesse résolue avec la liste paginée des notes.
 */
export const getParentNotesClasse = async (
  filters?: ParentNotesClasseFilters,
): Promise<GetNotesClasseResponse> => {
  const params = new URLSearchParams();

  if (filters?.eleve_id) {
    params.append("eleve_id", filters.eleve_id.toString());
  }
  if (filters?.matiere_id) {
    params.append("matiere_id", filters.matiere_id.toString());
  }
  if (filters?.date_debut) {
    params.append("date_debut", filters.date_debut);
  }
  if (filters?.date_fin) {
    params.append("date_fin", filters.date_fin);
  }
  if (filters?.page) {
    params.append("page", filters.page.toString());
  }

  const endpoint = `${ParentNoteClasseEndpoints.GET_ALL}${params.toString() ? `?${params.toString()}` : ""}`;
  return request.get<GetNotesClasseResponse>(endpoint);
};

/**
 * Récupère les statistiques des notes de tous les enfants du parent authentifié.
 * Inclut les statistiques par enfant et la moyenne générale de tous les enfants.
 * @returns {Promise<GetParentNoteClasseStatsResponse>} Une promesse résolue avec les statistiques.
 */
export const getParentNoteClasseStats =
  async (): Promise<GetParentNoteClasseStatsResponse> => {
    return request.get<GetParentNoteClasseStatsResponse>(
      ParentNoteClasseEndpoints.GET_STATS,
    );
  };

/**
 * Récupère la liste des enfants du parent authentifié.
 * @returns {Promise<GetParentEnfantsResponse>} Une promesse résolue avec la liste des enfants.
 */
export const getParentEnfants = async (): Promise<GetParentEnfantsResponse> => {
  return request.get<GetParentEnfantsResponse>(
    ParentNoteClasseEndpoints.GET_ENFANTS,
  );
};

/**
 * Récupère les notes d'un enfant spécifique.
 * @param {number} enfantId - L'ID de l'enfant.
 * @returns {Promise<GetParentEnfantNotesResponse>} Une promesse résolue avec les notes de l'enfant.
 */
export const getParentEnfantNotes = async (
  enfantId: number,
): Promise<GetParentEnfantNotesResponse> => {
  const endpoint = ParentNoteClasseEndpoints.GET_ENFANT_NOTES.replace(
    "{enfantId}",
    enfantId.toString(),
  );
  return request.get<GetParentEnfantNotesResponse>(endpoint);
};
