"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
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

interface ComparisonData {
  matiere: string;
  note_aladin: number;
  note_classe: number;
}

interface NotesComparisonBarChartProps {
  data: ComparisonData[];
}

const chartConfig = {
  note_aladin: {
    label: "Notes Aladin",
    color: "var(--chart-1)",
  },
  note_classe: {
    label: "Notes de Classe",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function NotesComparisonBarChart({
  data,
}: NotesComparisonBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Comparaison par Matière</CardTitle>
          <CardDescription>Pas encore de données à comparer</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Comparaison par Matière</CardTitle>
        <CardDescription>
          Moyennes Aladin vs Classe pour chaque matière
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="matiere"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                // Tronquer les noms longs pour mobile
                return value.length > 10
                  ? value.substring(0, 10) + "..."
                  : value;
              }}
            />
            <YAxis domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Legend />
            <Bar
              dataKey="note_aladin"
              fill="var(--color-note_aladin)"
              radius={[8, 8, 0, 0]}
              name="Aladin"
            />
            <Bar
              dataKey="note_classe"
              fill="var(--color-note_classe)"
              radius={[8, 8, 0, 0]}
              name="Classe"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
