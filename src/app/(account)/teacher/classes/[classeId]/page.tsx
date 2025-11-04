
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useClasse } from "@/services/hooks/professeur/useClasse";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, BookText, Upload, Users, MessageSquarePlus } from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { QuizAISection } from "@/components/pages/teacher-classes/quiz-ai-section";
import { SendMessageModal } from "@/components/pages/teacher-classes/send-message-modal";
import { StudentSection } from "@/components/pages/teacher-classes/student-section";

const ClasseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const classeId = Number(params.classeId);

  const [activeTab, setActiveTab] = useState("Quiz Spontané avec AI");
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);

  const { data: classeDetails, isLoading, isError } = useClasse(classeId);

  const handleBack = () => {
    router.back();
  };

  const tabs = [
    { label: "Quiz Spontané avec AI", icon: <Brain className="w-4 h-4" /> },
    { label: "Quiz manuelle", icon: <BookText className="w-4 h-4" /> },
    { label: "Document téléchargé", icon: <Upload className="w-4 h-4" /> },
    { label: "Elève", icon: <Users className="w-4 h-4" /> },
  ];

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
          Une erreur est survenue lors du chargement des détails de la classe.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header avec bouton retour et titre */}
          <div
            className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 mb-8"
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
            </div>
          </div>

          {/* Nom de la classe et bouton de message */}
          <div className="flex justify-between items-center mb-8 px-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-500">
              {classeDetails.nom}
            </h1>
            <Button onClick={() => setMessageModalOpen(true)} className="bg-[#2C3E50] hover:bg-[#1a252f] text-white">
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              Passer un message
            </Button>
          </div>

          {/* Description */}
          <div className="mb-8 px-4">
            <p className="text-gray-600 text-base sm:text-lg max-w-4xl leading-relaxed">
              {classeDetails.description || "Aucune description pour cette classe."}
            </p>
          </div>

          {/* Onglets */}
          <div className="mb-8 flex justify-center">
            <AnimatedTabs tabs={tabs} onTabChange={setActiveTab} activeTab={activeTab} />
          </div>

          {/* Contenu des onglets */}
          <div>
            {activeTab === "Quiz Spontané avec AI" && (
              <QuizAISection classeDetails={classeDetails} />
            )}
            {activeTab === "Quiz manuelle" && (
              <div>Contenu pour Quiz manuelle</div>
            )}
            {activeTab === "Document téléchargé" && (
              <div>Contenu pour Document téléchargé</div>
            )}
            {activeTab === "Elève" && (
              <StudentSection classeDetails={classeDetails} />
            )}
          </div>
        </div>
      </div>

      <SendMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        classeId={classeId}
      />
    </>
  );
};

export default ClasseDetailPage;
