"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/pages/dashboard/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  Users,
  Brain,
  FileText,
  ArrowLeft,
  TrendingUp,
  Clock,
  Award,
  Target,
  Zap,
  Calendar,
} from "lucide-react";
import BestSubjectChart from "@/components/pages/dashboard/score-donut";
import { StudyTimeChart } from "@/components/pages/dashboard/study-time";
import { NotesEvolutionChart } from "@/components/pages/dashboard/note-chart";
import { useSession } from "@/services/hooks/auth/useSession";
import { useEleveDashboard } from "@/services/hooks/stats/useEleveDashboard";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSession();
  const { data: dashboardData, isLoading } = useEleveDashboard(
    user?.id || 0,
    "week",
  );

  const handleBack = () => {
    router.push("/student/home");
  };

  // Calculer des statistiques avancées
  const stats = useMemo(() => {
    if (!dashboardData) return null;

    const notes = dashboardData.notes_evolution || [];
    const averageNote =
      notes.length > 0
        ? notes.reduce((acc, n) => acc + n.note, 0) / notes.length
        : 0;

    const studySeconds = dashboardData.study_time.series.reduce(
      (acc, s) => acc + Number(s.seconds),
      0,
    );
    const studyHours = Math.round((studySeconds / 3600) * 10) / 10;

    // Calcul du taux de réussite (notes > 10)
    const successRate =
      notes.length > 0
        ? (notes.filter((n) => n.note >= 10).length / notes.length) * 100
        : 0;

    // Progression vers les limites
    const quizProgress =
      dashboardData.limites.nombre_quiz > 0
        ? (dashboardData.counters.quiz / dashboardData.limites.nombre_quiz) *
          100
        : 0;

    return {
      averageNote: Math.round(averageNote * 10) / 10,
      studyHours,
      successRate: Math.round(successRate),
      quizProgress: Math.min(quizProgress, 100),
      totalActivities:
        dashboardData.counters.quiz +
        dashboardData.counters.cours +
        dashboardData.counters.groupes,
    };
  }, [dashboardData]);

  // Préparer les données pour le graphique de temps d'étude
  const studyTimeData = useMemo(() => {
    if (!dashboardData?.study_time) return undefined;

    const { labels, series } = dashboardData.study_time;

    // Créer un mapping jour -> matières -> secondes
    const dayMap: Record<string, Record<string, number>> = {};

    series.forEach((item) => {
      const dayLabel =
        labels[new Date(item.bucket).getDay()] || item.bucket.split("-")[2];
      if (!dayMap[dayLabel]) {
        dayMap[dayLabel] = {};
      }
      if (item.matiere) {
        dayMap[dayLabel][item.matiere] =
          (dayMap[dayLabel][item.matiere] || 0) + Number(item.seconds) / 3600;
      }
    });

    // Convertir en format attendu par le graphique
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

  // Obtenir le badge de niveau basé sur la moyenne
  const getPerformanceBadge = (average: number) => {
    if (average >= 16) return { label: "Excellent", color: "bg-green-500" };
    if (average >= 14) return { label: "Très bien", color: "bg-blue-500" };
    if (average >= 12) return { label: "Bien", color: "bg-yellow-500" };
    if (average >= 10) return { label: "Passable", color: "bg-orange-500" };
    return { label: "À améliorer", color: "bg-red-500" };
  };

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
      <div className="min-h-screen bg-[#F5F4F1] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 text-lg">
            Chargement de mon tableau de bord...
          </p>
        </div>
      </div>
    );
  }

  const performanceBadge = getPerformanceBadge(stats?.averageNote || 0);

  return (
    <div
      className="min-h-screen bg-[#F5F4F1] relative overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e0e0e0' fill-opacity='0.2'%3E%3Cpath d='M20 20h10v10H20zM40 40h10v10H40zM60 20h10v10H60zM80 60h10v10H80zM30 70h10v10H30zM70 30h10v10H70zM50 50h10v10H50z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "100px 100px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header avec bouton retour et titre */}
        <div
          className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
          style={{
            backgroundImage: `url("/bg-2.png")`,
            backgroundSize: "180px 180px",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full bg-white hover:bg-gray-50 w-9 h-9 sm:w-10 sm:h-10 shadow-sm flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <span className="text-2xl sm:text-3xl">📊</span>
            <div className="flex-1">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 leading-tight">
                Mon tableau de bord
              </h1>
              <p className="text-xs sm:text-[1.5rem] text-gray-600 mt-1">
                Bienvenue {user?.prenom}, voici tes statistiques{" "}
                {dashboardData.user.niveau.libelle}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats avec animations */}
        {/*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-3 rounded-xl ${performanceBadge.color} bg-opacity-20`}
                >
                  <Award
                    className={`h-6 w-6 ${performanceBadge.color.replace("bg-", "text-")}`}
                  />
                </div>
                <Badge className={`${performanceBadge.color} text-white`}>
                  {performanceBadge.label}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.averageNote}/20
              </h3>
              <p className="text-sm text-gray-600 mt-1">Moyenne générale</p>
              <Progress
                value={(stats?.averageNote || 0) * 5}
                className="mt-3"
              />
            </CardContent>
          </Card>

          <Card className="bg-white border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.studyHours}h
              </h3>
              <p className="text-sm text-gray-600 mt-1">Temps d'étude</p>
              <p className="text-xs text-blue-600 mt-2 font-medium">
                Cette semaine
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-green-100">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.successRate}%
              </h3>
              <p className="text-sm text-gray-600 mt-1">Taux de réussite</p>
              <Progress value={stats?.successRate || 0} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-white border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-purple-100">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <Badge
                  variant="outline"
                  className="text-purple-600 border-purple-300"
                >
                  {dashboardData.temps_restant}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.totalActivities}
              </h3>
              <p className="text-sm text-gray-600 mt-1">Activités totales</p>
              <p className="text-xs text-purple-600 mt-2 font-medium">
                Quiz, cours, groupes
              </p>
            </CardContent>
          </Card>
        </div>*/}

        {/* Stats Cards traditionnelles */}
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

        {/* Charts Section avec meilleur style */}
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

        {/* Notes Evolution Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
          <NotesEvolutionChart />
        </div>

        {/* Notes Table avec design amélioré */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-purple-100">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Dernières notes</h2>
          </div>

          {dashboardData.all_notes.length > 0 ? (
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
                  {dashboardData.all_notes.slice(0, 10).map((note, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {note.matiere || "Non défini"}
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
                            className={`w-2 h-2 rounded-full ${getNoteBadgeColor(note.note)}`}
                          />
                          <span className="font-bold text-lg">
                            {note.note}
                            <span className="text-sm text-gray-500">/20</span>
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Aucune note disponible pour le moment
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Commence à faire des quiz pour voir tes résultats ici
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
