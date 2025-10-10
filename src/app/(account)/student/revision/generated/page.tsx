"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import { useSession } from "@/services/hooks/auth/useSession";
import { Matiere, Chapitre } from "@/services/controllers/types/common";

export default function RevisionPage() {
  const [step, setStep] = useState<"subject" | "chapter">("subject");
  const [selectedMatiereId, setSelectedMatiereId] = useState<number | null>(
    null,
  );
  const [selectedChapitreId, setSelectedChapitreId] = useState<number | null>(
    null,
  );
  const router = useRouter();
  const { user } = useSession();

  // Fetching data with hooks
  const { data: matieresData, isLoading: isLoadingMatieres } =
    useMatieresByNiveau(user?.niveau?.id || user?.niveau_id || 0);
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
      router.push(`/student/cours/${selectedChapitreId}`);
    }
  };

  const handleBack = () => {
    router.push("/student/home");
  };

  return (
    <div
      className="h-full w-full"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='M20 20h10v10H20zM40 40h10v10H40zM60 20h10v10H60zM80 60h10v10H80zM30 70h10v10H30zM70 30h10v10H70zM50 50h10v10H50z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "80px 80px",
      }}
    >
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
            {step === "subject" && <ArrowLeft className="w-4 h-4" />}
            {step === "chapter" && <span className="text-sm">Retour</span>}
          </Button>

          <h1 className="text-orange-500 text-4xl md:text-[3rem]">
            Place aux révisions
          </h1>
        </div>
      </div>

      <div className="w-full mx-auto max-w-5xl px-4 md:px-8 pt-2 pb-4">
        {step === "subject" && (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg md:text-[1.2rem]">
                Prêt à réviser ? Choisis ta matière et plonge dans tes cours.
                C'est parti pour consolider tes connaissances !
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
                    Aucune matière n'est disponible pour votre niveau pour le
                    moment.
                  </p>
                </div>
              )}
              <div className="text-center mt-8">
                <Button
                  onClick={handleSubjectNext}
                  disabled={!selectedMatiereId}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold text-lg"
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
              <h1 className="text-4xl font-bold text-orange-500 mb-2">
                {selectedMatiereName}
              </h1>
              <p className="text-gray-600 text-base md:text-lg">
                Maintenant, choisis le chapitre que tu souhaites réviser. Chaque
                chapitre t'aidera à maîtriser un concept spécifique !
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
              <div className="text-center mt-8">
                <Button
                  onClick={handleStart}
                  disabled={!selectedChapitreId}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold text-lg"
                >
                  Commencer !
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
