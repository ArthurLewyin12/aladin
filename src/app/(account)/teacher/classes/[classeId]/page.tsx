"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useClasse } from "@/services/hooks/professeur/useClasse";
import { createQueryKey } from "@/lib/request";
import { useActivateQuiz } from "@/services/hooks/professeur/useActivateQuiz";
import { useDeactivateQuiz } from "@/services/hooks/professeur/useDeactivateQuiz";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Brain,
  BookText,
  Upload,
  Users,
  MessageSquarePlus,
  PlusIcon,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { QuizAISection } from "@/components/pages/teacher-classes/quiz-ai-section";
import { SendMessageModal } from "@/components/pages/teacher-classes/send-message-modal";
import { StudentSection } from "@/components/pages/teacher-classes/student-section";
import { GradesSection } from "@/components/pages/teacher-classes/grades-section";
import { EmptyState } from "@/components/ui/empty-state";
import { ManualQuizCard } from "@/components/pages/teacher-classes/manual-quiz-card";
import { GetClasseResponse } from "@/services/controllers/types/common/professeur.types";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";

const ClasseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const classeId = Number(params.classeId);

  const [activeTab, setActiveTab] = useState("Quiz avec IA");
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);

  const { data: classeDetails, isLoading, isError, refetch } = useClasse(classeId);

  // Refetch les données quand le tab change
  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  const handleBack = () => {
    router.back();
  };

  const tabs = [
    { label: "Quiz avec IA", icon: <Brain className="w-4 h-4" /> },
    { label: "Quiz manuel", icon: <BookText className="w-4 h-4" /> },
    { label: "Documents", icon: <Upload className="w-4 h-4" /> },
    { label: "Elèves", icon: <Users className="w-4 h-4" /> },
    { label: "Notes", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !classeDetails) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">
          Une erreur est survenue lors du chargement des détails de la classe.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header avec bouton retour et titre */}
          <div
            className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 mb-8"
            style={{
              backgroundImage: `url("/bg-2.png")`,
              backgroundSize: "180px 180px",
            }}
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="rounded-full bg-white hover:bg-gray-50 w-10 h-10 shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Nom de la classe et bouton de message */}
          <div className="flex justify-between items-center mb-8 px-4">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 leading-tight">
              {classeDetails.nom}
            </h1>
            <Button
              onClick={() => setMessageModalOpen(true)}
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white"
            >
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              Passer un message
            </Button>
          </div>

          {/* Description */}
          <div className="mb-8 px-4">
            <p className="text-gray-600 text-base sm:text-lg max-w-4xl leading-relaxed">
              {classeDetails.description ||
                "Aucune description pour cette classe."}
            </p>
          </div>

          {/* Onglets */}
          <div className="mb-8 flex justify-center">
            <AnimatedTabs
              tabs={tabs}
              onTabChange={setActiveTab}
              activeTab={activeTab}
            />
          </div>

          {/* Contenu des onglets */}
          <div>
            {activeTab === "Quiz avec IA" && (
              <QuizAISection classeDetails={classeDetails} />
            )}
            {activeTab === "Quiz manuel" && (
              <ManualQuizSection classeDetails={classeDetails} />
            )}
            {activeTab === "Documents" && (
              <div>Contenu pour Document téléchargé</div>
            )}
            {activeTab === "Elèves" && (
              <StudentSection classeDetails={classeDetails} />
            )}
            {activeTab === "Notes" && (
              <GradesSection classeDetails={classeDetails} />
            )}
          </div>
        </div>
      </div>

      <SendMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        classeId={classeId}
      />
    </>
  );
};

interface ManualQuizSectionProps {
  classeDetails: GetClasseResponse;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

const ManualQuizSection = ({ classeDetails }: ManualQuizSectionProps) => {
  const router = useRouter();

  // Pagination avec nuqs
  const [page, setPage] = useQueryState(
    "manualQuizPage",
    parseAsInteger.withDefault(1),
  );

  const ITEMS_PER_PAGE = 6;

  const { mutate: activateQuizMutation } = useActivateQuiz();
  const { mutate: deactivateQuizMutation } = useDeactivateQuiz();

  const quizzes = classeDetails.quizzes || [];

  // Filtrer uniquement les quiz manuels (is_manual === true)
  const manualQuizzes = quizzes.filter((quiz) => quiz.is_manual === true);

  // Trier les quiz par ID décroissant (plus récents en premier) et enrichir avec les couleurs
  const enrichedQuizzes = useMemo(() => {
    // Trier par ID décroissant (les plus récents en premier)
    const sortedQuizzes = [...manualQuizzes].sort((a, b) => b.id - a.id);

    return sortedQuizzes.map((quiz, index) => ({
      ...quiz,
      cardColor: CARD_COLORS[index % CARD_COLORS.length],
    }));
  }, [manualQuizzes]);

  // Calculer les quiz paginés
  const { paginatedQuizzes, totalPages } = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedQuizzes: enrichedQuizzes.slice(startIndex, endIndex),
      totalPages: Math.ceil(enrichedQuizzes.length / ITEMS_PER_PAGE),
    };
  }, [enrichedQuizzes, page]);

  const handleActivate = (quizId: number) => {
    activateQuizMutation({ classeId: classeDetails.id, quizId });
  };

  const handleDeactivate = (quizId: number) => {
    deactivateQuizMutation({ classeId: classeDetails.id, quizId });
  };

  const handleOpen = (quizId: number) => {
    // TODO: Créer la page de détails du quiz
    router.push(`/teacher/classes/${classeDetails.id}/quiz/${quizId}`);
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

  if (quizzes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="px-4 sm:px-0">
          <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
            <div className="relative w-full max-w-2xl">
              <EmptyState
                title="Aucun quiz manuel pour le moment"
                description="Crée ton premier quiz manuel pour proposer des exercices sur mesure à tes élèves."
                icons={[<FileQuestion key="file" size={20} />]}
                size="default"
                theme="light"
                variant="default"
                className="mx-auto max-w-[50rem]"
              />
            </div>

            <div className="text-center px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Quiz manuels
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
                Crée des quiz personnalisés adaptés à {classeDetails.nom}.
              </p>

              <Button
                asChild
                size="lg"
                className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-lg transition-all hover:shadow-xl w-full sm:w-auto"
              >
                <Link href={`/teacher/classes/${classeDetails.id}/quiz/manual`}>
                  <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Créer un quiz manuel
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
      <div className="  flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm px-4 sm:px-0">
        <div className="ml-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Quiz manuels
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {manualQuizzes.length} quiz{manualQuizzes.length > 1 ? "s" : ""}
            {totalPages > 1 && ` • Page ${page} sur ${totalPages}`}
          </p>
        </div>
        <Button
          asChild
          className="mr-4 bg-[#2C3E50] hover:bg-[#1a252f] text-white px-4 sm:px-6 md:px-6 py-3 text-sm sm:text-base md:text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap flex items-center justify-center"
        >
          <Link href={`/teacher/classes/${classeDetails.id}/quiz/manual`}>
            <PlusIcon className="w-4 sm:w-5 h-5 mr-2 flex-shrink-0" />
            Créer un quiz manuel
          </Link>
        </Button>
      </div>

      {/* Grille des quiz paginés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
        {paginatedQuizzes.map((quiz) => (
          <ManualQuizCard
            key={`quiz-${quiz.id}`}
            quiz={quiz}
            cardColor={quiz.cardColor}
            onActivate={() => handleActivate(quiz.id)}
            onDeactivate={() => handleDeactivate(quiz.id)}
            onOpen={() => handleOpen(quiz.id)}
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

export default ClasseDetailPage;
