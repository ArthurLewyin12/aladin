"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGroupQuizzes } from "@/services/hooks/quiz";
import { GroupQuizCard } from "./group-quiz-card";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, BookOpen, FileQuestion, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseAsInteger, useQueryState } from "nuqs";

const ITEMS_PER_PAGE = 6;

export function GroupQuizList() {
  const { data, isLoading, isError } = useGroupQuizzes();
  const quizzes = data?.quizzes || [];
  const router = useRouter();

  // Pagination avec nuqs (utilise un paramètre différent pour éviter les conflits)
  const [page, setPage] = useQueryState("groupPage", parseAsInteger.withDefault(1));

  // Calculer les quiz paginés
  const { paginatedQuizzes, totalPages } = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedQuizzes: quizzes.slice(startIndex, endIndex),
      totalPages: Math.ceil(quizzes.length / ITEMS_PER_PAGE),
    };
  }, [quizzes, page]);

  const handleOpenDetails = (groupId: number, quizId: number) => {
    router.push(`/student/groups/${groupId}/quiz/${quizId}/notes`);
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
            {totalPages > 1 && ` • Page ${page} sur ${totalPages}`}
          </p>
        </div>
      </div>

      {/* Grille des quiz de groupe paginés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {paginatedQuizzes.map((quizItem, index) => (
          <GroupQuizCard
            key={quizItem.quiz.id}
            quizItem={quizItem}
            index={(page - 1) * ITEMS_PER_PAGE + index}
            onDetailsClick={() => handleOpenDetails(quizItem.groupe.id, quizItem.quiz.id)}
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
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
            })}
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
  );
}
