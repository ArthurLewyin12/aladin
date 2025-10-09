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

export default function QuizResultPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.quizId);
  const [corrections, setCorrections] = useState<QuizQuestion[]>([]);
  const [isExplanationsOpen, setIsExplanationsOpen] = useState(false);

  useEffect(() => {
    const storedCorrections = sessionStorage.getItem("quizCorrections");
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>{" "}
        {/* Spinner plus soft et thémé */}
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
          className="rounded-xl px-6 py-3 text-lg"
        >
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  const score = notesData?.notes[0]?.note || 0;
  const totalQuestions = corrections.length || 0;
  const explanations = notesData?.questions_approfondissement || [];

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
        className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-6" // Padding up pour plus d'air
        style={{
          backgroundImage: `url("/bg-2.png")`,
          backgroundSize: "80px 80px",
        }}
      >
        <div className="flex items-center space-x-6">
          {" "}
          {/* Space-x boosté */}
          <Button
            variant="ghost"
            size="lg" // Taille up
            onClick={handleBackToHome}
            className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 border rounded-xl bg-white/80 px-6 py-3 shadow-sm hover:shadow-md transition-all duration-300" // Bord arrondi, animation soft, ombre
          >
            <ArrowLeft className="w-5 h-5" /> {/* Icône up */}
            <span className="text-base font-medium">Retour</span>{" "}
            {/* Texte up */}
          </Button>
          <h1 className="text-orange-600 text-5xl md:text-6xl font-bold">
            {" "}
            {/* Taille explosive pour impact */}
            Quiz Time !
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto max-w-4xl px-4 md:px-8 pt-4 pb-12">
        {" "}
        {/* Max-w up pour aération, pb up */}
        {/* Congratulations Message */}
        <div className="text-center mb-12 mt-8 animate-fade-in">
          {" "}
          {/* Animation d'entrée soft */}
          <div className="mb-6 flex items-center justify-center gap-4">
            {" "}
            {/* Gap up */}
            <span className="text-4xl">👏</span> {/* Emoji up */}
            <span className="text-2xl text-gray-700 font-semibold">
              {" "}
              {/* Texte up */}
              Mission accomplie
            </span>
            <span className="text-4xl">👏</span>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            {" "}
            {/* Texte up, max-w pour flow */}
            Tu as bien travaillé, et j'ai noté ce que tu maîtrises déjà et ce
            qu'on peut encore revoir ensemble.
          </p>
        </div>
        {/* Félicitations Section */}
        <div className="text-center mb-12 animate-fade-in">
          {" "}
          {/* Même anim */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="text-4xl">🎉</span>
            <h2 className="text-3xl font-bold text-gray-800">
              Félicitations
            </h2>{" "}
            {/* Titre up */}
            <span className="text-4xl">🎉</span>
          </div>
        </div>
        {/* Score Display */}
        <div className="text-center mb-8 animate-bounce-in">
          {" "}
          {/* Petite anim fun sur score */}
          <div className="text-5xl font-bold text-orange-500 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            {" "}
            {/* Gradient thématique */}
            Score : {score}/{totalQuestions}
          </div>
        </div>
        {/* Questions and Corrections */}
        <div className="space-y-8">
          {" "}
          {/* Space-y up pour respiration */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 animate-fade-in">
            {" "}
            {/* Titre up, mb up */}
            Correction détaillée
          </h2>
          <div className="grid gap-6">
            {" "}
            {/* Grid pour flex si besoin, mais space-y suffit */}
            {corrections.map((correction, index) => (
              <Card
                key={correction.id}
                className="shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in" // Ombres up, arrondis xl, hover lift soft
              >
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6">
                  {" "}
                  {/* Gradient subtil header */}
                  <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    {" "}
                    {/* Texte up, gap */}
                    <span className="text-orange-500">Q{index + 1}</span>{" "}
                    {/* Badge coloré */}
                    {correction.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {" "}
                    {/* Space-y up */}
                    {correction.propositions.map((proposition) => {
                      const isCorrect =
                        proposition.id === correction.bonne_reponse_id;
                      const isUserChoice =
                        proposition.id === (correction as any).user_answer;
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
                          className={`flex items-center p-4 rounded-xl border-2 ${stateClass} transition-all duration-200 hover:bg-opacity-80`} // Padding up, arrondis, hover soft
                        >
                          <span className="flex-grow text-base leading-relaxed">
                            {" "}
                            {/* Texte up */}
                            <span className="font-medium text-gray-800 mr-2">
                              {proposition.id}.
                            </span>
                            {proposition.text}
                          </span>
                          {isCorrect && (
                            <div className="flex items-center text-green-600 px-3 py-2 bg-green-100 rounded-lg">
                              <CheckCircle className="w-6 h-6 mr-2" />{" "}
                              {/* Icône up */}
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
        {/* Boutons bas - Structure originale restaurée */}
        <div className="mb-8 mt-4 hover:scale-105 transform transition-all duration-300 ">
          {" "}
          {/* mb-8 comme avant, centré */}
          <Button
            onClick={handleRetakeQuiz}
            variant="ghost"
            size="lg" // Taille up
            className="text-gray-600 hover:text-gray-800 border-none rounded-xl px-8 py-3 text-lg font-medium transition-all duration-300" // Couleurs ghost original, arrondis et anim soft
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Repasser le test
          </Button>
        </div>
        <div className="flex justify-between items-center">
          {" "}
          {/* Flex justify-between comme avant */}
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
