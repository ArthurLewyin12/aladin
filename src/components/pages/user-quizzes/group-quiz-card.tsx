"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GroupQuizItem } from "@/services/controllers/types/common/groupe-quiz.types";
import { Users, Crown } from "lucide-react";

interface GroupQuizCardProps {
  quizItem: GroupQuizItem;
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

export const GroupQuizCard = ({
  quizItem,
  index,
  className,
  onDetailsClick,
}: GroupQuizCardProps) => {
  const { quiz, groupe, is_completed } = quizItem;
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <div
      className={cn(
        "relative rounded-3xl p-10 shadow-sm transition-all hover:shadow-md",
        bgColor,
        className,
      )}
    >
      {/* Badge Chef si applicable */}
      {groupe.isChief && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#FFE8D6] text-amber-800 px-3 py-1 rounded-full text-xs font-medium border border-amber-200">
          <Crown className="w-3 h-3" />
          Chef
        </div>
      )}

      {/* Badge Complété */}
      {is_completed && (
        <div className="absolute top-4 left-4 bg-[#D4EBE8] text-teal-800 px-3 py-1 rounded-full text-xs font-medium border border-teal-200">
          ✓ Complété
        </div>
      )}

      {/* Header avec titre du quiz */}
      <div className={cn("mb-4", groupe.isChief && "pr-20")}>
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
          {quiz.titre}
        </h3>
      </div>

      {/* Informations du groupe */}
      <div className="mb-3 pb-3 border-b border-gray-300/50">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-gray-600" />
          <p className="text-base font-semibold text-gray-900">{groupe.nom}</p>
        </div>
        {groupe.description && (
          <p className="text-sm text-gray-600 line-clamp-2 ml-6">
            {groupe.description}
          </p>
        )}
        <p className="text-sm text-gray-500 ml-6 mt-1">
          Type : {groupe.group_type}
        </p>
      </div>

      {/* Informations du quiz */}
      <div className="mb-6 space-y-1">
        <p className="text-sm text-gray-500">
          Créé le : {new Date(quiz.created_at).toLocaleDateString()}
        </p>
        <p className="text-base text-gray-500">
          Niveau : {groupe.niveau?.libelle || "N/A"}
        </p>
        <p className="text-sm text-gray-500">Difficulté : {quiz.difficulte}</p>
        <p className="text-base font-bold text-gray-900">
          Durée estimée : {quiz.temps} sec
        </p>
        <p className="text-sm text-gray-500">
          {quiz.nombre_questions} questions
        </p>
      </div>

      {/* Footer avec bouton */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={onDetailsClick}
          disabled={is_completed}
          className={cn(
            "bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-xl px-6 h-11 font-medium w-full",
            is_completed && "opacity-50 cursor-not-allowed",
          )}
        >
          {is_completed ? "Déjà complété" : "Voir les détails"}
        </Button>
      </div>
    </div>
  );
};
