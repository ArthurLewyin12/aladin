"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import { useEleves } from "@/services/hooks/repetiteur";
import { Matiere, Chapitre } from "@/services/controllers/types/common";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { useDocumentUpload } from "@/stores/useDocumentUpload";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/lib/toast";

export default function RepetiteurRevisionPage() {
  // Migration vers nuqs pour la persistance URL
  const [step, setStep] = useQueryState(
    "step",
    parseAsString.withDefault("subject"),
  );
  const [selectedMatiereId, setSelectedMatiereId] = useQueryState(
    "matiereId",
    parseAsInteger,
  );
  const [selectedChapitreId, setSelectedChapitreId] = useQueryState(
    "chapitreId",
    parseAsInteger,
  );

  // États locaux (non persistés dans l'URL)
  // const [useDocument, setUseDocument] = useState(false);
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();
  const { setPendingDocument } = useDocumentUpload();

  // Récupérer l'ID de l'élève depuis l'URL (fallback si cache pas à jour)
  const [eleveIdFromUrl] = useQueryState("eleveId", parseAsInteger);

  // Récupérer l'élève actif
  const { data: elevesData, isLoading: isLoadingEleves } = useEleves();
  const eleveActif = elevesData?.eleve_actif;

  // Si pas d'élève actif mais qu'on a un ID dans l'URL, trouver cet élève
  const eleveDansUrl = eleveIdFromUrl
    ? elevesData?.eleves?.find((e) => e.id === eleveIdFromUrl)
    : null;

  // Utiliser l'élève actif en priorité, sinon celui de l'URL
  const eleveUtilise = eleveActif || eleveDansUrl;

  // Fetching data with hooks en utilisant le niveau de l'élève utilisé
  const { data: matieresData, isLoading: isLoadingMatieres } =
    useMatieresByNiveau(
      eleveUtilise?.niveau?.id || eleveUtilise?.niveau_id || 0,
    );
  const { data: chapitresData, isLoading: isLoadingChapitres } =
    useChapitresByMatiere(selectedMatiereId || 0);

  // Derived State
  const matieres: Matiere[] = matieresData?.matieres || [];
  const chapitres: Chapitre[] = chapitresData || [];
  const selectedMatiereName =
    matieres.find((m) => m.id === selectedMatiereId)?.libelle || "";

  const handleSubjectSelect = (value: string) => {
    setSelectedMatiereId(Number(value));
  };

  const handleChapterSelect = (value: string) => {
    setSelectedChapitreId(Number(value));
  };

  const handleSubjectNext = () => {
    if (selectedMatiereId) {
      setStep("chapter");
    }
  };

  const handleChapterBack = () => {
    setStep("subject");
    setSelectedChapitreId(null);
  };

  const handleStart = () => {
    if (selectedChapitreId) {
      // Stocker le document dans le store Zustand si présent
      // setPendingDocument(selectedFile);
      setPendingDocument(null);
      // Rediriger vers la page de génération du répétiteur
      router.push(`/repetiteur/cours/${selectedChapitreId}`);
    }
  };

  const handleBack = () => {
    if (eleveUtilise) {
      router.push(`/repetiteur/students/${eleveUtilise.id}`);
    } else {
      router.push("/repetiteur/students");
    }
  };

  // Vérifier qu'un élève est sélectionné
  if (isLoadingEleves) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!eleveUtilise) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Aucun élève sélectionné
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez sélectionner un élève pour générer un cours.
          </p>
          <Button
            onClick={() => router.push("/repetiteur/students")}
            className="bg-[#548C2F] hover:bg-[#4a7829]"
          >
            Sélectionner un élève
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div
        className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
        style={{
          backgroundImage: `url("/bg-2.png")`,
          backgroundSize: "180px 180px",
        }}
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={step === "subject" ? handleBack : handleChapterBack}
            className={`flex items-center space-x-2 text-gray-600 hover:text-gray-800 border rounded-full bg-white ${
              step === "subject" ? "w-12 h-12 justify-center" : "px-4 py-2"
            }`}
          >
            <ArrowLeft
              className={`${step === "subject" ? "w-5 h-5" : "w-4 h-4"}`}
            />
            {step === "chapter" && (
              <span className="text-sm font-medium">Retour</span>
            )}
          </Button>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#548C2F] leading-tight">
            Générer un cours pour {eleveUtilise.prenom}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Niveau : {eleveUtilise.niveau?.libelle || "Non défini"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {step === "subject" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choisissez une matière
              </h2>
              <p className="text-gray-600">
                Sélectionnez la matière pour laquelle vous souhaitez générer un
                cours
              </p>
            </div>

            {isLoadingMatieres ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <RadioGroup
                value={selectedMatiereId?.toString()}
                onValueChange={handleSubjectSelect}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {matieres.map((matiere) => (
                  <Label
                    key={matiere.id}
                    htmlFor={`matiere-${matiere.id}`}
                    className={`
                      flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${
                        selectedMatiereId === matiere.id
                          ? "border-[#548C2F] bg-[#F0F7EC] shadow-md"
                          : "border-gray-200 hover:border-[#548C2F] hover:bg-gray-50"
                      }
                    `}
                  >
                    <RadioGroupItem
                      value={matiere.id.toString()}
                      id={`matiere-${matiere.id}`}
                      className="data-[state=checked]:bg-[#548C2F] data-[state=checked]:border-[#548C2F]"
                    />
                    <span className="font-medium text-gray-900">
                      {matiere.libelle}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            )}

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSubjectNext}
                disabled={!selectedMatiereId}
                className="bg-[#548C2F] hover:bg-[#4a7829] text-white px-8"
              >
                Suivant
              </Button>
            </div>
          </div>
        )}

        {step === "chapter" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choisissez un chapitre
              </h2>
              <p className="text-gray-600">
                Matière sélectionnée :{" "}
                <span className="font-semibold text-[#548C2F]">
                  {selectedMatiereName}
                </span>
              </p>
            </div>

            {isLoadingChapitres ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                <RadioGroup
                  value={selectedChapitreId?.toString()}
                  onValueChange={handleChapterSelect}
                  className="space-y-3"
                >
                  {chapitres.map((chapitre) => (
                    <Label
                      key={chapitre.id}
                      htmlFor={`chapitre-${chapitre.id}`}
                      className={`
                        flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${
                          selectedChapitreId === chapitre.id
                            ? "border-[#548C2F] bg-[#F0F7EC] shadow-md"
                            : "border-gray-200 hover:border-[#548C2F] hover:bg-gray-50"
                        }
                      `}
                    >
                      <RadioGroupItem
                        value={chapitre.id.toString()}
                        id={`chapitre-${chapitre.id}`}
                        className="data-[state=checked]:bg-[#548C2F] data-[state=checked]:border-[#548C2F]"
                      />
                      <span className="font-medium text-gray-900">
                        {chapitre.libelle}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>

                {/* Option document - MASQUÉ POUR LES RÉPÉTITEURS */}
                {/* <div className="border-t pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Checkbox
                      id="use-document"
                      checked={useDocument}
                      onCheckedChange={(checked) =>
                        setUseDocument(checked as boolean)
                      }
                      className="data-[state=checked]:bg-[#548C2F] data-[state=checked]:border-[#548C2F]"
                    />
                    <Label htmlFor="use-document" className="cursor-pointer">
                      <span className="font-medium text-gray-900">
                        Utiliser un document pour générer le cours
                      </span>
                      <p className="text-sm text-gray-500">
                        Téléchargez un PDF ou une image pour personnaliser le
                        contenu
                      </p>
                    </Label>
                  </div>

                  {useDocument && (
                    <FileUpload
                      onChange={setSelectedFile}
                      selectedFile={selectedFile}
                    />
                  )}
                </div> */}
              </>
            )}

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleStart}
                disabled={!selectedChapitreId}
                className="bg-[#548C2F] hover:bg-[#4a7829] text-white px-8"
              >
                Générer le cours
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
