"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { QuestionReponse } from "@/services/controllers/types/common/cours.type";
import { MathText } from "@/components/ui/MathText";

interface DeepeeningQuestionsProps {
  questions: QuestionReponse[];
  onBack: () => void;
}

export const DeepeeningQuestions = ({
  questions,
  onBack,
}: DeepeeningQuestionsProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full bg-white hover:bg-gray-50 w-9 h-9 sm:w-10 sm:h-10 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Questions d'approfondissement
        </h2>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((qa, index) => (
          <details
            key={index}
            className="group border-2 border-orange-200 rounded-lg p-4 hover:bg-orange-50 transition-colors cursor-pointer bg-white"
          >
            <summary className="font-medium text-gray-900 flex items-start gap-3 list-none select-none">
              <span className="flex-shrink-0 mt-0.5 text-orange-500 font-bold group-open:hidden">
                ▶
              </span>
              <span className="flex-shrink-0 mt-0.5 text-orange-500 font-bold hidden group-open:block">
                ▼
              </span>
              <div className="flex-1">
                <span className="inline-block mr-2 text-sm font-semibold text-orange-500">
                  Q{index + 1}.
                </span>
                <span className="inline">
                  <MathText text={qa.question} />
                </span>
              </div>
            </summary>
            <div className="mt-3 ml-6 pl-3 border-l-2 border-orange-300">
              <MathText
                text={qa.reponse}
                className="text-gray-700 leading-relaxed"
              />
            </div>
          </details>
        ))}
      </div>

      {/* Info Text */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 Ces questions d'approfondissement vous aideront à mieux maîtriser
          les concepts clés du cours. N'hésitez pas à explorer chaque réponse
          en détail.
        </p>
      </div>
    </div>
  );
};
