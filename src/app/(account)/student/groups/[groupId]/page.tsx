"use client";

import { useParams, useRouter } from "next/navigation";
import { useDetailedGroupe } from "@/services/hooks/groupes/useDetailedGroupe";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowLeft } from "lucide-react";
import { QuizCard } from "@/components/pages/quizzes/quiz-card";
import { useState } from "react";
import { InviteUsersModal } from "@/components/pages/groups/invit-member-modal";
import { CreateQuizModal } from "@/components/pages/groups/create-quiz-modal";
import { toast } from "sonner";
import { useDeactivateQuiz, useReactivateQuiz } from "@/services/hooks/quiz";
import { useSession } from "@/services/hooks/auth/useSession";
import { useStartGroupQuiz } from "@/services/hooks/groupes/useStartGroupQuiz";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MemberPopoverCard } from "@/components/pages/groups/MemberPopoverCard";
import { useQueryClient } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";

import { useMediaQuery } from "@/services/hooks/use-media-query";

const GroupPage = () => {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isCreateQuizModalOpen, setCreateQuizModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { user } = useSession();
  const {
    data: groupDetails,
    isLoading,
    isError,
  } = useDetailedGroupe(Number(groupId));

  const { mutate: startGroupQuiz } = useStartGroupQuiz();
  const queryClient = useQueryClient();

  const handleStartQuiz = (quizId: number) => {
    startGroupQuiz(
      { groupeId: Number(groupId), quizId },
      {
        onSuccess: (data) => {
          sessionStorage.setItem("groupQuizData", JSON.stringify(data));
          queryClient.invalidateQueries({
            queryKey: createQueryKey("detailedGroupe", String(groupId)),
          });
          router.push(`/student/groups/${groupId}/quiz/${quizId}`);
        },
        onError: (error: any) => {
          toast.error(
            error.message ||
              "Impossible de démarrer le quiz. Veuillez réessayer.",
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !groupDetails) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">
          Une erreur est survenue lors du chargement des détails du groupe.
        </p>
      </div>
    );
  }

  const { groupe, utilisateurs, quizzes, matieres } = groupDetails;
  const isChief = user?.id === groupe.chief_user;

  const handleBack = () => {
    router.back();
  };

  return (
    <div
      className="min-h-screen bg-[#F5F4F1]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e0e0e0' fill-opacity='0.2'%3E%3Cpath d='M20 20h10v10H20zM40 40h10v10H40zM60 20h10v10H60zM80 60h10v10H80zM30 70h10v10H30zM70 30h10v10H70zM50 50h10v10H50z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "100px 100px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header avec bouton retour et titre */}
        <div
          className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 mb-8"
          style={{
            backgroundImage: `url("/bg-2.png")`,
            backgroundSize: "100px 100px",
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

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-500">
              Réviser à plusieurs, c'est mieux !
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 px-4">
          <p className="text-gray-600 text-base sm:text-lg max-w-4xl leading-relaxed">
            {groupDetails.groupe.description}
          </p>
        </div>

        {/* Section Membres + Bouton Créer Quiz */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Membres du groupe :
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Avatars des membres */}
              {utilisateurs.map((user, index) => {
                const colors = [
                  "bg-purple-300",
                  "bg-green-500",
                  "bg-yellow-400",
                  "bg-pink-400",
                ];
                const bgColor = colors[index % colors.length];

                return (
                  <Popover key={user.id}>
                    <PopoverTrigger asChild>
                      <div
                        className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center text-gray-900 font-bold text-lg cursor-pointer`}
                      >
                        {user.prenom.charAt(0).toUpperCase()}
                        {user.nom.charAt(0).toUpperCase()}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-xl">
                      <MemberPopoverCard
                        user={user}
                        bgColor={bgColor}
                        niveauLabel={groupDetails.niveau?.libelle || ""}
                        isChief={user.id === groupDetails.groupe.chief_user}
                        groupId={Number(groupId)}
                      />
                    </PopoverContent>
                  </Popover>
                );
              })}

              {/* Bouton + pour inviter (seulement pour le chef)*/}
              {isChief && (
                <button
                  onClick={() => setInviteModalOpen(true)}
                  className="w-14 h-14 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Inviter des membres"
                >
                  <PlusIcon className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Bouton Créer un Quiz - visible seulement si le user est chief */}
          {isChief && quizzes.length > 0 && (
            <Button
              size="lg"
              onClick={() => setCreateQuizModalOpen(true)}
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-6 py-3 rounded-lg shadow-lg transition-all hover:shadow-xl"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Créer un Quiz
            </Button>
          )}
        </div>

        {/* Contenu principal */}
        {quizzes.length === 0 ? (
          /* État vide - Pas de quiz */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              <p className="text-gray-600 text-lg mb-8">
                Aucun quiz pour le moment. Créez votre premier quiz pour
                commencer à réviser avec votre groupe.
              </p>
              {isChief && (
                <Button
                  size="lg"
                  onClick={() => setCreateQuizModalOpen(true)}
                  className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-8 py-6 text-lg rounded-lg shadow-lg transition-all hover:shadow-xl"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Créer un Quiz
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Grille de quiz cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, index) => {
              const subject =
                matieres.find((m) => m.id === quiz.matiere_id)?.libelle || "";

              const hasTaken = quiz.submissions.some(
                (submission: { user_id: number }) =>
                  submission.user_id === user?.id,
              );
              const allMembersTaken =
                quiz.submissions.length === utilisateurs.length;

              return (
                <QuizCard
                  key={quiz.id}
                  title={quiz.titre}
                  subject={subject}
                  numberOfQuestions={quiz.nombre_questions}
                  duration={quiz.temps}
                  quizId={quiz.id.toString()}
                  isActive={quiz.is_active}
                  index={index}
                  hasTaken={hasTaken}
                  allMembersTaken={allMembersTaken}
                  onStart={() => handleStartQuiz(quiz.id)}
                  onViewGrades={() => {
                    // TODO: Implement when backend provides an endpoint to fetch past results.
                    toast.info(
                      "La consultation des résultats passés n'est pas encore disponible.",
                    );
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modal d'invitation */}
      <InviteUsersModal
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        groupId={Number(groupId)}
        groupName={groupe.nom}
        isMobile={isMobile}
      />

      {/* Modal de création de quiz */}
      <CreateQuizModal
        isOpen={isCreateQuizModalOpen}
        onClose={() => setCreateQuizModalOpen(false)}
        groupId={Number(groupId)}
        matieres={matieres}
      />
    </div>
  );
};

export default GroupPage;
