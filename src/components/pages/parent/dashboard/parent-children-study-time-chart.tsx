"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ChildStudyTime {
  name: string;
  hours: number;
  color: string;
}

interface ParentChildrenStudyTimeChartProps {
  data: ChildStudyTime[];
}

export function ParentChildrenStudyTimeChart({
  data,
}: ParentChildrenStudyTimeChartProps) {
  return (
    <Card className="bg-white rounded-[24px] shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">
          Temps d'étude par enfant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
