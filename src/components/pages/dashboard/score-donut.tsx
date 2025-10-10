"use client";
import React, { useState } from "react";
import { pie, arc, PieArcDatum } from "d3";
import {
  GenericDonutChart,
  ChartItem,
} from "@/components/ui/charts/pie-charts";

const BestSubjectChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Cette semaine");

  const periods = ["Cette semaine", "Ce mois-ci", "Cette année"];

  // Données mockées dynamiques par période (valeurs = scores en %)
  const dataByPeriod: Record<string, ChartItem[]> = {
    "Cette semaine": [
      { name: "Mathématiques", value: 40, color: "#ec4899" }, // Rose
      { name: "Anglais", value: 80, color: "#10b981" }, // Vert
    ],
    "Ce mois-ci": [
      { name: "Mathématiques", value: 70, color: "#ec4899" },
      { name: "Anglais", value: 85, color: "#10b981" },
    ],
    "Cette année": [
      { name: "Mathématiques", value: 65, color: "#ec4899" },
      { name: "Anglais", value: 90, color: "#10b981" },
    ],
  };

  const currentData =
    dataByPeriod[selectedPeriod] || dataByPeriod["Cette semaine"];
  const customColors = currentData
    .map((item) => item.color)
    .filter((c): c is string => !!c);

  // Config pour les labels externes (dupliqué de GenericDonutChart pour le wrapper)
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
  const arcs = pieLayout(currentData);

  const computeAngle = (d: PieArcDatum<ChartItem>) => {
    return ((d.endAngle - d.startAngle) * 180) / Math.PI;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
      {/* Header : Titre + Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Meilleure matière
        </h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {periods.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>

      {/* Légende avec points colorés */}
      <div className="flex space-x-6 mb-6">
        {currentData.map((item, i) => (
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
          data={currentData}
          customColors={customColors}
          radius={radius}
          gap={gap}
          showLabels={false} // Désactive les labels internes
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
            // Ajustement de position comme dans GenericDonutChart
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
            const rx = 16; // Pour forme pilule
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
