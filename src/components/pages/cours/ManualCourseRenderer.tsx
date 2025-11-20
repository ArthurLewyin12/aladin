import { MathText } from "@/components/ui/MathText";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Calculator, Image, Table, Video } from "lucide-react";

interface ManualCourseRendererProps {
  course: {
    titre: string;
    html?: string;
    plain_text?: string;
    classe: {
      nom: string;
    };
    chapitre: {
      libelle: string;
    };
    metadata?: {
      has_math: boolean;
      has_images: boolean;
      has_tables: boolean;
      has_videos: boolean;
      word_count: number;
      image_count: number;
      table_count: number;
      video_count: number;
    };
  };
}

export function ManualCourseRenderer({ course }: ManualCourseRendererProps) {
  // Fonction pour rendre le HTML de manière sécurisée
  const renderHTML = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <div className="space-y-6">
      {/* Header avec informations du cours */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {course.titre}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {course.classe?.nom}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {course.chapitre?.libelle}
          </span>
        </div>

        {/* Métadonnées du cours */}
        {course.metadata && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {course.metadata.has_math && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calculator className="w-3 h-3" />
                Maths
              </Badge>
            )}
            {course.metadata.has_images && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Image className="w-3 h-3" />
                Images ({course.metadata.image_count})
              </Badge>
            )}
            {course.metadata.has_tables && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Table className="w-3 h-3" />
                Tableaux ({course.metadata.table_count})
              </Badge>
            )}
            {course.metadata.has_videos && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                Vidéos ({course.metadata.video_count})
              </Badge>
            )}
            <Badge variant="outline">{course.metadata.word_count} mots</Badge>
          </div>
        )}
      </div>

      {/* Contenu du cours manuel */}
      {course.html ? (
        <Card>
          <CardContent className="p-6">
            <div
              className="prose prose-base sm:prose-base md:prose-lg lg:prose-lg max-w-none text-gray-800
                         prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900
                         prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700
                         prose-blockquote:text-gray-600 prose-code:text-gray-800 prose-pre:bg-gray-100"
              dangerouslySetInnerHTML={renderHTML(course.html)}
            />
          </CardContent>
        </Card>
      ) : course.plain_text ? (
        <Card>
          <CardContent className="p-6">
            <div className="prose prose-base sm:prose-base md:prose-lg lg:prose-lg max-w-none text-gray-800">
              <MathText text={course.plain_text} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <p>Contenu du cours non disponible</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
