"use client";

import * as React from "react";
import { StudyPlan } from "@/services/controllers/types/common";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeeklySchedulerProps {
  plans: StudyPlan[];
  onSelectSlot?: (day: number, time: string) => void;
  onSelectPlan?: (plan: StudyPlan) => void;
  className?: string;
}

const daysOfWeek = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
const timeSlots = Array.from({ length: (22 - 7) * 2 }, (_, i) => {
  const hour = 7 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

const subjectColors = [
  "bg-sky-100 border-sky-200 text-sky-900 dark:bg-sky-900/30 dark:border-sky-700/40 dark:text-sky-200",
  "bg-amber-100 border-amber-200 text-amber-900 dark:bg-amber-900/30 dark:border-amber-700/40 dark:text-amber-200",
  "bg-emerald-100 border-emerald-200 text-emerald-900 dark:bg-emerald-900/30 dark:border-emerald-700/40 dark:text-emerald-200",
  "bg-violet-100 border-violet-200 text-violet-900 dark:bg-violet-900/30 dark:border-violet-700/40 dark:text-violet-200",
  "bg-rose-100 border-rose-200 text-rose-900 dark:bg-rose-900/30 dark:border-rose-700/40 dark:text-rose-200",
  "bg-indigo-100 border-indigo-200 text-indigo-900 dark:bg-indigo-900/30 dark:border-indigo-700/40 dark:text-indigo-200",
];
const getColorForSubject = (subjectId: number) => {
  return subjectColors[subjectId % subjectColors.length];
};

/**
 * A visually appealing weekly scheduler component to display study plans.
 * It shows a grid with days of the week as columns and time slots as rows.
 */
export function WeeklyScheduler({
  plans,
  onSelectSlot,
  onSelectPlan,
  className,
}: WeeklySchedulerProps) {
  // Helper to get grid row from a time string (e.g., "08:30:00")
  const getRowFromTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const totalMinutesFromStart = (hour - 7) * 60 + minute;
    // Each row is a 30-minute slot. +2 because grid row 1 is for headers.
    return Math.floor(totalMinutesFromStart / 30) + 2;
  };

  return (
    <div className={cn("bg-card rounded-xl border", className)}>
      <header className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Mon Planning d'Études</h2>
        <Button variant="outline" size="sm">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Ajouter un créneau
        </Button>
      </header>

      <div className="relative grid grid-cols-[4rem_repeat(7,1fr)] grid-rows-[2rem_repeat(30,3.5rem)]">
        {/* Time Gutter Labels (shows only full hours) */}
        {timeSlots.map((time, index) => {
          if (time.endsWith("00")) {
            return (
              <div
                key={time}
                className="row-start-1 -mt-3 flex justify-end pr-2 text-xs text-muted-foreground"
                style={{ gridRow: index + 2 }}
              >
                {time}
              </div>
            );
          }
          return null;
        })}

        {/* Day Headers */}
        {daysOfWeek.map((day, index) => (
          <div
            key={day}
            className="row-start-1 flex justify-center items-center p-2 font-medium text-sm"
            style={{ gridColumn: index + 2 }}
          >
            {day}
          </div>
        ))}

        {/* Grid Background Cells */}
        {daysOfWeek.map((_, dayIndex) =>
          timeSlots.map((time, timeIndex) => (
            <div
              key={`${dayIndex}-${timeIndex}`}
              onClick={() => onSelectSlot?.(dayIndex + 1, time)}
              className="border-r border-b border-border/30 cursor-pointer hover:bg-muted/50 transition-colors"
              style={{
                gridColumn: dayIndex + 2,
                gridRow: timeIndex + 2,
              }}
            />
          )),
        )}

        {/* Render Plans */}
        {plans.map((plan) => {
          const gridColumn = plan.weekday; // weekday is 1-7, grid col is 2-8
          const gridRowStart = getRowFromTime(plan.start_time);
          const gridRowEnd = getRowFromTime(plan.end_time);
          const colorClasses = getColorForSubject(plan.matiere.id);

          return (
            <div
              key={plan.id}
              onClick={() => onSelectPlan?.(plan)}
              className={cn(
                "m-px p-2 rounded-lg cursor-pointer overflow-hidden border transition-all hover:shadow-md hover:scale-[1.02] flex flex-col",
                colorClasses,
              )}
              style={{
                gridColumn: gridColumn + 1,
                gridRow: `${gridRowStart} / span ${gridRowEnd - gridRowStart}`,
              }}
            >
              <p className="font-bold text-sm truncate">
                {plan.matiere.libelle}
              </p>
              <p className="text-xs opacity-80 truncate">
                {plan.chapitres.map((c) => c.libelle).join(", ")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
