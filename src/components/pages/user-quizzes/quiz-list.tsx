"use client";
import { useState, useMemo } from "react";
import { useGetAllQuiz } from "@/services/hooks/quiz";
import { UserQuizCard } from "./user-quiz-card";
import { Spinner } from "@/components/ui/spinner";
import { Quiz } from "@/services/controllers/types/common/quiz.types";

import { useRouter } from "next/navigation";
import {
  Plus,
  BookOpen,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizDetailsModal } from "./quiz-details-modal";
import { parseAsInteger, useQueryState } from "nuqs";
import { EmptyState } from "@/components/ui/empty-state";

const ITEMS_PER_PAGE = 6;

export function QuizList() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetAllQuiz();
  const quizzes = (data?.quizzes as Quiz[]) || [];
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

  // Pagination avec nuqs
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // Filtrer les quiz personnels (ceux sans type ou avec type différent de "classe" et "groupe")
  const personalQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const quizType = (quiz as any).type;
      // Considérer comme personnel si pas de type ou type différent de "classe" et "groupe"
      return !quizType || (quizType !== "classe" && quizType !== "groupe");
    });
  }, [quizzes]);

  // Trier les quiz par ID décroissant (plus récents en premier) et calculer la pagination
  const { paginatedQuizzes, totalPages } = useMemo(() => {
    // Trier par ID décroissant (les plus récents en premier)
    const sortedQuizzes = [...personalQuizzes].sort((a, b) => b.id - a.id);

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedQuizzes: sortedQuizzes.slice(startIndex, endIndex),
      totalPages: Math.ceil(sortedQuizzes.length / ITEMS_PER_PAGE),
    };
  }, [personalQuizzes, page]);

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
            Une erreur est survenue lors du chargement des quiz.
          </p>
        </div>
      </div>
    );
  }

  if (personalQuizzes.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        {/* Illustration centrale */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
          <div className="relative w-full max-w-2xl">
            <EmptyState
              title="Aucun quiz généré"
              description="Crée ton premier quiz personnalisé et commence à réviser de manière ludique et efficace !"
              icons={[
                <FileQuestion key="1" size={20} />,
                <BookOpen key="2" size={20} />,
                <Plus key="3" size={20} />,
              ]}
              size="default"
              theme="light"
              variant="default"
            />
          </div>

          {/* Texte et bouton CTA */}
          <div className="text-center px-4">
            <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
              Clique ci-dessous pour générer ton premier quiz et commencer
              l'aventure !
            </p>

            <Button
              size="lg"
              onClick={() => router.push("/student/quiz/generate")}
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-lg transition-all hover:shadow-xl w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Générer un quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Bouton en haut quand il y a des quiz */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4  backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Mes Quiz
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {personalQuizzes.length} quiz{" "}
              {personalQuizzes.length > 1 ? "disponibles" : "disponible"}
              {totalPages > 1 && ` • Page ${page} sur ${totalPages}`}
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => router.push("/student/quiz/generate")}
            className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            <span className="hidden sm:inline">Nouveau quiz</span>
            <span className="sm:hidden">Créer</span>
          </Button>
        </div>

        {/* Grille des quiz paginés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginatedQuizzes.map((quiz, index) => (
            <UserQuizCard
              key={quiz.id}
              quiz={quiz}
              index={(page - 1) * ITEMS_PER_PAGE + index}
              onDetailsClick={() => handleOpenDetails(quiz.id)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  // Afficher les 3 premières pages, les 3 dernières, et la page courante avec ses voisines
                  const showPage =
                    pageNum <= 2 ||
                    pageNum >= totalPages - 1 ||
                    (pageNum >= page - 1 && pageNum <= page + 1);

                  const showEllipsisBefore = pageNum === 3 && page > 4;
                  const showEllipsisAfter =
                    pageNum === totalPages - 2 && page < totalPages - 3;

                  if (!showPage && !showEllipsisBefore && !showEllipsisAfter) {
                    return null;
                  }

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <span key={pageNum} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className={`rounded-full min-w-[2.5rem] ${
                        pageNum === page
                          ? "bg-[#2C3E50] hover:bg-[#1a252f]"
                          : ""
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                },
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <QuizDetailsModal
        quizId={selectedQuizId}
        isOpen={selectedQuizId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCloseDetails();
          }
        }}
      />
    </>
  );
}
