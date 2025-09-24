"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

// --- DATA STRUCTURES ---
const subjects = [
  { id: "math", name: "Mathématiques" },
  { id: "geography", name: "Géographie" },
  { id: "french", name: "Français" },
  { id: "physics", name: "Physique Chimie" },
  { id: "history", name: "Histoire" },
];

const chapters = {
  math: [
    { id: "chp1", name: "Chp1: Algèbres" },
    { id: "chp2", name: "Chp2: Fonction" },
    { id: "chp3", name: "Chp3: Fraction" },
  ],
  geography: [{ id: "geo1", name: "Chp1: Géographie physique" }],
  french: [{ id: "fr1", name: "Chp1: Grammaire" }],
  physics: [{ id: "phy1", name: "Chp1: Mécanique" }],
  history: [{ id: "hist1", name: "Chp1: Antiquité" }],
};

const difficulties = [
  { id: "facile", name: "Facile" },
  { id: "moyen", name: "Moyen" },
  { id: "difficile", name: "Difficile" },
];

const quizData = {
  questions: [
    {
      id: "q1",
      questionText: "Quelle est la capitale de la France ?",
      answers: [
        { id: "a1", text: "Berlin" },
        { id: "a2", text: "Madrid" },
        { id: "a3", text: "Paris" },
        { id: "a4", text: "Rome" },
      ],
      correctAnswerId: "a3",
    },
    {
      id: "q2",
      questionText: "Combien de côtés a un triangle ?",
      answers: [
        { id: "b1", text: "2" },
        { id: "b2", text: "3" },
        { id: "b3", text: "4" },
      ],
      correctAnswerId: "b2",
    },
    {
      id: "q3",
      questionText: "Quel est le plus grand océan du monde ?",
      answers: [
        { id: "c1", text: "Atlantique" },
        { id: "c2", text: "Indien" },
        { id: "c3", text: "Arctique" },
        { id: "c4", text: "Pacifique" },
      ],
      correctAnswerId: "c4",
    },
  ],
};

// --- COMPONENT ---
export default function QuizPage() {
  // State Management
  const [step, setStep] = useState<"subject" | "config" | "quiz">("subject");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const router = useRouter();

  // Derived State
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const currentChapters =
    chapters[selectedSubject as keyof typeof chapters] || [];
  const selectedSubjectName =
    subjects.find((s) => s.id === selectedSubject)?.name || "";

  // --- HANDLERS ---
  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleStartQuiz = () => setStep("quiz");
  const handleSubjectNext = () => {
    if (selectedSubject) setStep("config");
  };
  const handleConfigBack = () => {
    setStep("subject");
    setSelectedChapter("");
    setSelectedDifficulty("");
  };
  const handleBackToHome = () => router.push("/student/home");

  // --- RENDER ---
  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='M20 20h10v10H20zM40 40h10v10H40zM60 20h10v10H60zM80 60h10v10H80zM30 70h10v10H30zM70 30h10v10H70zM50 50h10v10H50z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "80px 80px",
      }}
    >
      {/* Header */}
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
            onClick={
              step === "subject"
                ? handleBackToHome
                : step === "config"
                  ? handleConfigBack
                  : () => setStep("config")
            }
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
          <h1 className="text-orange-600 text-4xl md:text-[3rem]">Quiz Time</h1>
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
            <RadioGroup
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center space-x-3 bg-white rounded-lg p-4 border hover:bg-gray-50"
                  >
                    <RadioGroupItem
                      value={subject.id}
                      id={`subject-${subject.id}`}
                      className="border-black border-2"
                    />
                    <Label
                      htmlFor={`subject-${subject.id}`}
                      className="flex-1 text-base font-medium cursor-pointer"
                    >
                      {subject.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            <div className="text-center mt-8">
              <Button
                onClick={handleSubjectNext}
                disabled={!selectedSubject}
                className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold text-lg"
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
              Configure ton quiz
            </h2>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">
                Choisis un chapitre
              </h3>
              <RadioGroup
                value={selectedChapter}
                onValueChange={setSelectedChapter}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 max-h-60 overflow-y-auto p-2">
                  {currentChapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="flex items-center space-x-3 bg-white rounded-lg p-4 border hover:bg-gray-50"
                    >
                      <RadioGroupItem
                        value={chapter.id}
                        id={`chapter-${chapter.id}`}
                        className="border-black border-2"
                      />
                      <Label
                        htmlFor={`chapter-${chapter.id}`}
                        className="flex-1 text-base font-medium cursor-pointer"
                      >
                        {chapter.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">
                Choisis un niveau
              </h3>
              <RadioGroup
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
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
            <div className="text-center pt-4">
              <Button
                onClick={handleStartQuiz}
                disabled={!selectedChapter || !selectedDifficulty}
                className="bg-[#111D4A] hover:bg-[#0d1640] text-white px-12 py-3 rounded-lg font-bold text-xl"
              >
                Commencer
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Quiz */}
        {step === "quiz" && currentQuestion && (
          <div className="max-w-2xl mx-auto  mt-24">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-600">
                  <span>
                    Question {currentQuestionIndex + 1}/
                    {quizData.questions.length}
                  </span>
                  <span>{selectedSubjectName}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full"
                    style={{
                      width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-[#F5D3A6] border border-orange-200 rounded-2xl p-6 md:p-8">
                <h2 className="text-[1.3rem]  text-center font-bold text-gray-800 mb-4">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="text-xl md:text-2xl text-gray-900">
                  {currentQuestion.questionText}
                </p>
              </div>

              <div>
                <RadioGroup
                  value={userAnswers[currentQuestion.id] || ""}
                  onValueChange={(value) =>
                    handleAnswerSelect(currentQuestion.id, value)
                  }
                >
                  <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {currentQuestion.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="flex items-center space-x-3 bg-white rounded-lg p-4 border border-black hover:bg-gray-50 transition-colors"
                      >
                        <RadioGroupItem
                          value={answer.id}
                          id={answer.id}
                          className="border-black border-2"
                        />
                        <Label
                          htmlFor={answer.id}
                          className="flex-1 text-base font-medium cursor-pointer"
                        >
                          {answer.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-between items-center pt-6">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Précédent
                </Button>
                <Button
                  onClick={handleNextQuestion}
                  disabled={
                    !userAnswers[currentQuestion.id] ||
                    currentQuestionIndex === quizData.questions.length - 1
                  }
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
