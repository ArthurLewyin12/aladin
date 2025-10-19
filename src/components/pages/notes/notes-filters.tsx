"use client";

import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { useSession } from "@/services/hooks/auth/useSession";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function NotesFilters() {
  const { user } = useSession();
  const { data: matieresData } = useMatieresByNiveau(user?.niveau?.id || 0);
  const matieres = matieresData?.matieres || [];

  const [matiereId, setMatiereId] = useQueryState(
    "matiere_id",
    parseAsInteger,
  );
  const [dateDebut, setDateDebut] = useQueryState("date_debut", parseAsString);
  const [dateFin, setDateFin] = useQueryState("date_fin", parseAsString);

  const handleClearFilters = () => {
    setMatiereId(null);
    setDateDebut(null);
    setDateFin(null);
  };

  const hasFilters = matiereId || dateDebut || dateFin;

  return (
    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filtres</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtre par matière */}
        <div className="space-y-2">
          <Label htmlFor="matiere-filter">Matière</Label>
          <Select
            value={matiereId?.toString() || "all"}
            onValueChange={(value) =>
              setMatiereId(value === "all" ? null : parseInt(value))
            }
          >
            <SelectTrigger id="matiere-filter">
              <SelectValue placeholder="Toutes les matières" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les matières</SelectItem>
              {matieres.map((matiere) => (
                <SelectItem key={matiere.id} value={matiere.id.toString()}>
                  {matiere.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre date début */}
        <div className="space-y-2">
          <Label htmlFor="date-debut">Date de début</Label>
          <Input
            id="date-debut"
            type="date"
            value={dateDebut || ""}
            onChange={(e) => setDateDebut(e.target.value || null)}
          />
        </div>

        {/* Filtre date fin */}
        <div className="space-y-2">
          <Label htmlFor="date-fin">Date de fin</Label>
          <Input
            id="date-fin"
            type="date"
            value={dateFin || ""}
            onChange={(e) => setDateFin(e.target.value || null)}
          />
        </div>
      </div>
    </div>
  );
}
