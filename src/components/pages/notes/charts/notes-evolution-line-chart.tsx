"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";
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

interface EvolutionData {
  date: string;
  moyenne_aladin: number;
  moyenne_classe: number;
}

interface NotesEvolutionLineChartProps {
  data: EvolutionData[];
}

const chartConfig = {
  moyenne_aladin: {
    label: "Moyenne Aladin",
    color: "var(--chart-1)",
  },
  moyenne_classe: {
    label: "Moyenne Classe",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function NotesEvolutionLineChart({
  data,
}: NotesEvolutionLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Évolution Temporelle</CardTitle>
          <CardDescription>Pas encore de données d'évolution</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Évolution Temporelle</CardTitle>
        <CardDescription>
          Progression de tes moyennes au fil du temps
        </CardDescription>
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
            <Line
              dataKey="moyenne_aladin"
              type="monotone"
              stroke="var(--color-moyenne_aladin)"
              strokeWidth={3}
              dot={{
                fill: "var(--color-moyenne_aladin)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
              name="Aladin"
            />
            <Line
              dataKey="moyenne_classe"
              type="monotone"
              stroke="var(--color-moyenne_classe)"
              strokeWidth={3}
              dot={{
                fill: "var(--color-moyenne_classe)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
              name="Classe"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
