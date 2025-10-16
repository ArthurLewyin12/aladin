import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  TimeTrackingSession,
  TimeTrackingStore,
  TrackingType,
  TimeTrackingPayload,
} from "./types/time-tracking.types";
import { saveTimeTracking } from "@/services/controllers/tracking.controller";

// Générer un ID numérique unique basé sur le timestamp
const generateNumericId = (): number => {
  return Date.now();
};

// Interval de mise à jour en millisecondes (10 secondes)
const UPDATE_INTERVAL = 10000;

// Seuil pour envoyer les données automatiquement (5 minutes)
const AUTO_SEND_THRESHOLD = 5 * 60 * 1000;

// Durée maximum par session (24 heures en secondes, limite backend)
const MAX_DURATION_SECONDS = 86400;

// Nombre maximum de sessions par batch (limite backend)
const MAX_SESSIONS_PER_BATCH = 100;

export const useTimeTracking = create<TimeTrackingStore>()(
  persist(
    (set, get) => ({
      activeSessions: [],
      currentSession: null,
      trackingInterval: null,

      startTracking: (type, resourceId, chapitreId, metadata) => {
        // Arrêter le tracking précédent s'il existe
        const { stopTracking } = get();
        stopTracking();

        const now = Date.now();
        const session: TimeTrackingSession = {
          id: generateNumericId(),
          type,
          resourceId,
          chapitreId,
          startTime: now,
          duration: 0,
          lastUpdate: now,
          metadata,
        };

        // Démarrer l'intervalle de mise à jour
        const interval = setInterval(() => {
          get().updateDuration();
        }, UPDATE_INTERVAL);

        set({
          currentSession: session,
          trackingInterval: interval,
        });

        console.log("[TimeTracking] Started tracking:", {
          type,
          resourceId,
          chapitreId,
        });
      },

      updateDuration: () => {
        const { currentSession, activeSessions } = get();

        if (!currentSession) return;

        const now = Date.now();
        const timeSinceLastUpdate = Math.floor(
          (now - currentSession.lastUpdate) / 1000,
        );

        // Limiter la durée à MAX_DURATION_SECONDS (24h max backend)
        const newDuration = Math.min(
          currentSession.duration + timeSinceLastUpdate,
          MAX_DURATION_SECONDS,
        );

        const updatedSession: TimeTrackingSession = {
          ...currentSession,
          duration: newDuration,
          lastUpdate: now,
        };

        set({ currentSession: updatedSession });

        // Vérifier si on doit envoyer automatiquement
        const totalTime = now - currentSession.startTime;
        if (totalTime >= AUTO_SEND_THRESHOLD) {
          console.log(
            "[TimeTracking] Auto-send threshold reached, sending data...",
          );
          get().sendData();
        }
      },

      stopTracking: () => {
        const { currentSession, trackingInterval, activeSessions } = get();

        if (trackingInterval) {
          clearInterval(trackingInterval);
        }

        if (currentSession) {
          // Mettre à jour une dernière fois avant d'arrêter
          const now = Date.now();
          const timeSinceLastUpdate = Math.floor(
            (now - currentSession.lastUpdate) / 1000,
          );

          // Limiter la durée finale à MAX_DURATION_SECONDS (24h max backend)
          const finalDuration = Math.min(
            currentSession.duration + timeSinceLastUpdate,
            MAX_DURATION_SECONDS,
          );

          const finalSession: TimeTrackingSession = {
            ...currentSession,
            duration: finalDuration,
            endTime: now,
            lastUpdate: now,
          };

          // Ajouter à la liste des sessions actives
          set({
            activeSessions: [...activeSessions, finalSession],
            currentSession: null,
            trackingInterval: null,
          });

          console.log("[TimeTracking] Stopped tracking:", {
            duration: finalSession.duration,
            sessions: [...activeSessions, finalSession].length,
          });

          // Envoyer les données immédiatement après avoir arrêté
          get().sendData();
        } else {
          set({
            trackingInterval: null,
          });
        }
      },

      sendData: async () => {
        const { activeSessions } = get();

        if (activeSessions.length === 0) {
          console.log("[TimeTracking] No sessions to send");
          return;
        }

        try {
          // Limiter à MAX_SESSIONS_PER_BATCH (100 sessions max par requête backend)
          const sessionsToSend = activeSessions.slice(
            0,
            MAX_SESSIONS_PER_BATCH,
          );
          const remainingSessions = activeSessions.slice(
            MAX_SESSIONS_PER_BATCH,
          );

          console.log(
            `[TimeTracking] Sending ${sessionsToSend.length} session(s)... (${remainingSessions.length} remaining)`,
          );

          // Préparer les données pour l'API
          const payload: TimeTrackingPayload[] = sessionsToSend.map(
            (session) => ({
              type: session.type,
              resource_id: session.resourceId,
              chapitre_id: session.chapitreId,
              duration: session.duration,
              metadata: session.metadata,
            }),
          );

          console.log("[TimeTracking] Payload to send:", payload);

          // Appel API réel
          const response = await saveTimeTracking(payload);

          console.log("[TimeTracking] API Response:", response);

          // Nettoyer seulement les sessions envoyées avec succès
          set({ activeSessions: remainingSessions });

          console.log("[TimeTracking] Data sent successfully");

          // Si des sessions restent, les envoyer récursivement
          if (remainingSessions.length > 0) {
            console.log(
              `[TimeTracking] Sending remaining ${remainingSessions.length} session(s)...`,
            );
            await get().sendData();
          }
        } catch (error) {
          console.error("[TimeTracking] Failed to send data:", error);
          // En cas d'erreur, garder les sessions pour réessayer plus tard
        }
      },

      clearSentSessions: () => {
        set({ activeSessions: [] });
      },

      cleanup: () => {
        const { trackingInterval } = get();
        if (trackingInterval) {
          clearInterval(trackingInterval);
        }
        set({
          trackingInterval: null,
          currentSession: null,
        });
      },
    }),
    {
      name: "time-tracking-storage",
      partialize: (state) => ({
        activeSessions: state.activeSessions,
        // Ne pas persister currentSession et trackingInterval
      }),
    },
  ),
);

// Hook pour nettoyer au démontage (à utiliser dans un composant racine)
export const useTimeTrackingCleanup = () => {
  if (typeof window !== "undefined") {
    // Nettoyer avant de quitter la page
    window.addEventListener("beforeunload", () => {
      const store = useTimeTracking.getState();
      store.stopTracking();
    });

    // Nettoyer au démontage du composant
    return () => {
      const store = useTimeTracking.getState();
      store.cleanup();
    };
  }
};
