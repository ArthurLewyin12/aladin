"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Brain,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatHoursToReadable } from "@/lib/utils/time";

interface StudentQuickView {
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

interface RepetiteurStudentQuickViewProps {
  students: StudentQuickView[];
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export function RepetiteurStudentQuickView({
  students,
}: RepetiteurStudentQuickViewProps) {
  const router = useRouter();

  if (students.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
          Vue rapide - Élèves
        </h3>
        <Card className="bg-white rounded-[24px] shadow-md border-0">
          <CardContent className="p-8">
            <div className="flex h-[200px] items-center justify-center text-gray-500">
              Aucun élève suivi pour le moment
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
        Vue rapide - Élèves
      </h3>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((student, index) => {
          const bgColor = CARD_COLORS[index % CARD_COLORS.length];
          const initials = student.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <Card
              key={student.id}
              className={`${bgColor} rounded-[24px] shadow-md hover:shadow-lg transition-all hover:scale-[1.02] duration-300 border-0`}
            >
              <CardContent className="p-6">
                {/* Header avec avatar et nom */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full text-white font-bold text-lg"
                      style={{ backgroundColor: student.color }}
                    >
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-900">
                        {student.name}
                      </h4>
                      <p className="text-sm text-gray-600">{student.niveau}</p>
                    </div>
                  </div>
                  {student.trend === "up" && (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  )}
                  {student.trend === "down" && (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4 text-sm text-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Temps d'étude</span>
                    </div>
                    <span className="font-medium">
                      {formatHoursToReadable(student.weeklyStudyHours)}/sem
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span>Quiz</span>
                    </div>
                    <span className="font-medium">{student.totalQuizzes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Cours</span>
                    </div>
                    <span className="font-medium">{student.totalCourses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Groupes</span>
                    </div>
                    <span className="font-medium">{student.totalGroups}</span>
                  </div>
                </div>

                {/* Bouton */}
                <Button
                  variant="outline"
                  className="w-full bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 rounded-xl font-medium"
                  onClick={() =>
                    router.push(`/repetiteur/students/${student.id}`)
                  }
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
