import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CoursEnfant } from "@/services/controllers/types/common/parent.types";
import { Loader2 } from "lucide-react";

interface ParentCourseCardProps {
  course: CoursEnfant;
  index: number;
  className?: string;
  onDetailsClick?: () => void;
  isLoading?: boolean;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export const ParentCourseCard = ({
  course,
  index,
  className,
  onDetailsClick,
  isLoading = false,
}: ParentCourseCardProps) => {
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
          {course.chapitre?.libelle || "Cours sans titre"}
        </h3>
      </div>

      {/* Informations du cours */}
      <div className="mb-6 space-y-1">
        {course.created_at && (
          <p className="text-sm text-gray-500">
            Généré le : {new Date(course.created_at).toLocaleDateString()}
          </p>
        )}
        <p className="text-base text-gray-500">
          Matière : {course.chapitre?.matiere?.libelle || "N/A"}
        </p>
        <p className="text-base text-gray-500">
          Niveau : {course.chapitre?.niveau?.libelle || "N/A"}
        </p>
        <p className="text-sm text-gray-500">
          Temps : {course.time} min
        </p>
        {course.has_content && (
          <p className="text-xs text-green-600">
            ✓ Contenu disponible
          </p>
        )}
        {course.has_questions && (
          <p className="text-xs text-green-600">
            ✓ Questions disponibles
          </p>
        )}
      </div>

      {/* Footer avec bouton "Voir les détails" */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={onDetailsClick}
          disabled={isLoading}
          className="bg-white border-2 border-[#548C2F] text-[#548C2F] hover:bg-[#F0F7EC] rounded-xl px-6 h-11 font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Chargement...
            </>
          ) : (
            "Voir le cours complet"
          )}
        </Button>
      </div>
    </div>
  );
};
