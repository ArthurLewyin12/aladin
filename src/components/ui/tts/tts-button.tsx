"use client";

import { Button } from "@/components/ui/button";
import { useTTSReader } from "@/services/hooks/tts";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

interface TTSButtonProps {
  /** Le texte à lire */
  text: string;
  /** Variante du bouton (par défaut: "ghost") */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  /** Taille du bouton */
  size?: "default" | "sm" | "lg" | "icon";
  /** Classes CSS additionnelles */
  className?: string;
  /** Afficher le label "Écouter" ? */
  showLabel?: boolean;
  /** Label personnalisé */
  label?: string;
}

/**
 * Bouton de lecture audio pour le text-to-speech
 *
 * @example
 * ```tsx
 * <TTSButton text="Contenu du cours..." />
 * <TTSButton text="Question de quiz" showLabel />
 * <TTSButton text="Texte" variant="outline" size="sm" />
 * ```
 */
export const TTSButton = ({
  text,
  variant = "ghost",
  size = "sm",
  className,
  showLabel = false,
  label = "Écouter",
}: TTSButtonProps) => {
  const tts = useTTSReader(text, {
    onError: (error) => {
      toast({
        variant: "error",
        title: "Erreur de lecture audio",
        message: error,
      });
    },
  });

  const handleClick = async () => {
    if (tts.isPlaying) {
      tts.pause();
    } else {
      await tts.play();
    }
  };

  // Icône selon l'état
  const Icon = tts.isLoading ? Loader2 : tts.isPlaying ? VolumeX : Volume2;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={tts.isLoading || !text}
      className={cn(
        "transition-all",
        tts.isPlaying && "text-primary",
        className,
      )}
      title={tts.isPlaying ? "Pause" : "Écouter"}
    >
      <Icon className={cn("shrink-0", tts.isLoading && "animate-spin")} />
      {showLabel && <span>{tts.isPlaying ? "Pause" : label}</span>}
    </Button>
  );
};
