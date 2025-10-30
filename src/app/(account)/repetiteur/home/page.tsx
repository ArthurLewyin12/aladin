"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronRight,
  BarChart3,
  Users,
  Share2,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { useSession } from "@/services/hooks/auth/useSession";
import { useNiveauxChoisis } from "@/services/hooks/repetiteur";
import { DefinirNiveauxModal } from "@/components/pages/repetiteur/definir-niveaux-modal";

export default function RepetiteurHomePage() {
  const router = useRouter();
  const { user } = useSession();
  const { data: niveauxData, isLoading: isLoadingNiveaux } =
    useNiveauxChoisis();
  const [showNiveauxModal, setShowNiveauxModal] = useState(false);

  // Vérifier si le répétiteur a défini ses niveaux
  useEffect(() => {
    if (!isLoadingNiveaux && niveauxData) {
      if (!niveauxData.a_defini_niveaux) {
        // Ouvrir le modal si les niveaux ne sont pas définis
        setShowNiveauxModal(true);
      }
    }
  }, [niveauxData, isLoadingNiveaux]);

  const handleShare = async () => {
    const shareData = {
      title: "Découvrez Aladin !",
      text: "J'utilise Aladin pour accompagner mes élèves dans leur apprentissage. Rejoignez-nous sur la plateforme pour offrir à vos élèves un accompagnement pédagogique de qualité.",
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          variant: "success",
          message: "Contenu partagé avec succès !",
        });
      } catch (error) {
        console.error("Erreur lors du partage :", error);
        toast({
          variant: "error",
          message: "Le partage a été annulé ou a échoué.",
        });
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      toast({
        variant: "default",
        message: "Le lien a été copié dans le presse-papiers !",
      });
    }
  };

  const repetiteurActions = [
    {
      id: "dashboard",
      title: "Je vois mon tableau de bord",
      description: "Je suis les statistiques et activités",
      icon: BarChart3,
      handler: () => router.push("/repetiteur/dashboard"),
    },
    {
      id: "students",
      title: "Je gère mes élèves",
      description: "j'ajoute et je suis mes élèves",
      icon: Users,
      handler: () => router.push("/repetiteur/students"),
    },
    {
      id: "groups",
      title: "Je gère les groupes",
      description: "j'ai une vue d'ensemble  des groupes d'étude",
      icon: UsersRound,
      handler: () => router.push("/repetiteur/groups"),
    },
    {
      id: "share",
      title: "Je partage Aladin",
      description: "Invitez d'autres répétiteurs",
      icon: Share2,
      handler: handleShare,
    },
  ];

  return (
    <>
      <DefinirNiveauxModal
        open={showNiveauxModal}
        onOpenChange={setShowNiveauxModal}
      />

      <div className="min-h-screen w-full relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Message de bienvenue professionnel */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#548C2F] mb-4">
              Bonjour {user?.prenom}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl">
              Suivez le niveau de vos élèves , créez vos cours et exercices, et
              laissez l'IA vous assister dans l'accompagnement pédagogique.
            </p>
          </div>

          {/* Section principale avec illustration et actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Colonne gauche - Illustration */}
            <div className="hidden lg:flex justify-center lg:justify-start order-2 lg:order-1">
              <Image
                src="/mathematics-pana.png"
                alt="Illustration parent"
                width={500}
                height={450}
                className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto"
                priority
              />
            </div>

            {/* Colonne droite - Actions */}
            <div className="space-y-4 order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Que souhaitez-vous faire ?
              </h2>
              {repetiteurActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.handler}
                    className="cursor-pointer w-full bg-white hover:bg-[#F0F7EC] border-2 border-[#C8E0B8] rounded-2xl p-5 sm:p-6 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-[#8FB376] group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#E3F1D9] rounded-xl flex items-center justify-center group-hover:bg-[#C8E0B8] transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-[#548C2F]" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5">
                          {action.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-[#548C2F] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
