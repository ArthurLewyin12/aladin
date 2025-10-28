"use client";

import { useMemo } from "react";
import {
  BarChart3,
  BookOpen,
  FileQuestion,
  Users,
  TrendingUp,
  Clock,
  Brain,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/pages/dashboard/stat-card";
import { useEleveDashboard } from "@/services/hooks/stats/useEleveDashboard";
import { Spinner } from "@/components/ui/spinner";
import { StudyTimeChart } from "@/components/pages/dashboard/study-time";
import BestSubjectChart from "@/components/pages/dashboard/score-donut";
import { NotesEvolutionChart } from "@/components/pages/dashboard/note-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { convertScoreToNote } from "@/lib/quiz-score";

interface RepetiteurStatisticsProps {
  eleve: any;
  statistics?: {
    nombre_groupes?: number;
    nombre_quiz?: number;
    nombre_cours?: number;
    moyenne_generale?: number;
  };
}

export function RepetiteurStatistics({ eleve, statistics }: RepetiteurStatisticsProps) {
  const { data: dashboardData, isLoading } = useEleveDashboard(eleve.id, "week");

  const studyTimeData = useMemo(() => {
    if (!dashboardData?.study_time) return undefined;

    const { labels, series } = dashboardData.study_time;

    const dateToLabelMap: Record<string, string> = {};

    const uniqueDates = Array.from(
      new Set(series.map((item) => item.bucket)),
    ).sort();

    uniqueDates.forEach((date, index) => {
      if (index < labels.length) {
        dateToLabelMap[date] = labels[index];
      }
    });

    const dayMap: Record<string, Record<string, number>> = {};

    series.forEach((item) => {
      const dayLabel = dateToLabelMap[item.bucket];
      if (!dayLabel) return;

      if (!dayMap[dayLabel]) {
        dayMap[dayLabel] = {};
      }
      if (item.matiere) {
        dayMap[dayLabel][item.matiere] =
          (dayMap[dayLabel][item.matiere] || 0) + Number(item.seconds) / 3600;
      }
    });

    const chartData = labels.map((label) => ({
      day: label,
      ...(dayMap[label] || {}),
    }));

    return {
      week: chartData,
      month: chartData,
      quarter: chartData,
      year: chartData,
    };
  }, [dashboardData]);

  const getDifficultyColor = (niveau: string) => {
    switch (niveau?.toLowerCase()) {
      case "facile":
        return "bg-green-100 text-green-800";
      case "moyen":
        return "bg-yellow-100 text-yellow-800";
      case "difficile":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNoteBadgeColor = (note: number) => {
    if (note >= 16) return "bg-green-500";
    if (note >= 14) return "bg-blue-500";
    if (note >= 12) return "bg-yellow-500";
    if (note >= 10) return "bg-orange-500";
    return "bg-red-500";
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-0">
      {/* Info élève */}
      <div className="bg-[#F0F7EC] border border-[#C8E0B8] rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#E3F1D9] rounded-full flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-[#548C2F]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-[#548C2F]">
              Statistiques de {eleve.prenom}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Suivi des progrès et de l'activité de l'élève
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards - Design Dashboard */}
      <div className="mx-auto bg-white backdrop:blur-2xl p-10 mb-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total des cours"
            value={dashboardData.counters.cours.toString()}
            subtitle="Cours"
            icon={<BookOpen className="h-16 w-16" />}
            bgColor="bg-[#FFF4E6]"
            iconColor="text-[#F5C27A]"
          />
          <StatCard
            title="Total des quiz"
            value={dashboardData.counters.quiz.toString()}
            subtitle="Quiz"
            icon={<Brain className="h-16 w-16" />}
            bgColor="bg-[#F5D7D7]"
            iconColor="text-[#E89999]"
          />
          <StatCard
            title="Total des groupes"
            value={dashboardData.counters.groupes.toString()}
            subtitle="Groupes"
            icon={<Users className="h-16 w-16" />}
            bgColor="bg-[#D4EBE8]"
            iconColor="text-[#7EC8BF]"
          />
          <StatCard
            title="Total de documents"
            value={dashboardData.counters.documents.toString()}
            subtitle="Docs"
            icon={<FileText className="h-16 w-16" />}
            bgColor="bg-[#D8EDD5]"
            iconColor="text-[#8FC984]"
          />
        </div>
      </div>

      {/* Section Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Temps d'étude</h2>
          </div>
          <StudyTimeChart data={studyTimeData} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <BestSubjectChart data={dashboardData.best_subject} />
        </div>
      </div>

      {/* Graphique Évolution des Notes */}
      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
        <NotesEvolutionChart />
      </div>

      {/* Table des Quiz */}
      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-purple-100">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Derniers Quiz de {eleve.prenom}
          </h2>
        </div>

        {(dashboardData.notes_quiz?.length || 0) > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Matière</TableHead>
                  <TableHead className="font-semibold">Chapitre</TableHead>
                  <TableHead className="font-semibold">Niveau</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="text-right font-semibold">
                    Note
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.notes_quiz
                  .filter(
                    (note) =>
                      note.matiere !== null &&
                      note.matiere !== "Non défini" &&
                      note.matiere !== "Indéfini" &&
                      note.matiere.trim() !== "",
                  )
                  .slice(0, 10)
                  .map((note, index) => {
                    const noteValue = convertScoreToNote(
                      note.note,
                      note.nombre_questions,
                    );

                    return (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {note.matiere}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {note.chapitre || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getDifficultyColor(note.niveau || "")} border-0`}
                          >
                            {note.niveau || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {new Date(note.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getNoteBadgeColor(noteValue)}`}
                            />
                            <span className="font-bold text-lg">
                              {noteValue.toFixed(2)}
                              <span className="text-sm text-gray-500">
                                /20
                              </span>
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Aucune note de quiz disponible pour le moment
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {eleve.prenom} n'a pas encore passé de quiz
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
