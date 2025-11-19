"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetAllQuiz, useSubmitQuiz } from "@/services/hooks/quiz";
import { useTimeTracking } from "@/stores/useTimeTracking";
import { useQuizTimer } from "@/stores/useQuizTimer";
import { calculateQuizScore } from "@/lib/quiz-score";
import { toast } from "@/lib/toast";
import { usePreventNavigation } from "@/services/hooks/usePreventNavigation";
import { Quiz } from "@/services/controllers/types/common";

const ClassQuizPage = () => {
  const params = useParams();
  const router = useRouter();
  const quizId = Number(params.quizId);

  const { data: allQuizData, isLoading: isLoadingQuizzes } = useGetAllQuiz();
  const submitQuizMutation = useSubmitQuiz();

  // État du quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string | number, string>>({});
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(60);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  // Récupérer le quiz depuis les données
  const classQuiz = allQuizData?.quizzes?.find(
    (q) => q.id === quizId && (q as any).type === "classe"
  ) as (Quiz & { classe?: { id: number; nom: string }; type?: string }) | undefined;

  const { startTracking, stopTracking } = useTimeTracking();
  const { startQuiz, startQuestion, endQuestion, getTotalTime, reset: resetQuizTimer } = useQuizTimer();

  // Démarrer le tracking
  useEffect(() => {
    if (isQuizStarted && classQuiz) {
      startTracking("quiz", classQuiz.id, classQuiz.chapitre?.id || 0, {
        difficulte: classQuiz.difficulte,
      });
    }

    return () => {
      if (isQuizStarted) {
        stopTracking();
      }
    };
  }, [isQuizStarted, classQuiz, startTracking, stopTracking]);

  // Initialiser le quiz
  useEffect(() => {
    if (classQuiz && !isQuizStarted) {
      const transformedQuestions = classQuiz.questions?.map((q: any, index: number) => {
        const propositionsArray = Array.isArray(q.propositions)
          ? q.propositions
          : Object.entries(q.propositions).map(([key, value]) => ({
              id: key,
              text: value,
            }));

        return {
          id: `q_${index}`,
          question: q.question,
          propositions: propositionsArray,
          bonne_reponse_id: q.bonne_reponse,
        };
      }) || [];

      setQuizQuestions(transformedQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setIsQuizStarted(true);

      // Démarrer les timers
      startQuiz(classQuiz.id);
      if (transformedQuestions.length > 0) {
        startQuestion(transformedQuestions[0].id);
      }
    }
  }, [classQuiz, isQuizStarted, startQuiz, startQuestion]);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      endQuestion(currentQuestion?.id);
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionTimeRemaining(60);

      const nextQuestion = quizQuestions[currentQuestionIndex + 1];
      if (nextQuestion) {
        startQuestion(nextQuestion.id);
      }
    }
  }, [currentQuestionIndex, quizQuestions, currentQuestion, endQuestion, startQuestion]);

  const handleSubmitQuiz = useCallback(
    async (answers?: Record<string | number, string>) => {
      stopTracking();
      if (!classQuiz) return;

      if (currentQuestion) {
        endQuestion(currentQuestion.id);
      }

      const totalTimeInSeconds = getTotalTime();
      const answersToSubmit = answers || userAnswers;

      // Calculer le score
      const scoreResult = calculateQuizScore(quizQuestions, answersToSubmit);

      try {
        const result = await submitQuizMutation.mutateAsync({
          quizId: classQuiz.id,
          payload: { score: scoreResult.scoreForApi },
        });

        toast({
          variant: "success",
          title: "Quiz terminé !",
          message: `Votre note: ${scoreResult.noteSur20}/20 (${scoreResult.correctAnswers}/${quizQuestions.length} bonnes réponses)`,
        });

        // Transformer les corrections
        const transformedCorrections = result.corrections.map((question: any, index: number) => {
          const propositions = Object.entries(question.propositions).map(([key, value]) => ({
            id: key,
            text: value as string,
          }));

          const originalQuestion = quizQuestions[index];
          const questionId = originalQuestion?.id || question.id || `q_${index}`;

          return {
            id: questionId,
            question: question.question,
            propositions: propositions,
            bonne_reponse_id: question.bonne_reponse,
            user_answer:
              answersToSubmit[questionId] || answersToSubmit[originalQuestion?.id],
          };
        });

        sessionStorage.setItem("quizCorrections", JSON.stringify(transformedCorrections));
        sessionStorage.setItem(
          "quizScore",
          JSON.stringify({
            score: scoreResult.correctAnswers,
            totalQuestions: quizQuestions.length,
            noteSur20: scoreResult.noteSur20,
            totalTimeInSeconds,
          })
        );

        resetQuizTimer();
        router.push(`/student/class-quiz/results/${result.userQuiz.id}`);
      } catch (error) {
        console.error("Erreur lors de la soumission du quiz", error);
        toast({
          variant: "error",
          title: "Erreur de soumission",
          message: "Impossible de soumettre le quiz. Veuillez réessayer.",
        });
      }
    },
    [classQuiz, currentQuestion, endQuestion, getTotalTime, quizQuestions, userAnswers, submitQuizMutation, stopTracking, resetQuizTimer, router]
  );

  // Timer countdown
  useEffect(() => {
    if (!isQuizStarted || !currentQuestion || submitQuizMutation.isPending) return;

    const timer = setInterval(() => {
      setQuestionTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (currentQuestionIndex === quizQuestions.length - 1) {
            handleSubmitQuiz(userAnswers);
          } else {
            handleNextQuestion();
          }
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizStarted, currentQuestion, currentQuestionIndex, quizQuestions.length, submitQuizMutation.isPending, userAnswers, handleNextQuestion, handleSubmitQuiz]);

  // Réinitialiser le timer quand on change de question
  useEffect(() => {
    if (isQuizStarted && currentQuestion) {
      setQuestionTimeRemaining(60);
    }
  }, [currentQuestionIndex, isQuizStarted, currentQuestion]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Ref pour stable handleSubmitQuiz
  const handleSubmitQuizRef = useRef(handleSubmitQuiz);
  useEffect(() => {
    handleSubmitQuizRef.current = handleSubmitQuiz;
  }, [handleSubmitQuiz]);

  const stableHandleSubmitQuiz = useCallback(() => {
    handleSubmitQuizRef.current();
  }, []);

  // Hook pour empêcher la navigation
  const { ConfirmationDialog, interceptNavigation } = usePreventNavigation({
    when: isQuizStarted && quizQuestions.length > 0,
    message: "Tu es en train de passer un quiz. Si tu quittes maintenant, ton quiz sera automatiquement soumis avec les réponses actuelles.",
    onConfirm: stableHandleSubmitQuiz,
  });

  const handleBack = () => {
    if (!interceptNavigation("/student/quiz?tab=Quiz%20de%20Classe")) {
      return;
    }
    router.push("/student/quiz?tab=Quiz%20de%20Classe");
  };

  if (isLoadingQuizzes) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Chargement du quiz...</p>
      </div>
    );
  }

  if (!classQuiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center max-w-md">
          <p className="text-red-600 font-semibold">Quiz non trouvé</p>
          <Button
            onClick={handleBack}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Retour aux quiz
          </Button>
        </div>
      </div>
    );
  }

  if (!isQuizStarted || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Initialisation du quiz...</p>
      </div>
    );
  }

  return (
    <>
      <ConfirmationDialog />
      <div className="min-h-screen w-full">
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
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border rounded-full bg-white w-12 h-12 justify-center"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <h1 className="text-orange-600 text-2xl md:text-3xl font-bold">
              {(classQuiz as any).titre || classQuiz.chapitre?.libelle}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full mx-auto max-w-4xl px-4 md:px-8 pt-2 pb-8">
          {isQuizStarted && currentQuestion && (
            <div className="max-w-4xl mx-auto mt-8">
              <div className="space-y-8">
                {/* Règles du Quiz */}
                <Alert variant="destructive" className="border-2 border-red-500 bg-red-50">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <AlertTitle className="text-red-800 font-bold text-lg md:text-xl">
                    Règles du Quiz
                  </AlertTitle>
                  <AlertDescription className="text-red-700 space-y-2 text-base md:text-lg">
                    <p>⏱️ <strong>60 secondes</strong> par question - passage automatique si le temps expire</p>
                    <p>➡️ <strong>Passage automatique</strong> à la question suivante après sélection</p>
                    <p>🚫 <strong>Impossible de revenir</strong> en arrière sur une question déjà passée</p>
                    <p>⚠️ <strong>Quitter la page = soumission automatique</strong> du quiz avec tes réponses actuelles</p>
                  </AlertDescription>
                </Alert>

                {/* Timer et Progress bar */}
                <div>
                  <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-600">
                    <span>Question {currentQuestionIndex + 1}/{quizQuestions.length}</span>
                    <span
                      className={`text-lg font-bold ${questionTimeRemaining <= 10 ? "text-red-600 animate-pulse" : "text-orange-600"}`}
                    >
                      ⏱️ {formatTime(questionTimeRemaining)}
                    </span>
                    <span>{classQuiz.chapitre?.matiere?.libelle}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-orange-500 h-2.5 rounded-full"
                      style={{
                        width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                <div className="bg-[#F5D3A6] border border-orange-200 rounded-2xl p-8 md:p-10">
                  <h2 className="text-3xl font-bold text-gray-800 text-center underline decoration-2 underline-offset-4 mb-6">
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
                      {currentQuestion.propositions.map((proposition: any, index: number) => {
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
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClassQuizPage;
