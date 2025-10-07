"use client";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import { useGenerateQuiz, useSubmitQuiz } from "@/services/hooks/quiz";
import { useSession } from "@/services/hooks/auth/useSession";
import {
  Matiere,
  Chapitre,
  QuizQuestion,
  QuizGeneratePayload,
} from "@/services/controllers/types/common";
import { toast } from "sonner";
import { GenerationLoadingOverlay } from "@/components/ui/generation-loading-overlay";

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

export default function QuizPage() {
  const [step, setStep] = useState<"subject" | "config" | "quiz">("subject");
  const [selectedMatiereId, setSelectedMatiereId] = useState<number | null>(
    null,
  );
  const [selectedChapitreId, setSelectedChapitreId] = useState<number | null>(
    null,
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    Record<string | number, string | number>
  >({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSession();

  useEffect(() => {
    const matiereId = searchParams.get("matiereId");
    const chapitreId = searchParams.get("chapitreId");
    const difficulty = searchParams.get("difficulty");

    if (matiereId && chapitreId && difficulty) {
      setSelectedMatiereId(Number(matiereId));
      setSelectedChapitreId(Number(chapitreId));
      setSelectedDifficulty(difficulty);
      setStep("config");
    }
  }, [searchParams]);

  const { data: matieresData, isLoading: isLoadingMatieres } =
    useMatieresByNiveau(user?.niveau?.id || user?.niveau_id || 0);
  const { data: chapitresData, isLoading: isLoadingChapitres } =
    useChapitresByMatiere(selectedMatiereId || 0);

  const generateQuizMutation = useGenerateQuiz();
  const submitQuizMutation = useSubmitQuiz();

  const matieres: Matiere[] = matieresData?.matieres || [];
  const chapitres: Chapitre[] = chapitresData || [];
  const selectedMatiereName =
    matieres.find((m) => m.id === selectedMatiereId)?.libelle || "";
  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerSelect = (
    questionId: string | number,
    answerId: string | number,
  ) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedChapitreId || !selectedDifficulty) {
      toast.error("Veuillez sélectionner un chapitre et une difficulté.");
      return;
    }

    const payload: QuizGeneratePayload = {
      chapter_id: selectedChapitreId,
      difficulty: selectedDifficulty,
    };

    try {
      const result = await generateQuizMutation.mutateAsync(payload);

      const quizConfig = {
        matiereId: selectedMatiereId,
        chapitreId: selectedChapitreId,
        difficulty: selectedDifficulty,
      };
      sessionStorage.setItem("quizConfig", JSON.stringify(quizConfig));

      setActiveQuizId(result.quiz_id);
      setQuizQuestions(result.questions);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setStep("quiz");
    } catch (error: any) {
      console.error("Erreur lors de la génération du quiz", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        "Impossible de générer le quiz. Veuillez réessayer.";
      toast.error(errorMessage);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuizId) return;

    let score = 0;
    for (const question of quizQuestions) {
      const userAnswerId = userAnswers[question.id];
      if (userAnswerId == question.bonne_reponse_id) {
        score++;
      }
    }

    try {
      const result = await submitQuizMutation.mutateAsync({
        quizId: activeQuizId,
        payload: { score },
      });
      toast.success(
        result.message ||
          `Quiz terminé! Votre score: ${result.score}/${quizQuestions.length}`,
      );

      const transformedCorrections = result.corrections.map(
        (question: any, index: number) => {
          const propositions = Object.entries(question.propositions).map(
            ([key, value]) => ({
              id: key,
              text: value as string,
            }),
          );

          return {
            id: `q_${index}`,
            question: question.question,
            propositions: propositions,
            bonne_reponse_id: question.bonne_reponse,
            user_answer: userAnswers[question.id],
          };
        },
      );

      sessionStorage.setItem(
        "quizCorrections",
        JSON.stringify(transformedCorrections),
      );

      router.push(`/student/quiz/results/${result.userQuiz.id}`);
    } catch (error) {
      console.error("Erreur lors de la soumission du quiz", error);
      toast.error("Impossible de soumettre le quiz. Veuillez réessayer.");
    }
  };

  const handleSubjectNext = () => {
    if (selectedMatiereId) setStep("config");
  };
  const handleConfigBack = () => {
    setStep("subject");
    setSelectedChapitreId(null);
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
      <GenerationLoadingOverlay
        isLoading={generateQuizMutation.isPending}
        messages={quizLoadingMessages}
      />

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
                onClick={handleGenerateQuiz}
                disabled={
                  !selectedChapitreId ||
                  !selectedDifficulty ||
                  generateQuizMutation.isPending
                }
                className="bg-[#111D4A] hover:bg-[#0d1640] text-white px-12 py-3 rounded-lg font-bold text-xl"
              >
                Commencer
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Quiz */}
        {step === "quiz" && currentQuestion && (
          <div className="max-w-4xl mx-auto mt-24">
            <div className="space-y-8">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-600">
                  <span>
                    Question {currentQuestionIndex + 1}/{quizQuestions.length}
                  </span>
                  <span>{selectedMatiereName}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full"
                    style={{
                      width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-[#F5D3A6] border border-orange-200 rounded-2xl p-8 md:p-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center underline decoration-2 underline-offset-4">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="text-2xl md:text-3xl text-gray-900 text-center leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Answers */}
              <div>
                <RadioGroup
                  value={userAnswers[currentQuestion.id]?.toString() || ""}
                  onValueChange={(value) =>
                    handleAnswerSelect(currentQuestion.id, value)
                  }
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentQuestion.propositions.map((proposition, index) => {
                      const letters = ["a", "b", "c", "d", "e", "f"];
                      return (
                        <div
                          key={proposition.id}
                          className="flex items-center space-x-3 bg-white rounded-xl p-4 border-2 border-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <RadioGroupItem
                            value={proposition.id.toString()}
                            id={proposition.id.toString()}
                            className="border-black border-2 flex-shrink-0"
                          />
                          <Label
                            htmlFor={proposition.id.toString()}
                            className="flex-1 text-base font-medium cursor-pointer"
                          >
                            {letters[index]}) {proposition.text}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2"
                >
                  Précédent
                </Button>
                {currentQuestionIndex === quizQuestions.length - 1 ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={
                      !userAnswers[currentQuestion.id] ||
                      submitQuizMutation.isPending
                    }
                    className="bg-[#111D4A] hover:bg-[#0d1640] text-white px-8 py-3 rounded-lg font-semibold text-lg"
                  >
                    {submitQuizMutation.isPending
                      ? "Soumission..."
                      : "Soumettre le quiz"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!userAnswers[currentQuestion.id]}
                    className="px-6 py-2"
                  >
                    Suivant
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
