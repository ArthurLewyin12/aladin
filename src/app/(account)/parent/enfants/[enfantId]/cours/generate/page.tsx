"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import { useEnfants } from "@/services/hooks/parent";
import { Matiere, Chapitre } from "@/services/controllers/types/common";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { useDocumentUpload } from "@/stores/useDocumentUpload";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { toast } from "@/lib/toast";

export default function ParentGenerateCoursPage() {
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

  // États locaux (non persistés dans l'URL)
  const [useDocument, setUseDocument] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();
  const { data: enfantsData } = useEnfants();
  const { setPendingDocument } = useDocumentUpload();

  // Récupérer l'enfant
  const enfant = enfantsData?.enfants.find((e) => e.id.toString() === enfantId);
  const niveauId = enfant?.niveau_id || 0;

  // Fetching data with hooks
  const { data: matieresData, isLoading: isLoadingMatieres } =
    useMatieresByNiveau(niveauId);
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
      setPendingDocument(selectedFile);

      toast({
        variant: "success",
        message: `Cours créé avec succès pour ${enfant?.prenom} !`,
      });

      // Rediriger vers le profil de l'enfant
      router.push(`/parent/enfants/${enfantId}`);
    }
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
    <div className="min-h-screen w-full">
      <div
        className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
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
            {step === "subject" && <ArrowLeft className="w-4 h-4" />}
            {step === "chapter" && <span className="text-sm">Retour</span>}
          </Button>

          <h1 className="text-purple-600 text-3xl sm:text-4xl md:text-[3rem] font-bold">
            Cours pour {enfant.prenom}
          </h1>
        </div>
      </div>

      <div className="w-full mx-auto max-w-5xl px-4 md:px-8 pt-2 pb-4">
        {step === "subject" && (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg md:text-[1.2rem]">
                Créez un cours personnalisé pour {enfant.prenom}. Choisissez la
                matière et le chapitre.
              </p>
            </div>
            <div className="bg-[#E1E5F4] rounded-2xl p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-6">
                Choisis une matière
              </h2>
              {isLoadingMatieres ? (
                <p>Chargement des matières...</p>
              ) : matieres.length > 0 ? (
                <RadioGroup
                  value={selectedMatiereId?.toString() || ""}
                  onValueChange={handleSubjectSelect}
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
                    Aucune matière n'est disponible pour le niveau de{" "}
                    {enfant.prenom}.
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
          </>
        )}
        {step === "chapter" && (
          <>
            <div className="text-center mb-2">
              <h1 className="text-4xl font-bold text-purple-600 mb-2">
                {selectedMatiereName}
              </h1>
              <p className="text-gray-600 text-base md:text-lg">
                Maintenant, choisis le chapitre pour créer le cours de{" "}
                {enfant.prenom}.
              </p>
            </div>
            <div className="bg-[#E1E5F4] rounded-2xl p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-6">
                Choisis un chapitre
              </h2>
              {isLoadingChapitres ? (
                <p>Chargement des chapitres...</p>
              ) : chapitres.length > 0 ? (
                <RadioGroup
                  value={selectedChapitreId?.toString() || ""}
                  onValueChange={handleChapterSelect}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 max-h-80 overflow-y-auto p-2">
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
                        disabled={!selectedChapitreId}
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
                          maxSize={10 * 1024 * 1024}
                          acceptedTypes={[".pdf", ".doc", ".docx", ".txt"]}
                          compact
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="text-center mt-8">
                <Button
                  onClick={handleStart}
                  disabled={!selectedChapitreId}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
                >
                  Créer le cours
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
