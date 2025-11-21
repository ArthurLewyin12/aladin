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
import { MatiereGeneric } from "@/services/controllers/types/common/professeur.types";

export default function TeacherSubjects() {
  const [selectedMatiereGenerics, setSelectedMatiereGenerics] = useState<
    number[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [nombreMatiereGenerics, setNombreMatiereGenerics] = useState<number>(0); // Sera initialisé avec les données
  const [showNumberInput, setShowNumberInput] = useState(false);

  // Récupérer les matières déjà enseignées
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  const { mutate: setSubjectsMutation } = useSetSubjects();

  // Récupérer toutes les matières disponibles (sans filtrage par niveau)
  const { data: matieresGenericData, isLoading: isLoadingMatiereGenerics } =
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
  const maxSubjects = subjectsResponse.max || 3;
  // Utiliser libelles pour récupérer les noms des matières sélectionnées
  const currentLibelles = Array.isArray(subjectsResponse.libelles)
    ? subjectsResponse.libelles.filter(
        (item: string) => typeof item === "string",
      )
    : [];
  // Récupérer les IDs des matières sélectionnées basées sur libelles
  const currentSubjectIds =
    currentLibelles.length > 0
      ? matieres
          .filter((m: MatiereGeneric) => currentLibelles.includes(m.libelle))
          .map((m: MatiereGeneric) => m.id)
      : [];
  const isSelectionComplete =
    currentLibelles.length > 0 &&
    currentLibelles.length === nombreMatiereGenerics;
  const modificationsRestantes =
    subjectsResponse.modifications_restantes ?? undefined;
  const canModify =
    modificationsRestantes === undefined || modificationsRestantes > 0;

  // Déterminer si on doit demander le nombre de matières
  const shouldAskNumber =
    currentLibelles.length === 0 || (isModifyMode && showNumberInput);

  // Initialiser selectedMatiereGenerics et nombreMatiereGenerics avec les matières actuelles
  useEffect(() => {
    if (currentLibelles.length > 0 && matieres.length > 0) {
      // Si on a les libellés, trouver les IDs correspondants
      const ids = matieres
        .filter((m: MatiereGeneric) => currentLibelles.includes(m.libelle))
        .map((m: MatiereGeneric) => m.id);
      setSelectedMatiereGenerics(ids);
      // Initialiser le nombre de matières avec le count actuel
      if (nombreMatiereGenerics === 0) {
        setNombreMatiereGenerics(currentLibelles.length || 3);
      }
    } else if (currentSubjectIds.length > 0) {
      // Fallback: utiliser currentSubjectIds
      setSelectedMatiereGenerics(currentSubjectIds);
      if (nombreMatiereGenerics === 0) {
        setNombreMatiereGenerics(currentSubjectIds.length || 3);
      }
    }
  }, [subjectsData, matieres]);

  const toggleMatiereGeneric = (matiereId: number) => {
    const isSelected = selectedMatiereGenerics.includes(matiereId);

    if (isModifyMode) {
      // En mode modification: permet de sélectionner/désélectionner librement
      if (isSelected) {
        setSelectedMatiereGenerics(
          selectedMatiereGenerics.filter((id) => id !== matiereId),
        );
      } else {
        if (selectedMatiereGenerics.length >= nombreMatiereGenerics) {
          toast({
            variant: "warning",
            message: `Vous devez sélectionner exactement ${nombreMatiereGenerics} matière${nombreMatiereGenerics > 1 ? "s" : ""}. Décochez d'abord une matière pour en ajouter une nouvelle.`,
          });
        } else {
          setSelectedMatiereGenerics([...selectedMatiereGenerics, matiereId]);
        }
      }
    } else {
      // En mode sélection initiale: peut sélectionner/désélectionner jusqu'à la limite
      if (isSelected) {
        setSelectedMatiereGenerics(
          selectedMatiereGenerics.filter((id) => id !== matiereId),
        );
      } else {
        if (selectedMatiereGenerics.length >= nombreMatiereGenerics) {
          toast({
            variant: "warning",
            message: `Vous devez sélectionner exactement ${nombreMatiereGenerics} matière${nombreMatiereGenerics > 1 ? "s" : ""}. Décochez d'abord une matière pour en ajouter une nouvelle.`,
          });
        } else {
          setSelectedMatiereGenerics([...selectedMatiereGenerics, matiereId]);
        }
      }
    }
  };

  const handleSave = async () => {
    if (selectedMatiereGenerics.length === 0) {
      toast({
        variant: "warning",
        message: "Veuillez sélectionner au moins une matière.",
      });
      return;
    }

    if (selectedMatiereGenerics.length !== nombreMatiereGenerics) {
      toast({
        variant: "error",
        message: `Vous devez sélectionner exactement ${nombreMatiereGenerics} matière${nombreMatiereGenerics > 1 ? "s" : ""}. Vous en avez sélectionné ${selectedMatiereGenerics.length}.`,
      });
      return;
    }

    setIsSaving(true);

    if (isModifyMode) {
      // Mode modification: envoyer toutes les matières complètes
      const selectedLibelles = matieres
        .filter((m: MatiereGeneric) => selectedMatiereGenerics.includes(m.id))
        .map((m: MatiereGeneric) => m.libelle);

      setSubjectsMutation(
        { matieres: selectedLibelles },
        {
          onSuccess: () => {
            setIsSaving(false);
            setIsModifyMode(false);
            setShowNumberInput(false);
          },
          onError: () => {
            setIsSaving(false);
          },
        },
      );
    } else {
      // Mode sélection initiale: envoyer toutes les matières sélectionnées
      const selectedLibelles = matieres
        .filter((m: MatiereGeneric) => selectedMatiereGenerics.includes(m.id))
        .map((m: MatiereGeneric) => m.libelle);

      setSubjectsMutation(
        { matieres: selectedLibelles },
        {
          onSuccess: () => {
            setIsSaving(false);
          },
          onError: () => {
            setIsSaving(false);
          },
        },
      );
    }
  };

  const hasChanges =
    JSON.stringify(selectedMatiereGenerics.sort()) !==
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
          Nb : Vous pouvez changer vos matières une seule fois durant la période
          de votre abonnement.
        </p>
        {isSelectionComplete && modificationsRestantes !== undefined && (
          <p
            className={`text-sm font-medium mt-2 ${
              canModify ? "text-blue-700 bg-blue-50" : "text-red-700 bg-red-50"
            } px-3 py-2 rounded-lg`}
          >
            {canModify ? (
              <>
                📝 <span className="font-bold">{modificationsRestantes}</span>{" "}
                modification{modificationsRestantes !== 1 ? "s" : ""} restante
                {modificationsRestantes !== 1 ? "s" : ""} avant choix définitif
              </>
            ) : (
              <>
                ✓ Vos choix de matières sont maintenant définitifs et ne peuvent
                plus être modifiés.
              </>
            )}
          </p>
        )}

        {/* Demander le nombre de matières si nécessaire */}
        {shouldAskNumber && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Label className="text-sm font-semibold text-gray-900 mb-2 block">
              Combien de matières enseignez-vous ? (Maximum 3)
            </Label>
            <div className="flex gap-3 mt-2">
              {[1, 2, 3].map((num) => (
                <Button
                  key={num}
                  onClick={() => {
                    setNombreMatiereGenerics(num);
                    setShowNumberInput(false);
                    // Réinitialiser les sélections si on change le nombre en mode modification
                    if (isModifyMode && num !== nombreMatiereGenerics) {
                      setSelectedMatiereGenerics([]);
                    }
                  }}
                  variant={
                    nombreMatiereGenerics === num ? "default" : "outline"
                  }
                  className={
                    nombreMatiereGenerics === num
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  {num} {num === 1 ? "matière" : "matières"}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Afficher les matières sélectionnées */}
        {!shouldAskNumber && currentLibelles.length > 0 && (
          <>
            <p className="text-sm text-green-700 font-medium mt-3">
              ✓ Vous avez sélectionné{" "}
              <span className="font-bold text-green-900">
                {currentLibelles.length}/{nombreMatiereGenerics}
              </span>{" "}
              matière{currentLibelles.length > 1 ? "s" : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              {currentLibelles.map((libelle: string, index: number) => (
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
                    if (modificationsRestantes === 1) {
                      toast({
                        variant: "warning",
                        message:
                          "⚠️ ATTENTION : Si vous modifiez maintenant, ce sera DÉFINITIF durant la période de votre abonnement. Vous ne pourrez plus modifier vos matières après cette fois.",
                      });
                    } else {
                      toast({
                        variant: "warning",
                        message:
                          "⚠️ C'est votre unique chance de modification. Veuillez bien vérifier vos sélections avant de sauvegarder.",
                      });
                    }
                    setIsModifyMode(true);
                    setShowNumberInput(true);
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
          </>
        )}
      </div>

      {/* Liste de toutes les matières disponibles - Affichée après avoir choisi le nombre */}
      {nombreMatiereGenerics > 0 &&
        (currentLibelles.length === 0 ||
          isModifyMode ||
          !isSelectionComplete) && (
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              {isModifyMode
                ? "Modifiez vos matières"
                : `Sélectionnez vos ${nombreMatiereGenerics} matière${nombreMatiereGenerics > 1 ? "s" : ""}`}
            </Label>
            {isLoadingMatiereGenerics ? (
              <div className="flex justify-center py-8">
                <Spinner size="sm" />
              </div>
            ) : matieres.length > 0 ? (
              <div className="mt-2 space-y-2 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
                {matieres.map((matiere: MatiereGeneric) => {
                  const isSelected = selectedMatiereGenerics.includes(
                    matiere.id,
                  );
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
                        onCheckedChange={() => toggleMatiereGeneric(matiere.id)}
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
      {/* Mode sélection initiale: affiche si changements ET nombre choisi */}
      {!isModifyMode &&
        hasChanges &&
        nombreMatiereGenerics > 0 &&
        selectedMatiereGenerics.length > 0 && (
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={
                isSaving ||
                selectedMatiereGenerics.length !== nombreMatiereGenerics
              }
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Enregistrement...
                </>
              ) : selectedMatiereGenerics.length === nombreMatiereGenerics ? (
                "Enregistrer"
              ) : (
                `Sélectionnez ${nombreMatiereGenerics - selectedMatiereGenerics.length} matière${nombreMatiereGenerics - selectedMatiereGenerics.length > 1 ? "s" : ""} supplémentaire${nombreMatiereGenerics - selectedMatiereGenerics.length > 1 ? "s" : ""}`
              )}
            </Button>
            <Button
              onClick={() => setSelectedMatiereGenerics(currentSubjectIds)}
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
              setSelectedMatiereGenerics(currentSubjectIds);
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
