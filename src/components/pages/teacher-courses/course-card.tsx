import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, Edit, Trash2, BookOpen, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CourseCardProps {
  course: {
    id: number;
    titre: string;
    classe?: {
      id: number;
      nom: string;
    };
    chapitre?: {
      id: number;
      libelle: string;
    };
    matiere?: {
      id: number;
      libelle: string;
    };
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  cardColor: string;
  onEdit?: (courseId: number) => void;
  onDelete?: (courseId: number) => void;
  onPreview?: (courseId: number) => void;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
  "bg-[#F0F9FF]", // Bleu très clair
  "bg-[#FEF3C7]", // Jaune clair
];

export function CourseCard({ course, cardColor, onEdit, onDelete, onPreview }: CourseCardProps) {
  const router = useRouter();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(course.id);
    } else {
      router.push(`/teacher/courses/${course.id}/edit`);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(course.id);
    } else {
      router.push(`/teacher/courses/${course.id}/preview`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(course.id);
    }
  };

  return (
    <Card className={`${cardColor} border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-2">
              {course.titre}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                variant={course.is_active ? "default" : "secondary"}
                className={`text-xs ${
                  course.is_active
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {course.is_active ? "Publié" : "Brouillon"}
              </Badge>
            </div>
          </div>
          <div className="flex-shrink-0">
            <BookOpen className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Informations du cours */}
          <div className="space-y-2 text-sm text-gray-700">
            {course.classe && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="truncate">{course.classe.nom}</span>
              </div>
            )}
            {course.matiere && (
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span className="truncate">{course.matiere.libelle}</span>
              </div>
            )}
            {course.chapitre && (
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span className="truncate">Chapitre: {course.chapitre.libelle}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs">
                Modifié {format(new Date(course.updated_at), "dd/MM/yyyy", { locale: fr })}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePreview}
              className="flex-1 bg-white/80 hover:bg-white border-gray-300 text-gray-700 hover:text-gray-900"
            >
              <Eye className="w-4 h-4 mr-1" />
              Aperçu
            </Button>
            <Button
              size="sm"
              onClick={handleEdit}
              className="flex-1 bg-[#2C3E50] hover:bg-[#1a252f] text-white"
            >
              <Edit className="w-4 h-4 mr-1" />
              Éditer
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="bg-white/80 hover:bg-red-50 border-red-300 text-red-600 hover:text-red-700 hover:border-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}