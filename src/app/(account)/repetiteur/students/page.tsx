"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Plus, Users, User, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { EleveCard } from "@/components/pages/repetiteur/eleve-card";
import { AddEleveModal } from "@/components/pages/repetiteur/add-eleve-modal";
import { SearchEleveModal } from "@/components/pages/repetiteur/search-eleve-modal";
import { useEleves, useSelectionnerEleve } from "@/services/hooks/repetiteur";
import { useNiveau } from "@/services/hooks/niveaux/useNiveau";
import { Eleve } from "@/services/controllers/types/common/repetiteur.types";
import { Alert } from "@/components/ui/alert";

const MAX_ELEVES = 3;

export default function ElevesPage() {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Récupérer les élèves
  const { data: elevesData, isLoading: isLoadingEleves } = useEleves();
  const { mutate: selectionnerEleve, isPending: isSelectingEleve } =
    useSelectionnerEleve();

  // Récupérer les niveaux pour le formulaire
  const { data: niveaux = [] } = useNiveau();

  const eleves = elevesData?.eleves || [];
  const eleveActif = elevesData?.eleve_actif;
  const hasReachedLimit = eleves.length >= MAX_ELEVES;

  const handleSelectEleve = (eleve: Eleve) => {
    if (isSelectingEleve) return;
    
    // Rediriger vers la page détails (la sélection se fera automatiquement là-bas)
    router.push(`/repetiteur/students/${eleve.id}`);
  };

  const handleBack = () => {
    router.push("/repetiteur/home");
  };

  if (isLoadingEleves) {
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

  if (eleves.length === 0) {
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
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#548C2F] leading-tight">
                Mes élèves
              </h1>
            </div>
          </div>

          {/* Description */}
          <div className="text-center mb-8 sm:mb-12 px-2">
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
              Ajoutez et gérez les profils de vos élèves pour suivre leurs
              progrès et adapter leur parcours d'apprentissage.
            </p>
          </div>

          <div className="px-4 sm:px-0">
            <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
              <div className="relative w-full max-w-2xl">
                <EmptyState
                  title="Aucun élève enregistré"
                  description="Ajoutez un élève pour suivre ses progrès et gérer son parcours scolaire"
                  icons={[
                    <User key="1" size={20} />,
                    <Users key="2" size={20} />,
                    <Plus key="3" size={20} />,
                  ]}
                  size="default"
                  theme="light"
                  variant="default"
                />
              </div>

              <div className="text-center px-4">
                <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
                  Cliquez ci-dessous pour ajouter votre premier élève
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    size="lg"
                    onClick={() => setIsSearchModalOpen(true)}
                    className="bg-white hover:bg-gray-50 text-[#548C2F] border-2 border-[#548C2F] px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-lg transition-all hover:shadow-xl"
                  >
                    <Search className="w-4 sm:w-5 h-5 mr-2" />
                    Rechercher un élève
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#548C2F] hover:bg-[#4a7829] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-lg transition-all hover:shadow-xl"
                  >
                    <Plus className="w-4 sm:w-5 h-5 mr-2" />
                    Ajouter manuellement
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <AddEleveModal
            open={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
            niveaux={niveaux}
          />

          <SearchEleveModal
            open={isSearchModalOpen}
            onOpenChange={setIsSearchModalOpen}
          />
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
            <span className="text-2xl sm:text-3xl">👨‍🎓</span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#548C2F] leading-tight">
              Mes élèves
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Gérez les profils de vos élèves et sélectionnez celui que vous
            souhaitez suivre. Les quiz et cours seront adaptés à leur niveau.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
          {/* Alerte limite atteinte */}
          {hasReachedLimit && (
            <div className="bg-amber-50 border-amber-200 w-full p-3">
              <div className="flex items-start gap-3 w-full">
                <div className="text-amber-600 font-semibold">⚠️</div>
                <div className="">
                  <h4 className="text-sm font-semibold text-amber-900">
                    Limite atteinte
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Vous avez atteint la limite de {MAX_ELEVES} élèves. Veuillez
                    retirer un élève pour en ajouter un nouveau.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bouton en haut quand il y a des élèves */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Mes Élèves
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {eleves.length} / {MAX_ELEVES} élève{eleves.length > 1 ? "s" : ""}{" "}
                enregistré{eleves.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                size="lg"
                onClick={() => setIsSearchModalOpen(true)}
                // disabled={hasReachedLimit}
                className="bg-white hover:bg-gray-50 text-[#548C2F] border-2 border-[#548C2F] disabled:opacity-50 disabled:cursor-not-allowed px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-2xl shadow-lg transition-all hover:shadow-xl whitespace-nowrap"
              >
                <Search className="w-4 sm:w-5 h-5 mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Rechercher</span>
                <span className="sm:hidden">Rechercher</span>
              </Button>
              <Button
                size="lg"
                onClick={() => setIsAddModalOpen(true)}
                // disabled={hasReachedLimit}
                className="bg-[#548C2F] hover:bg-[#4a7829] text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-2xl shadow-lg transition-all hover:shadow-xl whitespace-nowrap"
              >
                <Plus className="w-4 sm:w-5 h-5 mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Ajouter manuellement</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
            </div>
          </div>

          {/* Grille des élèves */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {eleves.map((eleve, index) => (
              <EleveCard
                key={eleve.id}
                eleve={eleve}
                index={index}
                isActive={eleveActif?.id === eleve.id}
                onClick={() => handleSelectEleve(eleve)}
              />
            ))}
          </div>

          {/* Information élève actif */}
          {eleveActif && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 p-4 sm:p-6 bg-[#F0F7EC] border border-[#C8E0B8] rounded-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E3F1D9] rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#548C2F]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    Élève sélectionné
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    Vous suivez actuellement{" "}
                    <span className="font-semibold text-[#548C2F]">
                      {eleveActif.prenom} {eleveActif.nom}
                    </span>{" "}
                    - {eleveActif.niveau?.libelle}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Les quiz et cours que vous créerez seront adaptés à son
                    niveau
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal d'ajout manuel */}
      <AddEleveModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        niveaux={niveaux}
      />

      {/* Modal de recherche */}
      <SearchEleveModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
      />
    </div>
  );
}

