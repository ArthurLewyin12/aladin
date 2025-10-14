"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEleveDashboard } from "@/services/hooks/stats/useEleveDashboard";
import { useSession } from "@/services/hooks/auth/useSession";

export const description = "Graphique d'évolution des notes par matière";

// Palette de couleurs pour les différentes matières - alignée avec score-donut.tsx
const SUBJECT_COLORS = [
  "#ec4899", // Rose
  "#10b981", // Vert
  "#f59e0b", // Orange
  "#8b5cf6", // Violet
  "#3b82f6", // Bleu
];

// Fonction pour obtenir une couleur stable basée sur le nom de la matière
const getSubjectColor = (subjectName: string, subjects: string[]) => {
  const index = subjects.indexOf(subjectName);
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
};

export function NotesEvolutionChart() {
  const [timeRange, setTimeRange] = React.useState<
    "week" | "month" | "quarter" | "semester" | "year"
  >("week");

  const { user } = useSession();
  const { data: dashboardData, isLoading } = useEleveDashboard(
    user?.id || 0,
    timeRange,
  );

  // Transformer les données pour le graphique
  const chartData = React.useMemo(() => {
    if (!dashboardData?.notes_evolution) return [];

    // Grouper les notes par date
    const groupedByDate = dashboardData.notes_evolution.reduce(
      (acc, note) => {
        const date = note.date;
        if (!acc[date]) {
          acc[date] = { date };
        }
        if (note.matiere) {
          acc[date][note.matiere] = note.note;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(groupedByDate);
  }, [dashboardData]);

  // Extraire les matières uniques pour la configuration du graphique
  const subjects = React.useMemo(() => {
    if (!dashboardData?.notes_evolution) return [];

    const uniqueSubjects = Array.from(
      new Set(
        dashboardData.notes_evolution
          .map((note) => note.matiere)
          .filter((m) => m !== null),
      ),
    );

    return uniqueSubjects;
  }, [dashboardData]);

  // Configuration dynamique du graphique basée sur les matières
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      notes: {
        label: "Notes",
      },
    };

    subjects.forEach((subject) => {
      config[subject] = {
        label: subject,
        color: getSubjectColor(subject, subjects),
      };
    });

    return config;
  }, [subjects]);

  const timeRangeLabels = {
    week: "7 derniers jours",
    month: "30 derniers jours",
    quarter: "3 derniers mois",
    semester: "6 derniers mois",
    year: "Année en cours",
  };

  if (isLoading) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Évolution des notes</CardTitle>
            <CardDescription>Chargement des données...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length || !subjects.length) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Évolution des notes</CardTitle>
            <CardDescription>
              Aucune note disponible pour cette période
            </CardDescription>
          </div>
          <Select
            value={timeRange}
            onValueChange={(value: any) => setTimeRange(value)}
          >
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label="Sélectionner une période"
            >
              <SelectValue placeholder={timeRangeLabels[timeRange]} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="week" className="rounded-lg">
                7 derniers jours
              </SelectItem>
              <SelectItem value="month" className="rounded-lg">
                30 derniers jours
              </SelectItem>
              <SelectItem value="quarter" className="rounded-lg">
                3 derniers mois
              </SelectItem>
              <SelectItem value="semester" className="rounded-lg">
                6 derniers mois
              </SelectItem>
              <SelectItem value="year" className="rounded-lg">
                Année en cours
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground">
              Aucune note disponible pour cette période
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Évolution des notes</CardTitle>
          <CardDescription>
            Tes notes par matière sur {timeRangeLabels[timeRange].toLowerCase()}
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(value: any) => setTimeRange(value)}
        >
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Sélectionner une période"
          >
            <SelectValue placeholder={timeRangeLabels[timeRange]} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="week" className="rounded-lg">
              7 derniers jours
            </SelectItem>
            <SelectItem value="month" className="rounded-lg">
              30 derniers jours
            </SelectItem>
            <SelectItem value="quarter" className="rounded-lg">
              3 derniers mois
            </SelectItem>
            <SelectItem value="semester" className="rounded-lg">
              6 derniers mois
            </SelectItem>
            <SelectItem value="year" className="rounded-lg">
              Année en cours
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              {subjects.map((subject) => {
                const color = getSubjectColor(subject, subjects);
                return (
                  <linearGradient
                    key={subject}
                    id={`fill${subject.replace(/\s+/g, "")}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 20]}
              ticks={[0, 5, 10, 15, 20]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("fr-FR", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                  formatter={(value, name) => (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{name}:</span>
                      <span className="font-bold">{value}/20</span>
                    </div>
                  )}
                />
              }
            />
            {subjects.map((subject) => (
              <Area
                key={subject}
                dataKey={subject}
                type="monotone"
                fill={`url(#fill${subject.replace(/\s+/g, "")})`}
                stroke={getSubjectColor(subject, subjects)}
                strokeWidth={2}
                stackId={undefined}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
