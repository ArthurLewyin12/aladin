"use client";
import { useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCourse } from "@/services/hooks/cours/useCourses";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  MessageCircleQuestion,
} from "lucide-react";
import { GenerateCoursSuccessResponse } from "@/services/controllers/types/common/cours.type";
import { MathText } from "@/components/ui/MathText";
import { GenerationLoadingOverlay } from "@/components/ui/generation-loading-overlay";
import { useTimeTracking } from "@/stores/useTimeTracking";
import { useDocumentUpload } from "@/stores/useDocumentUpload";
import { useEleves } from "@/services/hooks/repetiteur";
import { TTSButton } from "@/components/ui/tts";

const courseLoadingMessages = [
  "Génération du cours personnalisé...",
  "Analyse des concepts clés du chapitre...",
  "Synthèse des informations importantes...",
  "Préparation des exemples et illustrations...",
  "Finalisation du cours...",
];

export default function RepetiteurCoursePage() {
  const router = useRouter();
  const params = useParams();
  const chapterId = params.chapterId as string;

  // Récupérer l'élève actif
  const { data: elevesData } = useEleves();
  const eleveActif = elevesData?.eleve_actif;

  // Récupérer le document depuis le store Zustand
  const { pendingDocument, clearPendingDocument } = useDocumentUpload();

  const { data, isLoading, isError, error } = useCourse(
    chapterId,
    pendingDocument || undefined,
  );
  const { startTracking, stopTracking } = useTimeTracking();

  // Nettoyer le document après avoir chargé le cours
  useEffect(() => {
    if (!isLoading && data) {
      clearPendingDocument();
    }
  }, [isLoading, data, clearPendingDocument]);

  // Démarrer le tracking quand le cours est chargé
  useEffect(() => {
    if (!isLoading && data && "cours_id" in data) {
      const courseData = data as GenerateCoursSuccessResponse;
      startTracking("revision", courseData.cours_id, Number(chapterId));
    }

    // Arrêter le tracking au démontage
    return () => {
      stopTracking();
    };
  }, [isLoading, data, chapterId]);

  const parsedContent = useMemo(() => {
    if (!data || !("text" in data)) return [];

    const courseData = data as GenerateCoursSuccessResponse;
    const romanNumeralRegex = /^([IVXLCDM]+)\.\s/;

    return courseData.text.split("\n").map((line, index) => {
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
    if (!data || !("text" in data)) return "";
    const courseData = data as GenerateCoursSuccessResponse;
    const conclusionIndex = courseData.text.indexOf("CONCLUSION");
    if (conclusionIndex !== -1) {
      return courseData.text
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

  const handleBack = () => {
    if (eleveActif) {
      // Retourner vers l'onglet Cours de l'élève
      router.push(`/repetiteur/students/${eleveActif.id}?tab=cours`);
    } else {
      router.push("/repetiteur/students");
    }
  };

  if (isError || (data && !("text" in data))) {
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

  const courseData = data as GenerateCoursSuccessResponse;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
              className="flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl w-12 h-12 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-3">
                {courseData && (
                  <TTSButton
                    text={courseData.text}
                    variant="outline"
                    size="sm"
                    showLabel
                    label="Écouter le cours"
                  />
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Cours personnalisé</span>
                </div>
              </div>
              {eleveActif && (
                <span className="text-xs text-[#548C2F] font-medium">
                  Pour {eleveActif.prenom}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {data && (
        <main className="w-full mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Course Content Card */}
          <article className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-10 lg:p-14 mb-6">
            <div
              className={`
              prose prose-base sm:prose-base md:prose-lg lg:prose-lg max-w-none
              prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:text-[#548C2F]
              prose-p:my-3 prose-p:leading-7 prose-p:text-gray-800
              prose-strong:text-[#4a7829] prose-strong:font-semibold
              prose-ul:my-4 prose-li:my-1
              prose-ol:my-4 prose-ol:list-decimal
            `}
            >
              {parsedContent.map((line) => (
                <div key={line.id}>
                  {line.type === "title" ? (
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#548C2F] mt-8 first:mt-0 mb-4">
                      {line.content}
                    </h2>
                  ) : line.content.trim() ? (
                    <MathText
                      text={line.content}
                      className="block my-3 leading-7"
                    />
                  ) : (
                    <div className="h-3" />
                  )}
                </div>
              ))}
            </div>
          </article>

          {/* Key Takeaways Section */}
          <section className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 sm:p-8 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#548C2F] rounded-xl">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2d5a1a]">
                Points clés à retenir
              </h2>
            </div>
            <MathText
              text={summary}
              className="text-base sm:text-lg text-[#2d5a1a] leading-relaxed"
            />
          </section>

          {/* FAQ Section */}
          {courseData.questions && courseData.questions.length > 0 && (
            <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#548C2F] rounded-xl">
                  <MessageCircleQuestion className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Questions fréquentes
                </h2>
              </div>
              <div className="space-y-4">
                {courseData.questions.map((qa, index) => (
                  <details
                    key={index}
                    className="group bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-5 rounded-2xl hover:border-green-300 transition-all duration-200 open:bg-white open:border-green-400 open:shadow-md"
                  >
                    <summary className="font-semibold text-base sm:text-lg cursor-pointer text-gray-900 flex items-start gap-3 list-none">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-[#548C2F] flex items-center justify-center text-sm font-bold mt-0.5">
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

