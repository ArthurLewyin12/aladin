
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ClasseMember } from "@/services/controllers/types/common/professeur.types";
import { Niveau } from "@/services/controllers/types/common";
import { cn } from "@/lib/utils";
import { Mail, Phone, User2, GraduationCap, UserCircle } from "lucide-react";

interface StudentCardProps {
  member: ClasseMember;
  niveau?: Niveau;
  index: number;
  onDeactivate: (memberId: number) => void;
  onReactivate: (memberId: number) => void;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export const StudentCard = ({
  member,
  niveau,
  index,
  onDeactivate,
  onReactivate,
}: StudentCardProps) => {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];
  
  const handleStatusChange = (checked: boolean) => {
    if (checked) {
      onReactivate(member.id);
    } else {
      onDeactivate(member.id);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl p-6 shadow-sm transition-all hover:shadow-md",
        bgColor,
        !member.is_active && "opacity-60",
      )}
    >
      {/* Header avec avatar, nom et switch */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarFallback className="bg-gray-700 text-white font-semibold">
              {member.eleve.prenom.charAt(0).toUpperCase()}
              {member.eleve.nom.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-gray-900 text-lg">
              {member.eleve.prenom} {member.eleve.nom}
            </p>
            {member.eleve.type && (
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  member.eleve.type === "utilisateur"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800",
                )}
              >
                {member.eleve.type === "utilisateur" ? "Compte" : "Manuel"}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Label
            htmlFor={`member-status-${member.id}`}
            className="text-xs font-medium"
          >
            {member.is_active ? "Actif" : "Inactif"}
          </Label>
          <Switch
            id={`member-status-${member.id}`}
            checked={member.is_active}
            onCheckedChange={handleStatusChange}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
          />
        </div>
      </div>

      {/* Informations de contact */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Mail className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{member.eleve.email}</span>
        </div>

        {member.eleve.numero && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{member.eleve.numero}</span>
          </div>
        )}

        {niveau && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <GraduationCap className="w-4 h-4 flex-shrink-0" />
            <span>Niveau: {niveau.libelle}</span>
          </div>
        )}

        {member.eleve.parent_mail && (
          <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t border-gray-300/50">
            <UserCircle className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Contact parent</p>
              <p className="truncate">{member.eleve.parent_mail}</p>
              {member.eleve.parent_numero && (
                <p>{member.eleve.parent_numero}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
