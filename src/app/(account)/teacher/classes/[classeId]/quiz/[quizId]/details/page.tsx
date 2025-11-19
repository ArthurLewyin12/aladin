"use client";

import { useParams, useRouter } from "next/navigation";
import { useClasse } from "@/services/hooks/professeur/useClasse";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, FileQuestion } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MathText } from "@/components/ui/MathText";

const QuizDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const classeId = Number(params.classeId);
  const quizId = Number(params.quizId);

  const { data: classeDetails, isLoading, isError } = useClasse(classeId);

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !classeDetails) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">
          Une erreur est survenue lors du chargement des détails.
        </p>
      </div>
    );
  }

  // Trouver le quiz dans la liste
  const quiz = classeDetails.quizzes?.find((q) => q.id === quizId);

  if (!quiz) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">Quiz introuvable.</p>
      </div>
    );
  }

  const isManual = quiz.is_manual;
  const qcmData = quiz.data?.qcm || [];
  const questionsApprofondissement =
    quiz.data?.questions_approfondissement || [];

  // Récupérer la matière du quiz
  const matieres = classeDetails.matieres || [];
  const matiere = matieres.find((m) => m.id === quiz.matiere_id)?.libelle || "";

  // Récupérer le chapitre du quiz (si disponible)
  const chapitre = quiz.chapitre?.libelle || "";

  // Formater la durée
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds} sec`;
    } else if (remainingSeconds === 0) {
      return `${minutes} min`;
    } else {
      return `${minutes} min ${remainingSeconds} sec`;
    }
  };

  // quiz.temps est le temps TOTAL du quiz en secondes
  const tempsTotal = quiz.temps;
  // Calculer le temps par question
  const tempsParQuestion =
    qcmData.length > 0 ? Math.floor(tempsTotal / qcmData.length) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header avec bouton retour, titre et badge */}
        <div
          className="mt-4 w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-10 py-4 mb-8 rounded-2xl"
          style={{
            backgroundImage: `url("/bg-2.png")`,
            backgroundSize: "180px 180px",
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full bg-white hover:bg-gray-50 w-10 h-10 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-600 leading-tight">
              {quiz.titre}
            </h1>
          </div>
          <Badge className={quiz.is_active ? "bg-green-600" : "bg-gray-500"}>
            {quiz.is_active ? "Publié" : "Brouillon"}
          </Badge>
        </div>

        {/* Badges et informations */}
        <div className="mb-8 px-4">

          <div className="flex flex-wrap gap-2 mb-4">
            {matiere && (
              <Badge
                variant="outline"
                className="text-base bg-blue-50 text-blue-700 border-blue-200"
              >
                {matiere}
              </Badge>
            )}
            {chapitre && (
              <Badge
                variant="outline"
                className="text-base bg-purple-50 text-purple-700 border-purple-200"
              >
                {chapitre}
              </Badge>
            )}
            <Badge variant="outline" className="text-base">
              {isManual ? "Quiz manuel" : "Quiz IA"}
            </Badge>
            <Badge variant="outline" className="text-base">
              {quiz.difficulte}
            </Badge>
            <Badge variant="outline" className="text-base">
              <FileQuestion className="w-4 h-4 mr-1" />
              {qcmData.length} question{qcmData.length > 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="text-gray-600">
            <p className="text-lg">
              <span className="font-semibold">
                {formatDuration(tempsParQuestion)}
              </span>{" "}
              par question
            </p>
            <p className="text-base">
              Durée totale : {formatDuration(tempsTotal)}
            </p>
          </div>
        </div>

        {/* Questions QCM */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 px-4">
            Questions à choix multiples
          </h2>

          {qcmData.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  Aucune question disponible
                </p>
              </CardContent>
            </Card>
          ) : (
            qcmData.map((question, index) => (
              <QuestionCard
                key={index}
                question={question}
                index={index}
                isManual={isManual}
              />
            ))
          )}
        </div>

        {/* Questions d'approfondissement */}
        {questionsApprofondissement.length > 0 && (
          <div className="space-y-6 px-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Justification des réponses
            </h2>

            {questionsApprofondissement.map((qa, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Question {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Question :</p>
                    <MathText text={qa.question} className="text-gray-900" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Réponse :</p>
                    <MathText
                      text={qa.reponse}
                      className="text-gray-800 whitespace-pre-wrap"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface QuestionCardProps {
  question: any;
  index: number;
  isManual: boolean;
}

const QuestionCard = ({ question, index, isManual }: QuestionCardProps) => {
  // Pour les quiz IA : { question, bonne_reponse, propositions: {a, b, c, d} }
  // Pour les quiz manuels : { question, reponses: [{texte, correct}] }

  let reponses: Array<{ texte: string; isCorrect: boolean }> = [];

  if (isManual) {
    // Format manuel
    reponses = (question.reponses || []).map((r: any) => ({
      texte: r.texte,
      isCorrect: r.correct,
    }));
  } else {
    // Format IA
    const propositions = question.propositions || {};
    const bonneReponse = question.bonne_reponse;

    reponses = Object.entries(propositions).map(([key, value]) => ({
      texte: `${key.toUpperCase()}. ${value}`,
      isCorrect: key === bonneReponse,
    }));
  }

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Question {index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4">
          <MathText
            text={question.question}
            className="text-gray-900 text-lg font-medium"
          />
        </div>

        <div className="space-y-2">
          <p className="font-medium text-gray-700 mb-3">Réponses :</p>
          {reponses.map((reponse, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 ${
                reponse.isCorrect
                  ? "bg-green-50 border-green-500"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {reponse.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              )}
              <MathText
                text={reponse.texte}
                className={`flex-1 ${
                  reponse.isCorrect
                    ? "text-green-900 font-semibold"
                    : "text-gray-700"
                }`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizDetailsPage;
