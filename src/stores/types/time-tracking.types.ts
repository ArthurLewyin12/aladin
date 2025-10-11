export type TrackingType = "quiz" | "revision";

export interface TimeTrackingSession {
  id: number; // id numérique généré côté client (timestamp unique)
  type: TrackingType;
  resourceId: number; // quiz_id ou cours_id
  chapitreId: number;
  startTime: number; // timestamp en ms
  endTime?: number; // timestamp en ms
  duration: number; // en secondes, accumulé
  lastUpdate: number; // timestamp de la dernière mise à jour
  metadata?: {
    difficulte?: string; // pour quiz
    userId?: number;
  };
}

export interface TimeTrackingPayload {
  type: TrackingType;
  resource_id: number;
  chapitre_id: number;
  duration: number; // en secondes
  metadata?: {
    difficulte?: string;
  };
}

export interface TimeTrackingStore {
  // Sessions actives (non envoyées)
  activeSessions: TimeTrackingSession[];

  // Session courante
  currentSession: TimeTrackingSession | null;

  // Interval ID pour le tracking
  trackingInterval: NodeJS.Timeout | null;

  // Actions
  startTracking: (
    type: TrackingType,
    resourceId: number,
    chapitreId: number,
    metadata?: TimeTrackingSession["metadata"],
  ) => void;

  updateDuration: () => void; // appelé périodiquement (ex: toutes les 5-10 secondes)

  stopTracking: () => void;

  sendData: () => Promise<void>; // envoie les données au backend

  clearSentSessions: () => void;

  // Nettoyage
  cleanup: () => void;
}
