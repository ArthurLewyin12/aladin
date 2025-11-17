"use client";

import { useState, useEffect } from "react";
import { Clock, FileQuestion, BookOpen, Calendar, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ClasseQuiz } from "@/services/controllers/types/common/professeur.types";

interface ManualQuizCardProps {
  quiz: ClasseQuiz;
  cardColor: string;
  matiere?: string; // Nom de la matière
  onActivate?: () => void;
  onDeactivate?: () => void;
  onOpen?: () => void; // Pour voir les notes
  onViewDetails?: () => void; // Pour voir les détails (questions/réponses)
  className?: string;
}

const DIFFICULTY_COLORS = {
  Facile: "bg-green-100 text-green-800 border-green-200",
  Moyen: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Difficile: "bg-red-100 text-red-800 border-red-200",
};

export const ManualQuizCard = ({
  quiz,
  cardColor,
  matiere,
  onActivate,
  onDeactivate,
  onOpen,
  onViewDetails,
  className,
}: ManualQuizCardProps) => {
  const nombre_eleves_soumis = quiz.nombre_eleves_soumis ?? 0;
  const difficultyColor =
    DIFFICULTY_COLORS[quiz.difficulte as keyof typeof DIFFICULTY_COLORS] ||
    "bg-gray-100 text-gray-800 border-gray-200";

  // State local pour optimistic update
  const [isActive, setIsActive] = useState(quiz.is_active);

  // Synchroniser avec les données du serveur quand elles changent
  useEffect(() => {
    setIsActive(quiz.is_active);
  }, [quiz.is_active]);

  const handleStatusChange = (newStatus: boolean) => {
    // Mise à jour optimiste - changer l'UI immédiatement
    setIsActive(newStatus);

    if (newStatus && onActivate) {
      onActivate();
    } else if (!newStatus && onDeactivate) {
      onDeactivate();
    }
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpen) {
      onOpen();
    }
  };

  const numQuestions = quiz.data?.qcm?.length || 0;
  const hasApprofondissement =
    (quiz.data?.questions_approfondissement?.length || 0) > 0;

  // quiz.temps est le temps par question en secondes
  const tempsParQuestion = quiz.temps; // déjà en secondes
  const tempsTotal = tempsParQuestion * numQuestions; // temps total en secondes

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

  // Formater la date de création
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl p-8 shadow-sm transition-all hover:shadow-md",
        cardColor,
        className,
      )}
    >
      {/* Header avec titre et switch */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1 pr-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight mb-2">
            {quiz.titre}
          </h3>
          {/* Badge difficulté */}
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
              difficultyColor,
            )}
          >
            {quiz.difficulte}
          </span>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Label
            htmlFor={`quiz-status-${quiz.id}`}
            className="text-sm font-medium whitespace-nowrap"
          >
            {isActive ? "Publié" : "Partager"}
          </Label>
          <Switch
            id={`quiz-status-${quiz.id}`}
            checked={isActive}
            onCheckedChange={handleStatusChange}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
          />
        </div>
      </div>

      {/* Matière (si fournie) */}
      {matiere && (
        <p className="text-sm text-gray-600 mb-3 font-medium">{matiere}</p>
      )}

      {/* Informations du quiz */}
      <div className="space-y-2.5 mb-6">
        <div className="flex items-center gap-2 text-base text-gray-900">
          <FileQuestion className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold">
            {numQuestions} question{numQuestions > 1 ? "s" : ""}
            {hasApprofondissement && " + approfondissement"}
          </span>
        </div>

        {numQuestions > 0 ? (
          <>
            <div className="flex items-center gap-2 text-base text-gray-900">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <span className="font-bold">{formatDuration(tempsParQuestion)} par question</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Durée totale : {formatDuration(tempsTotal)}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-base text-gray-900">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">{formatDuration(quiz.temps)} par question</span>
          </div>
        )}

        {quiz.chapitres_ids && quiz.chapitres_ids.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span>
              {quiz.chapitres_ids.length} chapitre
              {quiz.chapitres_ids.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>Créé le {formatDate(quiz.created_at)}</span>
        </div>
      </div>

      {/* Footer avec boutons */}
      <div className="flex items-center justify-between gap-3">
        {nombre_eleves_soumis === 0 ? (
          // Aucune soumission : afficher "En attente de soumission" + "Voir détails"
          <>
            <div className="flex-1 flex items-center justify-center bg-orange-100 border-2 border-orange-400 rounded-xl px-6 h-11">
              <p className="text-sm font-medium text-orange-700">
                En attente de soumission
              </p>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetails) onViewDetails();
              }}
              variant="outline"
              className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-xl px-6 h-11 font-medium flex-1"
            >
              Voir détails
            </Button>
          </>
        ) : (
          // Des soumissions existent : afficher "Voir les notes" + nombre de soumissions + "Voir détails"
          <>
            <Button
              onClick={handleOpen}
              variant="outline"
              className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-xl px-6 h-11 font-medium flex-1"
            >
              Voir les notes ({nombre_eleves_soumis})
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetails) onViewDetails();
              }}
              variant="outline"
              className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-xl px-6 h-11 font-medium flex-1"
            >
              Voir détails
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

