import { useMutation } from "@tanstack/react-query";
import {
  saveTimeTracking,
  TimeTrackingSessionPayload,
} from "@/services/controllers/tracking.controller";

/**
 * Hook de mutation pour sauvegarder les données de tracking du temps d'étude.
 * Utilisé pour envoyer les sessions accumulées au backend.
 *
 * @returns Une mutation TanStack Query pour sauvegarder le tracking.
 */
export const useSaveTimeTracking = () => {
  return useMutation({
    mutationFn: (sessions: TimeTrackingSessionPayload[]) =>
      saveTimeTracking(sessions),

    // Configuration de retry en cas d'échec
    retry: (failureCount, error) => {
      // Si l'erreur est un 429 (Too Many Requests), on arrête les tentatives
      if ((error as any)?.response?.status === 429) {
        return false;
      }
      // Retry jusqu'à 2 fois (3 tentatives au total)
      return failureCount < 2;
    },

    // Délai exponentiel entre les tentatives (1s, 2s, 4s...)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};
