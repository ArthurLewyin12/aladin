"use client";

import { PlusIcon, GraduationCap, BookOpen, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Classe,
  ClasseMember,
} from "@/services/controllers/types/common/professeur.types";
import { StudentAvatars } from "@/components/ui/student-avatars";
import { Niveau } from "@/services/controllers/types/common";

interface ClasseCardProps {
  classe: Classe & {
    cardColor?: string;
    members?: ClasseMember[];
    niveau?: Niveau;
  };
  cardColor: string;
  onViewDetails: (classeId: number) => void;
  onDeactivate?: (classeId: number) => void;
  onReactivate?: (classeId: number) => void;
  onOpen?: (classeId: number) => void;
  onAddStudent?: (classeId: number) => void;
}

export const ClasseCard = ({
  classe,
  cardColor,
  onViewDetails,
  onDeactivate,
  onReactivate,
  onOpen,
  onAddStudent,
}: ClasseCardProps) => {
  const handleStatusChange = (newStatus: boolean) => {
    if (newStatus && onReactivate) {
      onReactivate(classe.id);
    } else if (!newStatus && onDeactivate) {
      onDeactivate(classe.id);
    }
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpen) {
      onOpen(classe.id);
    } else {
      onViewDetails(classe.id);
    }
  };

  // Transformer les membres en format Student pour StudentAvatars
  const activeMembers =
    classe.members?.filter((member) => member.is_active) || [];
  const students = activeMembers.map((member) => ({
    id: member.eleve.id,
    nom: member.eleve.nom,
    prenom: member.eleve.prenom,
  }));

  const descriptionText = classe.description || "Aucune description";

  // Formater la date de création
  const formatCreatedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return "Date inconnue";
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl p-8 shadow-sm transition-all hover:shadow-md",
        cardColor,
        !classe.is_active && "opacity-60",
      )}
    >
      {/* Header avec titre et switch */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 pr-2 flex-1">
          {classe.nom}
        </h3>
        <div className="flex items-center space-x-2">
          <Label
            htmlFor={`classe-status-${classe.id}`}
            className="text-sm font-medium"
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
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {descriptionText}
      </p>

      {/* Niveau de la classe */}
      {classe.niveau && (
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <GraduationCap className="w-4 h-4" />
          <span className="underline">Niveau</span>: {classe.niveau.libelle}
        </div>
      )}

      {/* Matières de la classe */}
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
        <BookOpen className="w-4 h-4" />
        <span className="underline">Matières</span>:{" "}
        {classe.matiere_ids.length === 0
          ? "Aucune"
          : `${classe.matiere_ids.length} matière(s)`}
      </div>

      {/* Date de création */}
      {classe.created_at && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Calendar className="w-3 h-3" />
          <span>Créée le {formatCreatedDate(classe.created_at)}</span>
        </div>
      )}

      {/* Footer avec avatars et bouton Ouvrir */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Avatars des élèves */}
          {students.length > 0 && (
            <StudentAvatars students={students} maxVisible={4} />
          )}

          {/* Bouton Ajouter un élève */}
          {onAddStudent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddStudent(classe.id);
              }}
              className={cn(
                "rounded-full flex items-center justify-center transition-colors",
                students.length > 0
                  ? "h-10 w-10 bg-white text-gray-900 hover:bg-gray-50 -ml-4 border-2 border-white relative z-10" // Style pour le bouton '+' quand il y a des avatars
                  : "bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50", // Style pour le bouton 'Ajouter un élève' quand il n'y a pas d'avatars
              )}
              title="Ajouter un élève"
            >
              <PlusIcon
                className={cn(
                  "inline-block",
                  students.length > 0 ? "w-5 h-5" : "w-4 h-4 mr-1",
                )}
              />
              {students.length === 0 && (
                <span className="font-bold">Ajouter un élève</span>
              )}
            </button>
          )}
        </div>

        {/* Bouton Ouvrir */}
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:gap-3 transition-all"
        >
          Ouvrir
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
};
