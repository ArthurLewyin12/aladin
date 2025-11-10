"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  MessageCircleQuestion,
  ChevronDown,
} from "lucide-react";
import { MathText } from "@/components/ui/MathText";
import { useTimeTracking } from "@/stores/useTimeTracking";
import { Spinner } from "@/components/ui/spinner";
import { CourseStructuredData } from "@/services/controllers/types/common/cours.type";
import { useState } from "react";

interface GeneratedCoursePageProps {
  courseData: CourseStructuredData;
  courseId: number;
  chapitreId: number;
  questions: Array<{ question: string; reponse: string }>;
}

// Composant pour afficher une notion
const NotionCard = ({ notion, index }: { notion: any; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* En-tête de la notion */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {notion.titre}
            </h3>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Contenu dépliable */}
      {isOpen && (
        <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
          {/* Explication */}
          <div>
            <p className="text-gray-700 leading-relaxed">
              <MathText text={notion.explication} />
            </p>
          </div>

          {/* Exemples */}
          {notion.exemples && Object.keys(notion.exemples).length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Exemples:</h4>
              <ul className="space-y-2">
                {Object.entries(notion.exemples).map(
                  ([key, exemple]: [string, any]) => {
                    const text =
                      typeof exemple === "string"
                        ? exemple
                        : exemple?.exemple || "";
                    return text ? (
                      <li key={key} className="flex gap-3">
                        <span className="text-orange-500 font-bold flex-shrink-0">
                          •
                        </span>
                        <span className="text-gray-700">
                          <MathText text={text} />
                        </span>
                      </li>
                    ) : null;
                  },
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function GeneratedCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<CourseStructuredData | null>(
    null,
  );
  const [questions, setQuestions] = useState<
    Array<{ question: string; reponse: string }>
  >([]);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [chapitreId, setChapitreId] = useState<number | null>(null);

  const { startTracking, stopTracking } = useTimeTracking();

  // Récupérer les données depuis sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("courseData");
    const qId = sessionStorage.getItem("courseId");
    const chId = sessionStorage.getItem("chapitreId");
    const qs = sessionStorage.getItem("courseQuestions");

    if (data && qId && chId) {
      try {
        setCourseData(JSON.parse(data));
        setCourseId(parseInt(qId));
        setChapitreId(parseInt(chId));
        if (qs) {
          setQuestions(JSON.parse(qs));
        }
        startTracking("revision", parseInt(qId), parseInt(chId));
      } catch (error) {
        console.error("Erreur lors du parsing des données:", error);
      }
    }

    return () => {
      stopTracking();
    };
  }, [startTracking, stopTracking]);

  const handleBack = () => router.back();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 bg-gray-50">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-lg font-medium text-gray-700">
            Chargement de votre cours...
          </p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-50 border-2 border-gray-200 rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold text-gray-700 mb-6">
            Aucune donnée disponible pour ce cours
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

  const notions = Object.entries(
    courseData["developpement du cours"] || {},
  ).map(([key, notion]) => ({
    key,
    ...notion,
  }));

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-white border-b border-gray-200">
        <div className="w-full mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
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
              <span className="hidden sm:inline">Cours généré</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        {/* Titre Principal */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 sm:p-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-600">
            {courseData["Titre de la lecon"]}
          </h1>
        </div>

        {/* Introduction */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900">
              Introduction
            </h2>
          </div>
          <MathText
            text={courseData.Introduction}
            className="text-gray-800 leading-relaxed"
          />
        </div>

        {/* Développement du cours */}
        {notions.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-xl">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Développement du cours
              </h2>
            </div>
            <div className="space-y-4">
              {notions.map((notion, index) => (
                <NotionCard key={notion.key} notion={notion} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Synthèse */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500 rounded-xl">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900">
              Synthèse du cours
            </h2>
          </div>
          <MathText
            text={courseData["Synthese ce qu'il faut retenir"]}
            className="text-gray-800 leading-relaxed"
          />
        </div>

        {/* Questions Fréquentes */}
        {questions.length > 0 && (
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
              {questions.map((qa, index) => (
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
    </div>
  );
}
