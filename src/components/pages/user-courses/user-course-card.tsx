import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Course } from "@/services/controllers/types/common/cours.type";

interface UserCourseCardProps {
  course: Course;
  index: number;
  className?: string;
  onDetailsClick?: (courseId: number) => void;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export const UserCourseCard = ({
  course,
  index,
  className,
  onDetailsClick,
}: UserCourseCardProps) => {
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
        <p className="text-base text-gray-500">
          Matière : {course.chapitre?.matiere?.libelle || "N/A"}
        </p>
        <p className="text-base text-gray-500">
          Niveau : {course.chapitre?.niveau?.libelle || "N/A"}
        </p>
        {/* Assuming created_at is available in course.chapitre or course itself */}
        {/* <p className="text-sm text-gray-500">
          Généré le : {new Date(course.created_at).toLocaleDateString()}
        </p> */}
      </div>

      {/* Footer avec bouton "Voir les détails" */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => onDetailsClick && onDetailsClick(course.id)}
          className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-xl px-6 h-11 font-medium w-full"
        >
          Voir les détails
        </Button>
      </div>
    </div>
  );
};
