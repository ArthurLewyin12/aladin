"use client";
import React, { CSSProperties } from "react";
import { scaleBand, scaleLinear, max } from "d3";
import { ClientTooltip, TooltipTrigger, TooltipContent } from "../tooltip";
import { motion } from "motion/react";

// Types génériques pour les données
export type ChartItem = {
  key: string;
  value: number;
  color?: string; // Couleur personnalisée optionnelle
};

type ColorTheme = "purple" | "blue" | "fuchsia" | "yellow";

interface GenericBarChartVerticalProps {
  data: ChartItem[];
  height?: number; // Hauteur du graphique en pixels
  minBars?: number; // Nombre minimum de barres (pour padding)
  marginTop?: number; // Marge supérieure en pixels
  marginRight?: number; // Marge droite en pixels
  marginBottom?: number; // Marge inférieure en pixels
  marginLeft?: number; // Marge gauche en pixels
  yTicks?: number; // Nombre de ticks sur l'axe Y
  singleColor?: ColorTheme; // Thème de couleur
  customColors?: string[]; // Couleurs personnalisées
  showTooltips?: boolean; // Afficher les tooltips
  showLabels?: boolean; // Afficher les labels sur l'axe X
  className?: string; // Classe CSS supplémentaire
}

// Composant AnimatedBar pour animer les barres
export function AnimatedBar({
  index = 0,
  children,
}: {
  index?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "100%" }}
      transition={{
        opacity: { duration: 0.25, delay: index * 0.075 },
        height: {
          type: "spring",
          duration: 0.25,
          bounce: 0.1,
          delay: index * 0.075,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function GenericBarChartVertical({
  data,
  height = 288, // Équivalent à h-72 (72 * 4 = 288px)
  minBars = 10,
  marginTop = 0,
  marginRight = 25,
  marginBottom = 56,
  marginLeft = 25,
  yTicks = 8,
  singleColor = "fuchsia",
  customColors,
  showTooltips = true,
  showLabels = true,
  className = "",
}: GenericBarChartVerticalProps) {
  // Ajouter des barres vides pour atteindre minBars
  const filledData = [
    ...data,
    ...Array.from({ length: Math.max(0, minBars - data.length) }, (_, i) => ({
      key: `Empty ${i + 1}`,
      value: 0,
    })),
  ];

  // Calculer le total pour les pourcentages dans les tooltips
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Échelles
  const xScale = scaleBand()
    .domain(filledData.map((d) => d.key))
    .range([0, 100])
    .padding(0.3);
  const yScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([100, 0]);

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
    <div
      className={`relative w-full h-auto grid ${className}`}
      style={
        {
          "--marginTop": `${marginTop}px`,
          "--marginRight": `${marginRight}px`,
          "--marginBottom": `${marginBottom}px`,
          "--marginLeft": `${marginLeft}px`,
          height: `${height}px`,
        } as CSSProperties
      }
    >
      {/* Axe Y */}
      <div
        className="
          relative
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        {yScale
          .ticks(yTicks)
          .map(yScale.tickFormat(yTicks, "d"))
          .map((value, i) => (
            <div
              key={i}
              style={{
                top: `${yScale(+value)}%`,
              }}
              className="absolute text-xs tabular-nums -translate-y-1/2 text-gray-300 w-full text-right pr-2"
            >
              {value}
            </div>
          ))}
      </div>
      {/* Zone du graphique */}
      <div
        className="
          absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        <ClientTooltip>
          <svg
            viewBox="0 0 100 100"
            className="overflow-visible w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Lignes de grille */}
            {yScale
              .ticks(yTicks)
              .map(yScale.tickFormat(yTicks, "d"))
              .map((active, i) => (
                <g
                  transform={`translate(0,${yScale(+active)})`}
                  className="text-gray-300/80 dark:text-gray-800/80"
                  key={i}
                >
                  <line
                    x1={0}
                    x2={100}
                    stroke="currentColor"
                    strokeDasharray="6,5"
                    strokeWidth={0.5}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
          </svg>
          {/* Axe X (Labels) */}
          {showLabels &&
            data.map((entry, i) => {
              const xPosition = xScale(entry.key)! + xScale.bandwidth() / 2;
              return (
                <div
                  key={i}
                  className="absolute overflow-visible text-gray-400"
                  style={{
                    left: `${xPosition}%`,
                    top: "100%",
                    transform: "rotate(45deg) translateX(4px) translateY(8px)",
                  }}
                >
                  <div className="absolute text-xs -translate-y-1/2 whitespace-nowrap">
                    {entry.key.slice(0, 10) +
                      (entry.key.length > 10 ? "..." : "")}
                  </div>
                </div>
              );
            })}
          {/* Barres */}
          {filledData.map((d, index) => {
            const barWidth = xScale.bandwidth();
            const barHeight = yScale(0) - yScale(d.value);
            return (
              <AnimatedBar key={index} index={index}>
                {showTooltips ? (
                  <TooltipTrigger>
                    <div
                      style={{
                        width: `${barWidth}%`,
                        height: `${barHeight}%`,
                        borderRadius: "6px 6px 0 0",
                        marginLeft: `${xScale(d.key)}%`,
                        background: getColor(index, d),
                      }}
                      className="absolute bottom-0"
                    />
                    <TooltipContent>
                      <div className="text-sm">
                        <div className="font-semibold">{d.key}</div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Valeur: {d.value.toLocaleString()}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Pourcentage: {((d.value / total) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </TooltipContent>
                  </TooltipTrigger>
                ) : (
                  <div
                    style={{
                      width: `${barWidth}%`,
                      height: `${barHeight}%`,
                      borderRadius: "6px 6px 0 0",
                      marginLeft: `${xScale(d.key)}%`,
                      background: getColor(index, d),
                    }}
                    className="absolute bottom-0"
                  />
                )}
              </AnimatedBar>
            );
          })}
        </ClientTooltip>
      </div>
    </div>
  );
}
