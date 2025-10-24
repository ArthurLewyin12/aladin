"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RepetiteurSettingsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/repetiteur/home");
  };

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
            <span className="text-2xl sm:text-3xl">⚙️</span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#548C2F] leading-tight">
              Paramètres
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Gérez votre compte et vos préférences
          </p>
        </div>

        {/* Contenu */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Paramètres du compte
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Vous pourrez gérer votre profil et vos préférences ici
              </p>
              <p className="text-xs text-gray-500">
                Fonctionnalité à venir
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

