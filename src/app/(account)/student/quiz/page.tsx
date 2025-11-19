"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuizList } from "@/components/pages/user-quizzes/quiz-list";
import { GroupQuizList } from "@/components/pages/user-quizzes/group-quiz-list";
import { ClassQuizList } from "@/components/pages/user-quizzes/class-quiz-list";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { ArrowLeft } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useGetAllQuiz } from "@/services/hooks/quiz";

export default function QuizPage() {
  const router = useRouter();
  const { data: allQuizData, isLoading } = useGetAllQuiz();
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("Mes Quiz"),
  );

  const handleBack = () => {
    router.push("/student/home");
  };

  const tabs = [
    { label: "Mes Quiz" },
    { label: "Quiz de Groupe" },
    { label: "Quiz de Classe" },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header avec bouton retour et titre */}
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
            {/*<span className="text-2xl sm:text-3xl">📚</span>*/}
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 leading-tight">
              Mes quiz !
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Génère des quiz adaptés à tes besoins et révise à ton rythme. Aladin
            crée des questions personnalisées pour t'aider à progresser
            efficacement dans tes études.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Contenu principal basé sur l'onglet actif */}
        {activeTab === "Mes Quiz" && <QuizList />}
        {activeTab === "Quiz de Groupe" && <GroupQuizList />}
        {activeTab === "Quiz de Classe" && (
          <ClassQuizList
            quizzes={allQuizData?.quizzes || []}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
