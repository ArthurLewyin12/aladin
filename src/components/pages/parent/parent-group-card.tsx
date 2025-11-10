"use client";

import { useState } from "react";
import { PlusIcon, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Enfant } from "@/services/controllers/types/common/parent.types";
import { Eleve } from "@/services/controllers/types/common/repetiteur.types";

interface Avatar {
  imageUrl: string;
  profileUrl?: string;
  name?: string;
}

interface ParentGroupCardProps {
  title: string;
  description: string;
  groupId: number;
  members?: Avatar[];
  numPeople?: number;
  isActive: boolean;
  isChief: boolean;
  index: number;
  bgColor: string;
  availableEnfants: (Enfant | Eleve)[]; // Enfants du parent ou élèves du répétiteur qui ne sont pas déjà dans le groupe
  onAddEnfant?: (enfantId: number, groupId: number) => void;
  onOpen?: () => void;
  className?: string;
  variant?: "parent" | "repetiteur"; // Pour adapter le texte
}

export const ParentGroupCard = ({
  title,
  description,
  groupId,
  members,
  numPeople,
  isActive,
  isChief,
  bgColor,
  availableEnfants,
  onAddEnfant,
  onOpen,
  className,
  variant = "parent",
}: ParentGroupCardProps) => {
  const [showEnfantSelect, setShowEnfantSelect] = useState(false);
  const [selectedEnfantId, setSelectedEnfantId] = useState<string>("");
  
  const addButtonText = variant === "parent" ? "Ajouter un enfant" : "Ajouter un élève";
  const selectPlaceholder = variant === "parent" ? "Sélectionner un enfant" : "Sélectionner un élève";

  const handleAddEnfant = () => {
    if (selectedEnfantId && onAddEnfant) {
      onAddEnfant(parseInt(selectedEnfantId), groupId);
      setSelectedEnfantId("");
      setShowEnfantSelect(false);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl p-6 sm:p-8 shadow-sm transition-all hover:shadow-md",
        bgColor,
        className,
        !isActive && "opacity-60",
      )}
    >
      {/* Header avec titre */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 pr-2">
          {title}
        </h3>
        {!isActive && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
            Inactif
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6 line-clamp-3">{description}</p>

      {/* Membres */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-700">
        <Users className="w-4 h-4" />
        <span>
          {numPeople || 0} membre{(numPeople || 0) > 1 ? "s" : ""}
        </span>
      </div>

      {/* Footer avec boutons */}
      <div className="flex flex-col gap-3">
        {/* Bouton Ajouter un enfant (seulement pour le chef) */}
        {isChief && availableEnfants.length > 0 && (
          <div className="space-y-2">
            {!showEnfantSelect ? (
              <button
                onClick={() => setShowEnfantSelect(true)}
                className={cn(
                  "w-full bg-white px-4 py-2 text-sm font-medium rounded-lg border flex items-center justify-center gap-2 transition-colors",
                  variant === "parent" 
                    ? "text-purple-700 hover:bg-purple-50 border-purple-200" 
                    : "text-[#548C2F] hover:bg-green-50 border-green-200"
                )}
              >
                <PlusIcon className="w-4 h-4" />
                <span>{addButtonText}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Select value={selectedEnfantId} onValueChange={setSelectedEnfantId}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder={selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEnfants.map((enfant) => (
                      <SelectItem key={enfant.id} value={enfant.id.toString()}>
                        {enfant.prenom} {enfant.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowEnfantSelect(false);
                      setSelectedEnfantId("");
                    }}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddEnfant}
                    disabled={!selectedEnfantId}
                    className={cn(
                      "flex-1",
                      variant === "parent" 
                        ? "bg-purple-600 hover:bg-purple-700" 
                        : "bg-[#548C2F] hover:bg-[#4a7829]"
                    )}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bouton Ouvrir */}
        {onOpen && (
          <button
            onClick={onOpen}
            className="w-full bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Voir les détails
            <span className="text-lg">→</span>
          </button>
        )}
      </div>
    </div>
  );
};
