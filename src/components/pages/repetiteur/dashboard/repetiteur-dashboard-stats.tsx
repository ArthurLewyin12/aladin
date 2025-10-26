"use client";

import { Users, BookOpen, FileText, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RepetiteurDashboardStatsProps {
  totalStudents: number;
  activeStudents: number;
  totalQuizzesCreated: number;
  totalCoursesCreated: number;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export function RepetiteurDashboardStats({
  totalStudents,
  activeStudents,
  totalQuizzesCreated,
  totalCoursesCreated,
}: RepetiteurDashboardStatsProps) {
  const stats = [
    {
      title: "Élèves suivis",
      value: totalStudents,
      subtitle: totalStudents > 1 ? "élèves" : "élève",
      icon: Users,
    },
    {
      title: "Élèves actifs",
      value: activeStudents,
      subtitle: activeStudents > 1 ? "actifs" : "actif",
      icon: Users,
    },
    {
      title: "Quiz créés",
      value: totalQuizzesCreated,
      subtitle: "quiz",
      icon: BookOpen,
    },
    {
      title: "Cours créés",
      value: totalCoursesCreated,
      subtitle: "cours",
      icon: FileText,
    },
  ];

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const bgColor = CARD_COLORS[index % CARD_COLORS.length];

        return (
          <Card
            key={stat.title}
            className={`${bgColor} rounded-[24px] shadow-md hover:shadow-lg transition-all hover:scale-[1.02] duration-300 border-0`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center">
                  <Icon className="h-5 w-5 text-gray-700" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  {stat.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
