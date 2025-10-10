"use client";
import React from "react";
import { pie, arc, PieArcDatum } from "d3";
import {
  GenericDonutChart,
  ChartItem,
} from "@/components/ui/charts/pie-charts";

interface BestSubjectChartProps {
  data?: Array<{
    matiere: string;
    avg_note: number;
  }>;
}

const BestSubjectChart: React.FC<BestSubjectChartProps> = ({ data }) => {
  // Si pas de données ou données vides, afficher un message
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  // Convertir les données de l'API en format pour le graphique
  const chartData: ChartItem[] = data
    .filter((item) => item.matiere !== null)
    .slice(0, 5)
    .map((item, index) => ({
      name: item.matiere,
      value: (item.avg_note / 20) * 100, // Convertir la note en pourcentage
      color: ["#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#3b82f6"][
        index % 5
      ],
    }));

  const customColors = chartData
    .map((item) => item.color)
    .filter((c): c is string => !!c);

  // Config pour les labels externes
  const radius = 420;
  const gap = 0.01;
  const labelExternalRadius = radius + 40;
  const minAngle = 20;
  const pieLayout = pie<ChartItem>()
    .value((d) => d.value)
    .padAngle(gap);
  const arcExternal = arc<PieArcDatum<ChartItem>>()
    .innerRadius(labelExternalRadius)
    .outerRadius(labelExternalRadius);
  const arcs = pieLayout(chartData);

  const computeAngle = (d: PieArcDatum<ChartItem>) => {
    return ((d.endAngle - d.startAngle) * 180) / Math.PI;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Meilleures matières
        </h2>
      </div>

      {/* Légende avec points colorés */}
      <div className="flex flex-wrap gap-4 mb-6">
        {chartData.map((item, i) => (
          <span
            key={item.name}
            className="flex items-center text-sm text-gray-700 dark:text-gray-300"
          >
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            ></div>
            {item.name}
          </span>
        ))}
      </div>

      {/* Chart wrapper avec labels superposés */}
      <div className="relative">
        <GenericDonutChart
          data={chartData}
          customColors={customColors}
          radius={radius}
          gap={gap}
          showLabels={false}
          showTooltips={true}
          className="max-w-[16rem] mx-auto"
        />

        {/* SVG superposé pour les labels externes avec fond arrondi */}
        <svg
          viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
          className="absolute inset-0 w-full h-full pointer-events-none max-w-[16rem] mx-auto"
        >
          {arcs.map((d, i) => {
            const angle = computeAngle(d);
            if (angle < minAngle) return null;

            let centroid: [number, number] = arcExternal.centroid(d) || [0, 0];
            if (d.endAngle > Math.PI) {
              centroid[0] += 10;
              centroid[1] += 10;
            } else {
              centroid[0] -= 10;
              centroid[1] -= 0;
            }

            const percent = d.data.value.toFixed(0) + "%";
            const rectWidth = 50;
            const rectHeight = 32;
            const rx = 16;
            const x = centroid[0] - rectWidth / 2;
            const y = centroid[1] - rectHeight / 2;

            return (
              <g key={`${d.data.name}-${i}`} opacity={1}>
                <rect
                  x={x}
                  y={y}
                  width={rectWidth}
                  height={rectHeight}
                  rx={rx}
                  fill="#fef3c7"
                  stroke="#f59e0b"
                  strokeWidth={1}
                />
                <text
                  x={centroid[0]}
                  y={centroid[1] + 6}
                  textAnchor="middle"
                  fontSize={28}
                  fontWeight="600"
                  fill="#92400e"
                  style={{ pointerEvents: "none" }}
                >
                  {percent}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default BestSubjectChart;
