"use client";

import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Classe } from "@/services/controllers/types/common/professeur.types";

interface ClasseCardProps {
  classe: Classe & { cardColor?: string };
  cardColor: string;
  onViewDetails: (classeId: number) => void;
  onDeactivate?: (classeId: number) => void;
  onReactivate?: (classeId: number) => void;
}

export const ClasseCard = ({
  classe,
  cardColor,
  onViewDetails,
  onDeactivate,
  onReactivate,
}: ClasseCardProps) => {
  const handleStatusChange = (newStatus: boolean) => {
    if (newStatus && onReactivate) {
      onReactivate(classe.id);
    } else if (!newStatus && onDeactivate) {
      onDeactivate(classe.id);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl p-6 shadow-sm transition-all hover:shadow-md cursor-pointer",
        cardColor,
        !classe.is_active && "opacity-60",
      )}
      onClick={() => onViewDetails(classe.id)}
    >
      {/* Header avec titre et switch */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 pr-2">
          {classe.nom}
        </h3>
        <div
          className="flex items-center space-x-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Label
            htmlFor={`classe-status-${classe.id}`}
            className="text-xs font-medium"
          >
            {classe.is_active ? "Actif" : "Inactif"}
          </Label>
          <Switch
            id={`classe-status-${classe.id}`}
            checked={classe.is_active}
            onCheckedChange={handleStatusChange}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
        {classe.description || "Aucune description"}
      </p>

      {/* Informations sur la classe */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users className="w-4 h-4" />
          <span>
            {classe.matiere_ids.length} matière
            {classe.matiere_ids.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Footer avec bouton */}
      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(classe.id);
          }}
          className="text-green-700 hover:text-green-800 hover:bg-green-50"
        >
          Voir détails →
        </Button>
      </div>
    </div>
  );
};
