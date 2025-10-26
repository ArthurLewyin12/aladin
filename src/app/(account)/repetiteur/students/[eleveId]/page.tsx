"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { ArrowLeft, BookOpen, FileText, User, Brain } from "lucide-react";
import { useEleves, useEleveResume, useSelectionnerEleve } from "@/services/hooks/repetiteur";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RepetiteurCourseList } from "@/components/pages/repetiteur/repetiteur-course-list";
import { RepetiteurQuizList } from "@/components/pages/repetiteur/repetiteur-quiz-list";
import { AladinNotesTab } from "@/components/pages/notes/aladin-notes-tab";
import { ClasseNotesTab } from "@/components/pages/notes/classe-notes-tab";
import { ComparisonTab } from "@/components/pages/notes/comparison-tab";
import { AnimatedTabs as NestedTabs } from "@/components/ui/animated-tabs";
import { GitCompare } from "lucide-react";

export default function EleveDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eleveId = params.eleveId as string;
  
  // Utiliser nuqs pour synchroniser l'onglet avec l'URL
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("cours")
  );
  const [notesTab, setNotesTab] = useState("Notes de Classe");
  const [isEleveReady, setIsEleveReady] = useState(false);

  // Récupérer les données de l'élève
  const { data: elevesData, isLoading: isLoadingEleves } = useEleves();
  const { mutate: selectionnerEleve, isPending: isSelecting } = useSelectionnerEleve();
  
  const eleves = elevesData?.eleves || [];
  const eleve = eleves.find((e) => e.id.toString() === eleveId);
  const eleveActif = elevesData?.eleve_actif;
  
  // Vérifier et sélectionner l'élève si nécessaire
  useEffect(() => {
    if (!isLoadingEleves && eleve) {
      const isCurrentlyActive = eleveActif?.id.toString() === eleveId;
      
      if (isCurrentlyActive) {
        // L'élève est déjà actif
        if (!isEleveReady) {
          setIsEleveReady(true);
        }
      } else if (!isSelecting && !isEleveReady) {
        // Sélectionner l'élève seulement s'il n'est pas en cours de sélection
        selectionnerEleve({
          eleve_id: eleve.id,
          type: eleve.type
        }, {
          onSuccess: async () => {
            // Attendre que le backend ET React Query soient à jour
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsEleveReady(true);
          }
        });
      }
    }
  }, [eleve, eleveActif, eleveId, isLoadingEleves]);

  // Ne charger les contenus que si l'élève est prêt
  const { data: resumeData, isLoading: isLoadingResume } = useEleveResume(isEleveReady);
  const resume = resumeData?.resume;

  const handleBack = () => {
    router.push("/repetiteur/students");
  };

  const tabs = [
    {
      label: "Cours",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      label: "Quiz",
      icon: <Brain className="w-4 h-4" />,
    },
    {
      label: "Notes",
      icon: <FileText className="w-4 h-4" />,
    },
  ];
  
  // Mapper les labels affichés aux valeurs d'URL
  const tabMapping: Record<string, string> = {
    "Cours": "cours",
    "Quiz": "quiz",
    "Notes": "notes"
  };
  
  const reversTabMapping: Record<string, string> = {
    "cours": "Cours",
    "quiz": "Quiz",
    "notes": "Notes"
  };
  
  const handleTabChange = (label: string) => {
    setActiveTab(tabMapping[label] || "cours");
  };

  if (isLoadingEleves || isSelecting || !isEleveReady) {
    return (
      <div className="min-h-screen relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
            {isSelecting && (
              <p className="ml-4 text-gray-600">Sélection de l'élève...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!eleve) {
    return (
      <div className="min-h-screen relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Élève non trouvé
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Cet élève n'existe pas ou vous n'y avez pas accès
                </p>
                <Button
                  onClick={handleBack}
                  className="bg-[#548C2F] hover:bg-[#4a7829]"
                >
                  Retour à la liste
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // L'élève est considéré comme actif si isEleveReady est true (car on vient de le sélectionner)
  // ou si l'eleveActif correspond dans le cache
  const isEleveActif = isEleveReady || eleveActif?.id === eleve.id;

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

          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <span className="text-2xl sm:text-3xl">👨‍🎓</span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#548C2F] leading-tight">
              {eleve.prenom} {eleve.nom}
            </h1>
          </div>

          {isEleveActif && (
            <span className="text-xs sm:text-sm font-medium text-[#548C2F] bg-[#E3F1D9] px-3 py-1.5 rounded-full">
              Élève actif
            </span>
          )}
        </div>

        {/* Info élève */}
        <div className="bg-[#F0F7EC] border border-[#C8E0B8] rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 bg-[#E3F1D9] rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-[#548C2F]" />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Niveau</p>
                <p className="text-base font-semibold text-gray-900">
                  {eleve.niveau?.libelle || "Non défini"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-base font-semibold text-gray-900 truncate">
                  {eleve.email}
                </p>
              </div>
              {eleve.numero && (
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="text-base font-semibold text-gray-900">
                    {eleve.numero}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Statistiques si disponibles */}
          {resume?.statistiques && (
            <div className="mt-4 pt-4 border-t border-[#C8E0B8]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#548C2F]">
                    {resume.statistiques.nombre_groupes}
                  </p>
                  <p className="text-xs text-gray-600">Groupes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#548C2F]">
                    {resume.statistiques.nombre_quiz}
                  </p>
                  <p className="text-xs text-gray-600">Quiz</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#548C2F]">
                    {resume.statistiques.nombre_cours}
                  </p>
                  <p className="text-xs text-gray-600">Cours</p>
                </div>
                {resume.statistiques.moyenne_generale !== undefined && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#548C2F]">
                      {resume.statistiques.moyenne_generale.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-600">Moyenne</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avertissement si pas élève actif */}
        {!isEleveActif && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-amber-600 font-semibold">⚠️</div>
              <div>
                <h4 className="text-sm font-semibold text-amber-900">
                  Élève non actif
                </h4>
                <p className="text-sm text-amber-700 mt-1">
                  Cet élève n'est pas sélectionné comme élève actif. Certaines
                  fonctionnalités peuvent être limitées.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <AnimatedTabs 
            tabs={tabs} 
            onTabChange={handleTabChange}
            activeTab={reversTabMapping[activeTab]}
          />
        </div>

        {/* Contenu basé sur l'onglet actif */}
        <div className="space-y-6">
          {activeTab === "cours" && (
            <RepetiteurCourseList eleve={eleve} isEleveReady={isEleveReady} />
          )}

          {activeTab === "quiz" && (
            <RepetiteurQuizList eleve={eleve} isEleveReady={isEleveReady} />
          )}

          {activeTab === "notes" && (
            <div className="space-y-6">
              {/* Sous-onglets pour Notes */}
              <div className="flex justify-center">
                <NestedTabs 
                  tabs={[
                    { label: "Notes de Classe", icon: <FileText className="w-4 h-4" /> },
                    { label: "Notes Aladin", icon: <BookOpen className="w-4 h-4" /> },
                    { label: "Comparaison", icon: <GitCompare className="w-4 h-4" /> },
                  ]}
                  onTabChange={setNotesTab}
                />
              </div>

              {/* Contenu des sous-onglets en mode lecture seule */}
              {notesTab === "Notes de Classe" && <ClasseNotesTab readOnly />}
              {notesTab === "Notes Aladin" && <AladinNotesTab />}
              {notesTab === "Comparaison" && <ComparisonTab />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

