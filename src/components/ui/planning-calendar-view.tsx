"use client";

import * as React from "react";
import { StudyPlan } from "@/services/controllers/types/common";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlanningCalendarViewProps {
  plans: StudyPlan[];
  onSelectSlot?: (day: number, time: string) => void;
  onSelectPlan?: (plan: StudyPlan) => void;
  className?: string;
}

// Générer les créneaux de 00h à 23h (24 heures complètes)
const timeSlots = Array.from({ length: 24 }, (_, i) => {
  return `${String(i).padStart(2, "0")}:00`;
});

const subjectColors: Record<number, string> = {
  0: "bg-blue-50 border-l-4 border-l-blue-500 text-blue-900 hover:bg-blue-100",
  1: "bg-amber-50 border-l-4 border-l-amber-500 text-amber-900 hover:bg-amber-100",
  2: "bg-emerald-50 border-l-4 border-l-emerald-500 text-emerald-900 hover:bg-emerald-100",
  3: "bg-violet-50 border-l-4 border-l-violet-500 text-violet-900 hover:bg-violet-100",
  4: "bg-rose-50 border-l-4 border-l-rose-500 text-rose-900 hover:bg-rose-100",
  5: "bg-indigo-50 border-l-4 border-l-indigo-500 text-indigo-900 hover:bg-indigo-100",
  6: "bg-pink-50 border-l-4 border-l-pink-500 text-pink-900 hover:bg-pink-100",
};

const getColorForSubject = (subjectId: number) => {
  return subjectColors[subjectId % 7];
};

export function PlanningCalendarView({
  plans,
  onSelectSlot,
  onSelectPlan,
  className,
}: PlanningCalendarViewProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Update current time every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getRowFromTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);

    // Calculer la position depuis minuit (0h)
    const totalMinutesFromStart = hour * 60 + minute;
    return totalMinutesFromStart / 60 + 2;
  };

  const getCurrentTimeRow = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Calculer la position depuis minuit (0h)
    const totalMinutesFromStart = hours * 60 + minutes;
    const row = totalMinutesFromStart / 60 + 2;
    return row;
  };

  const currentTimeRow = getCurrentTimeRow();
  const todayIndex = weekDays.findIndex((day) => isToday(day));

  return (
    <TooltipProvider>
      <div
        className={cn(
          "bg-white rounded-2xl border shadow-sm overflow-hidden",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">
            Planning de la semaine
          </h2>
          <p className="text-sm text-gray-600">
            {format(weekStart, "d", { locale: fr })} au{" "}
            {format(weekEnd, "d MMM yyyy", { locale: fr })}
          </p>
          <Button
            size="sm"
            onClick={() => onSelectSlot?.(1, "09:00:00")}
            className="h-9 gap-2 bg-[#2C3E50] hover:bg-[#1a252f] text-white"
          >
            <Plus className="w-4 h-4" />
            Nouveau créneau
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="relative overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="relative grid grid-cols-[80px_repeat(7,1fr)]">
              {/* Day Headers */}
              <div className="h-12 bg-gray-50/50 border-b" />
              {weekDays.map((day, index) => {
                const isCurrentDay = isToday(day);
                const dayOfWeek = [
                  "Lun",
                  "Mar",
                  "Mer",
                  "Jeu",
                  "Ven",
                  "Sam",
                  "Dim",
                ][index];
                return (
                  <motion.div
                    key={day.toString()}
                    className={cn(
                      "h-12 flex flex-col items-center justify-center border-l border-b bg-gray-50/50 text-sm font-medium transition-colors",
                      isCurrentDay && "bg-orange-50",
                    )}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <span className="text-gray-600 text-xs">{dayOfWeek}</span>
                    <span
                      className={cn(
                        "text-base font-semibold mt-0.5",
                        isCurrentDay &&
                          "flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </motion.div>
                );
              })}

              {/* Time Labels + Grid Cells */}
              {timeSlots.map((time, timeIndex) => (
                <React.Fragment key={time}>
                  {/* Time Label */}
                  <div
                    className="h-16 flex items-start justify-end pr-3 pt-1 text-xs text-gray-500 font-medium border-b"
                    style={{ gridRow: timeIndex + 2 }}
                  >
                    {time}
                  </div>

                  {/* Day Cells */}
                  {weekDays.map((day, dayIndex) => (
                    <motion.div
                      key={`${day.toString()}-${time}`}
                      onClick={() => onSelectSlot?.(dayIndex + 1, `${time}:00`)}
                      className={cn(
                        "h-16 border-l border-b relative cursor-pointer transition-colors group",
                        dayIndex === todayIndex && "bg-orange-50/20",
                        "hover:bg-gray-50",
                      )}
                      style={{
                        gridColumn: dayIndex + 2,
                        gridRow: timeIndex + 2,
                      }}
                      whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </React.Fragment>
              ))}

              {/* Current Time Indicator */}
              {currentTimeRow !== null && todayIndex !== -1 && (
                <div
                  className="absolute h-0.5 bg-red-500 z-30 pointer-events-none"
                  style={{
                    gridColumn: `${todayIndex + 2}`,
                    gridRow: currentTimeRow,
                    left: "80px",
                    right: 0,
                    top: 0,
                  }}
                >
                  <div className="absolute left-0 top-[-4px] w-2 h-2 rounded-full bg-red-500" />
                </div>
              )}

              {/* Render Plans */}
              {plans.map((plan) => {
                // weekday: 1=Monday, 7=Sunday
                const gridColumn = plan.weekday === 7 ? 8 : plan.weekday + 1;
                const gridRowStart = Math.floor(
                  getRowFromTime(plan.start_time),
                );
                const gridRowEnd = Math.ceil(getRowFromTime(plan.end_time));
                const rowSpan = gridRowEnd - gridRowStart;

                const colorClasses = getColorForSubject(plan.matiere.id);

                return (
                  <Tooltip key={plan.id} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <motion.div
                        layoutId={`plan-${plan.id}`}
                        onClick={() => onSelectPlan?.(plan)}
                        className={cn(
                          "m-1 p-3 rounded-lg cursor-pointer shadow-sm overflow-hidden transition-all z-20",
                          colorClasses,
                        )}
                        style={{
                          gridColumn: gridColumn,
                          gridRow: `${gridRowStart} / ${gridRowEnd}`,
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow:
                            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                          transition: { duration: 0.2 },
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-col h-full">
                          <p className="font-bold text-sm leading-tight line-clamp-1">
                            {plan.matiere.libelle}
                          </p>
                          <p className="text-xs opacity-75 mt-1 line-clamp-2">
                            {plan.chapitres.map((c) => c.libelle).join(", ")}
                          </p>
                          {plan.chapitres.length > 0 && rowSpan > 1 && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 mt-auto text-xs font-medium rounded-full bg-white/50 w-fit">
                              {plan.chapitres.length} ch.
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-semibold">{plan.matiere.libelle}</p>
                        <p className="text-sm text-muted-foreground">
                          {plan.start_time.substring(0, 5)} -{" "}
                          {plan.end_time.substring(0, 5)}
                        </p>
                        {plan.chapitres.length > 0 && (
                          <div>
                            <p className="text-xs font-medium mb-1">
                              Chapitres :
                            </p>
                            <ul className="text-xs space-y-1">
                              {plan.chapitres.map((ch) => (
                                <li key={ch.id}>• {ch.libelle}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
