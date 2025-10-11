import { TrackingEndpoints } from "@/constants/endpoints";
import { request } from "@/lib/request";

/**
 * Payload pour une session de tracking
 */
export interface TimeTrackingSessionPayload {
  type: "quiz" | "revision";
  resource_id: number;
  chapitre_id: number;
  duration: number; // en secondes
  metadata?: {
    difficulte?: string;
  };
}

/**
 * Réponse de l'API après sauvegarde du temps d'étude
 */
export interface SaveTimeTrackingResponse {
  success: boolean;
  message: string;
  saved_sessions?: number; // Nombre de sessions sauvegardées
}

/**
 * Sauvegarde les données de tracking du temps d'étude.
 * @param {TimeTrackingSessionPayload[]} sessions - Les sessions de tracking à sauvegarder.
 * @returns {Promise<SaveTimeTrackingResponse>} La réponse de l'API.
 */
export const saveTimeTracking = async (
  sessions: TimeTrackingSessionPayload[],
): Promise<SaveTimeTrackingResponse> => {
  return request.post<SaveTimeTrackingResponse>(
    TrackingEndpoints.SAVE_TIME,
    { sessions },
  );
};
