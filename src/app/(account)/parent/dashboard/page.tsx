"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ParentDashboardStats,
  ParentChildrenStudyTimeChart,
  ParentChildrenPerformanceChart,
  ParentPerformanceEvolutionChart,
  ParentRecentActivities,
  ParentChildrenQuickView,
} from "@/components/pages/parent/dashboard";

// Données statiques - À remplacer par les vraies données de l'API
const mockData = {
  // Stats globales
  totalChildren: 3,
  totalStudyHours: 127,
  averageNote: 13.2,
  totalActivities: 89,

  // Temps d'étude par enfant
  studyTimeData: [
    { name: "Amadou", hours: 45, color: "#8b5cf6" },
    { name: "Fatou", hours: 52, color: "#06b6d4" },
    { name: "Ibrahima", hours: 30, color: "#f97316" },
  ],

  // Performance par enfant
  performanceData: [
    { name: "Amadou", average: 12.5, color: "#8b5cf6" },
    { name: "Fatou", average: 14.8, color: "#06b6d4" },
    { name: "Ibrahima", average: 12.3, color: "#f97316" },
  ],

  // Évolution des performances (6 derniers mois)
  evolutionData: [
    { month: "Juillet", Amadou: 11.2, Fatou: 13.5, Ibrahima: 10.8 },
    { month: "Août", Amadou: 11.8, Fatou: 14.0, Ibrahima: 11.2 },
    { month: "Septembre", Amadou: 12.1, Fatou: 14.3, Ibrahima: 11.5 },
    { month: "Octobre", Amadou: 12.3, Fatou: 14.5, Ibrahima: 11.9 },
    { month: "Novembre", Amadou: 12.5, Fatou: 14.7, Ibrahima: 12.1 },
    { month: "Décembre", Amadou: 12.5, Fatou: 14.8, Ibrahima: 12.3 },
  ],

  // Configuration des enfants pour le graphique
  childrenConfig: [
    { name: "Amadou", color: "#8b5cf6" }, // Violet
    { name: "Fatou", color: "#06b6d4" }, // Cyan
    { name: "Ibrahima", color: "#f97316" }, // Orange
  ],

  // Activités récentes
  recentActivities: [
    {
      id: "1",
      childName: "Fatou",
      childColor: "#06b6d4",
      type: "quiz" as const,
      subject: "Mathématiques",
      title: "Équations du second degré",
      date: new Date().toISOString(),
      score: 16.5,
    },
    {
      id: "2",
      childName: "Amadou",
      childColor: "#8b5cf6",
      type: "cours" as const,
      subject: "Physique",
      title: "Les forces et mouvements",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      childName: "Ibrahima",
      childColor: "#f97316",
      type: "quiz" as const,
      subject: "SVT",
      title: "La reproduction humaine",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      score: 13.0,
    },
    {
      id: "4",
      childName: "Fatou",
      childColor: "#06b6d4",
      type: "groupe" as const,
      title: "Révisions Terminale S",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      childName: "Amadou",
      childColor: "#8b5cf6",
      type: "quiz" as const,
      subject: "Anglais",
      title: "Present Perfect vs Simple Past",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      score: 11.5,
    },
    {
      id: "6",
      childName: "Ibrahima",
      childColor: "#f97316",
      type: "cours" as const,
      subject: "Histoire",
      title: "La première guerre mondiale",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "7",
      childName: "Fatou",
      childColor: "#06b6d4",
      type: "quiz" as const,
      subject: "Chimie",
      title: "Les réactions acido-basiques",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      score: 17.0,
    },
    {
      id: "8",
      childName: "Amadou",
      childColor: "#8b5cf6",
      type: "groupe" as const,
      title: "Groupe Math 1ère S",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "9",
      childName: "Ibrahima",
      childColor: "#f97316",
      type: "quiz" as const,
      subject: "Français",
      title: "Analyse de texte",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      score: 12.0,
    },
    {
      id: "10",
      childName: "Fatou",
      childColor: "#06b6d4",
      type: "cours" as const,
      subject: "Philosophie",
      title: "La conscience",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],

  // Vue rapide des enfants
  childrenQuickView: [
    {
      id: "1",
      name: "Amadou",
      niveau: "Première S",
      color: "#8b5cf6",
      averageNote: 12.5,
      weeklyStudyHours: 12,
      totalQuizzes: 28,
      totalCourses: 15,
      totalGroups: 3,
      trend: "up" as const,
      progressToNextMilestone: 65,
      nextMilestone: "50 quiz complétés",
    },
    {
      id: "2",
      name: "Fatou",
      niveau: "Terminale S",
      color: "#06b6d4",
      averageNote: 14.8,
      weeklyStudyHours: 18,
      totalQuizzes: 42,
      totalCourses: 22,
      totalGroups: 5,
      trend: "up" as const,
      progressToNextMilestone: 84,
      nextMilestone: "100 heures d'étude",
    },
    {
      id: "3",
      name: "Ibrahima",
      niveau: "Seconde",
      color: "#f97316",
      averageNote: 12.3,
      weeklyStudyHours: 8,
      totalQuizzes: 19,
      totalCourses: 10,
      totalGroups: 2,
      trend: "stable" as const,
      progressToNextMilestone: 38,
      nextMilestone: "25 quiz complétés",
    },
  ],
};

export default function ParentDashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden">
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
            onClick={() => router.push("/parent/home")}
            className="rounded-full bg-white hover:bg-gray-50 w-9 h-9 sm:w-12 sm:h-12 shadow-sm flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <div className="flex-1">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-600 leading-tight">
                Tableau de bord parent
              </h1>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6">
          <ParentDashboardStats
            totalChildren={mockData.totalChildren}
            totalStudyHours={mockData.totalStudyHours}
            averageNote={mockData.averageNote}
            totalActivities={mockData.totalActivities}
          />
        </div>

        {/* Charts Section - Comparison */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 mb-6">
          <ParentChildrenStudyTimeChart data={mockData.studyTimeData} />
          <ParentChildrenPerformanceChart data={mockData.performanceData} />
        </div>

        {/* Evolution Chart */}
        <div className="mb-6">
          <ParentPerformanceEvolutionChart
            data={mockData.evolutionData}
            childrenConfig={mockData.childrenConfig}
          />
        </div>

        {/* Recent Activities Table */}
        <div className="mb-6">
          <ParentRecentActivities activities={mockData.recentActivities} />
        </div>

        {/* Children Quick View Cards */}
        <ParentChildrenQuickView children={mockData.childrenQuickView} />
      </div>
    </div>
  );
}
