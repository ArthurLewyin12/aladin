"use client";

import Image from "next/image";
import {
  ChevronRight,
  BarChart3,
  Brain,
  BookOpen,
  Users,
  Share2,
} from "lucide-react";
import { useRouter } from "next/navigation";
// import { toast } from "sonner";
import { toast } from "@/lib/toast";

export default function StudentHomePage() {
  const router = useRouter();

  const handleShare = async () => {
    const shareData = {
      title: "Découvre Aladin !",
      text: "J'utilise Aladin pour booster mes révisions et c'est génial ! Rejoins-moi sur la plateforme pour apprendre et progresser ensemble. ",
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
      // Fallback pour les navigateurs qui ne supportent pas l'API de partage Web ou les systèmes d'exploitation
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      toast({
        variant: "default",
        message: "Le lien a été copié dans le presse-papiers !",
      });
    }
  };

  const homeActions = [
    {
      id: "dashboard",
      title: "je consulte mon tableau de bord",
      icon: BarChart3,
      handler: () => router.push("/student/dashboard"),
    },
    {
      id: "course",
      title: "Je révise un cours",
      icon: BookOpen,
      handler: () => router.push("/student/revision/generated"),
    },
    {
      id: "quiz",
      title: "Je passe un quiz",
      icon: Brain,
      handler: () => router.push("/student/quiz/generate"),
    },

    {
      id: "group",
      title: "Je créer un groupe d'étude",
      icon: Users,
      handler: () => router.push("/student/groups"),
    },
    {
      id: "share",
      title: "Partager Aladin",
      icon: Share2,
      handler: handleShare,
    },
  ];

  return (
    <div className="bg-[#F5F4F1] w-full p-4 sm:p-6">
      <div
        className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='M20 20h10v10H20zM40 40h10v10H40zM60 20h10v10H60zM80 60h10v10H80zM30 70h10v10H30zM70 30h10v10H70zM50 50h10v10H50z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      >
        {/* Message de bienvenue */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-2 sm:mb-4">
            Hello!
          </h1>
          <p className="text-base sm:text-lg lg:text-[1.3rem] text-gray-600 leading-relaxed">
            Je suis là pour t'aider à apprendre à ton rythme, t'expliquer ce que
            tu ne comprends pas, et t'accompagner tout au long de ton parcours.
            Prêt(e) ? Par quoi on commence ensemble ?
          </p>
        </div>
        {/* Section principale avec illustration et actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-8 md:mt-10 lg:mt-20">
          {/* Colonne gauche - Illustration */}
          <div className="flex justify-center lg:justify-start">
            <Image
              src="/student-illustration-img.png"
              alt="Illustration étudiant"
              width={400}
              height={350}
              className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto"
            />
          </div>

          {/* Colonne droite - Contenu */}
          <div className="space-y-4 md:space-y-6">
            {/* Actions disponibles */}
            <div className="space-y-3">
              {homeActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.handler}
                    className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl p-4 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-medium text-left">
                        {action.title}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
