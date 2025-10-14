"use client";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import type { RectangleProps } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PeriodType = "week" | "month" | "quarter" | "year";

interface StudyData {
  day: string;
  [subject: string]: number | string; // Clés dynamiques pour les matières
}

interface SubjectConfig {
  name: string;
  color: string;
}

interface StudyTimeChartProps {
  data?: Record<PeriodType, StudyData[]>;
  subjects?: SubjectConfig[];
  defaultPeriod?: PeriodType;
}

const periodLabels: Record<PeriodType, string> = {
  week: "Cette semaine",
  month: "Ce mois-ci",
  quarter: "Ce trimestre",
  year: "Cette année",
};

// Palette de couleurs pastel douces et harmonieuses (comme la maquette)
const generateColor = (index: number): string => {
  const colors = [
    "#C5B9D6", // Lavande clair (violet doux)
    "#F5A6A0", // Rose saumon doux
    "#B8E6D5", // Vert menthe pastel
    "#FFD7A8", // Pêche/orange pastel
    "#D4A5D9", // Violet/mauve pastel
    "#F5B8D4", // Rose pastel
    "#A8D8EA", // Bleu ciel pastel
    "#FFE5B4", // Jaune pastel
    "#D5C4E8", // Lavande moyen
    "#B5E7A0", // Vert clair pastel
    "#FAD5C0", // Beige rosé
    "#C9E4DE", // Vert d'eau pastel
  ];
  return colors[index % colors.length];
};

// Fonction pour extraire les matières uniques des données
const extractSubjectsFromData = (data: StudyData[]): string[] => {
  const subjectsSet = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== "day") {
        subjectsSet.add(key);
      }
    });
  });
  return Array.from(subjectsSet);
};

// Composant custom pour les barres avec bordures alternées pair/impair
const RoundedBar = (props: any) => {
  const { fill, x, y, width, height, index, isLast } = props;

  if (!height || height <= 0) return null;

  const curveDepth = 10; // Profondeur de la courbe
  const midX = x + width / 2;
  const cornerRadius = 8;

  const isPair = index % 2 === 0; // Position paire (0, 2, 4...)

  let path = "";

  if (isPair) {
    // POSITION PAIRE : bas normal, haut arrondi TRÈS BOMBÉ vers l'extérieur
    if (index === 0) {
      // Toute première : bas plat, haut très arrondi
      path = `
        M ${x},${y}
        L ${x},${y + height}
        Q ${midX},${y + height + curveDepth} ${x + width},${y + height}
        L ${x + width},${y}
        Z
      `;
    } else {
      // Autres paires : bas creusé pour épouser l'impaire d'en dessous, haut très bombé
      path = `
        M ${x},${y}
        Q ${midX},${y - curveDepth} ${x + width},${y}
        L ${x + width},${y + height}
        Q ${midX},${y + height + curveDepth} ${x},${y + height}
        Z
      `;
    }
  } else {
    // POSITION IMPAIRE : bas creusé vers l'intérieur, haut très arrondi
    if (isLast) {
      // Dernière : bas creusé, haut avec coins très arrondis (demi-cercle)
      const topRadius = width / 2;
      path = `
        M ${x},${y}
        Q ${midX},${y - curveDepth} ${x + width},${y}
        L ${x + width},${y + height - topRadius}
        Q ${x + width},${y + height} ${midX},${y + height}
        Q ${x},${y + height} ${x},${y + height - topRadius}
        Z
      `;
    } else {
      // Autres impaires : bas creusé, haut très bombé
      path = `
        M ${x},${y}
        Q ${midX},${y - curveDepth} ${x + width},${y}
        L ${x + width},${y + height}
        Q ${midX},${y + height + curveDepth} ${x},${y + height}
        Z
      `;
    }
  }

  return <path d={path} fill={fill} stroke="none" />;
};

export function StudyTimeChart({
  data,
  subjects,
  defaultPeriod = "week",
}: StudyTimeChartProps) {
  const [selectedPeriod, setSelectedPeriod] =
    useState<PeriodType>(defaultPeriod);

  // Vérifier si les données sont fournies et valides
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }

  const currentData = data[selectedPeriod];

  // Vérifier si les données pour la période sélectionnée sont vides
  if (!currentData || currentData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Aucune donnée disponible pour cette période
        </p>
      </div>
    );
  }

  // Si les matières ne sont pas fournies, les extraire des données
  const subjectsList =
    subjects ||
    extractSubjectsFromData(currentData).map((name, index) => ({
      name,
      color: generateColor(index),
    }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Select
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value as PeriodType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(periodLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={currentData}
          margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666", fontSize: 12 }}
            tickFormatter={(value) => {
              // Mapping des jours en anglais vers le français
              const dayMapping: Record<string, string> = {
                "Mon": "Lun",
                "Tue": "Mar",
                "Wed": "Mer",
                "Thu": "Jeu",
                "Fri": "Ven",
                "Sat": "Sam",
                "Sun": "Dim",
                "Monday": "Lundi",
                "Tuesday": "Mardi",
                "Wednesday": "Mercredi",
                "Thursday": "Jeudi",
                "Friday": "Vendredi",
                "Saturday": "Samedi",
                "Sunday": "Dimanche"
              };
              return dayMapping[value] || value;
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666", fontSize: 12 }}
            label={{
              value: selectedPeriod === "week" ? "8h" : "",
              position: "top",
              offset: 10,
              style: { fill: "#666", fontSize: 12 },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "13px",
              padding: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
            formatter={(value: number) => [`${value.toFixed(1)}h`, ""]}
            labelStyle={{ fontWeight: "600", marginBottom: "8px" }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span
                style={{ color: "#666", fontSize: "12px", marginLeft: "4px" }}
              >
                {value}
              </span>
            )}
          />
          {subjectsList.map((subject, index) => {
            const isPair = index % 2 === 0;
            const isLast = index === subjectsList.length - 1;

            // Déterminer les radius selon la position
            let radius: [number, number, number, number] | number = [0, 0, 0, 0];

            if (index === 0) {
              // Premier : haut arrondi, bas plat
              radius = [0, 0, 10, 10];
            } else if (isPair) {
              // Pair : haut et bas arrondis
              radius = [10, 10, 10, 10];
            } else if (isLast) {
              // Dernier impair : très arrondi en haut
              radius = [15, 15, 10, 10];
            } else {
              // Impair milieu : haut et bas arrondis
              radius = [10, 10, 10, 10];
            }

            return (
              <Bar
                key={subject.name}
                dataKey={subject.name}
                stackId="a"
                fill={subject.color}
                radius={radius}
                barSize={40}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
