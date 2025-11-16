"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuizGrades } from "@/services/hooks/professeur/useQuizGrades";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Users, Award, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuizGradesPage = () => {
  const params = useParams();
  const router = useRouter();
  const quizId = Number(params.quizId);
  const classeId = Number(params.classeId);

  const { data: gradesData, isLoading, isError } = useQuizGrades(quizId);

  const handleBack = () => {
    router.push(`/teacher/classes/${classeId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !gradesData) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full bg-white hover:bg-gray-50 w-10 h-10 shadow-sm mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="rounded-3xl border-4 border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600 text-lg font-semibold">
              Une erreur est survenue lors du chargement des notes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { quiz, classe, notes, statistiques, corrections } = gradesData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full bg-white hover:bg-gray-50 w-12 h-12 shadow-lg mb-6 border-4 border-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          {/* Titre et infos du quiz */}
          <div className="bg-white rounded-3xl border-4 border-gray-200 p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  {quiz.titre}
                </h1>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold bg-blue-100 text-blue-800 border-2 border-blue-200">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {classe.nom}
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold bg-purple-100 text-purple-800 border-2 border-purple-200">
                    {quiz.difficulte}
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold bg-green-100 text-green-800 border-2 border-green-200">
                    {quiz.nombre_questions} question{quiz.nombre_questions > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Total élèves */}
          <Card className="rounded-3xl border-4 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total élèves</p>
                  <p className="text-4xl font-bold text-blue-900 mt-2">
                    {statistiques.total_notes}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-200 flex items-center justify-center">
                  <Users className="w-7 h-7 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Moyenne générale */}
          <Card className="rounded-3xl border-4 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Moyenne</p>
                  <p className="text-4xl font-bold text-yellow-900 mt-2">
                    {statistiques.moyenne_generale.toFixed(1)}/20
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-yellow-200 flex items-center justify-center">
                  <Award className="w-7 h-7 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Note maximale - Commenté */}
          {/* <Card className="rounded-3xl border-4 border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Note max</p>
                  <p className="text-4xl font-bold text-green-900 mt-2">
                    {statistiques.note_max.toFixed(1)}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-green-200 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Note minimale - Commenté */}
          {/* <Card className="rounded-3xl border-4 border-red-200 bg-gradient-to-br from-red-50 to-red-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Note min</p>
                  <p className="text-4xl font-bold text-red-900 mt-2">
                    {statistiques.note_min.toFixed(1)}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-red-200 flex items-center justify-center">
                  <TrendingDown className="w-7 h-7 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Tableau des notes */}
        <Card className="rounded-3xl border-4 border-gray-200 bg-white shadow-xl mb-8">
          <CardHeader className="border-b-4 border-gray-100 px-8 py-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Notes des élèves ({notes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {notes.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  Aucun élève n'a encore passé ce quiz
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Prénom
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-8 py-5 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y-4 divide-gray-100">
                    {notes.map((note, index) => {
                      const noteValue = note.note;
                      const noteColor =
                        noteValue >= 16
                          ? "text-green-700 bg-green-100 border-green-300"
                          : noteValue >= 12
                          ? "text-blue-700 bg-blue-100 border-blue-300"
                          : noteValue >= 10
                          ? "text-yellow-700 bg-yellow-100 border-yellow-300"
                          : "text-red-700 bg-red-100 border-red-300";

                      return (
                        <tr
                          key={note.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-8 py-6 whitespace-nowrap text-sm font-semibold text-gray-600">
                            {index + 1}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-base font-bold text-gray-900">
                            {note.eleve.nom}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-base font-medium text-gray-700">
                            {note.eleve.prenom}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600">
                            {note.eleve.mail}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-center">
                            <span
                              className={`inline-flex items-center justify-center px-4 py-2 rounded-2xl text-lg font-bold border-2 min-w-[80px] ${noteColor}`}
                            >
                              {noteValue.toFixed(1)}/20
                            </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600">
                            {new Date(note.created_at).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Corrections - Commenté */}
        {/* <Card className="rounded-3xl border-4 border-gray-200 bg-white shadow-xl">
          <CardHeader className="border-b-4 border-gray-100 px-8 py-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Correction du quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {corrections.questions.map((question, index) => (
              <div
                key={index}
                className="rounded-3xl border-4 border-blue-100 bg-blue-50 p-6"
              >
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  Question {index + 1}: {question.question}
                </h3>
                {question.reponses && question.reponses.length > 0 ? (
                  <div className="space-y-3">
                    {question.reponses.map((reponse, rIndex) => (
                      <div
                        key={rIndex}
                        className={`rounded-2xl border-2 p-4 ${
                          reponse.correct
                            ? "bg-green-100 border-green-300"
                            : "bg-gray-100 border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              reponse.correct
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          >
                            {reponse.correct && (
                              <span className="text-white text-sm">✓</span>
                            )}
                          </div>
                          <p
                            className={`font-medium ${
                              reponse.correct
                                ? "text-green-900"
                                : "text-gray-700"
                            }`}
                          >
                            {reponse.texte}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    Correction non disponible pour cette question
                  </p>
                )}
              </div>
            ))}

            {corrections.questions_approfondissement.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Questions d'approfondissement
                </h3>
                <div className="space-y-4">
                  {corrections.questions_approfondissement.map((qa, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border-4 border-purple-100 bg-purple-50 p-6"
                    >
                      <p className="font-bold text-lg text-purple-900 mb-3">
                        {qa.question}
                      </p>
                      <div className="rounded-2xl bg-white border-2 border-purple-200 p-4">
                        <p className="text-gray-700">{qa.reponse}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default QuizGradesPage;
