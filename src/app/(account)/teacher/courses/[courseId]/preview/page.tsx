"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  AlertCircle,
  BookOpen,
  Users,
  Calendar,
} from "lucide-react";
import { useCourse } from "@/services/hooks/professeur/useCourse";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function CoursePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);

  const { data: course, isLoading } = useCourse(courseId);

  const handleBack = () => {
    router.push("/teacher/courses");
  };

  const handleEdit = () => {
    router.push(`/teacher/courses/${courseId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Cours introuvable ou accès non autorisé.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div
          className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
          style={{
            backgroundImage: `url("/bg-2.png")`,
            backgroundSize: "180px 180px",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full bg-white hover:bg-gray-50 w-9 h-9 sm:w-10 sm:h-10 shadow-sm flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 leading-tight">
              Aperçu du cours
            </h1>
          </div>
        </div>

        {/* Course Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Course Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Informations du cours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {course.titre}
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <Badge
                      variant={course.is_active ? "default" : "secondary"}
                      className={
                        course.is_active
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-500 text-white"
                      }
                    >
                      {course.is_active ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-700">
                  {course.classe && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{course.classe.nom}</span>
                    </div>
                  )}
                  {course.chapitre && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span>Chapitre: {course.chapitre.libelle}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>
                      Modifié{" "}
                      {format(
                        new Date(course.updated_at),
                        "dd/MM/yyyy 'à' HH:mm",
                        { locale: fr },
                      )}
                    </span>
                  </div>
                </div>

                {course.content?.metadata && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Statistiques
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>📝 {course.content.metadata.word_count} mots</div>
                      <div>🔤 {course.content.metadata.character_count} caractères</div>
                      {course.content.metadata.has_images && (
                        <div>🖼️ {course.content.metadata.image_count} image{course.content.metadata.image_count > 1 ? 's' : ''}</div>
                      )}
                      {course.content.metadata.has_videos && (
                        <div>🎥 {course.content.metadata.video_count} vidéo{course.content.metadata.video_count > 1 ? 's' : ''}</div>
                      )}
                      {course.content.metadata.has_tables && (
                        <div>📊 {course.content.metadata.table_count} tableau{course.content.metadata.table_count > 1 ? 'x' : ''}</div>
                      )}
                      {course.content.metadata.has_math && (
                        <div>➗ Formules mathématiques</div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={handleEdit}
                  className="w-full bg-[#2C3E50] hover:bg-[#1a252f] text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Éditer le cours
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Course Content Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu du contenu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px]">
                  {course.content?.html ? (
                    <div
                      className="prose prose-lg max-w-none p-6 bg-white rounded-lg border border-gray-200"
                      dangerouslySetInnerHTML={{ __html: course.content.html }}
                    />
                  ) : course.content?.plain_text ? (
                    <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="prose prose-gray max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700">
                          {course.content.plain_text}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <BookOpen className="w-12 h-12 mb-4 text-gray-400" />
                      <p className="text-center">
                        Aucun contenu disponible.
                        <br />
                        Éditez ce cours pour ajouter du contenu.
                      </p>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
