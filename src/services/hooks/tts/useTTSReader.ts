"use client";

import { useEffect, useRef } from "react";
import { useTTS, Voices } from "next-tts";
import { useTTSPreferences } from "@/stores/useTTSPreferences";
import { TTSReaderOptions, TTSReaderControls } from "./types";

/**
 * Hook personnalisé pour la lecture de texte avec synthèse vocale
 * Utilise les préférences utilisateur stockées dans Zustand
 *
 * @param text - Le texte à lire
 * @param options - Options de lecture (autoplay, callbacks)
 * @returns Contrôles de lecture et état
 *
 * @example
 * ```tsx
 * const tts = useTTSReader("Bonjour les étudiants");
 *
 * <button onClick={tts.play}>Lire</button>
 * <button onClick={tts.pause}>Pause</button>
 * ```
 */
export const useTTSReader = (
  text: string,
  options: TTSReaderOptions = {},
): TTSReaderControls => {
  const { preferences } = useTTSPreferences();
  const { autoplay, onStart, onEnd, onError } = options;

  // Utiliser la voix française par défaut ou celle choisie par l'utilisateur
  const voice = preferences.voice || Voices.French.FR.Female.Denise;

  // Hook TTS de next-tts avec les préférences utilisateur
  const ttsControls = useTTS(text, voice, {
    rate: preferences.voiceSettings.rate,
    volume: preferences.voiceSettings.volume,
    pitch: preferences.voiceSettings.pitch,
    autoplay: autoplay ?? preferences.autoPlay,
  });

  const previousIsPlaying = useRef(ttsControls.isPlaying);
  const previousError = useRef(ttsControls.error);

  // Callbacks pour les événements
  useEffect(() => {
    // Démarrage de la lecture
    if (ttsControls.isPlaying && !previousIsPlaying.current) {
      onStart?.();
    }

    // Fin de la lecture
    if (!ttsControls.isPlaying && previousIsPlaying.current) {
      onEnd?.();
    }

    previousIsPlaying.current = ttsControls.isPlaying;
  }, [ttsControls.isPlaying, onStart, onEnd]);

  // Gestion des erreurs
  useEffect(() => {
    if (ttsControls.error && ttsControls.error !== previousError.current) {
      onError?.(ttsControls.error);
    }
    previousError.current = ttsControls.error;
  }, [ttsControls.error, onError]);

  // Ne pas exposer si TTS est désactivé dans les préférences
  if (!preferences.enabled) {
    return {
      play: async () => {},
      pause: () => {},
      stop: () => {},
      seek: () => {},
      isPlaying: false,
      isLoading: false,
      progress: 0,
      error: null,
      currentWord: null,
    };
  }

  return {
    play: ttsControls.controls.play,
    pause: ttsControls.controls.pause,
    stop: ttsControls.controls.stop,
    seek: ttsControls.controls.seek,
    isPlaying: ttsControls.isPlaying,
    isLoading: ttsControls.isLoading,
    progress: ttsControls.progress,
    error: ttsControls.error,
    currentWord: ttsControls.currentWord,
  };
};
