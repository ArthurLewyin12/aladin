"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GetClasseResponse } from "@/services/controllers/types/common/professeur.types";
import { useGetEvaluations } from "@/services/hooks/professeur/useGetEvaluations";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  FileQuestion,
  BookOpen,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  TrendingUp,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { parseAsInteger, useQueryState } from "nuqs";
import Link from "next/link";

interface GradesSectionProps {
  classeDetails: GetClasseResponse;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export const GradesSection = ({ classeDetails }: GradesSectionProps) => {
  const router = useRouter();
  const { data: evaluationsData, isLoading } = useGetEvaluations(
    classeDetails.id,
  );

  // Pagination avec nuqs
  const [page, setPage] = useQueryState(
    "gradesPage",
    parseAsInteger.withDefault(1),
  );

  const ITEMS_PER_PAGE = 6;

  const evaluations = evaluationsData?.evaluations || [];

  // Enrichir les évaluations avec les couleurs et les statistiques calculées
  const enrichedEvaluations = useMemo(() => {
    return evaluations.map((evaluation, index) => {
      // Calculer notes_count et moyenne à partir de grades
      const grades = evaluation.grades || [];
      const notesCount = grades.length;

      let moyenne = 0;
      if (notesCount > 0) {
        const sum = grades.reduce((acc, grade) => acc + (grade.note || 0), 0);
        moyenne = sum / notesCount;
      }

      return {
        ...evaluation,
        cardColor: CARD_COLORS[index % CARD_COLORS.length],
        notes_count: notesCount,
        moyenne: moyenne,
      };
    });
  }, [evaluations]);

  // Calculer les évaluations paginées
  const { paginatedEvaluations, totalPages } = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedEvaluations: enrichedEvaluations.slice(startIndex, endIndex),
      totalPages: Math.ceil(enrichedEvaluations.length / ITEMS_PER_PAGE),
    };
  }, [enrichedEvaluations, page]);

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

  const handleViewEvaluation = (evaluationId: number) => {
    router.push(
      `/teacher/classes/${classeDetails.id}/evaluations/${evaluationId}`,
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="space-y-6">
        <div className="px-4 sm:px-0">
          <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
            <div className="relative w-full max-w-2xl">
              <EmptyState
                title="Aucune évaluation pour le moment"
                description="Crée ta première évaluation pour suivre les notes de tes élèves."
                icons={[<FileQuestion key="file" size={20} />]}
                size="default"
                theme="light"
                variant="default"
                className="mx-auto max-w-[50rem]"
              />
            </div>

            <div className="text-center px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Évaluations et Notes
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
                Crée des évaluations et assigne des notes à tes élèves de{" "}
                {classeDetails.nom}.
              </p>

              <Button
                asChild
                size="lg"
                className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-3xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto"
              >
                <Link
                  href={`/teacher/classes/${classeDetails.id}/evaluations/create`}
                >
                  <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Créer une évaluation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton de création */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm px-4 sm:px-0">
        <div className="ml-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Évaluations
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {evaluations.length} évaluation{evaluations.length > 1 ? "s" : ""}
            {totalPages > 1 && ` • Page ${page} sur ${totalPages}`}
          </p>
        </div>
        <Button
          asChild
          className="mr-4 bg-[#2C3E50] hover:bg-[#1a252f] text-white px-4 sm:px-6 md:px-6 py-3 text-sm sm:text-base md:text-lg rounded-3xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap flex items-center justify-center"
        >
          <Link
            href={`/teacher/classes/${classeDetails.id}/evaluations/create`}
          >
            <PlusIcon className="w-4 sm:w-5 h-5 mr-2 flex-shrink-0" />
            Créer une évaluation
          </Link>
        </Button>
      </div>

      {/* Grille des évaluations paginées */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
        {paginatedEvaluations.map((evaluation) => (
          <Card
            key={`evaluation-${evaluation.id}`}
            className={`${evaluation.cardColor} border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden rounded-3xl`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-2">
                    {evaluation.type_evaluation}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge
                      variant={evaluation.is_active ? "default" : "secondary"}
                      className={`text-xs ${
                        evaluation.is_active
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {evaluation.is_active ? "Actif" : "Inactif"}
                    </Badge>
                    {evaluation.matiere && (
                      <Badge className="text-xs bg-[#2C3E50] text-white hover:bg-[#1a252f]">
                        {evaluation.matiere.libelle}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Informations de l'évaluation */}
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>
                      {format(
                        new Date(evaluation.date_evaluation),
                        "dd MMMM yyyy",
                        { locale: fr },
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">
                      Notes/élèves : {evaluation.notes_count ?? 0}/{classeDetails.members?.length || 0}
                    </span>
                  </div>

                  {evaluation.moyenne !== undefined && evaluation.moyenne > 0 && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">
                        Moyenne: {evaluation.moyenne.toFixed(2)}/20
                      </span>
                    </div>
                  )}

                  {evaluation.commentaire && (
                    <div className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {evaluation.commentaire}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleViewEvaluation(evaluation.id)}
                    className="flex-1 bg-[#2C3E50] hover:bg-[#1a252f] text-white rounded-3xl"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir détails
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
