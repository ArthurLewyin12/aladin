"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, BookOpen, FileQuestion, Users, TrendingUp } from "lucide-react";
import { Enfant } from "@/services/controllers/types/common/parent.types";

interface ParentStatisticsProps {
  enfant: Enfant;
  statistics: {
    groupes: number;
    quiz_personnels: number;
    quiz_groupes: number;
    quiz_total: number;
    cours: number;
    total_contenus: number;
  };
}

export function ParentStatistics({ enfant, statistics }: ParentStatisticsProps) {
  const stats = [
    {
      label: "Groupes rejoints",
      value: statistics.groupes,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Quiz personnels",
      value: statistics.quiz_personnels,
      icon: FileQuestion,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Quiz en groupe",
      value: statistics.quiz_groupes,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Total quiz",
      value: statistics.quiz_total,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "Cours créés",
      value: statistics.cours,
      icon: BookOpen,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      label: "Total contenus",
      value: statistics.total_contenus,
      icon: TrendingUp,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ];

  return (
    <div className="space-y-6 px-2 sm:px-0">
      {/* Info enfant */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-purple-700">
              Statistiques de {enfant.prenom}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Suivez les progrès et l'activité de votre enfant
            </p>
          </div>
        </div>
      </div>

      {/* Grille des statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="rounded-[20px] shadow-md border-purple-100 hover:shadow-lg transition-all hover:scale-[1.02] duration-300"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl sm:text-4xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Résumé */}
      <Card className="rounded-[20px] shadow-md border-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <TrendingUp className="w-5 h-5" />
            Résumé de l'activité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Nombre de groupes</span>
            <span className="font-semibold text-purple-700">{statistics.groupes}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Quiz générés</span>
            <span className="font-semibold text-purple-700">
              {statistics.quiz_total}{" "}
              <span className="text-sm text-gray-500">
                ({statistics.quiz_personnels} perso + {statistics.quiz_groupes} groupe)
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Cours générés</span>
            <span className="font-semibold text-purple-700">{statistics.cours}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600 font-medium">Total de contenus créés</span>
            <span className="font-bold text-xl text-purple-700">{statistics.total_contenus}</span>
          </div>
        </CardContent>
      </Card>

      {/* Message d'encouragement */}
      {statistics.total_contenus > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-purple-900 mb-1">
                Excellent travail !
              </h4>
              <p className="text-xs sm:text-sm text-purple-700">
                {enfant.prenom} a créé <strong>{statistics.total_contenus} contenus</strong> au total.
                {statistics.quiz_total > 0 && ` Dont ${statistics.quiz_total} quiz pour réviser.`}
                {statistics.cours > 0 && ` Et ${statistics.cours} cours pour apprendre.`}
                {" "}Continuez à l'encourager dans son apprentissage !
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
