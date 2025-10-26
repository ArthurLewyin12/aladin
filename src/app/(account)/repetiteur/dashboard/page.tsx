"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useEleves, useRepetiteurStats } from "@/services/hooks/repetiteur";
import { useSession } from "@/services/hooks/auth/useSession";
import {
  RepetiteurDashboardStats,
  RepetiteurStudentStudyTimeChart,
  RepetiteurStudentPerformanceChart,
  RepetiteurStudentPerformanceEvolutionChart,
  RepetiteurRecentActivities,
  RepetiteurStudentQuickView,
} from "@/components/pages/repetiteur/dashboard";

// Mock data for charts and activities (to be replaced with API data)
const mockData = {
  studyTimeData: [
    { name: "Alice", hours: 30, color: "#8b5cf6" },
    { name: "Bob", hours: 25, color: "#06b6d4" },
    { name: "Charlie", hours: 35, color: "#f97316" },
  ],
  performanceData: [
    { name: "Alice", average: 14.2, color: "#8b5cf6" },
    { name: "Bob", average: 12.8, color: "#06b6d4" },
    { name: "Charlie", average: 15.1, color: "#f97316" },
  ],
  evolutionData: [
    { month: "Juillet", Alice: 13.0, Bob: 12.0, Charlie: 14.0 },
    { month: "Août", Alice: 13.5, Bob: 12.5, Charlie: 14.5 },
    { month: "Septembre", Alice: 13.8, Bob: 12.7, Charlie: 14.8 },
    { month: "Octobre", Alice: 14.0, Bob: 12.8, Charlie: 15.0 },
    { month: "Novembre", Alice: 14.2, Bob: 12.8, Charlie: 15.1 },
    { month: "Décembre", Alice: 14.2, Bob: 12.8, Charlie: 15.1 },
  ],
  studentsConfig: [
    { name: "Alice", color: "#8b5cf6" }, // Violet
    { name: "Bob", color: "#06b6d4" }, // Cyan
    { name: "Charlie", color: "#f97316" }, // Orange
  ],
  recentActivities: [
    {
      id: "1",
      studentName: "Alice",
      studentColor: "#8b5cf6",
      type: "quiz" as const,
      subject: "Mathématiques",
      title: "Algèbre linéaire",
      date: new Date().toISOString(),
      score: 17.0,
    },
    {
      id: "2",
      studentName: "Bob",
      studentColor: "#06b6d4",
      type: "cours" as const,
      subject: "Physique",
      title: "Mécanique quantique",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      studentName: "Charlie",
      studentColor: "#f97316",
      type: "quiz" as const,
      subject: "SVT",
      title: "La génétique",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      score: 14.5,
    },
    {
      id: "4",
      studentName: "Alice",
      studentColor: "#8b5cf6",
      type: "groupe" as const,
      title: "Préparation Bac S",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      studentName: "Bob",
      studentColor: "#06b6d4",
      type: "quiz" as const,
      subject: "Anglais",
      title: "Grammar Test",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      score: 10.0,
    },
  ],
  studentsQuickView: [
    {
      id: "1",
      name: "Alice",
      niveau: "Terminale S",
      color: "#8b5cf6",
      averageNote: 14.2,
      weeklyStudyHours: 15,
      totalQuizzes: 35,
      totalCourses: 20,
      totalGroups: 4,
      trend: "up" as const,
      progressToNextMilestone: 70,
      nextMilestone: "50 quiz complétés",
    },
    {
      id: "2",
      name: "Bob",
      niveau: "Première L",
      color: "#06b6d4",
      averageNote: 12.8,
      weeklyStudyHours: 10,
      totalQuizzes: 20,
      totalCourses: 12,
      totalGroups: 2,
      trend: "stable" as const,
      progressToNextMilestone: 50,
      nextMilestone: "25 heures d'étude",
    },
    {
      id: "3",
      name: "Charlie",
      niveau: "Seconde",
      color: "#f97316",
      averageNote: 15.1,
      weeklyStudyHours: 18,
      totalQuizzes: 40,
      totalCourses: 25,
      totalGroups: 3,
      trend: "up" as const,
      progressToNextMilestone: 80,
      nextMilestone: "100 heures d'étude",
    },
  ],
};

export default function RepetiteurDashboardPage() {
  const router = useRouter();
  const { user } = useSession();
  const { data: elevesData, isLoading: isLoadingEleves } = useEleves();
  const { data: statsData, isLoading: isLoadingStats } = useRepetiteurStats(
    user?.id || 0,
  );

  const eleves = elevesData?.eleves || [];
  const eleveActif = elevesData?.eleve_actif;
  const stats = statsData?.stats;

  // Handle navigation back to home
  const handleBack = () => {
    router.push("/repetiteur/home");
  };

  // Loading state
  if (isLoadingEleves || isLoadingStats) {
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

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
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
            <span className="text-2xl sm:text-3xl">📊</span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#548C2F] leading-tight">
              Tableau de bord
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Vue d'ensemble de votre activité et de vos élèves
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <RepetiteurDashboardStats
            totalStudents={stats?.nombre_eleves || eleves.length}
            activeStudents={stats?.nombre_eleves_actifs || 0}
            totalQuizzesCreated={stats?.total_quiz_crees || 0}
            totalCoursesCreated={stats?.total_cours_crees || 0}
          />
        </div>

        {/* Active Student Card */}
        {eleveActif ? (
          <Card className="mb-8 bg-[#F0F7EC] border-[#C8E0B8]">
            <CardHeader>
              <CardTitle className="text-[#548C2F]">
                Élève actuellement suivi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#E3F1D9] rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#548C2F]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {eleveActif.prenom} {eleveActif.nom}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {eleveActif.niveau?.libelle}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {eleveActif.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-amber-200">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun élève sélectionné
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Sélectionnez un élève pour voir ses statistiques et créer du
                  contenu adapté
                </p>
                <Button
                  onClick={() => router.push("/repetiteur/students")}
                  className="bg-[#548C2F] hover:bg-[#4a7829]"
                >
                  Sélectionner un élève
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Students List */}
        {eleves.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Mes élèves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eleves.map((eleve) => (
                  <div
                    key={eleve.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      eleveActif?.id === eleve.id
                        ? "bg-[#F0F7EC] border-[#548C2F]"
                        : "bg-gray-50 border-gray-200 hover:border-[#C8E0B8]"
                    }`}
                    onClick={() => router.push("/repetiteur/students")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E3F1D9] rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#548C2F]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {eleve.prenom} {eleve.nom}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {eleve.niveau?.libelle}
                          </p>
                        </div>
                      </div>
                      {eleveActif?.id === eleve.id && (
                        <span className="text-xs font-medium text-[#548C2F] bg-[#E3F1D9] px-3 py-1 rounded-full">
                          Actif
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparison Charts */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 mb-6">
          <RepetiteurStudentStudyTimeChart data={mockData.studyTimeData} />
          <RepetiteurStudentPerformanceChart data={mockData.performanceData} />
        </div>

        {/* Evolution Chart */}
        <div className="mb-6">
          <RepetiteurStudentPerformanceEvolutionChart
            data={mockData.evolutionData}
            studentsConfig={mockData.studentsConfig}
          />
        </div>

        {/* Recent Activities */}
        <div className="mb-6">
          <RepetiteurRecentActivities activities={mockData.recentActivities} />
        </div>

        {/* Students Quick View */}
        <RepetiteurStudentQuickView students={mockData.studentsQuickView} />
      </div>
    </div>
  );
}
