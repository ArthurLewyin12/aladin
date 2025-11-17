import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, Edit, BookOpen, Calendar, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CourseCardProps {
  course: {
    id: number;
    titre: string;
    type?: "manuel" | "genere";
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
  onActivate?: () => void;
  onDeactivate?: () => void;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
  "bg-[#F0F9FF]", // Bleu très clair
  "bg-[#FEF3C7]", // Jaune clair
];

export function CourseCard({ course, cardColor, onEdit, onDelete, onPreview, onActivate, onDeactivate }: CourseCardProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(course.is_active);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(course.id);
    } else {
      // Rediriger vers edit-ia pour les cours générés par IA, sinon vers edit
      const editPath =
        course.type === "genere"
          ? `/teacher/courses/${course.id}/edit-ia`
          : `/teacher/courses/${course.id}/edit`;
      router.push(editPath);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(course.id);
    } else {
      // Route to appropriate preview page based on course type
      const previewPath =
        course.type === "genere"
          ? `/teacher/courses/${course.id}/preview-ia`
          : `/teacher/courses/${course.id}/preview`;
      router.push(previewPath);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(course.id);
    }
  };

  const handleStatusChange = (newStatus: boolean) => {
    // Optimistic update - change the UI immediately
    setIsActive(newStatus);

    if (newStatus && onActivate) {
      onActivate();
    } else if (!newStatus && onDeactivate) {
      onDeactivate();
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
                variant={isActive ? "default" : "secondary"}
                className={`text-xs ${
                  isActive
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {isActive ? "Publié" : "Brouillon"}
              </Badge>
              {course.type && (
                <Badge
                  className={`text-xs font-medium ${
                    course.type === "genere"
                      ? "bg-[#D4EBE8] text-gray-700 hover:bg-[#C5DED9]"
                      : "bg-[#FFE8D6] text-gray-700 hover:bg-[#FFD9C2]"
                  }`}
                >
                  {course.type === "genere" ? "IA" : "Manuel"}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Label
                htmlFor={`course-status-${course.id}`}
                className="text-sm font-medium whitespace-nowrap"
              >
                {isActive ? "Publié" : "Brouillon"}
              </Label>
              <Switch
                id={`course-status-${course.id}`}
                checked={isActive}
                onCheckedChange={handleStatusChange}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </div>
            <p className="text-xs text-gray-600 italic">
              {isActive ? "Visible par les élèves" : "Activer pour partager"}
            </p>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}