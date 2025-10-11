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

        const updatedSession: TimeTrackingSession = {
          ...currentSession,
          duration: currentSession.duration + timeSinceLastUpdate,
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

          const finalSession: TimeTrackingSession = {
            ...currentSession,
            duration: currentSession.duration + timeSinceLastUpdate,
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
          console.log(
            `[TimeTracking] Sending ${activeSessions.length} session(s)...`,
          );

          // Préparer les données pour l'API
          const payload: TimeTrackingPayload[] = activeSessions.map(
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

          // Nettoyer les sessions envoyées
          get().clearSentSessions();

          console.log("[TimeTracking] Data sent successfully");
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
