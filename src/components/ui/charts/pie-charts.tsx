"use client";
import React from "react";
import { pie, arc, PieArcDatum } from "d3";
import { AnimatedSlice } from "./animated-slice";
import { ClientTooltip, TooltipTrigger, TooltipContent } from "../tooltip";

// Types génériques pour les données
export type ChartItem = {
  name: string;
  value: number;
  color?: string; // Couleur personnalisée optionnelle
};

type ColorTheme = "purple" | "blue" | "fuchsia" | "yellow";

export function GenericDonutChart({
  data,
  singleColor = "purple",
  radius = 420,
  innerRadiusRatio = 1.625,
  gap = 0.01,
  showLabels = true,
  showTooltips = true,
  customColors,
  className = "",
}: {
  data: ChartItem[];
  singleColor?: ColorTheme;
  radius?: number;
  innerRadiusRatio?: number;
  gap?: number;
  showLabels?: boolean;
  showTooltips?: boolean;
  customColors?: string[];
  className?: string;
}) {
  const lightStrokeEffect = 10;
  const innerRadius = radius / innerRadiusRatio;

  // Calculer le total pour les pourcentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Pie layout et arc generator
  const pieLayout = pie<ChartItem>()
    .value((d) => d.value)
    .padAngle(gap);
  const arcGenerator = arc<PieArcDatum<ChartItem>>()
    .innerRadius(innerRadius)
    .outerRadius(radius)
    .cornerRadius(lightStrokeEffect + 2);
  const labelRadius = radius * 0.825;
  const arcLabel = arc<PieArcDatum<ChartItem>>()
    .innerRadius(labelRadius)
    .outerRadius(labelRadius);
  const arcs = pieLayout(data);

  // Fonction pour calculer l'angle
  function computeAngle(d: PieArcDatum<ChartItem>) {
    return ((d.endAngle - d.startAngle) * 180) / Math.PI;
  }

  const minAngle = 20;

  // Palettes de couleurs
  const colors = {
    purple: ["#7e4cfe", "#895cfc", "#956bff", "#a37fff", "#b291fd", "#b597ff"],
    blue: [
      "#73caee",
      "#73caeeee",
      "#73caeedd",
      "#73caeecc",
      "#73caeebb",
      "#73caeeaa",
    ],
    fuchsia: [
      "#f6a3ef",
      "#f6a3efee",
      "#f6a3efdd",
      "#f6a3efcc",
      "#f6a3efbb",
      "#f6a3efaa",
    ],
    yellow: [
      "#f6e71f",
      "#f6e71fee",
      "#f6e71fdd",
      "#f6e71fcc",
      "#f6e71fbb",
      "#f6e71faa",
    ],
  };

  // Gestion des couleurs
  const getColor = (index: number, item: ChartItem) => {
    if (item.color) return item.color;
    if (customColors && customColors[index]) return customColors[index];
    return colors[singleColor][index % colors[singleColor].length];
  };

  return (
    <div className={`relative mt-4 ${className}`}>
      <ClientTooltip>
        <svg
          viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
          className="max-w-[16rem] mx-auto overflow-visible"
        >
          {arcs.map((d, i) => {
            const angle = computeAngle(d);
            let centroid = arcLabel.centroid(d);

            if (d.endAngle > Math.PI) {
              centroid[0] += 10;
              centroid[1] += 10;
            } else {
              centroid[0] -= 10;
              centroid[1] -= 0;
            }

            return (
              <AnimatedSlice key={`${d.data.name}-${i}`} index={i}>
                {showTooltips ? (
                  <TooltipTrigger>
                    <path
                      stroke="#ffffff33"
                      strokeWidth={lightStrokeEffect}
                      fill={getColor(i, d.data)}
                      d={arcGenerator(d) || undefined}
                      style={{ cursor: "pointer" }}
                    />
                    <TooltipContent>
                      <div className="text-sm">
                        <div className="font-semibold">{d.data.name}</div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Valeur: {d.data.value.toLocaleString()}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Pourcentage:{" "}
                          {((d.data.value / total) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </TooltipContent>
                  </TooltipTrigger>
                ) : (
                  <path
                    stroke="#ffffff33"
                    strokeWidth={lightStrokeEffect}
                    fill={getColor(i, d.data)}
                    d={arcGenerator(d) || undefined}
                  />
                )}
                {/* Labels conditionnels */}
                {showLabels && (
                  <g opacity={angle > minAngle ? 1 : 0}>
                    <text
                      transform={`translate(${centroid})`}
                      textAnchor="middle"
                      fontSize={38}
                      style={{ pointerEvents: "none" }}
                    >
                      <tspan
                        y="-0.4em"
                        fontWeight="600"
                        fill={singleColor === "purple" ? "#eee" : "#444"}
                      >
                        {d.data.name}
                      </tspan>
                      {angle > minAngle && (
                        <tspan
                          x={0}
                          y="0.7em"
                          fillOpacity={0.7}
                          fill={singleColor === "purple" ? "#eee" : "#444"}
                        >
                          {((d.data.value / total) * 100).toFixed(1)}%
                        </tspan>
                      )}
                    </text>
                  </g>
                )}
              </AnimatedSlice>
            );
          })}
        </svg>
      </ClientTooltip>
    </div>
  );
}

// Exemple d'utilisation avec des données de démonstration
const ExampleUsage: React.FC = () => {
  const portfolioData: ChartItem[] = [
    { name: "AAPL", value: 23 },
    { name: "BTC", value: 18 },
    { name: "GOLD", value: 11 },
    { name: "PLTR", value: 9 },
    { name: "ADA", value: 7 },
    { name: "MSFT", value: 3 },
  ];
  const salesData: ChartItem[] = [
    { name: "Web", value: 45 },
    { name: "Mobile", value: 30 },
    { name: "Desktop", value: 15 },
    { name: "Tablet", value: 10 },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Portfolio (Thème Purple)
        </h2>
        <GenericDonutChart
          data={portfolioData}
          singleColor="purple"
          showTooltips={true}
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Ventes par Canal (Thème Blue)
        </h2>
        <GenericDonutChart
          data={salesData}
          singleColor="blue"
          showTooltips={true}
          className="max-w-sm"
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Couleurs Personnalisées
        </h2>
        <GenericDonutChart
          data={salesData}
          customColors={["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"]}
          showTooltips={true}
          showLabels={false}
        />
      </div>
    </div>
  );
};

export default ExampleUsage;
