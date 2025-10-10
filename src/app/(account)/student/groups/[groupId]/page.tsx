"use client";

import { useParams, useRouter } from "next/navigation";
import { useDetailedGroupe } from "@/services/hooks/groupes/useDetailedGroupe";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowLeft, Mail, GraduationCap, LogOut } from "lucide-react";
import { QuizCard } from "@/components/pages/quizzes/quiz-card";
import { useState } from "react";
import { InviteUsersModal } from "@/components/pages/groups/invit-member-modal";
import { CreateQuizModal } from "@/components/pages/groups/create-quiz-modal";
// import { toast } from "sonner";
import { toast } from "@/lib/toast";
import { useDeactivateQuiz, useReactivateQuiz } from "@/services/hooks/quiz";
import { useSession } from "@/services/hooks/auth/useSession";
import { useStartGroupQuiz } from "@/services/hooks/groupes/useStartGroupQuiz";
import { useQuitGroupe } from "@/services/hooks/groupes/useQuitGroupe";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MemberPopoverCard } from "@/components/pages/groups/MemberPopoverCard";
import { useQueryClient } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";

import { useMediaQuery } from "@/services/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MemberDrawer = ({
  isOpen,
  onClose,
  user,
  bgColor,
  niveauLabel,
  isChief,
  groupId,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  bgColor: string;
  niveauLabel: string;
  isChief: boolean;
  groupId: number;
}) => {
  const { user: currentUser } = useSession();
  const { mutate: quitGroupe, isPending } = useQuitGroupe();
  const router = useRouter();

  if (!user) return null;

  const isCurrentUser = currentUser?.id === user.id;

  const handleQuitGroup = () => {
    quitGroupe(groupId, {
      onSuccess: () => {
        toast({
          variant: "success",
          message: "Vous avez quitté le groupe.",
        });
        router.push("/student/groups");
      },
      onError: (error: any) => {
        toast({
          variant: "error",
          message: error.message || "Impossible de quitter le groupe.",
        });
      },
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[70vh]">
        <div className="mx-auto w-full max-w-sm">
          <div className={`h-12 `} />

          <div className="px-4 pb-6 relative">
            <div
              className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center text-gray-900 font-bold text-xl absolute -top-8 left-1/2 -translate-x-1/2 border-4 border-white shadow-lg`}
            >
              {user.prenom.charAt(0).toUpperCase()}
              {user.nom.charAt(0).toUpperCase()}
            </div>

            <div className="pt-10 text-center">
              <h3 className="text-lg font-bold text-gray-900">
                {user.prenom} {user.nom}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {isChief ? "Auteur du Groupe" : "Membre du Groupe"}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span className="break-all">{user.mail}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                <span>{niveauLabel}</span>
              </div>
            </div>

            {isCurrentUser && !isChief && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={isPending}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Quitter le groupe
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous sûr de vouloir quitter ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Vous ne pourrez plus
                        accéder aux ressources de ce groupe.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleQuitGroup}
                        disabled={isPending}
                      >
                        {isPending ? "Départ en cours..." : "Quitter"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const GroupPage = () => {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isCreateQuizModalOpen, setCreateQuizModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
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
          toast({
            variant: "error",
            message:
              error.message ||
              "Impossible de démarrer le quiz. Veuillez réessayer.",
          });
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
        backgroundSize: "160px 160px",
      }}
    >
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

        {/* Section Membres */}
        <div className="mb-8">
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

              const handleAvatarClick = () => {
                setSelectedUser({ ...user, bgColor });
                if (isMobile) {
                  setDrawerOpen(true);
                }
              };

              if (isMobile) {
                return (
                  <div
                    key={user.id}
                    onClick={handleAvatarClick}
                    className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center text-gray-900 font-bold text-lg cursor-pointer`}
                  >
                    {user.prenom.charAt(0).toUpperCase()}
                    {user.nom.charAt(0).toUpperCase()}
                  </div>
                );
              }

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

        {/* En-tête Quiz avec titre et bouton */}
        {quizzes.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Quiz du groupe
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {quizzes.length} quiz {quizzes.length > 1 ? "disponibles" : "disponible"}
              </p>
            </div>
            {isChief && (
              <button
                onClick={() => setCreateQuizModalOpen(true)}
                className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-4 sm:px-6 md:px-6 py-3 text-sm sm:text-base md:text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap flex items-center justify-center"
              >
                <span className="text-lg mr-2">+</span>
                <span className="hidden sm:inline">Nouveau quiz</span>
                <span className="sm:hidden">Créer</span>
              </button>
            )}
          </div>
        )}

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
                    router.push(
                      `/student/groups/${groupId}/quiz/${quiz.id}/notes`,
                    );
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <MemberDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={selectedUser}
        bgColor={selectedUser?.bgColor}
        niveauLabel={groupDetails.niveau?.libelle || ""}
        isChief={selectedUser?.id === groupDetails.groupe.chief_user}
        groupId={Number(groupId)}
      />

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
