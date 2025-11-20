"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOneEleveCourse } from "@/services/hooks/eleve/useGetOneEleveCourse";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircleQuestion } from "lucide-react";
import { MathText } from "@/components/ui/MathText";
import { useTimeTracking } from "@/stores/useTimeTracking";
import { Spinner } from "@/components/ui/spinner";
import { ManualCourseRenderer } from "@/components/pages/cours/ManualCourseRenderer";
import { AICourseRenderer } from "@/components/pages/cours/AICourseRenderer";

export default function ClasseCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);

  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useGetOneEleveCourse(courseId);
  const { startTracking, stopTracking } = useTimeTracking();

  // Démarrer le tracking quand le cours est chargé
  useEffect(() => {
    if (!isLoading && course) {
      startTracking("revision", course.id, course.chapitre.id);
    }
    return () => stopTracking();
  }, [isLoading, course, startTracking, stopTracking]);

  const handleBack = () => router.back();

  // Gestion des erreurs
  if (isError) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold text-red-600 mb-2">
            Erreur lors du chargement du cours
          </p>
          <p className="text-sm text-red-500 mb-6">{(error as any)?.message}</p>
          <Button
            onClick={handleBack}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl w-12 h-12 p-0 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Cours non trouvé
  if (!isLoading && !course) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-50 border-2 border-gray-200 rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold text-gray-700 mb-6">
            Cours introuvable
          </p>
          <Button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl w-12 h-12 p-0 justify-center transition-all"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Chargement
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-lg font-medium text-gray-700">
            Chargement de votre cours...
          </p>
          <p className="text-sm text-gray-500">Récupération du contenu</p>
        </div>
      </div>
    );
  }

  const isManualCourse = course?.type === "manuel";
  const isAICourse = course?.type === "genere";

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="mt-2 sm:mt-4 w-full flex items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
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

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 leading-tight">
              Cours de classe
            </h1>
          </div>
        </div>

        {/* Main Content */}
        {course && (
          <main className="w-full max-w-6xl mx-auto py-8 sm:py-12 space-y-6">
            {isManualCourse ? (
              <ManualCourseRenderer course={course} />
            ) : isAICourse ? (
              <AICourseRenderer course={course} getCourseData={() => {}} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-600 mb-4">
                  Format de cours non reconnu
                </p>
              </div>
            )}

            {/* Questions d'approfondissement (uniquement pour les cours IA) */}
            {isAICourse && course.data?.questions && course.data.questions.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-500 rounded-xl">
                    <MessageCircleQuestion className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Questions d'approfondissements
                  </h2>
                </div>
                <div className="space-y-4">
                  {course.data.questions.map((qa: any, index: number) => (
                    <details
                      key={index}
                      className="group bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 p-5 rounded-2xl hover:border-orange-300 transition-all duration-200 open:bg-white open:border-orange-400 open:shadow-md"
                    >
                      <summary className="font-semibold text-base sm:text-lg cursor-pointer text-gray-900 flex items-start gap-3 list-none">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mt-0.5">
                          {index + 1}
                        </span>
                        <MathText text={qa.question} className="flex-1" />
                      </summary>
                      <div className="mt-4 pl-9">
                        <MathText
                          text={qa.reponse}
                          className="text-sm sm:text-base text-gray-700 leading-relaxed"
                        />
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
