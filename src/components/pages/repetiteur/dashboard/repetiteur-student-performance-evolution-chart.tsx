"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PerformanceDataPoint {
  month: string;
  [studentName: string]: number | string; // Dynamique pour chaque élève
}

interface StudentConfig {
  name: string;
  color: string;
}

interface RepetiteurStudentPerformanceEvolutionChartProps {
  data: PerformanceDataPoint[];
  studentsConfig: StudentConfig[]; // Configuration des élèves (nom + couleur)
}

export function RepetiteurStudentPerformanceEvolutionChart({
  data,
  studentsConfig,
}: RepetiteurStudentPerformanceEvolutionChartProps) {
  // Créer la configuration dynamique pour chaque élève
  const chartConfig: ChartConfig = studentsConfig.reduce((config, student) => {
    config[student.name] = {
      label: student.name,
      color: student.color,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card className="bg-white rounded-[24px] shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">
          Évolution des performances des élèves
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
          <LineChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis domain={[0, 20]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {studentsConfig.map((student) => (
              <Line
                key={student.name}
                dataKey={student.name}
                stroke={student.color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
