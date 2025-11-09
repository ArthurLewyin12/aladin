"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuizNotes } from "@/services/hooks/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { QuizQuestion } from "@/services/controllers/types/common";
import { toast } from "@/lib/toast";
import { QuizExplanations } from "@/components/pages/quizzes/quiz-explanations";
import { convertScoreToNote } from "@/lib/quiz-score";

export default function QuizResultPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.quizId);
  const [corrections, setCorrections] = useState<QuizQuestion[]>([]);
  const [isExplanationsOpen, setIsExplanationsOpen] = useState(false);
  const [localScore, setLocalScore] = useState<{
    score: number;
    totalQuestions: number;
    noteSur20: number;
    totalTimeInSeconds?: number;
  } | null>(null);

  useEffect(() => {
    const storedCorrections = sessionStorage.getItem("quizCorrections");
    const storedScore = sessionStorage.getItem("quizScore");

    if (storedCorrections) {
      setCorrections(JSON.parse(storedCorrections));
    } else {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Impossible de récupérer les résultats du quiz.",
      });
      router.push("/student/home");
    }

    if (storedScore) {
      setLocalScore(JSON.parse(storedScore));
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
        toast({
          variant: "error",
          title: "Erreur de configuration",
          message: "La configuration du quiz est invalide.",
        });
      }
    } else {
      toast({
        variant: "error",
        title: "Erreur",
        message:
          "Impossible de trouver la configuration pour repasser le quiz.",
      });
    }
  };

  if (isLoadingNotes || corrections.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (isErrorNotes) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-500 space-y-4">
        <p className="text-xl mb-4">
          Erreur lors du chargement de votre score.
        </p>
        <Button
          onClick={handleBackToHome}
          className="rounded-xl w-12 h-12 p-0 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    );
  }

  // Utiliser le score local en priorité pour éviter les incohérences
  const score = localScore?.score ?? (notesData?.notes[0]?.note || 0);
  const totalQuestions = localScore?.totalQuestions ?? (corrections.length || 0);
  const explanations = notesData?.questions_approfondissement || [];

  // Convertir le score en note sur 20 - utiliser le score local si disponible
  const noteSur20 = localScore?.noteSur20 ?? convertScoreToNote(score, totalQuestions);

  // Debug: afficher les scores pour comprendre les incohérences
  console.log("=== QUIZ RESULTS DEBUG ===");
  console.log("Score local (calculé):", localScore);
  console.log("Score backend:", notesData?.notes[0]?.note);
  console.log("Score final utilisé:", score);
  console.log("Note sur 20:", noteSur20);

  // Calculer le pourcentage
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  // Fonction pour obtenir le message adapté au score
  const getScoreMessage = () => {
    if (percentage >= 90) {
      return {
        emoji: "🏆",
        title: "Excellent !",
        message:
          "Tu maîtrises parfaitement ce chapitre ! Continue comme ça, tu es sur la bonne voie pour devenir un expert.",
        titleEmoji: "🌟",
      };
    } else if (percentage >= 70) {
      return {
        emoji: "👏",
        title: "Bien joué !",
        message:
          "Tu as bien travaillé ! Tu maîtrises déjà beaucoup de choses, quelques petites révisions et ce sera parfait.",
        titleEmoji: "🎉",
      };
    } else if (percentage >= 50) {
      return {
        emoji: "💪",
        title: "Bon début !",
        message:
          "Tu es sur la bonne voie ! Quelques notions sont à revoir, mais tu progresses. Continue à t'entraîner.",
        titleEmoji: "📚",
      };
    } else {
      return {
        emoji: "🎯",
        title: "Continue tes efforts !",
        message:
          "Ce chapitre demande encore du travail, mais ne te décourage pas ! Révise bien les corrections et réessaie, tu vas y arriver.",
        titleEmoji: "💡",
      };
    }
  };

  const scoreMessage = getScoreMessage();

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div
        className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
        style={{
          backgroundImage: `url("/bg-2.png")`,
          backgroundSize: "180px 180px",
        }}
      >
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleBackToHome}
            className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 border rounded-xl bg-white/80 w-12 h-12 p-0 justify-center shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <h1 className="text-orange-600 text-5xl md:text-6xl font-bold">
            Quiz Time !
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto max-w-4xl px-4 md:px-8 pt-4 pb-12">
        {/* Message adaptatif basé sur le score */}
        <div className="text-center mb-12 mt-8 animate-fade-in">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="text-4xl">{scoreMessage.emoji}</span>
            <span className="text-2xl text-gray-700 font-semibold">
              {scoreMessage.title}
            </span>
            <span className="text-4xl">{scoreMessage.emoji}</span>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            {scoreMessage.message}
          </p>
        </div>

        {/* Félicitations Section avec emoji adaptatif */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="text-4xl">{scoreMessage.titleEmoji}</span>
            <h2 className="text-3xl font-bold text-gray-800">Résultat</h2>
            <span className="text-4xl">{scoreMessage.titleEmoji}</span>
          </div>
        </div>

        {/* Score Display avec couleur adaptative */}
        <div className="text-center mb-8 animate-bounce-in">
          <div
            className={`text-5xl font-bold ${
              percentage >= 70
                ? "text-green-500 bg-gradient-to-r from-green-400 to-green-600"
                : percentage >= 50
                  ? "text-orange-500 bg-gradient-to-r from-orange-400 to-orange-600"
                  : "text-red-500 bg-gradient-to-r from-red-400 to-red-600"
            } bg-clip-text text-transparent`}
          >
            Note : {noteSur20}/20
          </div>
          <div className="text-lg text-gray-600 mt-2">
            {score}/{totalQuestions} bonnes réponses ({percentage.toFixed(0)}%)
          </div>
          {localScore?.totalTimeInSeconds && (
            <div className="text-base text-gray-500 mt-2">
              ⏱️ Temps réel : {Math.floor(localScore.totalTimeInSeconds / 60)}min {localScore.totalTimeInSeconds % 60}s
            </div>
          )}
        </div>

        {/* Questions and Corrections */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 animate-fade-in">
            Correction détaillée
          </h2>
          <div className="grid gap-6">
            {corrections.map((correction, index) => (
              <Card
                key={correction.id}
                className="shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in"
              >
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6">
                  <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-orange-500">Q{index + 1}</span>
                    {correction.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {correction.propositions.map((proposition) => {
                      const isCorrect =
                        proposition.id === correction.bonne_reponse_id;
                      const userAnswer = (correction as any).user_answer;
                      const isUserChoice = proposition.id === userAnswer;
                      const isCorrectUserChoice = isUserChoice && isCorrect;
                      const isIncorrectUserChoice = isUserChoice && !isCorrect;

                      let stateClass = "bg-gray-50 border-gray-200";
                      if (isCorrect) {
                        stateClass = "bg-green-50 border-green-200";
                      } else if (isIncorrectUserChoice) {
                        stateClass = "bg-red-50 border-red-200";
                      }

                      return (
                        <li
                          key={proposition.id}
                          className={`flex items-center p-4 rounded-xl border-2 ${stateClass} transition-all duration-200 hover:bg-opacity-80`}
                        >
                          <span className="flex-grow text-base leading-relaxed">
                            <span className="font-medium text-gray-800 mr-2">
                              {proposition.id}.
                            </span>
                            {proposition.text}
                          </span>
                          {isCorrectUserChoice && (
                            <div className="flex items-center text-green-600 px-3 py-2 bg-green-100 rounded-lg">
                              <CheckCircle className="w-6 h-6 mr-2" />
                              <span className="font-semibold">
                                Bonne réponse ✓ Votre choix
                              </span>
                            </div>
                          )}
                          {isCorrect && !isUserChoice && (
                            <div className="flex items-center text-green-600 px-3 py-2 bg-green-100 rounded-lg">
                              <CheckCircle className="w-6 h-6 mr-2" />
                              <span className="font-semibold">
                                Bonne réponse
                              </span>
                            </div>
                          )}
                          {isIncorrectUserChoice && (
                            <div className="flex items-center text-red-600 px-3 py-2 bg-red-100 rounded-lg">
                              <X className="w-6 h-6 mr-2" />
                              <span className="font-semibold">Votre choix</span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Boutons bas */}
        <div className="mb-8 mt-4 hover:scale-105 transform transition-all duration-300 ">
          <Button
            onClick={handleRetakeQuiz}
            variant="ghost"
            size="lg"
            className="text-gray-600 hover:text-gray-800 border-none rounded-xl px-8 py-3 text-lg font-medium transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Repasser le test
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <QuizExplanations
            explanations={explanations}
            open={isExplanationsOpen}
            onOpenChange={setIsExplanationsOpen}
          >
            <Button
              className="rounded-xl px-6 py-3 text-lg"
              variant="outline"
              size="lg"
            >
              Plus d'explication
            </Button>
          </QuizExplanations>
          <Button
            onClick={handleBackToHome}
            size="lg"
            className="rounded-xl px-8 py-3 text-lg"
          >
            Accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
