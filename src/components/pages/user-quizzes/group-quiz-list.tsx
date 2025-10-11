"use client";
import { useState } from "react";
import { useGroupQuizzes } from "@/services/hooks/quiz";
import { GroupQuizCard } from "./group-quiz-card";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, BookOpen, FileQuestion } from "lucide-react";

export function GroupQuizList() {
  const { data, isLoading, isError } = useGroupQuizzes();
  const quizzes = data?.quizzes || [];
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

  const handleOpenDetails = (quizId: number) => {
    setSelectedQuizId(quizId);
  };

  const handleCloseDetails = () => {
    setSelectedQuizId(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[400px] px-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 sm:p-6 text-center max-w-md w-full">
          <p className="text-red-600 text-sm sm:text-base">
            Une erreur est survenue lors du chargement des quiz de groupe.
          </p>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
          <div className="relative w-full max-w-2xl">
            <EmptyState
              title="Aucun quiz de groupe"
              description="Tu n'as pas encore de quiz de groupe. Rejoins un groupe ou attends qu'un chef de groupe crée un quiz !"
              icons={[
                <Users key="1" size={20} />,
                <FileQuestion key="2" size={20} />,
                <BookOpen key="3" size={20} />,
              ]}
              size="default"
              theme="light"
              variant="default"
            />
          </div>

          <div className="text-center px-4">
            <p className="text-gray-600 text-base sm:text-lg">
              Les quiz de groupe te permettent de réviser avec tes camarades de
              classe !
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header avec compteur */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            Quiz de Groupe
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {quizzes.length} quiz{" "}
            {quizzes.length > 1 ? "disponibles" : "disponible"}
          </p>
        </div>
      </div>

      {/* Grille des quiz de groupe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {quizzes.map((quizItem, index) => (
          <GroupQuizCard
            key={quizItem.quiz.id}
            quizItem={quizItem}
            index={index}
            onDetailsClick={() => handleOpenDetails(quizItem.quiz.id)}
          />
        ))}
      </div>
    </div>
  );
}
