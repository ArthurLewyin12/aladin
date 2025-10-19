"use client";

import Image from "next/image";
import {
  ChevronRight,
  BarChart3,
  BookOpen,
  Users,
  Share2,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

export default function ParentHomePage() {
  const router = useRouter();

  const handleShare = async () => {
    const shareData = {
      title: "Découvrez Aladin !",
      text: "J'utilise Aladin pour accompagner mes enfants dans leur apprentissage. Rejoignez-nous sur la plateforme pour offrir à vos enfants un accompagnement pédagogique de qualité.",
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

  const parentActions = [
    {
      id: "dashboard",
      title: "Je vois mon tableau de bord",
      description: "Suivez les progrès de vos enfants",
      icon: BarChart3,
      handler: () => router.push("/parent/dashboard"),
    },
    // {
    //   id: "courses",
    //   title: "Je vois mes cours",
    //   description: "Accédez aux cours et ressources",
    //   icon: BookOpen,
    //   handler: () => router.push("/parent/courses"),
    // },
    {
      id: "enfants",
      title: "Je consulte mes enfants",
      description: "Gérez vos différents enfants",
      icon: Users,
      handler: () => router.push("/parent/enfants"),
    },
    {
      id: "groups",
      title: "Je crée un groupe d'étude",
      description: "Collaborez avec d'autres parents",
      icon: UsersRound,
      handler: () => router.push("/parent/groups"),
    },
    {
      id: "share",
      title: "Je partage Aladin",
      description: "Invitez d'autres parents à rejoindre",
      icon: Share2,
      handler: handleShare,
    },
  ];

  return (
    <div className="min-h-screen w-full relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Message de bienvenue professionnel */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-600 mb-4">
            Bonjour
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl">
            Suivez le niveau de vos enfants, créez vos cours et exercices, et
            laissez l'IA vous assister dans l'accompagnement pédagogique.
          </p>
        </div>

        {/* Section principale avec illustration et actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Colonne gauche - Illustration */}
          <div className="hidden lg:flex justify-center lg:justify-start order-2 lg:order-1">
            <Image
              src="/femme_learning.png"
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
            {parentActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.handler}
                  className="w-full bg-white hover:bg-purple-50 border-2 border-purple-100 rounded-2xl p-5 sm:p-6 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-purple-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-purple-600" />
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
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
