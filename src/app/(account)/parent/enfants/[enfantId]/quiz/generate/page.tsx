"use client";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import { useGenerateQuiz } from "@/services/hooks/quiz";
import { useEnfants } from "@/services/hooks/parent";
import {
  Matiere,
  Chapitre,
  QuizGeneratePayload,
} from "@/services/controllers/types/common";
import { toast } from "@/lib/toast";
import { GenerationLoadingOverlay } from "@/components/ui/generation-loading-overlay";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

const quizLoadingMessages = [
  "Génération du quiz en cours...",
  "Construction des questions...",
  "Analyse du chapitre...",
  "Préparation des propositions...",
  "Finalisation...",
];

const difficulties = [
  { id: "Facile", name: "Facile" },
  { id: "Moyen", name: "Moyen" },
  { id: "Difficile", name: "Difficile" },
];

export default function ParentGenerateQuizPage() {
  const params = useParams();
  const enfantId = params.enfantId as string;

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
  const [selectedDifficulty, setSelectedDifficulty] = useQueryState(
    "difficulty",
    parseAsString,
  );

  // États locaux (non persistés dans l'URL)
  const [useDocument, setUseDocument] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();
  const { data: enfantsData } = useEnfants();
  const generateQuizMutation = useGenerateQuiz();

  // Récupérer l'enfant
  const enfant = enfantsData?.enfants.find((e) => e.id.toString() === enfantId);
  const niveauId = enfant?.niveau_id || 0;

  const { data: matieresData, isLoading: isLoadingMatieres } =
    useMatieresByNiveau(niveauId);
  const { data: chapitresData, isLoading: isLoadingChapitres } =
    useChapitresByMatiere(selectedMatiereId || 0);

  const matieres: Matiere[] = matieresData?.matieres || [];
  const chapitres: Chapitre[] = chapitresData || [];

  const handleGenerateQuiz = async () => {
    if (!selectedChapitreId || !selectedDifficulty) {
      toast({
        variant: "error",
        message: "Veuillez sélectionner un chapitre et une difficulté.",
      });
      return;
    }

    const payload: QuizGeneratePayload = {
      chapter_id: selectedChapitreId,
      difficulty: selectedDifficulty as "Facile" | "Moyen" | "Difficile",
      document_file: selectedFile || undefined,
    };

    try {
      await generateQuizMutation.mutateAsync(payload);
      toast({
        variant: "success",
        message: `Quiz créé avec succès pour ${enfant?.prenom} !`,
      });
      router.push(`/parent/enfants/${enfantId}`);
    } catch (error: any) {
      console.error("Erreur lors de la génération du quiz", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        "Impossible de générer le quiz. Veuillez réessayer.";
      toast({
        variant: "error",
        title: "Erreur de génération",
        message: errorMessage,
      });
    }
  };

  const handleSubjectNext = () => {
    if (selectedMatiereId) setStep("config");
  };
  const handleConfigBack = () => {
    setStep("subject");
    setSelectedChapitreId(null);
    setSelectedDifficulty(null);
  };

  const handleBack = () => {
    router.push(`/parent/enfants/${enfantId}`);
  };

  if (!enfant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Enfant non trouvé.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full">
        <GenerationLoadingOverlay
          isLoading={generateQuizMutation.isPending}
          messages={quizLoadingMessages}
        />

        {/* Header */}
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
              onClick={() => {
                if (step === "subject") {
                  handleBack();
                } else if (step === "config") {
                  handleConfigBack();
                }
              }}
              className={`flex items-center space-x-2 text-gray-600 hover:text-gray-800 border rounded-full bg-white ${
                step === "subject" ? "w-12 h-12 justify-center" : "px-4 py-2"
              }`}
            >
              {step === "subject" ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <span className="text-sm">Retour</span>
              )}
            </Button>
            <h1 className="text-purple-600 text-3xl sm:text-4xl md:text-[3rem] font-bold">
              Quiz pour {enfant.prenom}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full mx-auto max-w-4xl px-4 md:px-8 pt-2 pb-8">
          {/* Step 1: Subject Selection */}
          {step === "subject" && (
            <div className="bg-[#E1E5F4] rounded-2xl p-8 md:p-10 shadow-sm mt-22 ">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-6">
                Choisis une matière
              </h2>
              {isLoadingMatieres ? (
                <p>Chargement des matières...</p>
              ) : matieres.length > 0 ? (
                <RadioGroup
                  value={selectedMatiereId?.toString() || ""}
                  onValueChange={(value) => setSelectedMatiereId(Number(value))}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {matieres.map((matiere) => (
                      <div
                        key={matiere.id}
                        className="flex items-center space-x-3 bg-white rounded-lg p-4 border hover:bg-gray-50"
                      >
                        <RadioGroupItem
                          value={matiere.id.toString()}
                          id={`matiere-${matiere.id}`}
                          className="border-black border-2"
                        />
                        <Label
                          htmlFor={`matiere-${matiere.id}`}
                          className="flex-1 text-base font-medium cursor-pointer"
                        >
                          {matiere.libelle}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 font-medium">
                    Aucune matière n'est disponible pour le niveau de {enfant.prenom}.
                  </p>
                </div>
              )}
              <div className="text-center mt-8">
                <Button
                  onClick={handleSubjectNext}
                  disabled={!selectedMatiereId}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Configuration */}
          {step === "config" && (
            <div className="bg-[#E1E5F4] rounded-2xl p-8 md:p-10 shadow-sm space-y-8 mt-22">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center">
                Configure le quiz
              </h2>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">
                  Choisis un chapitre
                </h3>
                {isLoadingChapitres ? (
                  <p>Chargement des chapitres...</p>
                ) : chapitres.length > 0 ? (
                  <RadioGroup
                    value={selectedChapitreId?.toString() || ""}
                    onValueChange={(value) =>
                      setSelectedChapitreId(Number(value))
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 max-h-60 overflow-y-auto p-2">
                      {chapitres.map((chapitre) => (
                        <div
                          key={chapitre.id}
                          className="flex items-center space-x-3 bg-white rounded-lg p-4 border hover:bg-gray-50"
                        >
                          <RadioGroupItem
                            value={chapitre.id.toString()}
                            id={`chapter-${chapitre.id}`}
                            className="border-black border-2"
                          />
                          <Label
                            htmlFor={`chapter-${chapitre.id}`}
                            className="flex-1 text-base font-medium cursor-pointer"
                          >
                            {chapitre.libelle}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 font-medium">
                      Aucun chapitre n'est disponible pour cette matière.
                    </p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">
                  Choisis un niveau
                </h3>
                <RadioGroup
                  value={selectedDifficulty || ""}
                  onValueChange={(value) => setSelectedDifficulty(value)}
                  className="grid grid-cols-3 gap-4 px-4"
                >
                  {difficulties.map((difficulty) => (
                    <div
                      key={difficulty.id}
                      className="flex items-center justify-center space-x-2"
                    >
                      <RadioGroupItem
                        value={difficulty.id}
                        id={`difficulty-${difficulty.id}`}
                        className="border-black border-2"
                      />
                      <Label
                        htmlFor={`difficulty-${difficulty.id}`}
                        className="text-base font-medium cursor-pointer"
                      >
                        {difficulty.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Checkbox et FileUpload pour document optionnel */}
              {chapitres.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                    <div className="flex items-start space-x-3 mb-4">
                      <Checkbox
                        id="useDocument"
                        checked={useDocument}
                        onCheckedChange={(checked) => {
                          setUseDocument(checked as boolean);
                          if (!checked) {
                            setSelectedFile(null);
                          }
                        }}
                        disabled={!selectedChapitreId || !selectedDifficulty}
                        className="mt-0.5 border-2 border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <div className="grid gap-1.5 leading-none flex-1">
                        <label
                          htmlFor="useDocument"
                          className="text-sm font-bold text-red-700 cursor-pointer"
                        >
                          Générer depuis un document (optionnel)
                        </label>
                        <p className="text-xs text-red-600 font-medium">
                          PDF, DOC, DOCX, TXT - Maximum 10 MB
                        </p>
                      </div>
                    </div>

                    {useDocument && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <FileUpload
                          onChange={setSelectedFile}
                          selectedFile={selectedFile}
                          disabled={generateQuizMutation.isPending}
                          maxSize={10 * 1024 * 1024}
                          acceptedTypes={[".pdf", ".doc", ".docx", ".txt"]}
                          compact
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="text-center pt-4">
                <Button
                  onClick={handleGenerateQuiz}
                  disabled={
                    !selectedChapitreId ||
                    !selectedDifficulty ||
                    generateQuizMutation.isPending
                  }
                  className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-3 rounded-lg font-bold text-xl"
                >
                  Créer le quiz
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
