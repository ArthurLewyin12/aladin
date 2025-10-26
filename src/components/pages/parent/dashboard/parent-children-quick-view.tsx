"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Clock, Users, TrendingUp, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChildQuickView {
  id: string;
  name: string;
  niveau: string;
  avatar?: string;
  color: string;
  averageNote: number;
  weeklyStudyHours: number;
  totalQuizzes: number;
  totalCourses: number;
  totalGroups: number;
  trend: "up" | "down" | "stable";
  progressToNextMilestone: number;
  nextMilestone?: string;
}

interface ParentChildrenQuickViewProps {
  children: ChildQuickView[];
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export function ParentChildrenQuickView({
  children,
}: ParentChildrenQuickViewProps) {
  const router = useRouter();

  const getPerformanceBadge = (average: number) => {
    if (average >= 14) return { label: "Excellent", color: "bg-green-100 text-green-800" };
    if (average >= 12) return { label: "Très bien", color: "bg-blue-100 text-blue-800" };
    if (average >= 10) return { label: "Bien", color: "bg-yellow-100 text-yellow-800" };
    return { label: "À améliorer", color: "bg-red-100 text-red-800" };
  };

  if (children.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
          Vue rapide - Enfants
        </h3>
        <Card className="bg-white rounded-[24px] shadow-md border-0">
          <CardContent className="p-8">
            <div className="flex h-[200px] items-center justify-center text-gray-500">
              Aucun enfant suivi pour le moment
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
        Vue rapide - Enfants
      </h3>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {children.map((child, index) => {
          const perfBadge = getPerformanceBadge(child.averageNote);
          const bgColor = CARD_COLORS[index % CARD_COLORS.length];
          const initials = child.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <Card
              key={child.id}
              className={`${bgColor} rounded-[24px] shadow-md hover:shadow-lg transition-all hover:scale-[1.02] duration-300 border-0`}
            >
              <CardContent className="p-6">
                {/* Header avec avatar et nom */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full text-white font-bold text-lg"
                      style={{ backgroundColor: child.color }}
                    >
                      {child.avatar ? (
                        <img
                          src={child.avatar}
                          alt={child.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-900">
                        {child.name}
                      </h4>
                      <p className="text-sm text-gray-600">{child.niveau}</p>
                    </div>
                  </div>
                  {child.trend === "up" && (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  )}
                  {child.trend === "down" && (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>

                {/* Moyenne et badge */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {child.averageNote.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-600">/20</span>
                  </div>
                  <Badge className={`${perfBadge.color} border-0`}>
                    {perfBadge.label}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4 text-sm text-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Temps d'étude</span>
                    </div>
                    <span className="font-medium">{child.weeklyStudyHours}h/sem</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span>Quiz</span>
                    </div>
                    <span className="font-medium">{child.totalQuizzes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Cours</span>
                    </div>
                    <span className="font-medium">{child.totalCourses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Groupes</span>
                    </div>
                    <span className="font-medium">{child.totalGroups}</span>
                  </div>
                </div>

                {/* Bouton */}
                <Button
                  variant="outline"
                  className="w-full bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 rounded-xl font-medium"
                  onClick={() => router.push(`/parent/enfants/${child.id}`)}
                >
                  Voir le profil
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
