"use client";

import { useState, useEffect, useMemo } from "react";
import {
  useSubjects,
  useSubjectsGeneric,
} from "@/services/hooks/professeur/useSubjects";
import { useSetSubjects } from "@/services/hooks/professeur/useSetSubjects";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/lib/toast";

export default function TeacherSubjects() {
  const [selectedMatieres, setSelectedMatieres] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);

  // Récupérer les matières déjà enseignées
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  const { mutate: setSubjectsMutation } = useSetSubjects();

  // Récupérer toutes les matières disponibles (sans filtrage par niveau)
  const { data: matieresGenericData, isLoading: isLoadingMatieres } =
    useSubjectsGeneric();
  const matieres = useMemo(
    () => matieresGenericData?.matieres || [],
    [matieresGenericData?.matieres],
  );

  const subjectsResponse = subjectsData || {
    matieres: [],
    libelles: [],
    count: 0,
    max: 3,
  };
  // Utiliser libelles pour récupérer les noms des matières sélectionnées
  const currentLibelles = Array.isArray(subjectsResponse.libelles)
    ? subjectsResponse.libelles.filter((item) => typeof item === "string")
    : [];
  // Récupérer les IDs des matières sélectionnées basées sur libelles
  const currentSubjectIds = currentLibelles.length > 0
    ? matieres
        .filter((m) => currentLibelles.includes(m.libelle))
        .map((m) => m.id)
    : [];
  const maxSubjects = subjectsResponse.max;
  const isSelectionComplete = currentLibelles.length === maxSubjects;
  const modificationsRestantes = subjectsResponse.modifications_restantes ?? undefined;
  const canModify = modificationsRestantes === undefined || modificationsRestantes > 0;

  // Initialiser selectedMatieres avec les matières actuelles
  useEffect(() => {
    if (currentLibelles.length > 0 && matieres.length > 0) {
      // Si on a les libellés, trouver les IDs correspondants
      const ids = matieres
        .filter((m) => currentLibelles.includes(m.libelle))
        .map((m) => m.id);
      setSelectedMatieres(ids);
    } else if (currentSubjectIds.length > 0) {
      // Fallback: utiliser currentSubjectIds
      setSelectedMatieres(currentSubjectIds);
    }
  }, [subjectsData, matieres]);

  const toggleMatiere = (matiereId: number) => {
    const isSelected = selectedMatieres.includes(matiereId);

    if (isModifyMode) {
      // En mode modification: permet de remplacer
      if (isSelected) {
        // Décocher une matière
        setSelectedMatieres(selectedMatieres.filter((id) => id !== matiereId));
      } else {
        // Cocher une matière (remplace si au max)
        if (selectedMatieres.length >= maxSubjects) {
          // Remplacer la première
          setSelectedMatieres([...selectedMatieres.slice(1), matiereId]);
        } else {
          setSelectedMatieres([...selectedMatieres, matiereId]);
        }
      }
    } else {
      // En mode sélection initiale
      if (isSelected) {
        // Grisé = disabled, ne peut pas décocher
        return;
      } else {
        // Peut seulement ajouter
        if (selectedMatieres.length < maxSubjects) {
          setSelectedMatieres([...selectedMatieres, matiereId]);
        } else {
          toast({
            variant: "warning",
            message: `Vous avez atteint la limite de ${maxSubjects} matières.`,
          });
        }
      }
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

    if (isModifyMode) {
      // Mode modification: envoyer les 3 matières complètes
      const selectedLibelles = matieres
        .filter((m) => selectedMatieres.includes(m.id))
        .map((m) => m.libelle);

      setSubjectsMutation(
        { matieres: selectedLibelles },
        {
          onSuccess: () => {
            setIsSaving(false);
            setIsModifyMode(false);
          },
          onError: () => {
            setIsSaving(false);
          },
        },
      );
    } else {
      // Mode sélection initiale: envoyer seulement la nouvelle matière
      const newMatiereIds = selectedMatieres.filter(
        (id) => !currentSubjectIds.includes(id),
      );

      if (newMatiereIds.length > 0) {
        const newMatiereLibelle = matieres.find(
          (m) => m.id === newMatiereIds[0],
        )?.libelle;

        if (newMatiereLibelle) {
          setSubjectsMutation(
            { matieres: [newMatiereLibelle] },
            {
              onSuccess: () => {
                setIsSaving(false);
                // Ne pas réinitialiser, on continue la sélection
              },
              onError: () => {
                setIsSaving(false);
              },
            },
          );
        }
      }
    }
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
        <p className="text-red-500 text-[1.1rem]">
          Nb : Vous pouvez changer vos matières une seule fois pendant la durée
          de votre abonnement.
        </p>
        {isSelectionComplete && modificationsRestantes !== undefined && (
          <p className={`text-sm font-medium mt-2 ${
            canModify ? "text-blue-700 bg-blue-50" : "text-red-700 bg-red-50"
          } px-3 py-2 rounded-lg`}>
            {canModify ? (
              <>
                📝 <span className="font-bold">{modificationsRestantes}</span>{" "}
                modification{modificationsRestantes !== 1 ? "s" : ""} restante
                {modificationsRestantes !== 1 ? "s" : ""} avant choix définitif
              </>
            ) : (
              <>
                ✓ Vos choix de matières sont maintenant définitifs et ne peuvent plus être modifiés.
              </>
            )}
          </p>
        )}
        <p className="text-sm text-gray-600 mt-1">
          Sélectionnez les matières que vous enseignez (maximum {maxSubjects})
        </p>
        {currentLibelles.length > 0 && (
          <p className="text-sm text-green-700 font-medium mt-2">
            ✓ Vous avez sélectionné{" "}
            <span className="font-bold text-green-900">
              {currentLibelles.length}/{maxSubjects}
            </span>
            {maxSubjects - currentLibelles.length > 0 && (
              <>
                {" "}
                - Il vous reste{" "}
                <span className="font-bold text-green-900">
                  {maxSubjects - currentLibelles.length}
                </span>{" "}
                {maxSubjects - currentLibelles.length === 1
                  ? "matière"
                  : "matières"}{" "}
                à sélectionner
              </>
            )}
            {maxSubjects - currentLibelles.length === 0 && " (Limite atteinte)"}
          </p>
        )}
        {currentLibelles.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            {currentLibelles.map((libelle, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
              >
                {libelle}
              </span>
            ))}
            {isSelectionComplete && !isModifyMode && canModify && (
              <Button
                onClick={() => {
                  toast({
                    variant: "warning",
                    message:
                      "⚠️ C'est votre unique chance de modification. Veuillez bien vérifier vos sélections avant de sauvegarder.",
                  });
                  setIsModifyMode(true);
                }}
                variant="outline"
                size="sm"
                className="ml-2 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                Modifier
              </Button>
            )}
            {isSelectionComplete && !canModify && (
              <span className="ml-2 text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                ✓ Choix définitif
              </span>
            )}
          </div>
        )}
      </div>

      {/* Liste de toutes les matières disponibles - Affichée si pas en limite OU en mode modification */}
      {(maxSubjects - currentLibelles.length > 0 || isModifyMode) && (
        <div>
          <Label className="text-sm font-semibold text-gray-700">
            {isModifyMode
              ? "Modifiez vos matières"
              : "Sélectionnez vos matières"}
          </Label>
          {isLoadingMatieres ? (
            <div className="flex justify-center py-8">
              <Spinner size="sm" />
            </div>
          ) : matieres.length > 0 ? (
            <div className="mt-2 space-y-2 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
              {matieres.map((matiere) => {
                const isSelected = selectedMatieres.includes(matiere.id);
                const isLocked = !isModifyMode && isSelected;

                return (
                  <div
                    key={matiere.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors border ${
                      isLocked
                        ? "bg-gray-100 border-gray-300 opacity-60"
                        : "hover:bg-white border-transparent hover:border-green-200"
                    }`}
                  >
                    <Checkbox
                      id={`matiere-${matiere.id}`}
                      checked={isSelected}
                      onCheckedChange={() => toggleMatiere(matiere.id)}
                      disabled={isSaving || isLocked}
                    />
                    <label
                      htmlFor={`matiere-${matiere.id}`}
                      className={`text-sm font-medium leading-none cursor-pointer flex-1 ${
                        isLocked ? "text-gray-500 cursor-not-allowed" : ""
                      }`}
                    >
                      {matiere.libelle}
                    </label>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2 p-3 bg-gray-50 rounded-lg">
              Aucune matière disponible
            </p>
          )}
        </div>
      )}

      {/* Boutons d'action */}
      {/* Mode sélection initiale: affiche si changements ET pas encore 3 matières */}
      {!isModifyMode &&
        hasChanges &&
        maxSubjects - currentLibelles.length > 0 && (
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
            <Button
              onClick={() => setSelectedMatieres(currentSubjectIds)}
              variant="outline"
              disabled={isSaving}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        )}

      {/* Mode modification: affiche si en mode modif ET changements */}
      {isModifyMode && hasChanges && (
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Enregistrement...
              </>
            ) : (
              "Confirmer les modifications"
            )}
          </Button>
          <Button
            onClick={() => {
              setSelectedMatieres(currentSubjectIds);
              setIsModifyMode(false);
            }}
            variant="outline"
            disabled={isSaving}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      )}

      {/* Message d'information */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <span className="font-semibold">💡 Info:</span> Sélectionnez les
          matières que vous enseignez. Vous pourrez ensuite créer des classes et
          y associer ces matières selon le niveau de vos élèves.
        </p>
      </div>
    </div>
  );
}
