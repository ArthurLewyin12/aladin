"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookMarked } from "lucide-react";

interface QuizCardProps {
  title: string;
  subject: string;
  numberOfQuestions: number;
  duration: number; // en secondes
  quizId: string;
  isActive: boolean;
  index: number;
  chapter?: string; // New prop - chapitre du quiz
  canManage?: boolean;
  onStatusChange?: (newStatus: boolean) => void;
  onViewGrades?: () => void;
  onViewDetails?: () => void; // New prop - pour voir les détails du quiz (questions/réponses)
  onStart?: () => void; // New prop
  hasTaken?: boolean; // New prop
  allMembersTaken?: boolean; // New prop
  nombre_eleves_soumis?: number; // New prop - nombre d'élèves ayant soumis
  createdAt?: string; // New prop - ISO date string
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

// Fonction pour formater la date en français
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("fr-FR", options);
  } catch {
    return "";
  }
};

export const QuizCard = ({
  title,
  subject,
  numberOfQuestions,
  duration,
  quizId,
  isActive: initialIsActive,
  index,
  chapter,
  canManage,
  onStatusChange,
  onViewGrades,
  onViewDetails,
  onStart,
  hasTaken,
  allMembersTaken,
  nombre_eleves_soumis = 0,
  createdAt,
  className,
}: QuizCardProps) => {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];

  // Sécuriser les valeurs pour éviter NaN et Infinity
  const safeNumberOfQuestions = numberOfQuestions || 0;
  const safeDuration = duration || 0;
  const durationPerQuestion = safeNumberOfQuestions > 0
    ? Math.floor(safeDuration / safeNumberOfQuestions)
    : 0;

  // State local pour optimistic update
  const [isActive, setIsActive] = useState(initialIsActive);

  // Synchroniser avec les données du serveur quand elles changent
  useEffect(() => {
    setIsActive(initialIsActive);
  }, [initialIsActive]);

  const handleStatusChange = (newStatus: boolean) => {
    // Mise à jour optimiste - changer l'UI immédiatement
    setIsActive(newStatus);

    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl p-10 shadow-sm transition-all hover:shadow-md",
        bgColor,
        className,
        !isActive && !canManage && "opacity-60",
      )}
    >
      {/* Header avec titre et switch */}
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 pr-2">
          {title}
        </h3>
        {canManage && (
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Label
                htmlFor={`quiz-status-${quizId}`}
                className="text-sm font-medium whitespace-nowrap"
              >
                {isActive ? "Publié" : "Brouillon"}
              </Label>
              <Switch
                id={`quiz-status-${quizId}`}
                checked={isActive}
                onCheckedChange={handleStatusChange}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </div>
            <p className="text-xs text-gray-600 italic text-right">
              {isActive ? "Visible par les élèves" : "Cliquez pour diffuser aux élèves"}
            </p>
          </div>
        )}
      </div>

      {/* Informations du quiz */}
      <div className="mb-6 space-y-1">
        <p className="text-sm text-gray-500">{subject}</p>
        {chapter && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <BookMarked className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <p className="text-sm text-gray-500 truncate">{chapter}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{chapter}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <p className="text-base text-gray-500">
          {safeNumberOfQuestions} question{safeNumberOfQuestions > 1 ? "s" : ""}
        </p>
        {safeNumberOfQuestions > 0 ? (
          <p className="text-base font-bold text-gray-900">
            {formatDuration(durationPerQuestion)} par question
          </p>
        ) : (
          <p className="text-base font-bold text-gray-900">
            Aucune question disponible
          </p>
        )}
        <p className="text-sm text-gray-500">
          Durée totale : {formatDuration(safeDuration)}
        </p>
        {createdAt && (
          <p className="text-sm text-gray-500 font-medium pt-1">
            Créé le {formatDate(createdAt)}
          </p>
        )}
      </div>

      {/* Footer avec boutons */}
      <div className="flex items-center justify-between gap-3">
        {canManage ? (
          // Vue professeur
          nombre_eleves_soumis === 0 ? (
            // Aucune soumission : afficher "En attente de soumission" + "Voir détails"
            <>
              <div className="flex-1 flex items-center justify-center bg-orange-100 border-2 border-orange-400 rounded-xl px-6 h-11">
                <p className="text-sm font-medium text-orange-700">
                  En attente de soumission
                </p>
              </div>
              <Button
                onClick={onViewDetails}
                variant="outline"
                className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-xl px-6 h-11 font-medium flex-1"
              >
                Voir détails
              </Button>
            </>
          ) : (
            // Des soumissions existent : afficher "Voir les notes" + nombre de soumissions
            <>
              <Button
                onClick={onViewGrades}
                variant="outline"
                className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-xl px-6 h-11 font-medium flex-1"
              >
                Voir les notes ({nombre_eleves_soumis})
              </Button>
              <Button
                onClick={onViewDetails}
                variant="outline"
                className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-xl px-6 h-11 font-medium flex-1"
              >
                Voir détails
              </Button>
            </>
          )
        ) : !hasTaken ? (
          // Vue élève : "Lancer le quiz" si pas encore passé
          <Button
            onClick={onStart}
            variant="outline"
            className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-xl px-6 h-11 font-medium flex-1"
          >
            Lancer le quiz
          </Button>
        ) : (
          // Vue élève : "Déjà passé" + "Voir les notes"
          <>
            <Button
              disabled
              variant="outline"
              className="bg-gray-200 border-2 border-gray-300 text-gray-500 rounded-xl px-6 h-11 font-medium flex-1"
            >
              Déjà passé
            </Button>
            <Button
              onClick={onViewGrades}
              disabled={!allMembersTaken}
              variant="outline"
              className={cn(
                "rounded-xl px-6 h-11 font-medium border-2 flex-1",
                allMembersTaken
                  ? "bg-white border-gray-900 text-gray-900 hover:bg-gray-50"
                  : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
              )}
              title={!allMembersTaken ? "En attente que tous les membres terminent le quiz" : ""}
            >
              Voir les notes
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
