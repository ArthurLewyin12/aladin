"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { ArrowLeft, BookOpen, FileText, GitCompare } from "lucide-react";
import { AladinNotesTab } from "@/components/pages/notes/aladin-notes-tab";
import { ClasseNotesTab } from "@/components/pages/notes/classe-notes-tab";
import { ComparisonTab } from "@/components/pages/notes/comparison-tab";

export default function NotesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Notes de Classe");

  const handleBack = () => {
    router.push("/student/home");
  };

  const tabs = [
    {
      label: "Notes de Classe",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      label: "Notes Aladin",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      label: "Comparaison",
      icon: <GitCompare className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header avec bouton retour et titre */}
        <div
          className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
          style={{
            backgroundImage: `url("/bg-2.png")`,
            backgroundSize: "180px 180px",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full bg-white hover:bg-gray-50 w-9 h-9 sm:w-10 sm:h-10 shadow-sm flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3">
            {/*<span className="text-2xl sm:text-3xl">📊</span>*/}
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-tight">
              Tes Notes !
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Consulte tes notes de quiz Aladin, ajoute tes notes de classe et
            compare ta progression sur les deux plateformes pour mieux suivre
            ton évolution.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <AnimatedTabs tabs={tabs} onTabChange={setActiveTab} />
        </div>

        {/* Contenu principal basé sur l'onglet actif */}
        {activeTab === "Notes de Classe" && <ClasseNotesTab />}
        {activeTab === "Notes Aladin" && <AladinNotesTab />}

        {activeTab === "Comparaison" && <ComparisonTab />}
      </div>
    </div>
  );
}
