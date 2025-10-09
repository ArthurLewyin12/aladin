"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGroupes } from "@/services/hooks/groupes/useGroupes";
import { useDeactivateGroupe } from "@/services/hooks/groupes/useDeactivateGroupe";
import { useReactivateGroupe } from "@/services/hooks/groupes/useReactivateGroupe";
import { GroupCard } from "./group-card";
import { InviteUsersModal } from "./invit-member-modal";
import { Spinner } from "@/components/ui/spinner";
// import { toast } from "sonner";
import { useSession } from "@/services/hooks/auth/useSession";

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export const GroupList = () => {
  const router = useRouter();
  const { data: groupes, isLoading, isError } = useGroupes();
  const { user: currentUser } = useSession();

  console.log("Groupes Data:", JSON.stringify(groupes, null, 2));
  console.log("Current User:", JSON.stringify(currentUser, null, 2));

  const { mutate: deactivateGroupeMutation } = useDeactivateGroupe();
  const { mutate: reactivateGroupeMutation } = useReactivateGroupe();
  const [isMobile, setIsMobile] = useState(false);

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
        const members = item.utilisateurs.filter(
          (user) => user.id !== item.groupe.chief_user,
        );

        const displayedMembers = members.slice(0, 6);

        const memberAvatars = displayedMembers.map((user) => {
          const initials =
            `${user.prenom?.[0] || ""}${user.nom?.[0] || ""}`.toUpperCase();
          const imageUrl = `https://ui-avatars.com/api/?name=${user.prenom}+${user.nom}&background=random&color=fff&size=40`;
          return {
            imageUrl: imageUrl,
            profileUrl: `#user-${user.id}`,
          };
        });

        const cardColor = CARD_COLORS[index % CARD_COLORS.length];

        const isChief = currentUser?.id === item.groupe.chief_user;

        return {
          ...item.groupe,
          ...item,
          hasMembers: members.length > 0,
          memberAvatars,
          remainingCount: item.members_count > 6 ? item.members_count - 6 : 0,
          cardColor,
          index,
          isChief, // Explicitly add the isChief property
        };
      });
  }, [groupes, currentUser]);

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
      router.push(`/student/groups/${groupId}`);
    },
    [router],
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
        <div className="mb-4 text-6xl">📚</div>
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrichedGroupes.map((groupe) => (
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
            onDeactivate={() => handleDeactivate(groupe.id)}
            onActivate={() => handleActivate(groupe.id)} // Ajout
            onOpen={() => handleOpen(groupe.id)}
            onInvite={() =>
              handleInvite(groupe.id, groupe.nom, groupe.cardColor)
            }
          />
        ))}
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
