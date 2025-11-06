"use client";

import * as React from "react";
import { StudyPlan } from "@/services/controllers/types/common";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import { fr } from "date-fns/locale";

interface PlanningMobileViewProps {
  plans: StudyPlan[];
  onSelectSlot?: (day: number, time: string) => void;
  onSelectPlan?: (plan: StudyPlan) => void;
  className?: string;
}

const subjectColors: Record<number, string> = {
  0: "bg-blue-500",
  1: "bg-amber-500",
  2: "bg-emerald-500",
  3: "bg-violet-500",
  4: "bg-rose-500",
  5: "bg-indigo-500",
  6: "bg-pink-500",
};

const getColorForSubject = (subjectId: number) => {
  return subjectColors[subjectId % 7];
};

export function PlanningMobileView({
  plans,
  onSelectSlot,
  onSelectPlan,
  className,
}: PlanningMobileViewProps) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getPlansForDay = (dayIndex: number) => {
    // dayIndex: 0=Monday, 6=Sunday
    const weekday = dayIndex === 6 ? 7 : dayIndex + 1;
    return plans
      .filter((plan) => plan.weekday === weekday)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="bg-white rounded-2xl border shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Ma semaine de révision
          </h2>
          <Button
            size="sm"
            onClick={() => onSelectSlot?.(1, "09:00:00")}
            className="h-9 gap-2 bg-[#2C3E50] hover:bg-[#1a252f] text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          {format(weekStart, "d", { locale: fr })} au{" "}
          {format(weekEnd, "d MMM yyyy", { locale: fr })}
        </p>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {weekDays.map((day, dayIndex) => {
          const dayPlans = getPlansForDay(dayIndex);
          const isCurrentDay = isToday(day);
          const weekday = dayIndex === 6 ? 7 : dayIndex + 1;

          return (
            <motion.div
              key={day.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.05, duration: 0.3 }}
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            >
              {/* Day Header */}
              <div
                className={cn("p-4 border-b", isCurrentDay && "bg-orange-50")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {format(day, "EEEE", { locale: fr })}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {format(day, "d MMMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  {isCurrentDay && (
                    <span className="px-3 py-1 text-xs font-medium bg-orange-500 text-white rounded-full">
                      Aujourd'hui
                    </span>
                  )}
                </div>
              </div>

              {/* Plans for the Day */}
              <div className="p-4 space-y-3">
                {dayPlans.length === 0 ? (
                  <motion.button
                    onClick={() => onSelectSlot?.(weekday, "09:00:00")}
                    className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-sm font-medium">
                      Ajouter un créneau
                    </span>
                  </motion.button>
                ) : (
                  <>
                    {dayPlans.map((plan) => {
                      const colorClass = getColorForSubject(plan.matiere.id);
                      return (
                        <motion.div
                          key={plan.id}
                          onClick={() => onSelectPlan?.(plan)}
                          className="relative p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer overflow-hidden"
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                        >
                          {/* Color Accent Bar */}
                          <div
                            className={cn(
                              "absolute left-0 top-0 bottom-0 w-1",
                              colorClass,
                            )}
                          />

                          {/* Content */}
                          <div className="ml-3 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-gray-900 text-base">
                                {plan.matiere.libelle}
                              </h4>
                              <div className="flex items-center gap-1 text-xs text-gray-600 font-medium bg-white px-2 py-1 rounded-full border flex-shrink-0">
                                <Clock className="w-3 h-3" />
                                {plan.start_time.substring(0, 5)} -{" "}
                                {plan.end_time.substring(0, 5)}
                              </div>
                            </div>

                            {plan.chapitres.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs text-gray-600 font-medium">
                                  Chapitres :
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {plan.chapitres.map((chapitre) => (
                                    <span
                                      key={chapitre.id}
                                      className="inline-flex items-center px-2 py-1 text-xs font-medium bg-white rounded-md border text-gray-700"
                                    >
                                      {chapitre.libelle}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Add Another Button */}
                    <motion.button
                      onClick={() => onSelectSlot?.(weekday, "09:00:00")}
                      className="w-full py-3 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter un autre créneau
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
