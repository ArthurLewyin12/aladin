"use client";

import { PlusIcon, Trash2 } from "lucide-react";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { cn } from "@/lib/utils";

interface Avatar {
  imageUrl: string;
  profileUrl: string;
}

interface GroupCardProps {
  title: string;
  description: string;
  groupId: string;
  members?: Avatar[];
  numPeople?: number;
  cardColor?: string;
  onDelete?: () => void;
  onOpen?: () => void;
  onInvite?: () => void;
  className?: string;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

// Fonction pour obtenir une couleur aléatoire
const getRandomColor = () => {
  return CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];
};

export const GroupCard = ({
  title,
  description,
  groupId,
  members,
  numPeople,
  cardColor,
  onDelete,
  onOpen,
  onInvite,
  className,
}: GroupCardProps) => {
  // Utiliser la couleur passée en prop, sinon générer aléatoirement
  const bgColor = cardColor || getRandomColor();

  const hasMembersOrInvite = members && members.length > 0;

  return (
    <div
      className={cn(
        "relative rounded-2xl p-6 shadow-sm transition-all hover:shadow-md",
        bgColor,
        className,
      )}
    >
      {/* Header avec titre et icône delete */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 pr-2">
          {title}
        </h3>
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex-shrink-0 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Supprimer le groupe"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6 line-clamp-3">{description}</p>

      {/* Footer avec boutons/avatars */}
      <div className="flex items-center justify-between">
        {hasMembersOrInvite ? (
          <>
            {/* Avatars des membres */}
            <AvatarCircles avatarUrls={members || []} numPeople={numPeople} />
            {/* Bouton Ouvrir */}
            {onOpen && (
              <button
                onClick={onOpen}
                className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:gap-3 transition-all"
              >
                Ouvrir
                <span className="text-lg">→</span>
              </button>
            )}
          </>
        ) : (
          <>
            {/* Bouton Inviter des amis */}
            {onInvite && (
              <button
                onClick={onInvite}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <PlusIcon className="inline-block w-4 h-4 mr-1" />
                <span className="font-bold">Inviter des amis</span>
              </button>
            )}
            {/* Bouton Ouvrir */}
            {onOpen && (
              <button
                onClick={onOpen}
                className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:gap-3 transition-all"
              >
                Ouvrir
                <span className="text-lg">→</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
