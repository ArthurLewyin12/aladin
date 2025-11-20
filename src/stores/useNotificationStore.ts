import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface NotificationStore {
  // IDs des notifications masquées (quiz déjà soumis, etc.)
  hiddenNotificationIds: Set<number>;

  // Actions
  hideNotification: (id: number) => void;
  isNotificationHidden: (id: number) => boolean;
  clearHiddenNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      hiddenNotificationIds: new Set(),

      hideNotification: (id: number) => {
        set((state) => ({
          hiddenNotificationIds: new Set([...state.hiddenNotificationIds, id]),
        }));
      },

      isNotificationHidden: (id: number) => {
        return get().hiddenNotificationIds.has(id);
      },

      clearHiddenNotifications: () => {
        set({ hiddenNotificationIds: new Set() });
      },
    }),
    {
      name: "notification-store",
      storage: createJSONStorage(() => localStorage, {
        // Convertir Set en Array pour la persistance JSON
        replacer: (key, value) => {
          if (key === "hiddenNotificationIds") {
            return Array.from(value as Set<number>);
          }
          return value;
        },
        // Convertir Array en Set lors de la lecture
        reviver: (key, value) => {
          if (key === "hiddenNotificationIds") {
            return new Set(value as number[]);
          }
          return value;
        },
      }),
    },
  ),
);
