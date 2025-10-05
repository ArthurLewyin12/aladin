"use client";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from "next/navigation";
import { useSubmitGroupQuiz } from "@/services/hooks/groupes/useSubmitGroupQuiz";
import {
  QuizQuestion,
  QuizSubmitPayload,
} from "@/services/controllers/types/common";
import { toast } from "sonner";

// NOTE: This is a simplified version of the individual quiz page, adapted for group quizzes.

export default function GroupQuizTakingPage() {
  const [quizDefinition, setQuizDefinition] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [timeLimit, setTimeLimit] = useState<number>(0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    Record<string | number, string | number>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const { groupId, quizId } = params;

  const submitQuizMutation = useSubmitGroupQuiz();

  useEffect(() => {
    try {
      const storedQuiz = sessionStorage.getItem("groupQuizData");
      if (storedQuiz) {
        const { quiz, data, time } = JSON.parse(storedQuiz);
        setQuizDefinition(quiz);
        // The question format from the API is different, we need to adapt it
        const formattedQuestions = data.map((q: any, index: number) => ({
          id: `q_${index}`,
          question: q.question,
          propositions: q.reponses.map((r: any, r_index: number) => ({
            id: `q_${index}_${r_index}`,
            text: r.texte,
          })),
          // Note: bonne_reponse_id is not provided by the start endpoint, it comes with corrections.
          bonne_reponse_id: "",
        }));
        setQuizQuestions(formattedQuestions);
        setTimeLimit(time);
      } else {
        toast.error("Données du quiz non trouvées. Redirection...");
        router.push(`/student/groups/${groupId}`);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement du quiz.");
      router.push(`/student/groups/${groupId}`);
    } finally {
      setIsLoading(false);
    }
  }, [groupId, router]);

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

  const handleSubmitQuiz = async () => {
    if (!quizId) return;

    // Note: Score calculation is illustrative. The backend doesn't use it, but we send it as per the spec.
    const score = Object.keys(userAnswers).length;

    const payload: QuizSubmitPayload = { score };

    try {
      const result = await submitQuizMutation.mutateAsync({
        quizId: Number(quizId),
        payload,
      });
      toast.success(result.message || "Quiz terminé avec succès!");

      sessionStorage.setItem(
        "groupQuizCorrections",
        JSON.stringify(result.corrections),
      );

      // Cleanup the quiz data from session storage
      sessionStorage.removeItem("groupQuizData");

      router.push(`/student/groups/${groupId}/quiz/${quizId}/results`);
    } catch (error) {
      console.error("Erreur lors de la soumission du quiz", error);
      toast.error("Impossible de soumettre le quiz. Veuillez réessayer.");
    }
  };

  const handleBackToGroup = () => router.push(`/student/groups/${groupId}`);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Chargement du quiz...
      </div>
    );
  }

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
      <div className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToGroup}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border rounded-full bg-white px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm">Retour au groupe</span>
          </Button>
          <h1 className="text-orange-600 text-4xl md:text-[3rem]">
            {quizDefinition?.titre || "Quiz de Groupe"}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto max-w-4xl px-4 md:px-8 pt-2 pb-8">
        {currentQuestion && (
          <div className="max-w-4xl mx-auto mt-24">
            <div className="space-y-8">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-600">
                  <span>
                    Question {currentQuestionIndex + 1}/{quizQuestions.length}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.propositions.map((proposition, index) => (
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
                    ))}
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
