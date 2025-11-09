"use client";

import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

// Palette de couleurs pour les différentes matières
const SUBJECT_COLORS = [
  "#ec4899", // Rose
  "#10b981", // Vert
  "#f59e0b", // Orange
  "#8b5cf6", // Violet
  "#3b82f6", // Bleu
];

// Fonction pour obtenir une couleur stable basée sur le nom de la matière
// Cette fonction sera remplacée par chartConfig.color dans le tooltip
const getSubjectColor = (subjectName: string, subjects: string[]) => {
  const index = subjects.indexOf(subjectName);
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
};

// Mapping des jours en anglais vers le français
const dayMapping: Record<string, string> = {
  Mon: "Lun",
  Tue: "Mar",
  Wed: "Mer",
  Thu: "Jeu",
  Fri: "Ven",
  Sat: "Sam",
  Sun: "Dim",
  Monday: "Lundi",
  Tuesday: "Mardi",
  Wednesday: "Mercredi",
  Thursday: "Jeudi",
  Friday: "Vendredi",
  Saturday: "Samedi",
  Sunday: "Dimanche",
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

    // Grouper les notes par date et matière (calculer la moyenne si plusieurs notes)
    const groupedByDateAndSubject: Record<
      string,
      Record<string, number[]>
    > = {};

    dashboardData.notes_evolution.forEach((note) => {
      if (!note.matiere) return; // Ignorer les notes sans matière

      const date = note.date;
      if (!groupedByDateAndSubject[date]) {
        groupedByDateAndSubject[date] = {};
      }
      if (!groupedByDateAndSubject[date][note.matiere]) {
        groupedByDateAndSubject[date][note.matiere] = [];
      }
      groupedByDateAndSubject[date][note.matiere].push(
        parseFloat(String(note.note)),
      );
    });

    // Calculer les moyennes et créer les données du graphique
    const groupedByDate: Record<string, any> = {};
    Object.entries(groupedByDateAndSubject).forEach(([date, subjects]) => {
      groupedByDate[date] = { date };
      Object.entries(subjects).forEach(([subject, notes]) => {
        // Calculer la moyenne des notes pour cette matière ce jour-là
        const average = notes.reduce((sum, n) => sum + n, 0) / notes.length;
        groupedByDate[date][subject] = Math.round(average * 10) / 10; // Arrondir à 1 décimale
      });
    });

    // Générer tous les jours de la période
    let allDates: string[] = [];
    if (timeRange === "week") {
      // Pour la semaine, générer les jours du lundi au dimanche de la semaine actuelle
      const today = new Date();
      const currentDay = today.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi

      // Calculer le lundi de cette semaine
      const monday = new Date(today);
      const daysFromMonday = currentDay === 0 ? -6 : -(currentDay - 1); // Si dimanche, remonter de 6 jours, sinon remonter de (jour - 1)
      monday.setDate(today.getDate() + daysFromMonday);

      // Générer les 7 jours de la semaine (Lundi à Dimanche)
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        allDates.push(dateStr);
      }
    } else {
      // Pour les autres périodes, utiliser les dates existantes
      allDates = Object.keys(groupedByDate).sort();
    }

    // Créer le résultat final avec tous les jours
    const result = allDates.map((date) => {
      return groupedByDate[date] || { date };
    });

    return result;
  }, [dashboardData, timeRange]);

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
          <LineChart data={chartData}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: "#666", fontSize: 12 }}
              tickFormatter={(value) => {
                // Pour la semaine, afficher les jours (Lun, Mar, etc.)
                if (timeRange === "week") {
                  const date = new Date(value);
                  const dayName = date.toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                  return dayMapping[dayName] || dayName;
                }
                // Pour les autres périodes, afficher la date
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
              tick={{ fill: "#666", fontSize: 12 }}
              domain={[0, 20]}
              ticks={[0, 5, 10, 15, 20]}
              tickFormatter={(value) => `${value}/20`}
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
                />
              }
            />
            {subjects.map((subject) => (
              <Line
                key={subject}
                dataKey={subject}
                type="linear"
                stroke={getSubjectColor(subject, subjects)}
                strokeWidth={2.5}
                fill="none"
                dot={{
                  fill: getSubjectColor(subject, subjects),
                  strokeWidth: 2,
                  r: 4,
                  stroke: "#fff",
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                connectNulls={true}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
