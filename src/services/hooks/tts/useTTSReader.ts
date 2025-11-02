"use client";

import { useEffect, useRef, useState } from "react";
import { useTTSPreferences } from "@/stores/useTTSPreferences";
import { TTSReaderOptions, TTSReaderControls } from "./types";

/**
 * Hook personnalisé pour la lecture de texte avec synthèse vocale
 * Utilise Web Speech API (native du navigateur) au lieu de Bing TTS
 * Évite les problèmes de tokens expirés et d'accès externe
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const previousIsPlayingRef = useRef(false);

  // Initialiser la synthèse vocale
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setError("Web Speech API not supported");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Utiliser la voix française si disponible
    let voices = speechSynthesis.getVoices();

    // Si pas de voix, attendre l'événement voiceschanged
    if (voices.length === 0) {
      const loadVoices = () => {
        voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          applyVoiceSettings();
          speechSynthesis.removeEventListener("voiceschanged", loadVoices);
        }
      };
      speechSynthesis.addEventListener("voiceschanged", loadVoices);
      // Fallback: appliquer les paramètres même sans voix custom
      setTimeout(applyVoiceSettings, 500);
    } else {
      applyVoiceSettings();
    }

    function applyVoiceSettings() {
      const availableVoices = speechSynthesis.getVoices();
      const frenchVoice = availableVoices.find(
        (voice) =>
          voice.lang.startsWith("fr") ||
          voice.name.toLowerCase().includes("french"),
      );

      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
    }

    // Appliquer les paramètres utilisateur
    // Les valeurs sont en format "+X%" ou "+XHz", donc on doit extraire le nombre
    const extractNumericValue = (value: string | undefined, defaultValue: number = 1): number => {
      if (!value) return defaultValue;
      const numericValue = parseFloat(value);
      return isNaN(numericValue) ? defaultValue : numericValue;
    };

    const rateValue = extractNumericValue(preferences.voiceSettings.rate);
    const pitchValue = extractNumericValue(preferences.voiceSettings.pitch);
    const volumeValue = extractNumericValue(preferences.voiceSettings.volume);

    utterance.rate = Math.max(0.1, Math.min(2, rateValue));
    utterance.pitch = Math.max(0, Math.min(2, pitchValue));
    utterance.volume = Math.max(0, Math.min(1, volumeValue));

    // Événements
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
      onStart?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      onEnd?.();
    };

    utterance.onerror = (event) => {
      const errorMessage = `Speech synthesis error: ${event.error}`;
      setError(errorMessage);
      setIsPlaying(false);
      onError?.(errorMessage);
    };

    utterance.onpause = () => {
      setIsPlaying(false);
    };

    utterance.onresume = () => {
      setIsPlaying(true);
    };

    synthesisRef.current = utterance;

    // Autoplay si activé
    if (autoplay ?? preferences.autoPlay) {
      setIsLoading(true);
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 100);
    }

    return () => {
      // NE PAS annuler la parole au cleanup, sinon chaque re-render arrête la lecture!
      // speechSynthesis.cancel();
    };
  }, [
    text,
    preferences.voiceSettings,
    preferences.autoPlay,
    autoplay,
    onStart,
    onEnd,
    onError,
  ]);

  // Callbacks pour les événements
  useEffect(() => {
    if (isPlaying && !previousIsPlayingRef.current) {
      onStart?.();
    }

    if (!isPlaying && previousIsPlayingRef.current) {
      onEnd?.();
    }

    previousIsPlayingRef.current = isPlaying;
  }, [isPlaying, onStart, onEnd]);

  const play = async () => {
    if (!synthesisRef.current) return;

    if (isPlaying) {
      speechSynthesis.resume();
    } else {
      setIsLoading(true);
      setError(null);
      speechSynthesis.cancel();
      speechSynthesis.speak(synthesisRef.current);
    }
  };

  const pause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const seek = () => {
    // Web Speech API n'a pas de contrôle de position
    // Cela n'est pas implémenté nativement
  };

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
    play,
    pause,
    stop,
    seek,
    isPlaying,
    isLoading,
    progress,
    error,
    currentWord: null,
  };
};
