"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/services/controllers/types/common/quiz.types";
import { convertScoreToNote } from "@/lib/quiz-score";
import { BookOpen, Users } from "lucide-react";

interface ClassQuizCardProps {
  quiz: Quiz & { classe?: { id: number; nom: string } };
  index: number;
  className?: string;
  onLaunchClick?: () => void;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export const ClassQuizCard = ({
  quiz,
  index,
  className,
  onLaunchClick,
}: ClassQuizCardProps) => {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];

  const totalQuestions = quiz.questions?.length || 0;
  const latestNote = quiz.notes && quiz.notes.length > 0 ? quiz.notes[0] : null;
  const noteSur20 = latestNote ? convertScoreToNote(latestNote.note, totalQuestions) : null;

  return (
    <div
      className={cn(
        "relative rounded-3xl p-6 sm:p-8 shadow-sm transition-all hover:shadow-md",
        bgColor,
        className,
      )}
    >
      {/* Header avec titre */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 flex-1">
          {(quiz as any).titre || quiz.chapitre?.libelle || "Quiz sans titre"}
        </h3>
      </div>

      {/* Classe et Professeur */}
      <div className="mb-4 space-y-2 pb-4 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-700">
            Classe : {quiz.classe?.nom || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <span className="text-sm text-gray-600">
            {quiz.chapitre?.matiere?.libelle || "N/A"}
          </span>
        </div>
      </div>

      {/* Informations du quiz */}
      <div className="mb-6 space-y-1 text-sm">
        <p className="text-gray-600">
          Chapitre : {quiz.chapitre?.libelle || "N/A"}
        </p>
        <p className="text-gray-600">
          Niveau : {quiz.chapitre?.niveau?.libelle || "N/A"}
        </p>
        <p className="text-gray-600">
          Difficulté : <span className="font-semibold">{quiz.difficulte}</span>
        </p>
        <p className="text-gray-600">
          Durée : {quiz.time ? Math.ceil(quiz.time / 60) : 10} min ({totalQuestions} questions)
        </p>
        <p className="text-xs text-gray-500">
          Créé le : {new Date(quiz.created_at).toLocaleDateString("fr-FR")}
        </p>
        {noteSur20 !== null && (
          <p className="text-base font-bold text-green-600 mt-2">
            ✓ Note : {noteSur20}/20 ({latestNote.note}/{totalQuestions})
          </p>
        )}
      </div>

      {/* Footer avec bouton de lancement */}
      <div className="flex gap-2">
        <Button
          onClick={onLaunchClick}
          disabled={noteSur20 !== null} // Désactiver si déjà complété
          className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-2.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {noteSur20 !== null ? "Quiz complété" : "Lancer le quiz"}
        </Button>
      </div>
    </div>
  );
};
