"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/services/controllers/types/common/quiz.types";

interface UserQuizCardProps {
  quiz: Quiz;
  index: number;
  className?: string;
  onDetailsClick?: () => void;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export const UserQuizCard = ({
  quiz,
  index,
  className,
  onDetailsClick,
}: UserQuizCardProps) => {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <div
      className={cn(
        "relative rounded-3xl p-10 shadow-sm transition-all hover:shadow-md",
        bgColor,
        className,
      )}
    >
      {/* Header avec titre */}
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 pr-2">
          {quiz.chapitre?.libelle || "Quiz sans titre"}
        </h3>
      </div>

      {/* Informations du quiz */}
      <div className="mb-6 space-y-1">
        <p className="text-sm text-gray-500">
          Généré le : {new Date(quiz.created_at).toLocaleDateString()}
        </p>
        <p className="text-base text-gray-500">
          Niveau : {quiz.chapitre?.niveau?.libelle || "N/A"}
        </p>
        <p className="text-sm text-gray-500">Difficulté : {quiz.difficulte}</p>
        <p className="text-base font-bold text-gray-900">
          Durée estimée : {quiz.time} min
        </p>
        <p className="text-base text-gray-500">
          Matière : {quiz.chapitre?.matiere?.libelle || "N/A"}
        </p>
      </div>

      {/* Footer avec bouton "Voir les détails" */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={onDetailsClick}
          className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-xl px-6 h-11 font-medium w-full"
        >
          Voir les détails
        </Button>
      </div>
    </div>
  );
};
