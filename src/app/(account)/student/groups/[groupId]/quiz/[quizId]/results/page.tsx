"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface CorrectionQCM {
  question: string;
  propositions: Record<string, string>;
  bonne_reponse: string;
}

interface Corrections {
  qcm: CorrectionQCM[];
  questions_approfondissement: any[]; // Define this type if needed
}

export default function GroupQuizResultPage() {
  const router = useRouter();
  const params = useParams();
  const { groupId, quizId } = params;
  const [corrections, setCorrections] = useState<Corrections | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    try {
      const storedCorrections = sessionStorage.getItem("groupQuizCorrections");
      if (storedCorrections) {
        const parsedCorrections = JSON.parse(storedCorrections);
        setCorrections(parsedCorrections);
        // Note: The score is not directly available here, we would need to pass it via sessionStorage as well
        // For now, we can't reliably display the score.
      } else {
        toast.error("Impossible de récupérer les résultats du quiz.");
        router.push(`/student/groups/${groupId}`);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des résultats.");
      router.push(`/student/groups/${groupId}`);
    }
  }, [router, groupId]);

  const handleBackToGroup = () => {
    router.push(`/student/groups/${groupId}`);
  };

  if (!corrections) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Chargement des résultats...
      </div>
    );
  }

  const totalQuestions = corrections.qcm.length;

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
      >
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
            Résultats du Quiz
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
            Tu as bien travaillé ! Voici la correction de ton quiz.
          </p>
        </div>

        {/* Score Display (Placeholder) */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-orange-500">
            {/* TODO: Pass score via sessionStorage to display it here */}
            Nombre de questions : {totalQuestions}
          </div>
        </div>

        {/* Questions and Corrections */}
        <div className="space-y-4 mb-6">
          {corrections.qcm.map((qcmItem: CorrectionQCM, index: number) => (
            <Card
              key={index}
              className="bg-blue-50 border-blue-200 shadow-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Question {index + 1}: {qcmItem.question}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-green-700 font-medium">
                        Bonne réponse: {qcmItem.propositions[qcmItem.bonne_reponse]}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end items-center">
          <Button onClick={handleBackToGroup}>Retour au groupe</Button>
        </div>
      </div>
    </div>
  );
}
