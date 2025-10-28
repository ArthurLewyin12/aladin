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
  [childName: string]: number | string; // Dynamique pour chaque enfant
}

interface ChildConfig {
  name: string;
  color: string;
}

interface ParentPerformanceEvolutionChartProps {
  data: PerformanceDataPoint[];
  childrenConfig: ChildConfig[]; // Configuration des enfants (nom + couleur)
}

export function ParentPerformanceEvolutionChart({
  data,
  childrenConfig,
}: ParentPerformanceEvolutionChartProps) {
  // Créer la configuration dynamique pour chaque enfant
  const chartConfig: ChartConfig = childrenConfig.reduce((config, child) => {
    config[child.name] = {
      label: child.name,
      color: child.color,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card className="bg-white rounded-[24px] shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">
          Évolution des performances
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
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
            {childrenConfig.map((child) => (
              <Line
                key={child.name}
                dataKey={child.name}
                stroke={child.color}
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
