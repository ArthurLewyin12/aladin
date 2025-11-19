"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ClassQuizCard } from "./class-quiz-card";
import { Quiz } from "@/services/controllers/types/common/quiz.types";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

interface ClassQuizListProps {
  quizzes: (Quiz & { classe?: { id: number; nom: string } })[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 6;

export const ClassQuizList = ({ quizzes, isLoading = false }: ClassQuizListProps) => {
  const router = useRouter();

  // Pagination avec nuqs
  const [page, setPage] = useQueryState(
    "classQuizPage",
    parseAsInteger.withDefault(1),
  );

  // Filtrer uniquement les quiz de classe
  const classQuizzes = useMemo(() => {
    return quizzes.filter(
      (quiz) => (quiz as any).type && (quiz as any).type === "classe"
    );
  }, [quizzes]);

  // Trier par ID décroissant (plus récents en premier)
  const sortedQuizzes = useMemo(() => {
    return [...classQuizzes].sort((a, b) => b.id - a.id);
  }, [classQuizzes]);

  // Calculer les quiz paginés
  const { paginatedQuizzes, totalPages } = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedQuizzes: sortedQuizzes.slice(startIndex, endIndex),
      totalPages: Math.ceil(sortedQuizzes.length / ITEMS_PER_PAGE),
    };
  }, [sortedQuizzes, page]);

  const handleLaunchQuiz = (quizId: number) => {
    router.push(`/student/class-quiz/${quizId}`);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-600">Chargement des quiz de classe...</p>
      </div>
    );
  }

  if (classQuizzes.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
          <div className="relative w-full max-w-2xl">
            <EmptyState
              title="Aucun quiz de classe"
              description="Tes professeurs n'ont pas encore créé de quiz pour toi."
              icons={[<BookOpen key="book" size={20} />]}
              size="default"
              theme="light"
              variant="default"
            />
          </div>

          <div className="text-center px-4">
            <p className="text-gray-600 text-base sm:text-lg">
              Les quiz de classe te permettent de réviser avec les contenus créés par tes professeurs !
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm px-4 sm:px-0">
        <div className="ml-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Quiz de Classe
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {classQuizzes.length} quiz{classQuizzes.length > 1 ? "s" : ""}
            {totalPages > 1 && ` • Page ${page} sur ${totalPages}`}
          </p>
        </div>
      </div>

      {/* Grille des quiz */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
        {paginatedQuizzes.map((quiz, index) => (
          <ClassQuizCard
            key={`class-quiz-${quiz.id}`}
            quiz={quiz}
            index={index}
            onLaunchClick={() => handleLaunchQuiz(quiz.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={page === 1}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => {
                    setPage(pageNum);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`rounded-full ${
                    pageNum === page
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : ""
                  }`}
                >
                  {pageNum}
                </Button>
              ),
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
