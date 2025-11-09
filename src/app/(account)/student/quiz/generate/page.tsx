"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
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
import { toast } from "@/lib/toast";
import { GenerationLoadingOverlay } from "@/components/ui/generation-loading-overlay";
import { useTimeTracking } from "@/stores/useTimeTracking";
import { useQuizTimer } from "@/stores/useQuizTimer";
import { calculateQuizScore } from "@/lib/quiz-score";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { usePreventNavigation } from "@/services/hooks/usePreventNavigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { QuizReader } from "@/components/ui/tts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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

export default function GenerateQuizPage() {
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
  // const [useDocument, setUseDocument] = useState(false);
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<
    Record<string | number, string | number>
  >({});
  const [questionTimeRemaining, setQuestionTimeRemaining] =
    useState<number>(60);

  const router = useRouter();
  const { user } = useSession();
  const { startTracking, stopTracking } = useTimeTracking();
  const {
    startQuiz,
    startQuestion,
    endQuestion,
    getTotalTime,
    reset: resetQuizTimer,
  } = useQuizTimer();

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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      // Terminer le timer de la question actuelle
      endQuestion(currentQuestion.id);

      setCurrentQuestionIndex((prev) => prev + 1);

      // Démarrer le timer de la prochaine question
      const nextQuestion = quizQuestions[currentQuestionIndex + 1];
      if (nextQuestion) {
        startQuestion(nextQuestion.id);
      }
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
      // document_file: selectedFile || undefined,
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
      // setUseDocument(false);
      // setSelectedFile(null);

      // Initialiser le timer du quiz
      startQuiz(result.quiz_id);
      // Démarrer le timer pour la première question
      if (result.questions.length > 0) {
        startQuestion(result.questions[0].id);
      }

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

  const handleSubmitQuiz = useCallback(
    async (answers?: Record<string | number, string | number>) => {
      stopTracking();
      if (!activeQuizId) return;

      // Terminer le timer de la question en cours (si pas déjà terminé)
      if (currentQuestion) {
        endQuestion(currentQuestion.id);
      }

      // Récupérer le temps total passé sur le quiz
      const totalTimeInSeconds = getTotalTime();

      const answersToSubmit = answers || userAnswers;

      // Calculer le score avec l'utilitaire centralisé
      const scoreResult = calculateQuizScore(quizQuestions, answersToSubmit);

      try {
        const result = await submitQuizMutation.mutateAsync({
          quizId: activeQuizId,
          payload: { score: scoreResult.scoreForApi }, // Envoie le nombre de bonnes réponses
        });
        toast({
          variant: "success",
          title: "Quiz terminé !",
          message:
            result.message ||
            `Votre note: ${scoreResult.noteSur20}/20 (${scoreResult.correctAnswers}/${quizQuestions.length} bonnes réponses)`,
        });

        // Debug: voir les IDs des questions et les réponses
        console.log("=== DEBUG QUIZ SUBMISSION ===");
        console.log(
          "Questions originales:",
          quizQuestions.map((q) => ({ id: q.id, question: q.question })),
        );
        console.log("Réponses de l'utilisateur:", answersToSubmit);
        console.log("Corrections du backend:", result.corrections);

        const transformedCorrections = result.corrections.map(
          (question: any, index: number) => {
            const propositions = Object.entries(question.propositions).map(
              ([key, value]) => ({
                id: key,
                text: value as string,
              }),
            );

            // Essayer de trouver la question originale correspondante
            const originalQuestion = quizQuestions[index];
            const questionId =
              originalQuestion?.id || question.id || `q_${index}`;

            console.log(`Question ${index}:`, {
              questionId,
              originalId: originalQuestion?.id,
              backendId: question.id,
              userAnswer: answersToSubmit[questionId],
              alternativeAnswer: answersToSubmit[originalQuestion?.id],
            });

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

        // Stocker aussi le score calculé localement pour éviter les incohérences
        sessionStorage.setItem(
          "quizScore",
          JSON.stringify({
            score: scoreResult.correctAnswers,
            totalQuestions: quizQuestions.length,
            noteSur20: scoreResult.noteSur20,
            totalTimeInSeconds, // Temps réel passé sur le quiz
          }),
        );

        // Réinitialiser le timer du quiz
        resetQuizTimer();

        router.push(`/student/quiz/results/${result.userQuiz.id}`);
      } catch (error) {
        console.error("Erreur lors de la soumission du quiz", error);
        toast({
          variant: "error",
          title: "Erreur de soumission",
          message: "Impossible de soumettre le quiz. Veuillez réessayer.",
        });
      }
    },
    [
      activeQuizId,
      quizQuestions,
      userAnswers,
      currentQuestion,
      stopTracking,
      submitQuizMutation,
      router,
      endQuestion,
      getTotalTime,
      resetQuizTimer,
    ],
  );

  // Timer countdown pour chaque question (60s)
  useEffect(() => {
    if (step !== "quiz" || !currentQuestion || submitQuizMutation.isPending)
      return;

    const timer = setInterval(() => {
      setQuestionTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-passer à la question suivante ou soumettre si c'est la dernière
          if (currentQuestionIndex === quizQuestions.length - 1) {
            handleSubmitQuiz(userAnswers);
          } else {
            handleNextQuestion();
          }
          return 60; // Reset pour la prochaine question
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    step,
    currentQuestion,
    currentQuestionIndex,
    quizQuestions.length,
    submitQuizMutation.isPending,
    userAnswers,
  ]);

  // Réinitialiser le timer quand on change de question
  useEffect(() => {
    if (step === "quiz" && currentQuestion) {
      setQuestionTimeRemaining(60);
    }
  }, [currentQuestionIndex, step, currentQuestion]);

  // Fonction pour formater le temps restant
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubjectNext = () => {
    if (selectedMatiereId) setStep("config");
  };
  const handleConfigBack = () => {
    setStep("subject");
    setSelectedChapitreId(null);
    setSelectedDifficulty(null);
  };

  // Créer une version stable de handleSubmitQuiz pour éviter les re-renders du dialog
  const handleSubmitQuizRef = useRef(handleSubmitQuiz);
  useEffect(() => {
    handleSubmitQuizRef.current = handleSubmitQuiz;
  }, [handleSubmitQuiz]);

  const stableHandleSubmitQuiz = useCallback(() => {
    handleSubmitQuizRef.current();
  }, []);

  // Hook pour empêcher la navigation pendant le quiz
  const { ConfirmationDialog, interceptNavigation } = usePreventNavigation({
    when: step === "quiz" && quizQuestions.length > 0,
    message:
      "Tu es en train de passer un quiz. Si tu quittes maintenant, ton quiz sera automatiquement soumis avec les réponses actuelles.",
    onConfirm: stableHandleSubmitQuiz,
  });

  // Changement ici : retourner vers la liste des quiz
  const handleBackToQuizList = () => {
    if (!interceptNavigation("/student/quiz")) {
      return; // Navigation interceptée
    }
    router.push("/student/quiz");
  };

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
                  handleBackToQuizList();
                } else if (step === "config") {
                  handleConfigBack();
                } else if (step === "quiz") {
                  // Intercepter la navigation pendant le quiz
                  if (!interceptNavigation("/student/quiz")) {
                    return;
                  }
                  setStep("config");
                }
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border rounded-full bg-white w-12 h-12 justify-center"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <h1 className="text-orange-600 text-4xl md:text-[3rem]">
              Quiz Time
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full mx-auto max-w-4xl px-4 md:px-8 pt-2 pb-8">
          {/* Step 1: Subject Selection */}
          {step === "subject" && (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-600 text-xl md:text-2xl">
                  Prêt à tester tes connaissances ? Choisis ta matière et
                  lance-toi dans un quiz personnalisé !
                </p>
              </div>
              <div className="bg-[#E1E5F4] rounded-2xl p-8 md:p-10 shadow-sm mt-22 ">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-6">
                  Choisis une matière
                </h2>
                {isLoadingMatieres ? (
                  <p>Chargement des matières...</p>
                ) : matieres.length > 0 ? (
                  <RadioGroup
                    value={selectedMatiereId?.toString() || ""}
                    onValueChange={(value) =>
                      setSelectedMatiereId(Number(value))
                    }
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

          {/* Step 2: Configuration */}
          {step === "config" && (
            <>
              <div className="text-center mb-2">
                <h1 className="text-4xl font-bold text-orange-500 mb-2">
                  {selectedMatiereName}
                </h1>
                <p className="text-gray-600 text-xl md:text-2xl">
                  Maintenant, sélectionne le chapitre et le niveau de difficulté
                  pour ton quiz.
                </p>
              </div>
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

                {/* Checkbox et FileUpload pour document optionnel - MASQUÉ POUR LES ÉLÈVES */}
                {/* {chapitres.length > 0 && (
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
              )} */}

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
            </>
          )}

          {/* Step 3: Quiz */}
          {step === "quiz" && currentQuestion && (
            <div className="max-w-4xl mx-auto mt-24">
              <div className="space-y-8">
                {/* Alert avec les règles du quiz */}
                <Alert
                  variant="destructive"
                  className="border-2 border-red-500 bg-red-50"
                >
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <AlertTitle className="text-red-800 font-bold text-lg md:text-xl">
                    Règles du Quiz
                  </AlertTitle>
                  <AlertDescription className="text-red-700 space-y-2 text-base md:text-lg">
                    <p>
                      ⏱️ <strong>60 secondes</strong> par question - passage
                      automatique si le temps expire
                    </p>
                    <p>
                      ➡️ <strong>Passage automatique</strong> à la question
                      suivante après sélection
                    </p>
                    <p>
                      🚫 <strong>Impossible de revenir</strong> en arrière sur
                      une question déjà passée
                    </p>
                    <p>
                      ⚠️{" "}
                      <strong>Quitter la page = soumission automatique</strong>{" "}
                      du quiz avec tes réponses actuelles
                    </p>
                  </AlertDescription>
                </Alert>

                {/* Timer et Progress bar */}
                <div>
                  <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-600">
                    <span>
                      Question {currentQuestionIndex + 1}/{quizQuestions.length}
                    </span>
                    <span
                      className={`text-lg font-bold ${questionTimeRemaining <= 10 ? "text-red-600 animate-pulse" : "text-orange-600"}`}
                    >
                      ⏱️ {formatTime(questionTimeRemaining)}
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
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 text-center underline decoration-2 underline-offset-4">
                      Question {currentQuestionIndex + 1}
                    </h2>
                    {/* <QuizReader
                      question={currentQuestion}
                      questionIndex={currentQuestionIndex}
                    /> */}
                  </div>
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
