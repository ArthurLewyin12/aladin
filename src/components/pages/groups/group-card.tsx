"use client";

import { PlusIcon, Eye, EyeOff } from "lucide-react";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { cn } from "@/lib/utils";
import { ClientTooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
  isActive: boolean;
  isChief: boolean;
  index: number;
  onDeactivate?: () => void;
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

export const GroupCard = ({
  title,
  description,
  groupId,
  members,
  numPeople,
  isActive,
  isChief,
  index,
  onDeactivate,
  onOpen,
  onInvite,
  className,
}: GroupCardProps) => {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];

  const hasMembersOrInvite = members && members.length > 0;

  return (
    <div
      className={cn(
        "relative rounded-3xl p-8 shadow-sm transition-all hover:shadow-md",
        bgColor,
        className,
        !isActive && "opacity-60",
      )}
    >
      {/* Header avec titre et icône de statut */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 pr-2">
          {title}
        </h3>
        <ClientTooltip>
          {isActive ? (
            isChief && onDeactivate ? (
              <TooltipTrigger>
                <button
                  onClick={onDeactivate}
                  className="flex-shrink-0 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Désactiver le groupe"
                >
                  <Eye size={20} />
                </button>
              </TooltipTrigger>
            ) : (
              <TooltipTrigger>
                <Eye size={20} className="flex-shrink-0 text-gray-600" />
              </TooltipTrigger>
            )
          ) : (
            <TooltipTrigger>
              <EyeOff size={20} className="flex-shrink-0 text-gray-600" />
            </TooltipTrigger>
          )}
          <TooltipContent>
            {!isChief ? (
              "Vous ne pouvez pas désactiver le groupe."
            ) : !isActive ? (
              "Le groupe est désactivé."
            ) : (
              "Désactiver le groupe"
            )}
          </TooltipContent>
        </ClientTooltip>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6 line-clamp-3">{description}</p>

      {/* Footer avec boutons/avatars */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Avatars des membres */}
          {members && members.length > 0 && (
            <AvatarCircles avatarUrls={members} numPeople={numPeople} />
          )}

          {/* Bouton Inviter des amis (toujours présent) */}
          {onInvite && (
            <button
              onClick={onInvite}
              className={cn(
                "rounded-full flex items-center justify-center transition-colors",
                members && members.length > 0
                  ? "h-10 w-10 bg-white text-gray-900 hover:bg-gray-50 -ml-4 border-2 border-white relative z-10"
                  : "bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50",
              )}
            >
              <PlusIcon
                className={cn(
                  "inline-block",
                  members && members.length > 0 ? "w-5 h-5" : "w-4 h-4 mr-1",
                )}
              />
              {!(members && members.length > 0) && (
                <span className="font-bold">Inviter des amis</span>
              )}
            </button>
          )}
        </div>

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
      </div>
    </div>
  );
};
