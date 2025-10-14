"use client";

import { useParams, useRouter } from "next/navigation";
import { useGroupQuizNotes } from "@/services/hooks/groupes/useGroupQuizNotes";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { convertScoreToNote } from "@/lib/quiz-score";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
  TrendingUp,
  Users,
} from "lucide-react";

// Composant Card pour les notes (Mobile)
const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

interface UserNoteCardProps {
  note: {
    id: number;
    note: number;
    user: {
      prenom: string;
      nom: string;
    };
  };
  index: number;
  totalQuestions: number;
}

const UserNoteCard = ({ note, index, totalQuestions }: UserNoteCardProps) => {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];
  const noteSur20 = convertScoreToNote(note.note, totalQuestions);
  const isSuccess = noteSur20 >= 10;

  return (
    <div
      className={`${bgColor} rounded-2xl p-5 shadow-sm transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-700 font-bold text-sm">
            {index + 1}
          </span>
          <div>
            <p className="font-semibold text-gray-900">
              {note.user.prenom} {note.user.nom}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-xs text-gray-600 mb-1">Note obtenue</p>
          <p className="text-2xl font-bold text-gray-900">{noteSur20}/20</p>
          <p className="text-xs text-gray-500 mt-1">({note.note}/{totalQuestions} bonnes réponses)</p>
        </div>

        {isSuccess ? (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
            <CheckCircle2 className="w-3 h-3" />
            Réussi
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
            <XCircle className="w-3 h-3" />
            Échoué
          </span>
        )}
      </div>
    </div>
  );
};

export const GroupQuizNotes = () => {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const quizId = params.quizId as string;

  const {
    data: notesData,
    isLoading,
    isError,
  } = useGroupQuizNotes({ groupeId: Number(groupId), quizId: Number(quizId) });

  const handleBack = () => {
    router.back();
  };

  // Calculer les statistiques
  const getStats = (totalQuestions: number) => {
    if (!notesData?.notes.length) return null;

    // Convertir tous les scores bruts en notes sur 20
    const notesSur20 = notesData.notes.map((n) => convertScoreToNote(n.note, totalQuestions));
    const moyenne = (notesSur20.reduce((a, b) => a + b, 0) / notesSur20.length).toFixed(2);
    const meilleureNote = Math.max(...notesSur20);
    const tauxReussite = (
      (notesSur20.filter((n) => n >= 10).length / notesSur20.length) *
      100
    ).toFixed(0);

    return { moyenne, meilleureNote, tauxReussite, total: notesSur20.length };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !notesData) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">
          Une erreur est survenue lors du chargement des notes.
        </p>
      </div>
    );
  }

  const { notes, corrections, questions_approfondissement } = notesData;
  const totalQuestions = corrections?.length || 0;
  const stats = getStats(totalQuestions);

  return (
    <div
      className="min-h-screen bg-[#F5F4F1]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e0e0e0' fill-opacity='0.2'%3E%3Cpath d='M20 20h10v10H20zM40 40h10v10H40zM60 20h10v10H60zM80 60h10v10H80zM30 70h10v10H30zM70 30h10v10H70zM50 50h10v10H50z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "100px 100px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full bg-white hover:bg-gray-50 w-10 h-10 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
              Résultats du Quiz
            </h1>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Participants
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Moyenne</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.moyenne}/20
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Meilleure Note
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.meilleureNote}/20
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Taux de Réussite
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.tauxReussite}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section des Notes */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Notes des Participants
          </h2>
          {notes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucune note disponible pour ce quiz.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note, index) => (
                <UserNoteCard key={note.id} note={note} index={index} totalQuestions={totalQuestions} />
              ))}
            </div>
          )}
        </div>

        {/* Section des Corrections (Questions à choix multiples) */}
        {/* TODO: Affichage des corrections à implémenter une fois la structure des données clarifiée */}
        {/*
        {corrections && corrections.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Correction Détaillée - Questions QCM
            </h2>
            <div className="space-y-6">
              {corrections.map((correction, index) => (
                <div
                  key={correction.id || index}
                  className="border border-gray-100 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-base sm:text-lg leading-relaxed">
                        {correction.question}
                      </p>
                    </div>
                  </div>

                  {/* Liste des réponses *\/}
                  {correction.reponses && correction.reponses.length > 0 && (
                    <div className="ml-0 sm:ml-11 mt-3 space-y-2">
                      {correction.reponses.map((reponse, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border flex items-start gap-2 ${
                            reponse.correct
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          {reponse.correct ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <CircleDot className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          )}
                          <p className={`text-sm ${
                            reponse.correct ? 'text-green-900 font-medium' : 'text-gray-700'
                          }`}>
                            {reponse.texte}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Explication si disponible *\/}
                  {correction.explication && (
                    <div className="ml-0 sm:ml-11 mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        💡 Explication
                      </p>
                      <p className="text-sm text-blue-700">
                        {correction.explication}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        */}

        {/* Section Questions d'Approfondissement */}
        {/* TODO: Affichage des questions d'approfondissement à implémenter */}
        {/*
        {questions_approfondissement && questions_approfondissement.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Questions d'Approfondissement
            </h2>
            <div className="space-y-6">
              {questions_approfondissement.map((question, index) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-base sm:text-lg leading-relaxed">
                        {question.question}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Question ouverte - Réponse libre
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        */}
      </div>
    </div>
  );
};
