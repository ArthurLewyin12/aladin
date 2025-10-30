"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  Calendar,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import {
  ParentDashboardStats,
  ParentChildrenStudyTimeChart,
  ParentChildrenPerformanceChart,
  ParentPerformanceEvolutionChart,
  ParentRecentActivities,
  ParentChildrenQuickView,
} from "@/components/pages/parent/dashboard";
import { useParentDashboard } from "@/services/hooks/parent/useParentDashboard";
import { useSession } from "@/services/hooks/auth/useSession";
import { DashboardPeriod } from "@/services/controllers/types/common/dashboard-data.types";
import { AnimatedTabs } from "@/components/ui/animated-tabs";

const PERIOD_OPTIONS = [
  "week",
  "month",
  "quarter",
  "semester",
  "year",
] as const;

export default function ParentDashboardPage() {
  const router = useRouter();
  const { user } = useSession();

  // Utiliser nuqs pour gérer la période dans l'URL
  const [period, setPeriod] = useQueryState(
    "period",
    parseAsStringLiteral(PERIOD_OPTIONS).withDefault("month"),
  );

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useParentDashboard(user?.id || 0, period);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-center h-screen gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Chargement du tableau de bord...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Erreur lors du chargement
              </h1>
              <p className="text-gray-600 mb-6">
                {error?.message || "Une erreur est survenue"}
              </p>
              <Button onClick={() => router.push("/parent/home")}>
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-600 mb-4">
                Aucune donnée disponible
              </h1>
              <Button onClick={() => router.push("/parent/home")}>
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header avec bouton retour et titre */}
        <div
          className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
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

        {/* Period Selector */}
        <div className="mb-6 flex justify-center">
          <AnimatedTabs
            tabs={[
              { label: "Semaine", icon: <Calendar className="w-4 h-4" /> },
              { label: "Mois", icon: <CalendarDays className="w-4 h-4" /> },
              {
                label: "Trimestre",
                icon: <CalendarRange className="w-4 h-4" />,
              },
              {
                label: "Semestre",
                icon: <CalendarRange className="w-4 h-4" />,
              },
              { label: "Année", icon: <CalendarRange className="w-4 h-4" /> },
            ]}
            activeTab={
              period === "week"
                ? "Semaine"
                : period === "month"
                  ? "Mois"
                  : period === "quarter"
                    ? "Trimestre"
                    : period === "semester"
                      ? "Semestre"
                      : "Année"
            }
            onTabChange={(label) => {
              const periodMap: Record<string, DashboardPeriod> = {
                Semaine: "week",
                Mois: "month",
                Trimestre: "quarter",
                Semestre: "semester",
                Année: "year",
              };
              setPeriod(periodMap[label] || "month");
            }}
          />
        </div>

        {/* Stats Cards */}
        <div className="mb-6">
          <ParentDashboardStats {...dashboardData.statsData} />
        </div>

        {/* Charts Section - Comparison */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 mb-6">
          <ParentChildrenStudyTimeChart data={dashboardData.studyTimeData} />
          <ParentChildrenPerformanceChart
            data={dashboardData.performanceData}
          />
        </div>

        {/* Evolution Chart */}
        <div className="mb-6">
          <ParentPerformanceEvolutionChart
            data={dashboardData.evolutionData}
            childrenConfig={dashboardData.childrenConfig}
          />
        </div>

        {/* Recent Activities Table */}
        <div className="mb-6">
          <ParentRecentActivities
            activities={dashboardData.recentActivitiesData}
          />
        </div>

        {/* Children Quick View Cards */}
        <ParentChildrenQuickView
          children={dashboardData.childrenQuickViewData}
        />
      </div>
    </div>
  );
}
