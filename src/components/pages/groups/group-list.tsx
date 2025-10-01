"use client";

import { useMemo, useCallback, useState } from "react";
import { useGroupes } from "@/services/hooks/groupes/useGroupes";
import { useDeleteGroupe } from "@/services/hooks/groupes/useDeleteGroupe";
import { GroupCard } from "./group-card";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

// Placeholders pour les avatars en attendant l'API users
const PLACEHOLDER_AVATARS = [
  {
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    profileUrl: "#",
  },
  {
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    profileUrl: "#",
  },
  {
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    profileUrl: "#",
  },
  {
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    profileUrl: "#",
  },
];

export const GroupList = () => {
  const { data: groupes, isLoading, isError } = useGroupes();
  const { mutate: deleteGroupeMutation, isPending: isDeletingGroup } =
    useDeleteGroupe();

  // State pour le dialog de confirmation
  const [deleteDialog, setDeleteDialog] = useState<{
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

  // Parser les user_ids et déterminer si le groupe a des membres
  const enrichedGroupes = useMemo(() => {
    if (!groupes) return [];

    return groupes.map((groupe, index) => {
      // Parser le JSON stringified user_id
      let userIds: number[] = [];
      try {
        userIds = JSON.parse(groupe.user_id);
      } catch (e) {
        console.error("Erreur parsing user_id:", e);
      }

      // Filtrer pour ne garder que les membres (pas le chief)
      const membersIds = userIds.filter((id) => id !== groupe.chief_user);

      // Générer des avatars placeholder basés sur le nombre de membres
      const memberAvatars = membersIds.slice(0, 4).map((id, index) => ({
        imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${groupe.id}-${id}`,
        profileUrl: `#user-${id}`,
      }));

      const hasMembers = membersIds.length > 0;
      const remainingCount = membersIds.length > 4 ? membersIds.length - 4 : 0;

      // Assigner une couleur basée sur l'index du groupe
      const cardColor = CARD_COLORS[index % CARD_COLORS.length];

      return {
        ...groupe,
        hasMembers,
        memberAvatars,
        remainingCount,
        cardColor,
      };
    });
  }, [groupes]);

  // Handlers
  const handleDelete = useCallback(
    (groupId: number, groupName: string, cardColor: string) => {
      setDeleteDialog({
        isOpen: true,
        groupId,
        groupName,
        cardColor,
      });
    },
    [],
  );

  const confirmDelete = useCallback(() => {
    if (deleteDialog.groupId) {
      deleteGroupeMutation(deleteDialog.groupId);
      setDeleteDialog({
        isOpen: false,
        groupId: null,
        groupName: "",
        cardColor: CARD_COLORS[0],
      });
    }
  }, [deleteDialog.groupId, deleteGroupeMutation]);

  const cancelDelete = useCallback(() => {
    setDeleteDialog({
      isOpen: false,
      groupId: null,
      groupName: "",
      cardColor: CARD_COLORS[0],
    });
  }, []);

  const handleOpen = useCallback((groupId: number) => {
    console.log("Open groupe:", groupId);
    // TODO: Implémenter la navigation vers le groupe
  }, []);

  const handleInvite = useCallback((groupId: number) => {
    console.log("Invite to groupe:", groupId);
    // TODO: Implémenter la modal d'invitation
  }, []);

  // État de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
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
            cardColor={groupe.cardColor}
            onDelete={() =>
              handleDelete(groupe.id, groupe.nom, groupe.cardColor)
            }
            onOpen={() => handleOpen(groupe.id)}
            onInvite={
              groupe.hasMembers ? undefined : () => handleInvite(groupe.id)
            }
          />
        ))}
      </div>

      {/* AlertDialog de confirmation de suppression */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => !open && cancelDelete()}
      >
        <AlertDialogContent className={`${deleteDialog.cardColor} border-none`}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">
              Supprimer le groupe ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700 text-base">
              Êtes-vous sûr de vouloir supprimer le groupe{" "}
              <span className="font-semibold">"{deleteDialog.groupName}"</span>{" "}
              ? Cette action est irréversible et tous les membres seront retirés
              du groupe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={cancelDelete}
              className="bg-white hover:bg-gray-100"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeletingGroup}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingGroup ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
