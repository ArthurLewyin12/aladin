"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuizNotes } from "@/services/hooks/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { QuizQuestion } from "@/services/controllers/types/common";
import { toast } from "sonner";

export default function QuizResultPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.quizId);
  const [corrections, setCorrections] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    const storedCorrections = sessionStorage.getItem("quizCorrections");
    if (storedCorrections) {
      setCorrections(JSON.parse(storedCorrections));
    } else {
      toast.error("Impossible de récupérer les résultats du quiz.");
      router.push("/student/home");
    }
  }, [router]);

  const {
    data: notesData,
    isLoading: isLoadingNotes,
    isError: isErrorNotes,
  } = useQuizNotes(quizId);

  const handleBackToHome = () => {
    router.push("/student/home");
  };

  const handleRetakeQuiz = () => {
    const quizConfigStr = sessionStorage.getItem("quizConfig");
    if (quizConfigStr) {
      const config = JSON.parse(quizConfigStr);
      if (config.matiereId && config.chapitreId && config.difficulty) {
        router.push(
          `/student/quiz?matiereId=${config.matiereId}&chapitreId=${config.chapitreId}&difficulty=${config.difficulty}`,
        );
      } else {
        toast.error("La configuration du quiz est invalide.");
      }
    } else {
      toast.error(
        "Impossible de trouver la configuration pour repasser le quiz.",
      );
    }
  };

  const handleMoreExplanation = () => {
    console.log("Plus d'explication");
  };

  if (isLoadingNotes || corrections.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isErrorNotes) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-500">
        <p className="mb-4">Erreur lors du chargement de votre score.</p>
        <Button onClick={handleBackToHome}>Retour à l'accueil</Button>
      </div>
    );
  }

  const score = notesData?.notes[0]?.note || 0;
  const totalQuestions = corrections.length || 0;

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
            onClick={handleBackToHome}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border rounded-full bg-white px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour</span>
          </Button>
          <h1 className="text-orange-600 text-4xl md:text-[3rem]">
            Quiz Time !
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto max-w-3xl px-4 md:px-8 pt-2 pb-8 py-2">
        {/* Congratulations Message */}
        <div className="text-center mb-8 mt-22">
          <div className="mb-4">
            <span className="text-2xl">👏</span>
            <span className="text-lg text-gray-700 mx-4">
              Mission accomplie
            </span>
            <span className="text-2xl">👏</span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tu as bien travaillé, et j'ai noté ce que tu maîtrises déjà et ce
            qu'on peut encore revoir ensemble.
          </p>
        </div>

        {/* Félicitations Section */}
        <div className="text-center mb-8">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-2xl">🎉</span>
            <h2 className="text-2xl font-bold text-gray-800">Félicitations</h2>
            <span className="text-2xl">🎉</span>
          </div>
        </div>

        {/* Score Display */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-orange-500">
            Score : {score}/{totalQuestions}
          </div>
        </div>

        {/* Questions and Corrections */}
        <div className="space-y-4 mb-6">
          {corrections.map((question: QuizQuestion, index: number) => (
            <Card
              key={question.id}
              className="bg-blue-50 border-blue-200 shadow-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <X className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Question {index + 1}: {question.question}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-green-700 font-medium">
                        Bonne réponse: a){" "}
                        {question.propositions.find(
                          (p) => p.id === question.bonne_reponse_id,
                        )?.text || "2x-32x"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Retake Quiz Button - Left aligned under questions */}
        <div className="mb-8">
          <Button
            onClick={handleRetakeQuiz}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800  border-none "
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Repasser le test
          </Button>
        </div>

        {/* Bottom Right Action Buttons */}
        {/* Bottom buttons - justified between left and right */}
        <div className="flex justify-between items-center">
          <Button className="" variant="outline">
            Plus d'explication
          </Button>
          <Button onClick={handleBackToHome}>Accueil</Button>
        </div>
      </div>
    </div>
  );
}
