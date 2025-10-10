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
