"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

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

export default function QuizPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const router = useRouter();

  const handleSubjectSelect = (value: string) => {
    setSelectedSubject(value);
  };

  const handleNext = () => {
    if (selectedSubject) {
      console.log("Navigation vers quiz:", selectedSubject);
      // Ici vous naviguerez vers la page de quiz de la matière sélectionnée
    }
  };

  const handleBack = () => {
    router.push("/student/home");
    console.log("Retour à la page précédente");
  };

  return (
    <div
      className=" relative overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='M20 20h10v10H20zM40 40h10v10H40zM60 20h10v10H60zM80 60h10v10H80zM30 70h10v10H30zM70 30h10v10H70zM50 50h10v10H50z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "80px 80px",
      }}
    >
      {/* Barre supérieure avec image de fond et bouton retour */}
      <div
        className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-4"
        style={{
          backgroundImage: `url("/bg-2.png")`,
          backgroundSize: "80px 80px",
        }}
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 w-12 h-12 border rounded-full bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-orange-600 text-4xl md:text-[3rem]">Quiz Time</h1>
        </div>
      </div>
      {/* Contenu principal */}
      <div className="w-full mx-auto max-w-5xl px-4 md:px-8 pt-2 pb-4">
        <div className="text-center mb-10">
          <p className="text-gray-600 text-lg md:text-[1.3rem]">
            C'est l'heure du quiz ! 3... 2... 1... À toi de jouer ! Tu vas voir,
            tu sais plus de choses que tu ne penses. 😊
          </p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
            Choisis une matière
          </h2>
          <RadioGroup
            value={selectedSubject}
            onValueChange={handleSubjectSelect}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              onClick={handleNext}
              disabled={!selectedSubject}
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}