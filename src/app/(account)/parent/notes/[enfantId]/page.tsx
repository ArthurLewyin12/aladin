"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { ArrowLeft, BookOpen, FileText, GitCompare } from "lucide-react";
import { useEnfants } from "@/services/hooks/parent";
import { useParentNotesClasse } from "@/services/hooks/notes-classe";
import { useEleveDashboard } from "@/services/hooks/stats/useEleveDashboard";
import { Spinner } from "@/components/ui/spinner";
import { ParentClasseNotesTab } from "@/components/pages/notes/parent/parent-classe-notes-tab";
import { ParentAladinNotesTab } from "@/components/pages/notes/parent/parent-aladin-notes-tab";
import { ParentComparisonTab } from "@/components/pages/notes/parent/parent-comparison-tab";

export default function ParentEnfantNotesPage() {
  const router = useRouter();
  const params = useParams();
  const enfantId = parseInt(params.enfantId as string);
  const [activeTab, setActiveTab] = useState("Notes de Classe");

  const { data: enfantsData, isLoading: enfantsLoading } = useEnfants();

  const enfantSelectionne = useMemo(() => {
    if (!enfantsData?.enfants || enfantsData.enfants.length === 0) return null;
    return enfantsData.enfants.find((e) => e.id === enfantId);
  }, [enfantsData, enfantId]);

  const handleBack = () => {
    router.push("/parent/notes");
  };

  if (enfantsLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!enfantSelectionne) {
    return (
      <div className="min-h-screen relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center">
            <p className="text-gray-600">Enfant non trouvé</p>
            <Button onClick={handleBack} className="mt-4">
              Retour
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-600 leading-tight">
              Notes de {enfantSelectionne.prenom} {enfantSelectionne.nom}
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Consultez les notes de classe de {enfantSelectionne.prenom}, ses
            notes de quiz Aladin et comparez sa progression sur les deux
            plateformes.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <AnimatedTabs tabs={tabs} onTabChange={setActiveTab} />
        </div>

        {/* Contenu principal basé sur l'onglet actif */}
        {activeTab === "Notes de Classe" && (
          <ParentClasseNotesTab enfantId={enfantId} />
        )}
        {activeTab === "Notes Aladin" && (
          <ParentAladinNotesTab enfantId={enfantId} />
        )}
        {activeTab === "Comparaison" && (
          <ParentComparisonTab enfantId={enfantId} />
        )}
      </div>
    </div>
  );
}
