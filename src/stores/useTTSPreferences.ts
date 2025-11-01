import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import ENVIRONNEMENTS from "@/constants/environnement";

export interface TTSVoiceSettings {
  rate: string; // e.g., "+0%", "+10%", "-10%"
  volume: string; // e.g., "+0%", "+20%"
  pitch: string; // e.g., "+0Hz", "+2Hz"
}

export interface TTSPreferences {
  enabled: boolean;
  autoPlay: boolean; // Auto-play dans certains contextes
  voice: string; // Identifiant de la voix
  voiceSettings: TTSVoiceSettings;
}

interface TTSPreferencesStore {
  preferences: TTSPreferences;
  setEnabled: (enabled: boolean) => void;
  setAutoPlay: (autoPlay: boolean) => void;
  setVoice: (voice: string) => void;
  setVoiceSettings: (settings: Partial<TTSVoiceSettings>) => void;
  resetPreferences: () => void;
}

const DEFAULT_PREFERENCES: TTSPreferences = {
  enabled: true,
  autoPlay: false,
  voice: "fr-FR-DeniseNeural", // Voix française par défaut
  voiceSettings: {
    rate: "+0%",
    volume: "+0%",
    pitch: "+0Hz",
  },
};

export const useTTSPreferences = create<TTSPreferencesStore>()(
  persist(
    (set) => ({
      preferences: DEFAULT_PREFERENCES,

      setEnabled: (enabled) =>
        set((state) => ({
          preferences: { ...state.preferences, enabled },
        })),

      setAutoPlay: (autoPlay) =>
        set((state) => ({
          preferences: { ...state.preferences, autoPlay },
        })),

      setVoice: (voice) =>
        set((state) => ({
          preferences: { ...state.preferences, voice },
        })),

      setVoiceSettings: (settings) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            voiceSettings: { ...state.preferences.voiceSettings, ...settings },
          },
        })),

      resetPreferences: () =>
        set({
          preferences: DEFAULT_PREFERENCES,
        }),
    }),
    {
      name: `tts-preferences-${ENVIRONNEMENTS.UNIVERSE}`,
      storage: {
        getItem: (name) => {
          const value = Cookies.get(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          Cookies.set(name, JSON.stringify(value), {
            expires: 365, // 1 an
            sameSite: "strict",
          });
        },
        removeItem: (name) => {
          Cookies.remove(name);
        },
      },
    },
  ),
);
