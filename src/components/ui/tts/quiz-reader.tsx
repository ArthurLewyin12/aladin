"use client";

import { Button } from "@/components/ui/button";
import { useTTSReader } from "@/services/hooks/tts";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { QuizQuestion } from "@/services/controllers/types/common";

interface QuizReaderProps {
  /** Objet question complet */
  question: QuizQuestion;
  /** Index de la question (pour afficher "Question 1", "Question 2", etc.) */
  questionIndex: number;
  /** Variante du bouton */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /** Taille du bouton */
  size?: "default" | "sm" | "lg" | "icon";
  /** Classes CSS additionnelles */
  className?: string;
  /** Lire automatiquement au montage ? */
  autoPlay?: boolean;
}

/**
 * Composant spécialisé pour lire les questions de quiz avec leurs propositions
 * Format: "Question [numéro] : [question]. Option a : [texte], Option b : [texte], ..."
 *
 * @example
 * ```tsx
 * <QuizReader
 *   question={currentQuestion}
 *   questionIndex={currentQuestionIndex}
 * />
 * ```
 */
export const QuizReader = ({
  question,
  questionIndex,
  variant = "ghost",
  size = "sm",
  className,
  autoPlay = false,
}: QuizReaderProps) => {
  // Formater le texte pour la lecture
  const formatQuizText = () => {
    const letters = ["a", "b", "c", "d", "e", "f"];
    const questionPart = `Question ${questionIndex + 1} : ${question.question}.`;
    const optionsPart = question.propositions
      .map((prop, idx) => `Option ${letters[idx]} : ${prop.text}`)
      .join(", ");
    return `${questionPart} ${optionsPart}`;
  };

  const fullText = formatQuizText();

  const tts = useTTSReader(fullText, {
    autoplay: autoPlay,
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
      disabled={tts.isLoading || !question}
      className={cn(
        "transition-all",
        tts.isPlaying && "text-primary",
        className
      )}
      title={tts.isPlaying ? "Pause" : "Écouter la question"}
    >
      <Icon
        className={cn(
          "shrink-0",
          tts.isLoading && "animate-spin"
        )}
      />
      <span className="sr-only">
        {tts.isPlaying ? "Pause" : "Écouter la question"}
      </span>
    </Button>
  );
};
