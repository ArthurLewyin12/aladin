"use client";

import { useState } from "react";
import { Settings, CreditCard, Book } from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import TeacherSettingsGeneral from "./teacher-general";
import TeacherSettingsSubscription from "./teacher-subscription";
import TeacherSubjects from "./teacher-subjects";

export default function TeacherParametreTabs() {
  const [activeTab, setActiveTab] = useState("Général");

  const tabs = [
    {
      label: "Général",
      icon: <Settings className="w-4 h-4" aria-hidden="true" />,
    },
    {
      label: "Matières",
      icon: <Book className="w-4 h-4" aria-hidden="true" />,
    },
    {
      label: "Abonnements",
      icon: <CreditCard className="w-4 h-4" aria-hidden="true" />,
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header avec titre */}
      <div className="backdrop-blur-sm rounded-3xl p-5 sm:p-6 shadow-sm bg-white/50 border-2 border-green-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Paramètres
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Gère tes informations et tes préférences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-start sm:justify-start mb-6">
        <AnimatedTabs
          tabs={tabs}
          onTabChange={setActiveTab}
          activeTabClassName="bg-gradient-to-r from-green-700 to-green-800"
        />
      </div>

      {/* Contenu basé sur l'onglet actif */}
      <div className="mt-6">
        {activeTab === "Général" && <TeacherSettingsGeneral />}
        {activeTab === "Matières" && <TeacherSubjects />}
        {activeTab === "Abonnements" && <TeacherSettingsSubscription />}
      </div>
    </div>
  );
}
