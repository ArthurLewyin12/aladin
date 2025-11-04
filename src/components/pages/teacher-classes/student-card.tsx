
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ClasseMember } from "@/services/controllers/types/common/professeur.types";
import { Niveau } from "@/services/controllers/types/common";
import { cn } from "@/lib/utils";

interface StudentCardProps {
  member: ClasseMember;
  niveau?: Niveau;
  onDeactivate: (memberId: number) => void;
  onReactivate: (memberId: number) => void;
}

export const StudentCard = ({
  member,
  niveau,
  onDeactivate,
  onReactivate,
}: StudentCardProps) => {
  const handleStatusChange = (checked: boolean) => {
    if (checked) {
      onReactivate(member.id);
    } else {
      onDeactivate(member.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
      <Avatar className="h-10 w-10">
        <AvatarFallback>
          {member.eleve.prenom.charAt(0).toUpperCase()}
          {member.eleve.nom.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-semibold text-gray-900">
          {member.eleve.prenom} {member.eleve.nom}
        </p>
        <p className="text-sm text-gray-600">{member.eleve.email}</p>
        {niveau && (
          <p className="text-xs text-gray-500">Niveau: {niveau.libelle}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
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
  );
};
