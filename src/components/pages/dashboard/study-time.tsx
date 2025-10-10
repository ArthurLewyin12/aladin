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
} from "recharts";
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

// Données mockées par défaut (pour le développement)
const defaultMockData: Record<PeriodType, StudyData[]> = {
  week: [
    { day: "Lun", PH: 2, Math: 1, Anglais: 0.5, Histoire: 0.5 },
    { day: "Mar", PH: 2.5, Math: 0.5, Anglais: 0.3, Histoire: 0.2 },
    { day: "Mer", Math: 1.5, Anglais: 1, Histoire: 0.5, Français: 1 },
    { day: "Jeu", PH: 1, Math: 1.5, Anglais: 0.5, Histoire: 0.5 },
    { day: "Ven", Math: 2, Anglais: 1, Français: 1.5, Espagnol: 0.5 },
    { day: "Sam", PH: 1, Math: 1.5, Anglais: 1.5, Espagnol: 2 },
    { day: "Dim", Anglais: 1, Espagnol: 0.5 },
  ],
  month: [
    { day: "S1", PH: 8, Math: 6, Anglais: 4, Histoire: 3 },
    { day: "S2", PH: 7, Math: 8, Anglais: 5, Français: 4 },
    { day: "S3", Math: 9, Anglais: 6, Histoire: 3, Espagnol: 5 },
    { day: "S4", PH: 6, Math: 10, Français: 7, Espagnol: 4 },
  ],
  quarter: [
    { day: "M1", PH: 25, Math: 30, Anglais: 20, Histoire: 15 },
    { day: "M2", PH: 28, Math: 32, Français: 22, Espagnol: 18 },
    { day: "M3", Math: 35, Anglais: 25, Histoire: 20, Espagnol: 20 },
  ],
  year: [
    { day: "T1", PH: 80, Math: 95, Anglais: 70, Histoire: 60 },
    { day: "T2", PH: 85, Math: 100, Français: 75, Espagnol: 65 },
    { day: "T3", Math: 105, Anglais: 80, Histoire: 70, Espagnol: 75 },
    { day: "T4", PH: 90, Math: 110, Français: 85, Espagnol: 80 },
  ],
};

// Matières par défaut (pour le développement)
const defaultSubjects: SubjectConfig[] = [
  { name: "PH", color: "#B4A5D9" },
  { name: "Math", color: "#E897C5" },
  { name: "Anglais", color: "#A8D5A8" },
  { name: "Histoire", color: "#F5A57A" },
  { name: "Français", color: "#7EC8E3" },
  { name: "Espagnol", color: "#F5C27A" },
];

const periodLabels: Record<PeriodType, string> = {
  week: "Cette semaine",
  month: "Ce mois-ci",
  quarter: "Ce trimestre",
  year: "Cette année",
};

// Fonction pour générer une couleur basée sur l'index
const generateColor = (index: number): string => {
  const colors = [
    "#B4A5D9",
    "#E897C5",
    "#A8D5A8",
    "#F5A57A",
    "#7EC8E3",
    "#F5C27A",
    "#F5B7C5",
    "#A8C5E3",
    "#D9C5A8",
    "#C5A8D9",
    "#A8D9C5",
    "#E3A8C5",
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

export function StudyTimeChart({
  data = defaultMockData,
  subjects,
  defaultPeriod = "week",
}: StudyTimeChartProps) {
  const [selectedPeriod, setSelectedPeriod] =
    useState<PeriodType>(defaultPeriod);

  const currentData = data[selectedPeriod];

  // Si les matières ne sont pas fournies, les extraire des données
  const subjectsList =
    subjects ||
    extractSubjectsFromData(currentData).map((name, index) => ({
      name,
      color: generateColor(index),
    }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Temps d'étude</h2>
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
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666", fontSize: 12 }}
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
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`${value}h`, ""]}
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
          {subjectsList.map((subject) => (
            <Bar
              key={subject.name}
              dataKey={subject.name}
              stackId="a"
              fill={subject.color}
              radius={[7, 7, 0, 0]}
              barSize={40}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
