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

  // Palette de couleurs vibrantes et distinctes pour chaque matière
  const colorPalette = [
    "#FF6B6B", // Rouge corail - Matière 1
    "#4ECDC4", // Turquoise - Matière 2
    "#FFE66D", // Jaune vif - Matière 3
    "#A8E6CF", // Vert menthe - Matière 4
    "#FF8B94", // Rose saumon - Matière 5
    "#95E1D3", // Vert aqua - Matière 6
    "#FFAAA5", // Pêche - Matière 7
    "#B4A7D6", // Lavande - Matière 8
  ];

  // Filtrer les matières avec une moyenne > 0 uniquement
  const validData = data.filter(
    (item) => item.matiere !== null && item.avg_note > 0
  );

  // Si aucune donnée valide, afficher un message
  if (validData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">
            Aucune note disponible. Commence à faire des quiz pour voir tes
            meilleures matières !
          </p>
        </div>
      </div>
    );
  }

  // Créer un mapping matière -> couleur stable
  // On trie d'abord par nom pour avoir un ordre consistant
  const sortedData = [...validData]
    .sort((a, b) => a.matiere.localeCompare(b.matiere))
    .slice(0, 8);

  // Créer le mapping couleur
  const colorMap = new Map<string, string>();
  sortedData.forEach((item, index) => {
    colorMap.set(item.matiere, colorPalette[index % colorPalette.length]);
  });

  // Convertir les données de l'API en format pour le graphique
  // en gardant l'ordre original (trié par avg_note décroissant de l'API)
  const chartData: ChartItem[] = validData
    .slice(0, 8)
    .map((item) => ({
      name: item.matiere,
      value: (item.avg_note / 20) * 100, // Convertir la note en pourcentage
      color: colorMap.get(item.matiere) || colorPalette[0],
    }));

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
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-100 to-pink-100">
          <svg
            className="h-5 w-5 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Meilleures matières
        </h2>
      </div>

      {/* Légende avec points colorés et fond */}
      <div className="flex flex-wrap gap-3 mb-6">
        {chartData.map((item, i) => (
          <span
            key={item.name}
            className="flex items-center text-sm font-medium text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: `${item.color}15`,
              borderLeft: `3px solid ${item.color}`,
            }}
          >
            <div
              className="w-3 h-3 rounded-full mr-2 shadow-sm"
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

            // Utiliser la couleur de la matière avec une opacité réduite pour le fond
            const bgColor = d.data.color ? `${d.data.color}20` : "#fef3c7";
            const borderColor = d.data.color || "#f59e0b";

            return (
              <g key={`${d.data.name}-${i}`} opacity={1}>
                <rect
                  x={x}
                  y={y}
                  width={rectWidth}
                  height={rectHeight}
                  rx={rx}
                  fill={bgColor}
                  stroke={borderColor}
                  strokeWidth={2}
                />
                <text
                  x={centroid[0]}
                  y={centroid[1] + 6}
                  textAnchor="middle"
                  fontSize={28}
                  fontWeight="600"
                  fill="#1f2937"
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
