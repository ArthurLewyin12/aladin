"use client";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import { useGenerateQuiz, useSubmitQuiz } from "@/services/hooks/quiz";
import { useEleves } from "@/services/hooks/repetiteur";
import {
  Matiere,
  Chapitre,
  QuizQuestion,
  QuizGeneratePayload,
} from "@/services/controllers/types/common";
import { toast } from "@/lib/toast";
import { GenerationLoadingOverlay } from "@/components/ui/generation-loading-overlay";
import { useTimeTracking } from "@/stores/useTimeTracking";
import { calculateQuizScore } from "@/lib/quiz-score";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { usePreventNavigation } from "@/services/hooks/usePreventNavigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Spinner } from "@/components/ui/spinner";

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

export default function RepetiteurGenerateQuizPage() {
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useQueryState(
    "q",
    parseAsInteger.withDefault(0),
  );

  // États locaux (non persistés dans l'URL)
  const [useDocument, setUseDocument] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<
    Record<string | number, string | number>
  >({});

  const router = useRouter();
  const { startTracking, stopTracking } = useTimeTracking();
  
  // Récupérer l'ID de l'élève depuis l'URL (fallback si cache pas à jour)
  const [eleveIdFromUrl] = useQueryState("eleveId", parseAsInteger);
  
  // Récupérer l'élève actif
  const { data: elevesData, isLoading: isLoadingEleves } = useEleves();
  const eleveActif = elevesData?.eleve_actif;
  
  // Si pas d'élève actif mais qu'on a un ID dans l'URL, trouver cet élève
  const eleveDansUrl = eleveIdFromUrl 
    ? elevesData?.eleves?.find(e => e.id === eleveIdFromUrl)
    : null;
  
  // Utiliser l'élève actif en priorité, sinon celui de l'URL
  const eleveUtilise = eleveActif || eleveDansUrl;

  // Démarrer le tracking quand le quiz commence
  useEffect(() => {
    if (step === "quiz" && activeQuizId && selectedChapitreId) {
      startTracking("quiz", activeQuizId, selectedChapitreId, {
        difficulte: selectedDifficulty || undefined,
      });
    }

    // Arrêter le tracking au démontage
    return () => {
      if (step === "quiz") {
        stopTracking();
      }
    };
  }, [step, activeQuizId, selectedChapitreId, selectedDifficulty]);

  const { data: matieresData, isLoading: isLoadingMatieres } =
    useMatieresByNiveau(eleveUtilise?.niveau?.id || eleveUtilise?.niveau_id || 0);
  const { data: chapitresData, isLoading: isLoadingChapitres } =
    useChapitresByMatiere(selectedMatiereId || 0);

  const generateQuizMutation = useGenerateQuiz();
  const submitQuizMutation = useSubmitQuiz();

  const matieres: Matiere[] = matieresData?.matieres || [];
  const chapitres: Chapitre[] = chapitresData || [];
  const selectedMatiereName =
    matieres.find((m) => m.id === selectedMatiereId)?.libelle || "";
  const currentQuestion = quizQuestions[currentQuestionIndex];

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
      setUseDocument(false);
      setSelectedFile(null);
      setStep("quiz");
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

  const handleSubmitQuiz = async (
    answers?: Record<string | number, string | number>,
  ) => {
    stopTracking();
    if (!activeQuizId) return;

    const answersToSubmit = answers || userAnswers;

    // Calculer le score avec l'utilitaire centralisé
    const scoreResult = calculateQuizScore(quizQuestions, answersToSubmit);

    try {
      const result = await submitQuizMutation.mutateAsync({
        quizId: activeQuizId,
        payload: { score: scoreResult.scoreForApi },
      });
      toast({
        variant: "success",
        title: "Quiz terminé !",
        message:
          result.message ||
          `Note: ${scoreResult.noteSur20}/20 (${scoreResult.correctAnswers}/${quizQuestions.length} bonnes réponses)`,
      });

      const transformedCorrections = result.corrections.map(
        (question: any, index: number) => {
          const propositions = Object.entries(question.propositions).map(
            ([key, value]) => ({
              id: key,
              text: value as string,
            }),
          );

          const originalQuestion = quizQuestions[index];
          const questionId =
            originalQuestion?.id || question.id || `q_${index}`;

          return {
            id: questionId,
            question: question.question,
            propositions: propositions,
            bonne_reponse_id: question.bonne_reponse,
            user_answer:
              answersToSubmit[questionId] ||
              answersToSubmit[originalQuestion?.id],
          };
        },
      );

      sessionStorage.setItem(
        "quizCorrections",
        JSON.stringify(transformedCorrections),
      );

      // Rediriger vers l'onglet Quiz de l'élève après avoir vu les résultats
      // Attendre un peu pour que l'utilisateur voie le toast de succès
      setTimeout(() => {
        if (eleveUtilise) {
          router.push(`/repetiteur/students/${eleveUtilise.id}?tab=quiz`);
        } else {
          router.push("/repetiteur/students");
        }
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la soumission du quiz", error);
      toast({
        variant: "error",
        title: "Erreur de soumission",
        message: "Impossible de soumettre le quiz. Veuillez réessayer.",
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
  
  // Hook pour empêcher la navigation pendant le quiz
  const { ConfirmationDialog, interceptNavigation } = usePreventNavigation({
    when: step === "quiz" && quizQuestions.length > 0,
    message:
      "Le quiz est en cours. Si vous quittez maintenant, il sera automatiquement soumis avec les réponses actuelles.",
    onConfirm: handleSubmitQuiz,
  });

  const handleBackToStudent = () => {
    if (eleveUtilise) {
      if (!interceptNavigation(`/repetiteur/students/${eleveUtilise.id}`)) {
        return;
      }
      router.push(`/repetiteur/students/${eleveUtilise.id}`);
    } else {
      if (!interceptNavigation("/repetiteur/students")) {
        return;
      }
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
            Vous devez sélectionner un élève pour générer un quiz.
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

  // --- RENDER ---
  return (
    <>
      <ConfirmationDialog />
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
                  handleBackToStudent();
                } else if (step === "config") {
                  handleConfigBack();
                } else if (step === "quiz") {
                  // Intercepter la navigation pendant le quiz
                  if (!interceptNavigation(`/repetiteur/students/${eleveUtilise?.id}`)) {
                    return;
                  }
                  setStep("config");
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
            <div>
              <h1 className="text-[#548C2F] text-3xl md:text-4xl font-bold">
                Générer un Quiz
              </h1>
              {eleveUtilise && (
                <p className="text-sm text-gray-600 mt-1">
                  Pour {eleveUtilise.prenom} - {eleveUtilise.niveau?.libelle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full mx-auto max-w-4xl px-4 md:px-8 pt-2 pb-8">
          {/* Step 1: Subject Selection */}
          {step === "subject" && (
            <div className="bg-[#E3F1D9] rounded-2xl p-8 md:p-10 shadow-sm mt-22 ">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-6">
                Choisissez une matière
              </h2>
              {isLoadingMatieres ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
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
                          className="border-[#548C2F] border-2 data-[state=checked]:bg-[#548C2F] data-[state=checked]:border-[#548C2F]"
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
                    Aucune matière n'est disponible pour ce niveau.
                  </p>
                </div>
              )}
              <div className="text-center mt-8">
                <Button
                  onClick={handleSubjectNext}
                  disabled={!selectedMatiereId}
                  className="bg-[#548C2F] hover:bg-[#4a7829] text-white px-8 py-3 rounded-lg font-semibold text-lg"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Configuration */}
          {step === "config" && (
            <div className="bg-[#E3F1D9] rounded-2xl p-8 md:p-10 shadow-sm space-y-8 mt-22">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center">
                Configurez le quiz
              </h2>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">
                  Choisissez un chapitre
                </h3>
                {isLoadingChapitres ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
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
                            className="border-[#548C2F] border-2 data-[state=checked]:bg-[#548C2F] data-[state=checked]:border-[#548C2F]"
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
                  Choisissez la difficulté
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
                        className="border-[#548C2F] border-2 data-[state=checked]:bg-[#548C2F] data-[state=checked]:border-[#548C2F]"
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
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
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
                        className="mt-0.5 border-2 border-[#548C2F] data-[state=checked]:bg-[#548C2F] data-[state=checked]:border-[#548C2F]"
                      />
                      <div className="grid gap-1.5 leading-none flex-1">
                        <label
                          htmlFor="useDocument"
                          className="text-sm font-bold text-[#548C2F] cursor-pointer"
                        >
                          Générer depuis un document (optionnel)
                        </label>
                        <p className="text-xs text-green-700 font-medium">
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
                  className="bg-[#548C2F] hover:bg-[#4a7829] text-white px-12 py-3 rounded-lg font-bold text-xl"
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
                      className="bg-[#548C2F] h-2.5 rounded-full"
                      style={{
                        width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Question Card */}
                <div className="bg-[#E3F1D9] border border-green-200 rounded-2xl p-8 md:p-10">
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
                    onValueChange={(value) => {
                      const newAnswers = {
                        ...userAnswers,
                        [currentQuestion.id]: value,
                      };
                      setUserAnswers(newAnswers);

                      if (currentQuestionIndex === quizQuestions.length - 1) {
                        setTimeout(() => handleSubmitQuiz(newAnswers), 300);
                      } else {
                        setTimeout(() => handleNextQuestion(), 300);
                      }
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentQuestion.propositions.map(
                        (proposition, index) => {
                          const letters = ["a", "b", "c", "d", "e", "f"];
                          return (
                            <div
                              key={proposition.id}
                              className="flex items-center space-x-3 bg-white rounded-xl p-4 border-2 border-gray-900 hover:bg-gray-50 transition-colors"
                            >
                              <RadioGroupItem
                                value={proposition.id.toString()}
                                id={proposition.id.toString()}
                                className="border-black border-2 flex-shrink-0 data-[state=checked]:bg-[#548C2F] data-[state=checked]:border-[#548C2F]"
                              />
                              <Label
                                htmlFor={proposition.id.toString()}
                                className="flex-1 text-base font-medium cursor-pointer"
                              >
                                {letters[index]}) {proposition.text}
                              </Label>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
