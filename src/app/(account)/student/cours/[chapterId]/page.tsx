"use client";
import { useMemo, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCourse } from "@/services/hooks/cours/useCourses";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, BookOpen, MessageCircleQuestion } from "lucide-react";
import { GenerateCoursSuccessResponse } from "@/services/controllers/types/common/cours.type";
import { MathText } from "@/components/ui/MathText";
import { GenerationLoadingOverlay } from "@/components/ui/generation-loading-overlay";
import { useTimeTracking } from "@/stores/useTimeTracking";
import { useDocumentUpload } from "@/stores/useDocumentUpload";

const courseLoadingMessages = [
  "Génération de votre cours personnalisé...",
  "Analyse des concepts clés du chapitre...",
  "Synthèse des informations importantes...",
  "Préparation des exemples et illustrations...",
  "Finalisation du cours...",
];

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const chapterId = params.chapterId as string;

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

  const handleBack = () => router.back();

  if (isError || (data && !("text" in data) && !("course_data" in data))) {
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
            className="bg-gray-600 hover:bg-gray-700 text-white rounded-xl w-12 h-12 p-0 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    );
  }

  const courseData = data as GenerateCoursSuccessResponse;
  const hasStructuredCourseData =
    data && typeof data === "object" && "course_data" in data;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GenerationLoadingOverlay
        isLoading={isLoading}
        messages={courseLoadingMessages}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec bouton retour et titre */}
        <div
          className="mt-2 sm:mt-4 w-full flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
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
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 leading-tight">
              Cours généré
            </h1>
          </div>
        </div>

        {/* Main Content */}
        {data && (
          <main className="w-full max-w-4xl mx-auto py-8 sm:py-12">
            {hasStructuredCourseData ? (
              <>
                {/* NOUVEAU FORMAT STRUCTURÉ - Simple et épuré */}

                {/* Titre Principal avec underline */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-orange-500 w-fit mx-auto">
                  {(courseData as any)?.course_data?.["Titre de la leçon"] || (courseData as any)?.course_data?.["Titre de la lecon"]}
                </h1>

                {/* Introduction */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Introduction
                  </h2>
                  <div className="text-gray-700 leading-relaxed">
                    <MathText
                      text={
                        (courseData as any)?.course_data?.Introduction || ""
                      }
                    />
                  </div>
                </div>

                {/* Développement du cours */}
                {(courseData as any)?.course_data &&
                  Object.keys(
                    (courseData as any).course_data["developpement du cours"] ||
                      {},
                  ).length > 0 && (
                    <div className="mb-8">
                      <div className="space-y-6">
                        {Object.entries(
                          (courseData as any).course_data[
                            "developpement du cours"
                          ],
                        ).map(([key, notion]: [string, any], index: number) => (
                          <div key={key}>
                            <div className="flex items-baseline gap-2 mb-2 pb-2 border-b border-gray-300">
                              <span className="text-lg font-semibold text-orange-500">
                                {index + 1}.
                              </span>
                              <h3 className="text-base font-semibold text-gray-900">
                                {notion.titre}
                              </h3>
                            </div>
                            <div className="text-gray-700 leading-relaxed mb-4">
                              <MathText text={notion.explication} />
                            </div>

                            {/* Exemples */}
                            {notion.exemples &&
                              Object.keys(notion.exemples).length > 0 && (
                                <div className="ml-4 mb-4">
                                  <p className="font-medium text-gray-800 mb-2">
                                    Exemples :
                                  </p>
                                  <ul className="space-y-2 text-gray-700">
                                    {Object.entries(notion.exemples).map(
                                      ([exKey, exemple]: [string, any]) => {
                                        const text =
                                          typeof exemple === "string"
                                            ? exemple
                                            : exemple?.exemple || "";
                                        return text ? (
                                          <li
                                            key={exKey}
                                            className="flex gap-3"
                                          >
                                            <span className="flex-shrink-0 text-orange-500">
                                              •
                                            </span>
                                            <MathText text={text} />
                                          </li>
                                        ) : null;
                                      },
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Synthèse */}
                <div className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8">
                  <h2 className="text-lg font-semibold text-amber-900 mb-3">
                    Synthèse du cours
                  </h2>
                  <div className="text-gray-700 leading-relaxed">
                    <MathText
                      text={
                        (courseData as any)?.course_data?.[
                          "Synthese ce qu'il faut retenir"
                        ] || ""
                      }
                    />
                  </div>
                </div>

                {/* Questions Fréquentes */}
                {courseData.questions && courseData.questions.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Questions fréquentes
                    </h2>
                    <div className="space-y-3">
                      {courseData.questions.map((qa, index) => (
                        <details
                          key={index}
                          className="group border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <summary className="font-medium text-gray-900 flex items-start gap-3 list-none select-none">
                            <span className="flex-shrink-0 mt-0.5 text-gray-400 group-open:hidden">
                              ▶
                            </span>
                            <span className="flex-shrink-0 mt-0.5 text-gray-400 hidden group-open:block">
                              ▼
                            </span>
                            <MathText
                              text={qa.question}
                              className="flex-1 text-gray-900"
                            />
                          </summary>
                          <div className="mt-3 ml-6 pl-3 border-l-2 border-gray-300">
                            <MathText
                              text={qa.reponse}
                              className="text-gray-700 leading-relaxed"
                            />
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* ANCIEN FORMAT */}
                <article className="prose prose-base sm:prose-base max-w-none text-gray-800">
                  {parsedContent.map((line) => (
                    <div key={line.id}>
                      {line.type === "title" ? (
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 first:mt-0 mb-4">
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
                </article>

                {/* Key Takeaways Section */}
                <section className="mt-8 pt-6 border-t border-gray-300">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Points clés à retenir
                  </h2>
                  <div className="text-gray-700 leading-relaxed">
                    <MathText text={summary} />
                  </div>
                </section>

                {/* FAQ Section */}
                {courseData.questions && courseData.questions.length > 0 && (
                  <section className="mt-8 pt-6 border-t border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Questions fréquentes
                    </h2>
                    <div className="space-y-3">
                      {courseData.questions.map((qa, index) => (
                        <details
                          key={index}
                          className="group border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <summary className="font-medium text-gray-900 flex items-start gap-3 list-none select-none">
                            <span className="flex-shrink-0 mt-0.5 text-gray-400 group-open:hidden">
                              ▶
                            </span>
                            <span className="flex-shrink-0 mt-0.5 text-gray-400 hidden group-open:block">
                              ▼
                            </span>
                            <MathText
                              text={qa.question}
                              className="flex-1 text-gray-900"
                            />
                          </summary>
                          <div className="mt-3 ml-6 pl-3 border-l-2 border-gray-300">
                            <MathText
                              text={qa.reponse}
                              className="text-gray-700 leading-relaxed"
                            />
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
