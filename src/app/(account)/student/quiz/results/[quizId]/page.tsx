"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuiz, useQuizNotes } from "@/services/hooks/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { QuizQuestion } from "@/services/controllers/types/common";

export default function QuizResultPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.quizId);

  const {
    data: quizData,
    isLoading: isLoadingQuiz,
    isError: isErrorQuiz,
  } = useQuiz(quizId);
  const {
    data: notesData,
    isLoading: isLoadingNotes,
    isError: isErrorNotes,
  } = useQuizNotes(quizId);

  const handleBackToHome = () => {
    router.push("/student/home");
  };

  if (isLoadingQuiz || isLoadingNotes) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isErrorQuiz || isErrorNotes) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-500">
        <p className="mb-4">Erreur lors du chargement des résultats du quiz.</p>
        <Button onClick={handleBackToHome}>Retour à l'accueil</Button>
      </div>
    );
  }

  const score = notesData?.notes[0]?.note || 0;
  const totalQuestions = quizData?.data.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900">
            Résultats du Quiz
          </h1>
          <Button onClick={handleBackToHome} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>

        {/* Score Summary Card */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-gray-700">
              Votre Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-6xl font-bold text-orange-500">
              {score}
              <span className="text-4xl text-gray-500">/{totalQuestions}</span>
            </p>
          </CardContent>
        </Card>

        {/* Corrections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Correction</h2>
          {quizData?.data.map((question: QuizQuestion, index: number) => (
            <Card key={question.id} className="bg-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                <p className="text-base text-gray-800 pt-2">
                  {question.question}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {question.propositions.map((proposition) => {
                    const isCorrect =
                      proposition.id == question.bonne_reponse_id;
                    return (
                      <li
                        key={proposition.id}
                        className={`flex items-center p-3 rounded-lg border-2 ${
                          isCorrect
                            ? "bg-green-100 border-green-400"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 mr-3 flex-shrink-0" />
                        )}
                        <span className="text-gray-900">
                          {proposition.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
