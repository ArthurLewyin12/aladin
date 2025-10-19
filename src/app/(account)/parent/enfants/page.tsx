"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Plus, Users, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { EnfantCard } from "@/components/pages/parent/enfant-card";
import { AddEnfantModal } from "@/components/pages/parent/add-enfant-modal";
import { useEnfants, useSelectionnerEnfant } from "@/services/hooks/parent";
import { useNiveau } from "@/services/hooks/niveaux/useNiveau";
import { Enfant } from "@/services/controllers/types/common/parent.types";

export default function EnfantsPage() {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Récupérer les enfants
  const { data: enfantsData, isLoading: isLoadingEnfants } = useEnfants();
  const { mutate: selectionnerEnfant, isPending: isSelectingEnfant } =
    useSelectionnerEnfant();

  // Récupérer les niveaux pour le formulaire
  const { data: niveaux = [] } = useNiveau();

  const enfants = enfantsData?.enfants || [];
  const enfantActif = enfantsData?.enfant_actif;

  const handleSelectEnfant = (enfant: Enfant) => {
    if (isSelectingEnfant) return;
    selectionnerEnfant({ enfant_id: enfant.id });
  };

  const handleBack = () => {
    router.push("/parent/home");
  };

  if (isLoadingEnfants) {
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

  if (enfants.length === 0) {
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
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-600 leading-tight">
                Mes enfants
              </h1>
            </div>
          </div>

          {/* Description */}
          <div className="text-center mb-8 sm:mb-12 px-2">
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
              Ajoutez et gérez les profils de vos enfants pour suivre leurs
              progrès et adapter leur parcours d'apprentissage.
            </p>
          </div>

          <div className="px-4 sm:px-0">
            <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
              <div className="relative w-full max-w-2xl">
                <EmptyState
                  title="Aucun enfant enregistré"
                  description="Ajoutez un enfant pour suivre ses progrès et gérer son parcours scolaire"
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
                  Cliquez ci-dessous pour ajouter votre premier enfant
                </p>

                <Button
                  size="lg"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-lg transition-all hover:shadow-xl w-full sm:w-auto"
                >
                  <Plus className="w-4 sm:w-5 h-5 mr-2" />
                  Ajouter mon premier enfant
                </Button>
              </div>
            </div>
          </div>

          <AddEnfantModal
            open={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
            niveaux={niveaux}
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
            <span className="text-2xl sm:text-3xl">👨‍👩‍👧‍👦</span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-600 leading-tight">
              Mes enfants
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Gérez les profils de vos enfants et sélectionnez celui que vous
            souhaitez suivre. Les quiz et cours seront adaptés à leur niveau.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
          {/* Bouton en haut quand il y a des enfants */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Mes Enfants
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {enfants.length} enfant{enfants.length > 1 ? "s" : ""}{" "}
                enregistré{enfants.length > 1 ? "s" : ""}
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap"
            >
              <Plus className="w-4 sm:w-5 h-5 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Ajouter un enfant</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          </div>

          {/* Grille des enfants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {enfants.map((enfant, index) => (
              <EnfantCard
                key={enfant.id}
                enfant={enfant}
                index={index}
                isActive={enfantActif?.id === enfant.id}
                onClick={() => handleSelectEnfant(enfant)}
              />
            ))}
          </div>

          {/* Information enfant actif */}
          {enfantActif && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 p-4 sm:p-6 bg-purple-50/50 border border-purple-200/50 rounded-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    Enfant sélectionné
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    Vous suivez actuellement{" "}
                    <span className="font-semibold text-purple-600">
                      {enfantActif.prenom} {enfantActif.nom}
                    </span>{" "}
                    - {enfantActif.niveau?.libelle}
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

      {/* Modal d'ajout */}
      <AddEnfantModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        niveaux={niveaux}
      />
    </div>
  );
}
