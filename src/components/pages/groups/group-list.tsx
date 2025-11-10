"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGroupes } from "@/services/hooks/groupes/useGroupes";
import { useDeactivateGroupe } from "@/services/hooks/groupes/useDeactivateGroupe";
import { useReactivateGroupe } from "@/services/hooks/groupes/useReactivateGroupe";
import { GroupCard } from "./group-card";
import { ParentGroupCard } from "../parent/parent-group-card";
import { InviteUsersModal } from "./invit-member-modal";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "@/services/hooks/auth/useSession";
import { useEnfants } from "@/services/hooks/parent";
import { useEleves } from "@/services/hooks/repetiteur";
import { parseAsInteger, useQueryState } from "nuqs";
import { toast } from "@/lib/toast";

const ITEMS_PER_PAGE = 6;

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

interface GroupListProps {
  onCreateGroup: () => void;
  basePath?: string; // Chemin de base pour la redirection (ex: "/student/groups", "/parent/groups", ou "/repetiteur/groups")
  showCreateButton?: boolean; // Afficher ou masquer le bouton de création
  variant?: "student" | "parent" | "repetiteur"; // Variant pour savoir si c'est un parent, un étudiant ou un répétiteur
}

export const GroupList = ({
  onCreateGroup,
  basePath = "/student/groups",
  showCreateButton = true,
  variant = "student",
}: GroupListProps) => {
  const router = useRouter();
  const { data: groupes, isLoading, isError } = useGroupes();
  const { user: currentUser } = useSession();

  // Appeler conditionnellement les hooks en fonction du variant
  const { data: enfantsData } = variant === "parent" ? useEnfants() : { data: undefined };
  const { data: elevesData } = variant === "repetiteur" ? useEleves() : { data: undefined };

  console.log("Groupes Data:", JSON.stringify(groupes, null, 2));
  console.log("Current User:", JSON.stringify(currentUser, null, 2));

  const { mutate: deactivateGroupeMutation } = useDeactivateGroupe();
  const { mutate: reactivateGroupeMutation } = useReactivateGroupe();
  const [isMobile, setIsMobile] = useState(false);

  // Pagination avec nuqs
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // State pour la modale d'invitation
  const [inviteModal, setInviteModal] = useState<{
    isOpen: boolean;
    groupId: number | null;
    groupName: string;
    cardColor: string;
  }>({
    isOpen: false,
    groupId: null,
    groupName: "",
    cardColor: CARD_COLORS[0],
  });

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const enrichedGroupes = useMemo(() => {
    if (!groupes) return [];

    return groupes
      .filter((item) => {
        if (item.groupe.is_active) {
          return true;
        }
        // For inactive groups, only show them to the chief
        return currentUser?.id === item.groupe.chief_user;
      })
      .map((item, index) => {
        // Inclure tous les membres (y compris le chef)
        const displayedMembers = item.utilisateurs.slice(0, 6);

        const memberAvatars = displayedMembers.map((user) => {
          const initials =
            `${user.prenom?.[0] || ""}${user.nom?.[0] || ""}`.toUpperCase();
          const imageUrl = `https://ui-avatars.com/api/?name=${user.prenom}+${user.nom}&background=random&color=fff&size=40`;
          return {
            imageUrl: imageUrl,
          };
        });

        const cardColor = CARD_COLORS[index % CARD_COLORS.length];

        const isChief = currentUser?.id === item.groupe.chief_user;

        return {
          ...item.groupe,
          ...item,
          hasMembers: item.utilisateurs.length > 0,
          memberAvatars,
          remainingCount:
            item.utilisateurs.length > 6 ? item.utilisateurs.length - 6 : 0,
          cardColor,
          index,
          isChief, // Explicitly add the isChief property
        };
      });
  }, [groupes, currentUser]);

  // Calculer les groupes paginés
  const { paginatedGroupes, totalPages } = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedGroupes: enrichedGroupes.slice(startIndex, endIndex),
      totalPages: Math.ceil(enrichedGroupes.length / ITEMS_PER_PAGE),
    };
  }, [enrichedGroupes, page]);

  // Handlers
  const handleDeactivate = useCallback(
    (groupId: number) => {
      deactivateGroupeMutation(groupId);
    },
    [deactivateGroupeMutation],
  );

  const handleActivate = useCallback(
    (groupId: number) => {
      reactivateGroupeMutation(groupId);
    },
    [reactivateGroupeMutation],
  );

  const handleOpen = useCallback(
    (groupId: number) => {
      router.push(`${basePath}/${groupId}`);
    },
    [router, basePath],
  );

  const handleInvite = useCallback(
    (groupId: number, groupName: string, cardColor: string) => {
      setInviteModal({
        isOpen: true,
        groupId,
        groupName,
        cardColor,
      });
    },
    [],
  );

  const closeInviteModal = useCallback(() => {
    setInviteModal({
      isOpen: false,
      groupId: null,
      groupName: "",
      cardColor: CARD_COLORS[0],
    });
  }, []);

  const handleAddEnfant = useCallback((enfantId: number, groupId: number) => {
    // TODO: Implémenter l'API pour ajouter un enfant à un groupe
    toast({
      variant: "default",
      message: "Fonctionnalité en cours de développement",
    });
    console.log(`Ajouter enfant ${enfantId} au groupe ${groupId}`);
  }, []);

  // État de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  // État d'erreur
  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">
          Une erreur est survenue lors du chargement des groupes.
        </p>
      </div>
    );
  }

  // État vide
  if (!groupes || groupes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/*<div className="mb-4 text-6xl">📚</div>*/}
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          Aucun groupe pour le moment
        </h3>
        <p className="mb-6 text-gray-600">
          Créez votre premier groupe d'étude pour commencer à réviser avec vos
          amis !
        </p>
        <button className="rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-gray-800 transition-colors">
          + Créer un groupe
        </button>
      </div>
    );
  }

  // Liste des groupes
  return (
    <>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* En-tête avec titre et bouton */}
        <div className=" flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {variant === "parent"
                ? "Groupes de vos enfants"
                : variant === "repetiteur"
                  ? "Groupes de vos élèves"
                  : "Mes Groupes"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {enrichedGroupes.length} groupe
              {enrichedGroupes.length > 1 ? "s" : ""}{" "}
              {variant === "parent" || variant === "repetiteur"
                ? enrichedGroupes.length > 1
                  ? "rejoints"
                  : "rejoint"
                : enrichedGroupes.length > 1
                  ? "disponibles"
                  : "disponible"}
              {totalPages > 1 && ` • Page ${page} sur ${totalPages}`}
            </p>
          </div>
          {showCreateButton && (
            <button
              onClick={onCreateGroup}
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-4 sm:px-6 md:px-6 py-3  text-sm sm:text-base md:text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap flex items-center justify-center"
            >
              <span className="text-lg mr-2">+</span>
              <span className="hidden sm:inline">Nouveau groupe</span>
              <span className="sm:hidden">Créer</span>
            </button>
          )}
        </div>

        {/* Grille des groupes paginés */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedGroupes.map((groupe) => {
            if (variant === "parent" || variant === "repetiteur") {
              // Calculer les enfants/élèves disponibles (pas encore dans ce groupe)
              const sourceData =
                variant === "parent"
                  ? enfantsData?.enfants
                  : elevesData?.eleves;
              const availableEnfants = (sourceData || []).filter(
                (enfant) =>
                  !groupe.utilisateurs.some((u) => u.id === enfant.id),
              );

              return (
                <ParentGroupCard
                  key={groupe.id}
                  title={groupe.nom}
                  description={groupe.description}
                  groupId={groupe.id}
                  members={groupe.hasMembers ? groupe.memberAvatars : undefined}
                  numPeople={groupe.members_count}
                  isActive={groupe.groupe.is_active}
                  isChief={groupe.isChief}
                  index={groupe.index}
                  bgColor={groupe.cardColor}
                  availableEnfants={availableEnfants}
                  onAddEnfant={handleAddEnfant}
                  onOpen={() => handleOpen(groupe.id)}
                  variant={variant === "repetiteur" ? "repetiteur" : "parent"}
                />
              );
            }

            // Cas étudiant (par défaut)
            return (
              <GroupCard
                key={groupe.id}
                title={groupe.nom}
                description={groupe.description}
                groupId={groupe.id.toString()}
                members={groupe.hasMembers ? groupe.memberAvatars : undefined}
                numPeople={groupe.remainingCount}
                isActive={groupe.groupe.is_active}
                isChief={groupe.isChief}
                index={groupe.index}
                createdAt={groupe.created_at}
                onDeactivate={() => handleDeactivate(groupe.id)}
                onActivate={() => handleActivate(groupe.id)}
                onOpen={() => handleOpen(groupe.id)}
                onInvite={() =>
                  handleInvite(groupe.id, groupe.nom, groupe.cardColor)
                }
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

      {/* Modale d'invitation */}
      {inviteModal.groupId && (
        <InviteUsersModal
          isOpen={inviteModal.isOpen}
          onClose={closeInviteModal}
          groupId={inviteModal.groupId}
          groupName={inviteModal.groupName}
          cardColor={inviteModal.cardColor}
          isMobile={isMobile}
        />
      )}
    </>
  );
};
