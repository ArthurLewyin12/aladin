"use client";
import { useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOneCourse } from "@/services/hooks/cours/useGetOneCourse";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  MessageCircleQuestion,
} from "lucide-react";
import { MathText } from "@/components/ui/MathText";
import { GenerationLoadingOverlay } from "@/components/ui/generation-loading-overlay";
import { useTimeTracking } from "@/stores/useTimeTracking";

const courseLoadingMessages = [
  "Chargement de votre cours...",
  "Préparation du contenu...",
  "Récupération des informations...",
];

export default function SavedCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = parseInt(params.courseId as string);

  const { data, isLoading, isError, error } = useGetOneCourse(courseId);
  const { startTracking, stopTracking } = useTimeTracking();

  // Démarrer le tracking quand le cours est chargé
  useEffect(() => {
    if (!isLoading && data) {
      startTracking("revision", data.id, data.chapitre_id);
    }

    // Arrêter le tracking au démontage
    return () => {
      stopTracking();
    };
  }, [isLoading, data]);

  const parsedContent = useMemo(() => {
    if (!data || !data.data?.text) return [];

    const romanNumeralRegex = /^([IVXLCDM]+)\.\s/;

    return data.data.text.split("\n").map((line, index) => {
      const isTitle =
        romanNumeralRegex.test(line) ||
        (line.toUpperCase() === line && line.length > 0 && line.length < 100);
      return {
        id: index,
        type: isTitle && line.length < 100 ? "title" : "paragraph",
        content: line,
      };
    });
  }, [data]);

  // Memoized summary generation
  const summary = useMemo(() => {
    if (!data || !data.data?.text) return "";
    const conclusionIndex = data.data.text.indexOf("CONCLUSION");
    if (conclusionIndex !== -1) {
      return data.data.text
        .substring(conclusionIndex + "CONCLUSION".length)
        .trim();
    }
    // Fallback: take first 3 non-title lines
    return parsedContent
      .filter((line) => line.type === "paragraph" && line.content.length > 20)
      .slice(0, 3)
      .map((line) => line.content)
      .join(" ");
  }, [data, parsedContent]);

  const handleBack = () => router.back();

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
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  // On ne peut pas afficher la page si les données ne sont pas prêtes (et pas en chargement)
  if (!isLoading && !data) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-50 border-2 border-gray-200 rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold text-gray-700 mb-6">
            Aucune donnée disponible pour ce cours
          </p>
          <Button
            onClick={handleBack}
            className="bg-gray-600 hover:bg-gray-700 text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <GenerationLoadingOverlay
        isLoading={isLoading}
        messages={courseLoadingMessages}
      />

      {/* Header Sticky */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl px-4 py-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Retour</span>
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Cours sauvegardé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {data && (
        <main className="w-full mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Course Content Card */}
          <article className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-10 lg:p-14 mb-6">
            <div className="prose prose-lg max-w-none">
              {parsedContent.map((line) => (
                <div key={line.id}>
                  {line.type === "title" ? (
                    <h2 className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-8 first:mt-0 mb-4">
                      {line.content}
                    </h2>
                  ) : line.content.trim() ? (
                    <MathText
                      text={line.content}
                      className="text-base sm:text-lg text-gray-800 leading-relaxed mb-4"
                    />
                  ) : (
                    <div className="h-4" />
                  )}
                </div>
              ))}
            </div>
          </article>

          {/* Key Takeaways Section */}
          {summary && (
            <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 mb-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-500 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-amber-900">
                  Points clés à retenir
                </h2>
              </div>
              <MathText
                text={summary}
                className="text-base sm:text-lg text-amber-900 leading-relaxed"
              />
            </section>
          )}

          {/* FAQ Section */}
          {data.data?.questions && data.data.questions.length > 0 && (
            <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500 rounded-xl">
                  <MessageCircleQuestion className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Questions fréquentes
                </h2>
              </div>
              <div className="space-y-4">
                {data.data.questions.map((qa, index) => (
                  <details
                    key={index}
                    className="group bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-gray-200 p-5 rounded-2xl hover:border-indigo-300 transition-all duration-200 open:bg-white open:border-indigo-400 open:shadow-md"
                  >
                    <summary className="font-semibold text-base sm:text-lg cursor-pointer text-gray-900 flex items-start gap-3 list-none">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold mt-0.5">
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
  );
}
