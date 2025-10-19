"use client";

import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { useSession } from "@/services/hooks/auth/useSession";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ParentNotesFiltersProps {
  matiereId: number | null;
  setMatiereId: (value: number | null) => void;
  dateDebut: string | null;
  setDateDebut: (value: string | null) => void;
  dateFin: string | null;
  setDateFin: (value: string | null) => void;
}

export function ParentNotesFilters({
  matiereId,
  setMatiereId,
  dateDebut,
  setDateDebut,
  dateFin,
  setDateFin,
}: ParentNotesFiltersProps) {
  const { user } = useSession();
  const { data: matieresData } = useMatieresByNiveau(user?.niveau_id || 0);

  const handleClearFilters = () => {
    setMatiereId(null);
    setDateDebut(null);
    setDateFin(null);
  };

  const hasActiveFilters = matiereId || dateDebut || dateFin;

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Filtres
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Filtre par matière */}
        <div className="space-y-2">
          <Label htmlFor="matiere-filter">Matière</Label>
          <Select
            value={matiereId?.toString() || ""}
            onValueChange={(value) =>
              setMatiereId(value ? parseInt(value) : null)
            }
          >
            <SelectTrigger id="matiere-filter">
              <SelectValue placeholder="Toutes les matières" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les matières</SelectItem>
              {matieresData?.matieres?.map((matiere) => (
                <SelectItem key={matiere.id} value={matiere.id.toString()}>
                  {matiere.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre date de début */}
        <div className="space-y-2">
          <Label htmlFor="date-debut-filter">Date de début</Label>
          <Input
            id="date-debut-filter"
            type="date"
            value={dateDebut || ""}
            onChange={(e) => setDateDebut(e.target.value || null)}
          />
        </div>

        {/* Filtre date de fin */}
        <div className="space-y-2">
          <Label htmlFor="date-fin-filter">Date de fin</Label>
          <Input
            id="date-fin-filter"
            type="date"
            value={dateFin || ""}
            onChange={(e) => setDateFin(e.target.value || null)}
          />
        </div>
      </div>
    </div>
  );
}
