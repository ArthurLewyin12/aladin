"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface QuizCardProps {
  title: string;
  subject: string;
  numberOfQuestions: number;
  duration: number; // en secondes
  quizId: string;
  isActive: boolean;
  index: number;
  canManage?: boolean;
  onStatusChange?: (newStatus: boolean) => void;
  onViewGrades?: () => void;
  onStart?: () => void; // New prop
  hasTaken?: boolean; // New prop
  allMembersTaken?: boolean; // New prop
  className?: string;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

// Fonction pour formater la durée en secondes
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds} sec`;
  } else if (remainingSeconds === 0) {
    return `${minutes} min`;
  } else {
    return `${minutes} min ${remainingSeconds} sec`;
  }
};

export const QuizCard = ({
  title,
  subject,
  numberOfQuestions,
  duration,
  quizId,
  isActive,
  index,
  canManage,
  onStatusChange,
  onViewGrades,
  onStart, // New prop
  hasTaken, // New prop
  allMembersTaken, // New prop
  className,
}: QuizCardProps) => {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <div
      className={cn(
        "relative rounded-3xl p-10 shadow-sm transition-all hover:shadow-md",
        bgColor,
        className,
        !isActive && "opacity-60",
      )}
    >
      {/* Header avec titre et switch */}
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 pr-2">
          {title}
        </h3>
        <div className="mt-1 flex items-center space-x-2">
          <Label
            htmlFor={`quiz-status-${quizId}`}
            className="text-sm font-medium"
          >
            {isActive ? "Activé" : "Désactivé"}
          </Label>
          {canManage && (
            <Switch
              id={`quiz-status-${quizId}`}
              checked={isActive}
              onCheckedChange={onStatusChange}
            />
          )}
        </div>
      </div>

      {/* Informations du quiz */}
      <div className="mb-6 space-y-1">
        <p className="text-sm text-gray-500">{subject}</p>
        <p className="text-base text-gray-500">{numberOfQuestions} questions</p>
        <p className="text-base font-bold text-gray-900">
          {formatDuration(Math.floor(duration / numberOfQuestions))} par
          question
        </p>
        <p className="text-sm text-gray-500">
          Durée totale : {formatDuration(duration)}
        </p>
      </div>

      {/* Footer avec boutons */}
      <div className="flex items-center justify-end gap-3">
        {!hasTaken ? (
          <Button
            onClick={onStart}
            variant="outline"
            className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-xl px-6 h-11 font-medium w-full"
          >
            Lancer le quiz
          </Button>
        ) : (
          <>
            <Button
              disabled
              variant="outline"
              className={cn(
                "bg-gray-200 border-2 border-gray-300 text-gray-500 rounded-xl px-6 h-11 font-medium",
                { "w-full": !allMembersTaken },
              )}
            >
              Déjà passé
            </Button>
            {allMembersTaken && onViewGrades && (
              <Button
                onClick={onViewGrades}
                variant="outline"
                className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-xl px-6 h-11 font-medium"
              >
                Voir les notes
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
