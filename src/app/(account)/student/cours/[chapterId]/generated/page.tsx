"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircleQuestion } from "lucide-react";
import { MathText } from "@/components/ui/MathText";
import { useState, useEffect } from "react";
import { GenerateCoursSuccessResponse } from "@/services/controllers/types/common/cours.type";

export default function DeepeeningQuestionsPage() {
  const router = useRouter();
  const params = useParams();
  const chapterId = params.chapterId as string;
  const [questions, setQuestions] = useState<
    Array<{ question: string; reponse: string }>
  >([]);
  const [courseData, setCourseData] = useState<any>(null);

  // Récupérer les données depuis sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("courseData");
    const qs = sessionStorage.getItem("courseQuestions");

    if (qs) {
      try {
        setQuestions(JSON.parse(qs));
      } catch (error) {
        console.error("Erreur lors du parsing des questions:", error);
      }
    }

    if (data) {
      try {
        setCourseData(JSON.parse(data));
      } catch (error) {
        console.error("Erreur lors du parsing des données:", error);
      }
    }
  }, []);

  const handleBack = () => router.back();

  if (!questions.length) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-50 border-2 border-gray-200 rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold text-gray-700 mb-6">
            Aucune question disponible
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
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageCircleQuestion className="w-4 h-4" />
              <span className="hidden sm:inline">
                Questions d'approfondissement
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        {/* Titre */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 sm:p-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-600">
            Questions d'approfondissement
          </h1>
        </div>

        {/* Questions */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
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
      </main>
    </div>
  );
}
