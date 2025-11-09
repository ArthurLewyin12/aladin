"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarPlus, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PlanningCalendarView } from "@/components/ui/planning-calendar-view";
import { PlanningMobileView } from "@/components/ui/planning-mobile-view";
import { useStudyPlans } from "@/services/hooks/study-plan/useStudyPlans";
import { StudyPlan } from "@/services/controllers/types/common";
import { useMediaQuery } from "@/services/hooks/use-media-query";
import { usePlanningEditor } from "@/stores/usePlanningEditor";

export default function PlanningPage() {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { data, isLoading, isError, error } = useStudyPlans();
  const { setEditingPlan } = usePlanningEditor();

  const handleBack = () => {
    router.push("/student/home");
  };

  const handleOpenCreator = (day: number, time: string) => {
    setEditingPlan(null);
    router.push(`/student/planning/editor?day=${day}&time=${time}`);
  };

  const handleOpenEditor = (plan: StudyPlan) => {
    setEditingPlan(plan);
    router.push(`/student/planning/editor?id=${plan.id}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 mt-4">
          <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>
      );
    }

    if (isError) {
      return (
        <EmptyState
          title="Erreur de chargement"
          description={
            error?.message ||
            "Impossible de charger le planning. Veuillez réessayer."
          }
        />
      );
    }

    const plans = data?.plans || [];

    if (plans.length === 0) {
      return (
        <EmptyState
          title="Aucun planning défini"
          description="Commencez à organiser votre semaine d'étude en ajoutant des créneaux."
          icons={[
            <TrendingUp key="3" size={20} />,
            <CalendarPlus key="1" size={20} />,
            <BookOpen key="2" size={20} />,
          ]}
          action={{
            label: "Ajouter mon premier créneau",
            onClick: () => handleOpenCreator(1, "09:00"),
          }}
        />
      );
    }

    // Use different views based on screen size
    if (isDesktop) {
      return (
        <PlanningCalendarView
          plans={plans}
          onSelectPlan={handleOpenEditor}
          onSelectSlot={handleOpenCreator}
        />
      );
    }

    return (
      <PlanningMobileView
        plans={plans}
        onSelectPlan={handleOpenEditor}
        onSelectSlot={handleOpenCreator}
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header with back button and title */}
      <div
        className="mt-2 sm:mt-4 w-full mx-auto flex flex-row items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
        style={{
          backgroundImage: `url("/bg-2.png")`,
          backgroundSize: "180px 180px",
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="rounded-full bg-white hover:bg-gray-50 w-9 h-9 sm:w-12 sm:h-12 shadow-sm flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 leading-tight">
            Mon Planning de révision
          </h1>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
