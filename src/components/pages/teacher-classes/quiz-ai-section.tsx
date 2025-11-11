
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/pages/quizzes/quiz-card";
import { EmptyState } from "@/components/ui/empty-state";
import { FileQuestion, Users, BookOpen } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { CreateClassQuizModal } from "./create-class-quiz-modal";
import { GetClasseResponse } from "@/services/controllers/types/common/professeur.types";

interface QuizAISectionProps {
  classeDetails: GetClasseResponse;
}

const ITEMS_PER_PAGE = 6;

export const QuizAISection = ({ classeDetails }: QuizAISectionProps) => {
  const router = useRouter();
  const [isCreateQuizModalOpen, setCreateQuizModalOpen] = useState(false);

  // Pagination avec nuqs
  const [page, setPage] = useQueryState(
    "quizPage",
    parseAsInteger.withDefault(1),
  );

  const { quizzes = [], matieres = [] } = classeDetails;

  // Filtrer uniquement les quiz générés par IA (is_manual === false)
  const aiQuizzes = quizzes.filter((quiz) => quiz.is_manual === false);

  // Trier les quiz par ID décroissant (plus récents en premier) et calculer la pagination
  const { paginatedQuizzes, totalPages } = useMemo(() => {
    // Trier par ID décroissant (les plus récents en premier)
    const sortedQuizzes = [...aiQuizzes].sort((a, b) => b.id - a.id);
    
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedQuizzes: sortedQuizzes.slice(startIndex, endIndex),
      totalPages: Math.ceil(sortedQuizzes.length / ITEMS_PER_PAGE),
    };
  }, [aiQuizzes, page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête Quiz avec titre et bouton */}
      {aiQuizzes.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Quiz de la classe
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {aiQuizzes.length} quiz{" "}
              {aiQuizzes.length > 1 ? "disponibles" : "disponible"}
            </p>
          </div>
          <Button
            onClick={() => setCreateQuizModalOpen(true)}
            className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-4 sm:px-6 md:px-6 py-3 text-sm sm:text-base md:text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap flex items-center justify-center"
          >
            <span className="text-lg mr-2">+</span>
            <span className="hidden sm:inline">Nouveau quiz</span>
            <span className="sm:hidden">Créer</span>
          </Button>
        </div>
      )}

      {/* Contenu principal */}
      {aiQuizzes.length === 0 ? (
        /* État vide - Pas de quiz */
        <div className="px-4 sm:px-0">
          <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
            <div className="relative w-full max-w-2xl">
              <EmptyState
                title="Aucun quiz pour le moment"
                description="Crée ton premier quiz pour commencer à évaluer tes élèves !"
                icons={[
                  <FileQuestion key="1" size={20} />,
                  <Users key="2" size={20} />,
                  <BookOpen key="3" size={20} />,
                ]}
                size="default"
                theme="light"
                variant="default"
                className="mx-auto max-w-[50rem]"
              />
            </div>

            <div className="text-center px-4">
              <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
                Clique ci-dessous pour créer ton premier quiz !
              </p>

              <Button
                size="lg"
                onClick={() => setCreateQuizModalOpen(true)}
                className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-lg transition-all hover:shadow-xl w-full sm:w-auto"
              >
                <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Créer un Quiz
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Compteur avec pagination */}
          {aiQuizzes.length > 0 && (
            <div className="text-sm text-gray-600">
              {aiQuizzes.length} quiz{aiQuizzes.length > 1 ? "s" : ""}
              {totalPages > 1 && ` • Page ${page} sur ${totalPages}`}
            </div>
          )}

          {/* Grille de quiz cards paginés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedQuizzes.map((quiz, index) => {
              const subject =
                matieres.find((m) => m.id === quiz.matiere_id)?.libelle || "";
              const numberOfQuestions = quiz.data?.qcm?.length || 0;

              return (
                <QuizCard
                  key={quiz.id}
                  title={quiz.titre}
                  subject={subject}
                  numberOfQuestions={numberOfQuestions}
                  duration={quiz.temps}
                  quizId={quiz.id.toString()}
                  isActive={quiz.is_active}
                  index={(page - 1) * ITEMS_PER_PAGE + index}
                  // No onStart or onViewGrades for teacher's view directly on card
                />
              );
            })}
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
                    const showPage =
                      pageNum <= 2 ||
                      pageNum >= totalPages - 1 ||
                      (pageNum >= page - 1 && pageNum <= page + 1);

                    const showEllipsisBefore = pageNum === 3 && page > 4;
                    const showEllipsisAfter =
                      pageNum === totalPages - 2 && page < totalPages - 3;

                    if (
                      !showPage &&
                      !showEllipsisBefore &&
                      !showEllipsisAfter
                    ) {
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
      )}

      {/* Modal de création de quiz */}
      <CreateClassQuizModal
        isOpen={isCreateQuizModalOpen}
        onClose={() => setCreateQuizModalOpen(false)}
        classeId={classeDetails.id}
        matieres={matieres}
      />
    </div>
  );
};
