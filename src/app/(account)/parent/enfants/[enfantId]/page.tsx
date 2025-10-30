"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import {
  ArrowLeft,
  BookOpen,
  FileQuestion,
  User,
  Brain,
  BarChart3,
  Users,
} from "lucide-react";
import {
  useEnfants,
  useEnfantResume,
  useSelectionnerEnfant,
} from "@/services/hooks/parent";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { ParentCourseList } from "@/components/pages/parent/parent-course-list";
import { ParentQuizList } from "@/components/pages/parent/parent-quiz-list";
import { ParentGroupsList } from "@/components/pages/parent/parent-groups-list";
import { ParentStatistics } from "@/components/pages/parent/parent-statistics";

export default function EnfantProfilPage() {
  const params = useParams();
  const router = useRouter();
  const enfantId = params.enfantId as string;
  const [activeTab, setActiveTab] = useState("Cours");
  const [isEnfantReady, setIsEnfantReady] = useState(false);

  // Récupérer les données de l'enfant
  const { data: enfantsData, isLoading: isLoadingEnfants } = useEnfants();
  const { mutate: selectionnerEnfant, isPending: isSelecting } =
    useSelectionnerEnfant();

  const enfants = enfantsData?.enfants || [];
  const enfant = enfants.find((e) => e.id.toString() === enfantId);
  const enfantActif = enfantsData?.enfant_actif;

  // Vérifier et sélectionner l'enfant si nécessaire
  useEffect(() => {
    if (!isLoadingEnfants && enfant) {
      const isCurrentlyActive = enfantActif?.id.toString() === enfantId;

      if (!isCurrentlyActive && !isSelecting && !isEnfantReady) {
        // Sélectionner l'enfant
        selectionnerEnfant(
          {
            enfant_id: enfant.id,
            type: enfant.type as "utilisateur" | "manuel",
          },
          {
            onSuccess: async () => {
              // Attendre un peu que le backend soit à jour
              await new Promise((resolve) => setTimeout(resolve, 500));
              setIsEnfantReady(true);
            },
          },
        );
      } else if (isCurrentlyActive) {
        // L'enfant est déjà actif
        setIsEnfantReady(true);
      }
    }
  }, [
    enfant,
    enfantActif,
    enfantId,
    isLoadingEnfants,
    isSelecting,
    isEnfantReady,
    selectionnerEnfant,
  ]);

  // Ne charger les contenus que si l'enfant est prêt
  const { data: resumeData, isLoading: isLoadingResume } =
    useEnfantResume(isEnfantReady);

  const handleBack = () => {
    router.push("/parent/enfants");
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
      label: "Groupes",
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: "Statistiques",
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  if (isLoadingEnfants || isSelecting || !isEnfantReady) {
    return (
      <div className="min-h-screen relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
            {isSelecting && (
              <p className="ml-4 text-gray-600">Sélection de l'enfant...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!enfant) {
    return (
      <div className="min-h-screen relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Enfant non trouvé
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Cet enfant n'existe pas ou vous n'y avez pas accès
                </p>
                <Button
                  onClick={handleBack}
                  className="bg-purple-600 hover:bg-purple-700"
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

  // L'enfant est considéré comme actif si isEnfantReady est true (car on vient de le sélectionner)
  // ou si l'enfantActif correspond dans le cache
  const isEnfantActif = isEnfantReady || enfantActif?.id === enfant.id;

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

          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-600 leading-tight">
              {enfant.prenom} {enfant.nom}
            </h1>
          </div>

          {isEnfantActif && (
            <span className="text-xs sm:text-sm font-medium text-purple-700 bg-purple-100 px-3 py-1.5 rounded-full">
              Enfant actif
            </span>
          )}
        </div>

        {/* Info enfant */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Niveau</p>
                <p className="text-base font-semibold text-gray-900">
                  {enfant.niveau?.libelle || "Non défini"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-base font-semibold text-gray-900 truncate">
                  {enfant.email}
                </p>
              </div>
              {enfant.numero && (
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="text-base font-semibold text-gray-900">
                    {enfant.numero}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Statistiques si disponibles */}
          {resumeData?.statistiques && (
            <div className="mt-4 pt-4 border-t border-purple-200">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {resumeData.statistiques.nombre_groupes}
                  </p>
                  <p className="text-xs text-gray-600">Groupes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {resumeData.statistiques.nombre_quiz}
                  </p>
                  <p className="text-xs text-gray-600">Quiz</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {resumeData.statistiques.nombre_cours}
                  </p>
                  <p className="text-xs text-gray-600">Cours</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Avertissement si pas enfant actif */}
        {!isEnfantActif && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-900">
                  Enfant non actif
                </h4>
                <p className="text-sm text-amber-700 mt-1">
                  Cet enfant n'est pas sélectionné comme enfant actif. Certaines
                  fonctionnalités peuvent être limitées.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <AnimatedTabs tabs={tabs} onTabChange={setActiveTab} />
        </div>

        {/* Contenu basé sur l'onglet actif */}
        <div className="space-y-6">
          {activeTab === "Cours" && (
            <ParentCourseList enfant={enfant} isEnfantReady={isEnfantReady} />
          )}

          {activeTab === "Quiz" && (
            <ParentQuizList enfant={enfant} isEnfantReady={isEnfantReady} />
          )}

          {activeTab === "Groupes" && (
            <ParentGroupsList enfant={enfant} isEnfantReady={isEnfantReady} />
          )}

          {activeTab === "Statistiques" && (
            <ParentStatistics enfant={enfant} />
          )}
        </div>
      </div>
    </div>
  );
}
