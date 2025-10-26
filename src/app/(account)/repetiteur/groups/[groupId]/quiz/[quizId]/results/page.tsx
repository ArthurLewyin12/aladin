"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";
// import { toast } from "sonner";
import { toast } from "@/lib/toast";

interface CorrectionQCM {
  question: string;
  propositions: Record<string, string>;
  bonne_reponse: string;
}

// Composant Card pour une question QCM
const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

interface QuestionCardProps {
  qcmItem: CorrectionQCM;
  index: number;
}

const QuestionCard = ({ qcmItem, index }: QuestionCardProps) => {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <div
      className={`${bgColor} rounded-2xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md`}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-700 font-bold text-sm flex-shrink-0">
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-base sm:text-lg leading-relaxed">
            {qcmItem.question}
          </p>
        </div>
      </div>

      {/* Affichage de toutes les propositions */}
      <div className="space-y-2 mb-4">
        {Object.entries(qcmItem.propositions).map(([key, value]) => {
          const isCorrect = key === qcmItem.bonne_reponse;
          return (
            <div
              key={key}
              className={`p-3 rounded-lg border flex items-start gap-2 ${
                isCorrect
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    isCorrect ? "text-green-900 font-medium" : "text-gray-700"
                  }`}
                >
                  <span className="font-semibold mr-2">{key}.</span>
                  {value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function GroupQuizResultPage() {
  const router = useRouter();
  const params = useParams();
  const { groupId, quizId } = params;
  const [corrections, setCorrections] = useState<CorrectionQCM[] | null>(null);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedCorrections = sessionStorage.getItem("groupQuizCorrections");
      const storedScore = sessionStorage.getItem("groupQuizScore");

      console.log("=== DEBUG GROUP QUIZ RESULTS PAGE ===");
      console.log("groupQuizCorrections depuis sessionStorage:", storedCorrections);
      console.log("groupQuizScore depuis sessionStorage:", storedScore);

      if (storedCorrections) {
        const parsedCorrections = JSON.parse(storedCorrections);
        console.log("Corrections parsées:", parsedCorrections);
        console.log("Nombre de questions:", parsedCorrections?.length);
        setCorrections(parsedCorrections);
      } else {
        console.warn("⚠️ Pas de corrections dans sessionStorage!");
        toast({
          variant: "error",
          message: "Impossible de récupérer les résultats du quiz.",
        });
        router.push(`/repetiteur/groups/${groupId}`);
      }

      if (storedScore) {
        const parsedScore = parseFloat(storedScore);
        console.log("Score parsé:", parsedScore);
        setScore(parsedScore);
      } else {
        console.warn("⚠️ Pas de score dans sessionStorage!");
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des résultats:", error);
      toast({
        variant: "error",
        message: "Erreur lors du chargement des résultats.",
      });
      router.push(`/repetiteur/groups/${groupId}`);
    }
  }, [router, groupId]);

  const handleBackToGroup = () => {
    router.push(`/repetiteur/groups/${groupId}`);
  };

  if (!corrections) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F5F4F1]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  const totalQuestions = corrections.length;
  const hasScore = score !== null;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToGroup}
              className="rounded-full bg-white hover:bg-gray-50 w-10 h-10 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
              Résultats du Quiz
            </h1>
          </div>
        </div>

        {/* Message de félicitations */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="text-4xl">👏</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Mission accomplie !
            </h2>
            <span className="text-4xl">👏</span>
          </div>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Tu as bien travaillé ! Voici la correction détaillée de ton quiz.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {hasScore && (
            <div className="bg-white p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ta note</p>
                  <p className="text-2xl font-bold text-gray-900">{score}/20</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Questions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalQuestions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="text-lg font-bold text-gray-900">QCM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Corrections */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Correction Détaillée
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {corrections.map((qcmItem: CorrectionQCM, index: number) => (
              <QuestionCard key={index} qcmItem={qcmItem} index={index} />
            ))}
          </div>
        </div>

        {/* Bouton retour */}
        <div className="flex justify-center sm:justify-end">
          <Button
            onClick={handleBackToGroup}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-all hover:shadow-md"
          >
            Retour au groupe
          </Button>
        </div>
      </div>
    </div>
  );
}
