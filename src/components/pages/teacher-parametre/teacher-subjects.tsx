"use client";

import { useState, useEffect } from "react";
import { useSubjects } from "@/services/hooks/professeur/useSubjects";
import { useSetSubjects } from "@/services/hooks/professeur/useSetSubjects";
import { useNiveaux } from "@/services/hooks/niveaux/useNiveaux";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieresByNiveau";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TeacherSubjects() {
  const [selectedNiveau, setSelectedNiveau] = useState<string>("");
  const [selectedMatieres, setSelectedMatieres] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Récupérer les matières déjà enseignées
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  const { mutate: setSubjectsMutation } = useSetSubjects();

  // Récupérer les niveaux
  const { data: niveauxData } = useNiveaux();
  const niveaux = niveauxData?.niveaux || [];

  // Récupérer les matières du niveau sélectionné
  const { data: matieresData, isLoading: isLoadingMatieres } =
    useMatieresByNiveau(selectedNiveau ? parseInt(selectedNiveau) : null);
  const matieres = matieresData?.matieres || [];

  const subjectsResponse = subjectsData || { matieres: [], count: 0, max: 3 };
  const currentSubjectIds = subjectsResponse.matieres.map((m) => m.id);
  const maxSubjects = subjectsResponse.max;

  // Initialiser selectedMatieres avec les matières actuelles
  useEffect(() => {
    setSelectedMatieres(currentSubjectIds);
  }, [subjectsData]);

  const toggleMatiere = (matiereId: number) => {
    if (selectedMatieres.includes(matiereId)) {
      setSelectedMatieres(
        selectedMatieres.filter((id) => id !== matiereId)
      );
    } else {
      if (selectedMatieres.length >= maxSubjects) {
        toast({
          variant: "warning",
          message: `Vous ne pouvez sélectionner que ${maxSubjects} matières maximum.`,
        });
        return;
      }
      setSelectedMatieres([...selectedMatieres, matiereId]);
    }
  };

  const handleSave = async () => {
    if (selectedMatieres.length === 0) {
      toast({
        variant: "warning",
        message: "Veuillez sélectionner au moins une matière.",
      });
      return;
    }

    setIsSaving(true);
    setSubjectsMutation(
      { matiere_ids: selectedMatieres },
      {
        onSuccess: () => {
          setIsSaving(false);
        },
        onError: () => {
          setIsSaving(false);
        },
      }
    );
  };

  const hasChanges =
    JSON.stringify(selectedMatieres.sort()) !==
    JSON.stringify(currentSubjectIds.sort());

  if (isLoadingSubjects) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm bg-white/50 border border-green-100">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Mes matières
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Sélectionnez les matières que vous enseignez (maximum {maxSubjects})
        </p>
        <p className="text-xs text-green-600 mt-2 font-medium">
          {selectedMatieres.length}/{maxSubjects} matières sélectionnées
        </p>
      </div>

      {/* Matières actuellement enseignées */}
      {currentSubjectIds.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">
            Matières actuelles
          </Label>
          <div className="flex flex-wrap gap-2">
            {subjectsResponse.matieres.map((matiere) => (
              <div
                key={matiere.id}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 border border-green-200"
              >
                <span className="text-sm font-medium text-green-800">
                  {matiere.libelle}
                </span>
                <span className="text-xs text-green-600">
                  {matiere.niveau.libelle}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sélecteur de niveau */}
      <div>
        <Label htmlFor="niveau" className="text-sm font-semibold text-gray-700">
          Sélectionner un niveau
        </Label>
        <Select value={selectedNiveau} onValueChange={setSelectedNiveau}>
          <SelectTrigger className="mt-2 w-full bg-gray-50 border-gray-200">
            <SelectValue placeholder="Choisir un niveau" />
          </SelectTrigger>
          <SelectContent>
            {niveaux.map((niveau) => (
              <SelectItem key={niveau.id} value={niveau.id.toString()}>
                {niveau.libelle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des matières du niveau sélectionné */}
      {selectedNiveau && (
        <div>
          <Label className="text-sm font-semibold text-gray-700">
            Matières disponibles pour {niveaux.find(n => n.id.toString() === selectedNiveau)?.libelle}
          </Label>
          {isLoadingMatieres ? (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
            </div>
          ) : matieres.length > 0 ? (
            <div className="mt-2 space-y-2 max-h-64 overflow-y-auto p-3 bg-gray-50 rounded-lg border border-gray-200">
              {matieres.map((matiere) => (
                <div
                  key={matiere.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Checkbox
                    id={`matiere-${matiere.id}`}
                    checked={selectedMatieres.includes(matiere.id)}
                    onCheckedChange={() => toggleMatiere(matiere.id)}
                    disabled={
                      isSaving ||
                      (selectedMatieres.length >= maxSubjects &&
                        !selectedMatieres.includes(matiere.id))
                    }
                  />
                  <label
                    htmlFor={`matiere-${matiere.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 cursor-pointer flex-1"
                  >
                    {matiere.libelle}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2 p-3 bg-gray-50 rounded-lg">
              Aucune matière disponible pour ce niveau
            </p>
          )}
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer les matières"
          )}
        </Button>
        {hasChanges && (
          <Button
            onClick={() => setSelectedMatieres(currentSubjectIds)}
            variant="outline"
            disabled={isSaving}
            className="flex-1"
          >
            Annuler
          </Button>
        )}
      </div>

      {/* Message d'information */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <span className="font-semibold">Important:</span> Vous devez définir vos matières avant de pouvoir créer des classes. Les matières sélectionnées ici doivent correspondre au niveau de vos classes.
        </p>
      </div>
    </div>
  );
}
