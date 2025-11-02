"use client";

import { useEffect, useRef, useState } from "react";
import { useTTSPreferences } from "@/stores/useTTSPreferences";
import { TTSReaderOptions, TTSReaderControls } from "./types";

/**
 * Hook pour la lecture de texte avec Microsoft Edge TTS (API backend)
 * Utilise edge-tts qui offre des voix naturelles et gratuites
 *
 * @param text - Le texte à lire
 * @param options - Options de lecture (autoplay, callbacks)
 * @returns Contrôles de lecture et état
 */
export const useEdgeTTS = (
  text: string,
  options: TTSReaderOptions = {},
): TTSReaderControls => {
  const { preferences } = useTTSPreferences();
  const { autoplay, onStart, onEnd, onError } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousIsPlayingRef = useRef(false);

  // Initialiser l'élément audio
  useEffect(() => {
    const audio = new Audio();

    // Événements audio
    audio.onplay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      onStart?.();
    };

    audio.onended = () => {
      setIsPlaying(false);
      onEnd?.();
    };

    audio.onerror = (event) => {
      const errorMessage = `Erreur audio: ${audio.error?.message || "inconnu"}`;
      setError(errorMessage);
      setIsPlaying(false);
      onError?.(errorMessage);
    };

    audio.onpause = () => {
      setIsPlaying(false);
    };

    audio.onplay = () => {
      setIsPlaying(true);
    };

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [onStart, onEnd, onError]);

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
    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Appeler l'API TTS
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: "fr-FR-DeniseNeural", // Voix française par défaut
          rate: extractNumericValue(preferences.voiceSettings.rate),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur serveur TTS");
      }

      // Récupérer l'audio en blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Charger et jouer l'audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      setError(errorMessage);
      setIsLoading(false);
      onError?.(errorMessage);
    }
  };

  const pause = () => {
    if (audioRef.current && audioRef.current.paused === false) {
      audioRef.current.pause();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Helper pour extraire la valeur numérique
  const extractNumericValue = (value: string | undefined, defaultValue: number = 0): number => {
    if (!value) return defaultValue;
    const numericValue = parseFloat(value);
    return isNaN(numericValue) ? defaultValue : numericValue;
  };

  // Ne pas exposer si TTS est désactivé
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
