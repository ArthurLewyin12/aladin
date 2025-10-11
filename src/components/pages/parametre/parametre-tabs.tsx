"use client";

import { useState } from "react";
import { Settings, CreditCard, GraduationCap } from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import SettingsGeneralPage from "./general";

export default function ParametreTabs() {
  const [activeTab, setActiveTab] = useState("Général");

  const tabs = [
    {
      label: "Général",
      icon: <Settings className="w-4 h-4" aria-hidden="true" />,
    },
    {
      label: "Abonnements",
      icon: <CreditCard className="w-4 h-4" aria-hidden="true" />,
    },
    {
      label: "Mes Classes",
      icon: <GraduationCap className="w-4 h-4" aria-hidden="true" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-2 sm:px-0">
      {/* Header avec titre */}
      <div className="backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm bg-white/50">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Paramètres
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Gère tes informations et préférences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <AnimatedTabs tabs={tabs} onTabChange={setActiveTab} />
      </div>

      {/* Contenu basé sur l'onglet actif */}
      <div className="mt-6">
        {activeTab === "Général" && <SettingsGeneralPage />}
        {activeTab === "Abonnements" && (
          <div className="rounded-2xl bg-[#F5E6D3] p-6 text-center shadow-sm">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-700 text-base font-medium">
              Contenu des abonnements à venir
            </p>
          </div>
        )}
        {activeTab === "Mes Classes" && (
          <div className="rounded-2xl bg-[#D4EBE8] p-6 text-center shadow-sm">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-700 text-base font-medium">
              Contenu des classes à venir
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
