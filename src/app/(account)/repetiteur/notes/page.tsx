"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { ArrowLeft, Users, BarChart3, User } from "lucide-react";
import { useEleves } from "@/services/hooks/repetiteur";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";

export default function RepetiteurNotesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Vue Globale");
  const { data: elevesData, isLoading } = useEleves();

  const eleveActif = elevesData?.eleve_actif;

  const handleBack = () => {
    router.push("/repetiteur/home");
  };

  const tabs = [
    {
      label: "Vue Globale",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      label: "Par Élève",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-2xl sm:text-3xl">📝</span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#548C2F] leading-tight">
              Notes des élèves
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Suivez les notes de classe de vos élèves, consultez leurs statistiques
            et leur progression sur la plateforme.
          </p>
        </div>

        {/* Vérification élève actif */}
        {!eleveActif ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun élève sélectionné
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Vous devez sélectionner un élève pour consulter ses notes
                </p>
                <Button
                  onClick={() => router.push("/repetiteur/students")}
                  className="bg-[#548C2F] hover:bg-[#4a7829]"
                >
                  Sélectionner un élève
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Info élève actif */}
            <div className="bg-[#F0F7EC] border border-[#C8E0B8] rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E3F1D9] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#548C2F]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Notes de l'élève</p>
                  <h3 className="text-lg font-semibold text-[#548C2F]">
                    {eleveActif.prenom} {eleveActif.nom}
                  </h3>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <AnimatedTabs tabs={tabs} onTabChange={setActiveTab} />
            </div>

            {/* Contenu */}
            <div className="space-y-6">
              {activeTab === "Vue Globale" && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Statistiques globales
                      </h3>
                      <p className="text-sm text-gray-600">
                        Les statistiques de {eleveActif.prenom} seront affichées ici
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "Par Élève" && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Détail des notes
                      </h3>
                      <p className="text-sm text-gray-600">
                        Le détail des notes par matière sera affiché ici
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

