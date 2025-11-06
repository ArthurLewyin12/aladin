"use client";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface EvolutionData {
  date: string;
  [key: string]: number | string; // Pour supporter les matières dynamiques
}

interface NotesEvolutionLineChartProps {
  data: EvolutionData[];
  matieres?: string[]; // Liste des matières à afficher
}

// Palette de couleurs pour les différentes matières
const COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#6366f1", // indigo
  "#f97316", // orange
  "#06b6d4", // cyan
];

export function NotesEvolutionLineChart({
  data,
  matieres,
}: NotesEvolutionLineChartProps) {
  const [filter, setFilter] = useState<"aladin" | "cours" | "both">("both");

  if (!data || data.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Évolution Temporelle par Matière</CardTitle>
          <CardDescription>Pas encore de données d'évolution</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Extraire automatiquement les matières depuis toutes les données (pas juste la première ligne)
  const allKeys = new Set<string>();
  data.forEach((point) => {
    Object.keys(point).forEach((key) => {
      if (key !== "date") {
        allKeys.add(key);
      }
    });
  });

  let displayMatieres = matieres || Array.from(allKeys);

  // Appliquer le filtre
  if (filter === "aladin") {
    displayMatieres = displayMatieres.filter((m) => m.includes("(Aladin)"));
  } else if (filter === "cours") {
    displayMatieres = displayMatieres.filter((m) => m.includes("(Classe)"));
  }

  // Si aucune matière trouvée, afficher un message
  if (displayMatieres.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Évolution Temporelle par Matière</CardTitle>
          <CardDescription>Pas encore de données d'évolution</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Construire la config dynamiquement
  const chartConfig: ChartConfig = {};
  displayMatieres.forEach((matiere, index) => {
    chartConfig[matiere] = {
      label: matiere,
      color: COLORS[index % COLORS.length],
    };
  });

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Évolution Temporelle par Matière</CardTitle>
        <CardDescription>
          Progression de tes notes par matière au fil du temps
        </CardDescription>

        {/* Filtre pour choisir l'affichage */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <Button
            variant={filter === "aladin" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("aladin")}
            className={
              filter === "aladin" ? "bg-blue-500 hover:bg-blue-600" : ""
            }
          >
            Notes Aladin
          </Button>
          <Button
            variant={filter === "cours" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("cours")}
            className={
              filter === "cours" ? "bg-green-500 hover:bg-green-600" : ""
            }
          >
            Notes Cours
          </Button>
          <Button
            variant={filter === "both" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("both")}
            className={
              filter === "both" ? "bg-orange-500 hover:bg-orange-600" : ""
            }
          >
            Aladin vs Cours
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Legend />
            {displayMatieres.map((matiere, index) => {
              // Déterminer si c'est Aladin ou Classe
              const isClasse = matiere.includes("(Classe)");
              const baseMatiere = matiere
                .replace(" (Aladin)", "")
                .replace(" (Classe)", "");

              // Utiliser la même couleur de base pour une matière, peu importe si Aladin ou Classe
              const matiereIndex = Array.from(
                new Set(
                  displayMatieres.map((m) =>
                    m.replace(" (Aladin)", "").replace(" (Classe)", ""),
                  ),
                ),
              ).indexOf(baseMatiere);

              const color = COLORS[matiereIndex % COLORS.length];

              return (
                <Line
                  key={matiere}
                  dataKey={matiere}
                  type="monotone"
                  stroke={color}
                  strokeWidth={3}
                  strokeDasharray={isClasse ? "5 5" : "0"}
                  dot={{
                    fill: color,
                    stroke: color,
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    fill: color,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  name={matiere}
                  connectNulls={true}
                />
              );
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
