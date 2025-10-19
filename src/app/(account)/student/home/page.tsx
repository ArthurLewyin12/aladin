"use client";

import Image from "next/image";
import {
  ChevronRight,
  BarChart3,
  Brain,
  BookOpen,
  Users,
  Share2,
  Sparkles,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
      title: "Je consulte mon tableau de bord",
      description: "Visualise tes progrès et statistiques",
      icon: BarChart3,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverBg: "hover:bg-blue-100",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      handler: () => router.push("/student/dashboard"),
    },
    {
      id: "course",
      title: "Je révise un cours",
      description: "Explore les cours personnalisés",
      icon: BookOpen,
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      hoverBg: "hover:bg-emerald-100",
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      handler: () => router.push("/student/revision/generated"),
    },
    {
      id: "quiz",
      title: "Je passe un quiz",
      description: "Teste tes connaissances maintenant",
      icon: Brain,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      hoverBg: "hover:bg-purple-100",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      handler: () => router.push("/student/quiz/generate"),
    },
    {
      id: "notes",
      title: "Je consulte mes notes",
      description: "Vois tes notes Aladin et de classe",
      icon: FileText,
      color: "from-amber-400 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      hoverBg: "hover:bg-amber-100",
      iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
      handler: () => router.push("/student/notes"),
    },
    {
      id: "group",
      title: "Je crée un groupe d'étude",
      description: "Apprends en collaborant avec d'autres",
      icon: Users,
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      hoverBg: "hover:bg-orange-100",
      iconBg: "bg-gradient-to-br from-orange-500 to-orange-600",
      handler: () => router.push("/student/groups"),
    },
    {
      id: "share",
      title: "Je partage Aladin",
      description: "Invite tes amis à te rejoindre",
      icon: Share2,
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      hoverBg: "hover:bg-pink-100",
      iconBg: "bg-gradient-to-br from-pink-500 to-pink-600",
      handler: handleShare,
    },
  ];

  return (
    <div className="min-h-screen w-full relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Message de bienvenue avec animation */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-500">
              Hello!
            </h1>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-3xl">
            Je suis là pour t'aider à apprendre à ton rythme et t'accompagner
            tout au long de ton parcours.
          </p>
        </div>

        {/* Section principale avec illustration et actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Colonne gauche - Illustration - hidden on mobile */}
          <div className="hidden lg:flex justify-center lg:justify-start order-2 lg:order-1">
            <Image
              src="/student-illustration-img.png"
              alt="Illustration étudiant"
              width={500}
              height={450}
              className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto"
              priority
            />
          </div>

          {/* Colonne droite - Actions */}
          <div className="space-y-4 order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Que veux-tu faire aujourd'hui ?
            </h2>
            {homeActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.handler}
                  className={`w-full ${action.bgColor} ${action.hoverBg} border-2 ${action.borderColor} rounded-3xl p-5 sm:p-6 flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${action.iconBg} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5">
                        {action.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
