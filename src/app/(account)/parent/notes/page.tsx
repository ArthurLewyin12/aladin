"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { ArrowLeft, Users, BarChart3 } from "lucide-react";
import { ParentNotesGlobalesTab } from "@/components/pages/notes/parent/parent-notes-globales-tab";
import { ParentNotesParEnfantTab } from "@/components/pages/notes/parent/parent-notes-par-enfant-tab";

export default function ParentNotesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Vue Globale");

  const handleBack = () => {
    router.push("/parent/home");
  };

  const tabs = [
    {
      label: "Vue Globale",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      label: "Par Enfant",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header avec bouton retour et titre */}
        <div
          className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
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
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-tight">
              Notes de vos enfants
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Suivez les notes de classe de vos enfants, consultez leurs
            statistiques et leur progression sur la plateforme.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <AnimatedTabs tabs={tabs} onTabChange={setActiveTab} />
        </div>

        {/* Contenu principal basé sur l'onglet actif */}
        {activeTab === "Vue Globale" && <ParentNotesGlobalesTab />}
        {activeTab === "Par Enfant" && <ParentNotesParEnfantTab />}
      </div>
    </div>
  );
}
