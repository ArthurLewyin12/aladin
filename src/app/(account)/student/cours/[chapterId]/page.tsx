"use client";
import { useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCourse } from "@/services/hooks/cours/useCourses";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, BrainCircuit, HelpCircle } from "lucide-react";
import { GenerateCoursSuccessResponse } from "@/services/controllers/types/common/cours.type";
import { MathText } from "@/components/ui/MathText";
import { GenerationLoadingOverlay } from "@/components/ui/generation-loading-overlay";
import { useTimeTracking } from "@/stores/useTimeTracking";

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

  const { data, isLoading, isError, error } = useCourse(chapterId);
  const { startTracking, stopTracking } = useTimeTracking();

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
        romanNumeralRegex.test(line) || line.toUpperCase() === line;
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

  if (isError || (data && !("text" in data))) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <p className="text-lg text-red-500">
          Erreur lors du chargement du cours.
        </p>
        <p className="text-sm text-gray-500">{(error as any)?.message}</p>
        <Button onClick={handleBack} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  // On ne peut pas afficher la page si les données ne sont pas prêtes (et pas en chargement)
  if (!isLoading && !data) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <p className="text-lg text-gray-500">Aucune donnée pour ce cours.</p>
        <Button onClick={handleBack} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  const courseData = data as GenerateCoursSuccessResponse;
  const introText = courseData?.text.substring(0, 100) || "";

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='M20 20h10v10H20zM40 40h10v10H40zM60 20h10v10H60zM80 60h10v10H80zM30 70h10v10H30zM70 30h10v10H70zM50 50h10v10H50z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "80px 80px",
      }}
    >
      <GenerationLoadingOverlay
        isLoading={isLoading}
        messages={courseLoadingMessages}
      />

      {/* Header */}
      <div className="sticky top-0 z-20  backdrop-blur-sm">
        <div
          className="mt-10 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-6 rounded-2xl"
          style={{
            backgroundImage: `url("/bg-2.png")`,
            backgroundSize: "180px 180px",
          }}
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border rounded-full bg-white px-4 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Retour</span>
            </Button>
            <div className="hidden md:block">
              <p className="text-gray-500 text-[1.5rem]">{introText}...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {data && (
        <main className="w-full mx-auto max-w-5xl px-4 md:px-8 pt-8 pb-16">
          {/* Course Paper */}
          <article className="bg-white rounded-lg shadow-lg p-8 md:p-12 lg:p-16 mb-12 font-serif">
            {parsedContent.map((line) => (
              <div key={line.id}>
                {line.type === "title" ? (
                  // Pour les titres, on peut garder un <p> normal ou utiliser MathText aussi
                  <p className="text-2xl font-bold text-orange-600 mt-6 mb-2">
                    {line.content}
                  </p>
                ) : (
                  // ← Utilisation de MathText pour les paragraphes
                  <MathText
                    text={line.content}
                    className="text-base text-black leading-relaxed mb-4"
                  />
                )}
              </div>
            ))}
          </article>

          {/* Summary Section */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12">
            <div className="flex items-center gap-4 mb-4">
              <BrainCircuit className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-blue-900">
                Ce que tu dois retenir
              </h2>
            </div>
            {/* ← Utilisation de MathText pour le résumé */}
            <MathText
              text={summary}
              className="text-blue-800 leading-relaxed"
            />
          </section>

          {/* FAQ Section */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <HelpCircle className="w-8 h-8 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Questions fréquentes
              </h2>
            </div>
            <div className="space-y-4">
              {courseData.questions.map((qa, index) => (
                <details
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm open:ring-2 open:ring-orange-500 transition"
                >
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900">
                    {/* ← Utilisation de MathText pour la question */}
                    <MathText text={qa.question} />
                  </summary>
                  {/* ← Utilisation de MathText pour la réponse */}
                  <MathText
                    text={qa.reponse}
                    className="mt-2 text-gray-700 leading-relaxed"
                  />
                </details>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
