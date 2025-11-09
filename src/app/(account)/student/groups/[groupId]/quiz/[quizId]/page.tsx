"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from "next/navigation";
import { useSubmitGroupQuiz } from "@/services/hooks/groupes/useSubmitGroupQuiz";
import {
  QuizQuestion,
  QuizSubmitPayload,
} from "@/services/controllers/types/common";
// import { toast } from "sonner";
import { toast } from "@/lib/toast";
import { useTimeTracking } from "@/stores/useTimeTracking";
import { calculateQuizScore } from "@/lib/quiz-score";
import { usePreventNavigation } from "@/services/hooks/usePreventNavigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { QuizReader } from "@/components/ui/tts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function GroupQuizTakingPage() {
  const [quizDefinition, setQuizDefinition] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useQueryState(
    "q",
    parseAsInteger.withDefault(0),
  );
  const [userAnswers, setUserAnswers] = useState<
    Record<string | number, string | number>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { groupId, quizId } = params;

  const submitQuizMutation = useSubmitGroupQuiz();
  const { startTracking, stopTracking } = useTimeTracking();

  useEffect(() => {
    try {
      const storedQuiz = sessionStorage.getItem("groupQuizData");
      if (storedQuiz) {
        const { quiz, data, time } = JSON.parse(storedQuiz);

        console.log("=== DEBUG CHARGEMENT QUIZ ===");
        console.log("Données brutes depuis sessionStorage:", {
          quiz,
          data,
          time,
        });
        console.log("Première question brute:", data[0]);

        setQuizDefinition(quiz);
        // The question format from the API is different, we need to adapt it
        const formattedQuestions = data.map((q: any, index: number) => ({
          id: q.id || `q_${index}`,
          question: q.question,
          propositions: Object.entries(q.propositions).map(([key, value]) => ({
            id: key,
            text: value as string,
          })),
          bonne_reponse_id: q.bonne_reponse_id || q.bonne_reponse || "",
        }));

        console.log("Questions formatées:", formattedQuestions.slice(0, 2));

        setQuizQuestions(formattedQuestions);
        setTimeLimit(time);
        setRemainingTime(time);
      } else {
        toast({
          variant: "error",
          message: "Données du quiz non trouvées. Redirection...",
        });
        router.push(`/student/groups/${groupId}`);
      }
    } catch (error) {
      toast({
        variant: "error",
        message: "Erreur lors du chargement du quiz.",
      });
      router.push(`/student/groups/${groupId}`);
    } finally {
      setIsLoading(false);
    }
  }, [groupId, router]);

  // Démarrer le tracking quand le quiz est chargé
  useEffect(() => {
    if (!isLoading && quizDefinition && quizId) {
      const chapitreId = quizDefinition?.chapitre_id;
      const difficulte = quizDefinition?.difficulte;

      if (chapitreId) {
        startTracking("quiz", Number(quizId), chapitreId, {
          difficulte,
        });
      }
    }

    // Arrêter le tracking au démontage
    return () => {
      stopTracking();
    };
  }, [isLoading, quizDefinition, quizId]);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmitQuiz = useCallback(async (answersToSubmit?: Record<string | number, string | number>) => {
    if (!quizId || isSubmitting) return;

    setIsSubmitting(true);

    // Utiliser les réponses passées en paramètre ou celles du state
    const finalAnswers = answersToSubmit || userAnswers;

    console.log("=== DEBUG GROUP QUIZ SUBMISSION ===");
    console.log("Questions totales:", quizQuestions.length);
    console.log(
      "Questions avec leurs bonnes réponses:",
      quizQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        bonne_reponse_id: q.bonne_reponse_id,
        propositions: q.propositions,
      })),
    );
    console.log("Réponses utilisateur:", finalAnswers);

    // Calculer le score avec l'utilitaire centralisé
    const scoreResult = calculateQuizScore(quizQuestions, finalAnswers);

    console.log("Score calculé:", scoreResult);
    console.log(
      "Score envoyé au backend (scoreForApi):",
      scoreResult.scoreForApi,
    );

    const payload: QuizSubmitPayload = { score: scoreResult.scoreForApi };

    try {
      const result = await submitQuizMutation.mutateAsync({
        groupeId: Number(groupId),
        quizId: Number(quizId),
        payload,
      });

      console.log("=== RÉPONSE DU BACKEND ===");
      console.log("Résultat complet:", result);
      console.log("result.corrections:", result.corrections);
      console.log("result.note:", result.note);
      console.log("result.note.note:", result.note?.note);

      toast({
        variant: "success",
        message: result.message || "Quiz terminé avec succès!",
      });

      // Sauvegarder les corrections avec les réponses utilisateur
      if (result.corrections && Array.isArray(result.corrections)) {
        console.log("=== DEBUG CORRECTIONS AVEC RÉPONSES ===");
        console.log("result.corrections:", result.corrections);
        console.log("quizQuestions:", quizQuestions);
        console.log("finalAnswers:", finalAnswers);

        const correctionsWithUserAnswers = result.corrections.map((correction: any, index: number) => {
          const questionId = quizQuestions[index]?.id;
          const userAnswer = finalAnswers[questionId];

          console.log(`Question ${index}:`, {
            questionId,
            userAnswer,
            correction
          });

          return {
            ...correction,
            user_answer: userAnswer?.toString(),
          };
        });

        console.log("correctionsWithUserAnswers:", correctionsWithUserAnswers);

        sessionStorage.setItem(
          "groupQuizCorrections",
          JSON.stringify(correctionsWithUserAnswers),
        );
      } else {
        console.warn("⚠️ Pas de corrections dans la réponse!");
      }

      // Sauvegarder le score retourné par le backend (déjà sur 20)
      if (result.note && result.note.note !== undefined) {
        sessionStorage.setItem("groupQuizScore", result.note.note.toString());
        console.log("Score sauvegardé dans sessionStorage:", result.note.note);
      } else {
        console.warn("⚠️ Pas de score dans result.note.note!");
      }

      // Cleanup the quiz data from session storage
      sessionStorage.removeItem("groupQuizData");

      router.push(`/student/groups/${groupId}/quiz/${quizId}/results`);
    } catch (error: any) {
      console.error("Erreur lors de la soumission du quiz", error);

      // Extraire le message d'erreur du backend
      const errorMessage = error?.response?.data?.error ||
                          error?.response?.data?.message ||
                          error?.message ||
                          "Impossible de soumettre le quiz. Veuillez réessayer.";

      toast({
        variant: "error",
        message: errorMessage,
      });
      setIsSubmitting(false);
    }
  }, [
    quizId,
    isSubmitting,
    quizQuestions,
    userAnswers,
    submitQuizMutation,
    router,
    groupId,
  ]);

  // Hook pour empêcher la navigation pendant le quiz
  const { ConfirmationDialog, interceptNavigation } = usePreventNavigation({
    when: !isLoading && !isSubmitting && quizQuestions.length > 0,
    message:
      "Tu es en train de passer un quiz. Si tu quittes maintenant, ton quiz sera automatiquement soumis avec les réponses actuelles.",
    onConfirm: handleSubmitQuiz,
  });

  // Timer countdown - APRÈS handleSubmitQuiz
  useEffect(() => {
    if (isLoading || isSubmitting || remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit quand le temps est écoulé
          // Les questions non répondues sont déjà comptées comme incorrectes (0 point)
          // car elles ne sont pas dans userAnswers
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, isSubmitting, remainingTime, handleSubmitQuiz]);

  // Fonction pour formater le temps restant
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleBackToGroup = () => {
    if (!interceptNavigation(`/student/groups/${groupId}`)) {
      return; // Navigation interceptée
    }
    router.push(`/student/groups/${groupId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Chargement du quiz...
      </div>
    );
  }

  // --- RENDER ---
  return (
    <>
      <ConfirmationDialog />
      <div className="min-h-screen w-full">
        {/* Header */}
        <div className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToGroup}
               className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border rounded-full bg-white w-12 h-12 justify-center"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <h1 className="text-orange-600 text-4xl md:text-[3rem]">
              {quizDefinition?.titre || "Quiz de Groupe"}
            </h1>
          </div>
        </div>

        {/* Alert Règles du Quiz */}
        <div className="w-full mx-auto max-w-4xl px-4 md:px-8 pt-4 pb-4">
          <Alert className="border-2 border-red-500 bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <AlertTitle className="text-red-800 font-bold text-lg md:text-xl">
              Règles du Quiz
            </AlertTitle>
            <AlertDescription className="text-red-700 space-y-2 text-base md:text-lg">
              <p>
                ⏱️ <strong>{Math.floor(timeLimit / quizQuestions.length)} secondes</strong> par question - passage
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
                ⚠️ <strong>Valider avant la fin</strong> pour que vos réponses soient
                comptabilisées
              </p>
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Content */}
        <div className="w-full mx-auto max-w-4xl px-4 md:px-8 pt-2 pb-8">
          {currentQuestion && (
            <div className="max-w-4xl mx-auto mt-24">
              <div className="space-y-8">
                {/* Timer et Progress bar */}
                <div>
                  <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-600">
                    <span>
                      Question {currentQuestionIndex + 1}/{quizQuestions.length}
                    </span>
                    <span
                      className={`text-lg font-bold ${remainingTime <= 10 ? "text-red-600 animate-pulse" : "text-orange-600"}`}
                    >
                      ⏱️ {formatTime(remainingTime)}
                    </span>
                    <span>{quizDefinition?.matiere?.libelle || ""}</span>
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
                    <QuizReader
                      question={currentQuestion}
                      questionIndex={currentQuestionIndex}
                    />
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
                      const updatedAnswers = {
                        ...userAnswers,
                        [currentQuestion.id]: value,
                      };
                      setUserAnswers(updatedAnswers);

                      if (currentQuestionIndex === quizQuestions.length - 1) {
                        // Dernière question : soumettre avec les réponses mises à jour
                        setTimeout(() => {
                          handleSubmitQuiz(updatedAnswers);
                        }, 300);
                      } else {
                        setTimeout(() => handleNextQuestion(), 300);
                      }
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentQuestion.propositions.map(
                        (proposition, index) => (
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
                              {proposition.text}
                            </Label>
                          </div>
                        ),
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
