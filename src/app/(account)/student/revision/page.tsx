"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

// Données des matières et chapitres (inchangées)
const subjects = [
  { id: "math", name: "Mathématiques" },
  { id: "geography", name: "Géographie" },
  { id: "french", name: "Français" },
  { id: "physics", name: "Physique Chimie" },
  { id: "history", name: "Histoire" },
  { id: "english", name: "Anglais" },
  { id: "history2", name: "Histoire" },
  { id: "spanish", name: "Espagnol" },
];
const chapters = {
  math: [
    { id: "chp1", name: "Chp1: Algèbres" },
    { id: "chp2", name: "Chp2: Fonction" },
    { id: "chp3", name: "Chp3: Fraction" },
    { id: "chp4", name: "Chp4: Lorem ipsum" },
    { id: "chp5", name: "Chp5: Lorem ipsum" },
    { id: "chp6", name: "Chp6: Lorem ipsum" },
    { id: "chp7", name: "Chp7: Lorem ipsum" },
    { id: "chp8", name: "Chp8: Lorem ipsum" },
    { id: "chp9", name: "Chp9: Lorem ipsum" },
    { id: "chp10", name: "Chp10: Lorem ipsum" },
    { id: "chp11", name: "Chp11: Lorem ipsum" },
    { id: "chp12", name: "Chp12: Lorem ipsum" },
  ],
  geography: [
    { id: "geo1", name: "Chp1: Géographie physique" },
    { id: "geo2", name: "Chp2: Climats" },
    { id: "geo3", name: "Chp3: Population" },
    { id: "geo4", name: "Chp4: Lorem ipsum" },
  ],
  french: [
    { id: "fr1", name: "Chp1: Grammaire" },
    { id: "fr2", name: "Chp2: Conjugaison" },
    { id: "fr3", name: "Chp3: Littérature" },
    { id: "fr4", name: "Chp4: Lorem ipsum" },
  ],
  physics: [
    { id: "phy1", name: "Chp1: Mécanique" },
    { id: "phy2", name: "Chp2: Optique" },
    { id: "phy3", name: "Chp3: Électricité" },
    { id: "phy4", name: "Chp4: Lorem ipsum" },
  ],
  history: [
    { id: "hist1", name: "Chp1: Antiquité" },
    { id: "hist2", name: "Chp2: Moyen Âge" },
    { id: "hist3", name: "Chp3: Renaissance" },
    { id: "hist4", name: "Chp4: Lorem ipsum" },
  ],
  english: [
    { id: "eng1", name: "Chp1: Grammar" },
    { id: "eng2", name: "Chp2: Vocabulary" },
    { id: "eng3", name: "Chp3: Reading" },
    { id: "eng4", name: "Chp4: Lorem ipsum" },
  ],
  spanish: [
    { id: "esp1", name: "Chp1: Gramática" },
    { id: "esp2", name: "Chp2: Vocabulario" },
    { id: "esp3", name: "Chp3: Lectura" },
    { id: "esp4", name: "Chp4: Lorem ipsum" },
  ],
};

export default function RevisionPage() {
  const [step, setStep] = useState<"subject" | "chapter">("subject");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");

  const router = useRouter();

  const handleSubjectSelect = (value: string) => {
    setSelectedSubject(value);
  };

  const handleChapterSelect = (value: string) => {
    setSelectedChapter(value);
  };

  const handleSubjectNext = () => {
    if (selectedSubject) {
      setStep("chapter");
    }
  };

  const handleChapterBack = () => {
    setStep("subject");
    setSelectedChapter("");
  };

  const handleStart = () => {
    console.log("Commencer révision:", {
      subject: selectedSubject,
      chapter: selectedChapter,
    });
  };

  const handleBack = () => {
    router.push("/student/home");
    console.log("Retour à la page précédente");
  };

  const currentChapters =
    chapters[selectedSubject as keyof typeof chapters] || [];
  const selectedSubjectName =
    subjects.find((s) => s.id === selectedSubject)?.name || "";

  return (
    <div
      className="  h-full w-full"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='M20 20h10v10H20zM40 40h10v10H40zM60 20h10v10H60zM80 60h10v10H80zM30 70h10v10H30zM70 30h10v10H70zM50 50h10v10H50z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "80px 80px",
      }}
    >
      <div
        className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-10 py-4"
        style={{
          backgroundImage: `url("/bg-2.png")`,
          backgroundSize: "80px 80px",
        }}
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={step === "subject" ? handleBack : handleChapterBack}
            className={`flex items-center space-x-2 text-gray-600 hover:text-gray-800 border rounded-full bg-white
              ${step === "subject" ? "w-12 h-12 justify-center" : "px-4 py-2"}
            `}
          >
            {step === "subject" && <ArrowLeft className="w-4 h-4" />}
            {step === "chapter" && <span className="text-sm">Retour</span>}
          </Button>

          <h1 className="text-orange-500 text-[3rem]">Place aux révisions</h1>
        </div>
      </div>
      {/* Contenu principal */}
      <div className="w-full mx-auto max-w-5xl px-8 pt-2 pb-4">
        {" "}
        {/* Réduit pt-4 à pt-2, pb-8 à pb-4 */}
        {step === "subject" && (
          <>
            <div className="text-center mb-8">
              {/*<h1 className="text-4xl font-bold text-orange-500 mb-2">

                Révision Time !
              </h1>*/}
              <p className="text-gray-600 text-[1.2rem]">
                Prêt à réviser ? Choisis ta matière et plonge dans tes cours.
                C'est parti pour consolider tes connaissances !
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 shadow-sm">
              {" "}
              {/* Réduit p-8 à p-6 */}
              <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                {" "}
                {/* Réduit mb-6 à mb-4 */}
                Choisis une matière
              </h2>
              <RadioGroup
                value={selectedSubject}
                onValueChange={handleSubjectSelect}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {" "}
                  {/* Réduit mb-8 à mb-4 */}
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-center space-x-3 bg-white rounded-lg p-4 border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem value={subject.id} id={subject.id} />
                      <Label
                        htmlFor={subject.id}
                        className="flex-1 text-gray-700 font-medium cursor-pointer"
                      >
                        {subject.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              <div className="text-center">
                <Button
                  onClick={handleSubjectNext}
                  disabled={!selectedSubject}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
              {" "}
              {/* Réduit de mb-4 à mb-2 */}
              <h1 className="text-4xl font-bold text-orange-500 mb-2">
                {" "}
                {/* Réduit de mb-4 à mb-2 */}
                {selectedSubjectName}
              </h1>
              <p className="text-gray-600 text-lg">
                Maintenant, choisis le chapitre que tu souhaites réviser. Chaque
                chapitre t'aidera à maîtriser un concept spécifique !
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 shadow-sm">
              {" "}
              {/* Réduit p-8 à p-6 */}
              <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                {" "}
                {/* Réduit mb-6 à mb-4 */}
                Choisis un chapitre
              </h2>
              <RadioGroup
                value={selectedChapter}
                onValueChange={handleChapterSelect}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 max-h-80 overflow-y-auto">
                  {" "}
                  {/* Réduit mb-8 à mb-4 */}
                  {currentChapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="flex items-center space-x-3 bg-white rounded-lg p-4 border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem value={chapter.id} id={chapter.id} />
                      <Label
                        htmlFor={chapter.id}
                        className="flex-1 text-gray-700 font-medium cursor-pointer"
                      >
                        {chapter.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              <div className="text-center">
                <Button
                  onClick={handleStart}
                  disabled={!selectedChapter}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
