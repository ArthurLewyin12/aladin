"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
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
  GraduationCap,
  ArrowLeft,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

// Données statiques pour le dashboard
const STATIC_DATA = {
  stats: {
    totalClasses: 8,
    totalStudents: 156,
    totalCourses: 24,
    totalQuizzes: 45,
  },
  classActivity: [
    { classe: "Terminale S1", quiz_termines: 32, moyenne: 14.5 },
    { classe: "Terminale S2", quiz_termines: 28, moyenne: 13.2 },
    { classe: "Première S", quiz_termines: 25, moyenne: 15.1 },
    { classe: "Seconde A", quiz_termines: 22, moyenne: 12.8 },
    { classe: "Seconde B", quiz_termines: 18, moyenne: 11.9 },
  ],
  quizTypeDistribution: [
    { name: "Quiz Manuel", value: 18, color: "#8884d8" },
    { name: "Quiz IA", value: 20, color: "#82ca9d" },
    { name: "Quiz Document", value: 7, color: "#ffc658" },
  ],
  performanceEvolution: [
    {
      jour: "Lun",
      "Terminale S1": 14.2,
      "Terminale S2": 13.5,
      "Première S": 15.0,
    },
    {
      jour: "Mar",
      "Terminale S1": 14.8,
      "Terminale S2": 13.1,
      "Première S": 15.3,
    },
    {
      jour: "Mer",
      "Terminale S1": 14.5,
      "Terminale S2": 13.8,
      "Première S": 14.9,
    },
    {
      jour: "Jeu",
      "Terminale S1": 15.1,
      "Terminale S2": 14.2,
      "Première S": 15.5,
    },
    {
      jour: "Ven",
      "Terminale S1": 14.9,
      "Terminale S2": 13.9,
      "Première S": 15.2,
    },
  ],
  recentActivities: [
    {
      eleve: "Konan Yao",
      classe: "Terminale S1",
      quiz: "Dérivées et primitives",
      matiere: "Mathématiques",
      note: 16.5,
      date: "2024-01-15T10:30:00",
    },
    {
      eleve: "Aya Kouassi",
      classe: "Première S",
      quiz: "Thermodynamique",
      matiere: "Physique",
      note: 18.0,
      date: "2024-01-15T09:15:00",
    },
    {
      eleve: "Ibrahim Traoré",
      classe: "Terminale S2",
      quiz: "Oxydoréduction",
      matiere: "Chimie",
      note: 14.5,
      date: "2024-01-15T08:45:00",
    },
    {
      eleve: "Fatou Diallo",
      classe: "Seconde A",
      quiz: "Révolution française",
      matiere: "Histoire",
      note: 15.5,
      date: "2024-01-14T16:20:00",
    },
    {
      eleve: "Mamadou Coulibaly",
      classe: "Terminale S1",
      quiz: "Probabilités",
      matiere: "Mathématiques",
      note: 13.0,
      date: "2024-01-14T14:30:00",
    },
    {
      eleve: "Aminata Bamba",
      classe: "Première S",
      quiz: "Mécanique",
      matiere: "Physique",
      note: 17.5,
      date: "2024-01-14T11:00:00",
    },
  ],
  engagement: {
    activeStudents: 142,
    totalStudents: 156,
    percentage: 91,
  },
  alerts: [
    {
      type: "warning",
      message: "3 élèves n'ont fait aucun quiz cette semaine",
    },
    {
      type: "info",
      message: "La classe Seconde B n'a pas eu d'activité depuis 2 jours",
    },
  ],
};

export default function TeacherDashboardPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/teacher/home");
  };

  const getNoteBadgeColor = (note: number) => {
    if (note >= 16) return "bg-green-500";
    if (note >= 14) return "bg-blue-500";
    if (note >= 12) return "bg-yellow-500";
    if (note >= 10) return "bg-orange-500";
    return "bg-red-500";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header avec bouton retour et titre */}
        <div
          className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
          style={{
            backgroundImage: `url("/bg-2.png")`,
            backgroundSize: "180px 180px",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full bg-white hover:bg-gray-50 w-9 h-9 sm:w-12 sm:h-12 shadow-sm flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <div className="flex-1">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 leading-tight">
                Tableau de bord professeur
              </h1>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mx-auto bg-white backdrop:blur-2xl p-4 sm:p-6 lg:p-10 mb-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Mes classes"
              value={STATIC_DATA.stats.totalClasses.toString()}
              subtitle="Classes actives"
              icon={<Users className="h-16 w-16" />}
              bgColor="bg-[#D4F4DD]"
              iconColor="text-green-600"
            />
            <StatCard
              title="Mes élèves"
              value={STATIC_DATA.stats.totalStudents.toString()}
              subtitle="Élèves inscrits"
              icon={<GraduationCap className="h-16 w-16" />}
              bgColor="bg-[#E8F8E8]"
              iconColor="text-green-500"
            />
            <StatCard
              title="Cours créés"
              value={STATIC_DATA.stats.totalCourses.toString()}
              subtitle="Cours publiés"
              icon={<BookOpen className="h-16 w-16" />}
              bgColor="bg-[#C8E6C9]"
              iconColor="text-green-700"
            />
            <StatCard
              title="Quiz créés"
              value={STATIC_DATA.stats.totalQuizzes.toString()}
              subtitle="Tous types"
              icon={<Brain className="h-16 w-16" />}
              bgColor="bg-[#DCEDC8]"
              iconColor="text-green-800"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Activité des classes */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Activité des classes
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={STATIC_DATA.classActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="classe"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="quiz_termines"
                  fill="#10b981"
                  name="Quiz terminés"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition des quiz par type */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-purple-100">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Répartition des quiz
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={STATIC_DATA.quizTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {STATIC_DATA.quizTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Évolution de la performance */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-green-100">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Évolution des performances (Top 3 classes)
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={STATIC_DATA.performanceEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jour" />
              <YAxis domain={[0, 20]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Terminale S1"
                stroke="#10b981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Terminale S2"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Première S"
                stroke="#8b5cf6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Dernières activités des élèves */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-orange-100">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Dernières activités des élèves
            </h2>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Élève</TableHead>
                  <TableHead className="font-semibold">Classe</TableHead>
                  <TableHead className="font-semibold">Quiz</TableHead>
                  <TableHead className="font-semibold">Matière</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="text-right font-semibold">
                    Note
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STATIC_DATA.recentActivities.map((activity, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {activity.eleve}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.classe}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {activity.quiz}
                    </TableCell>
                    <TableCell>{activity.matiere}</TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {new Date(activity.date).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${getNoteBadgeColor(activity.note)}`}
                        />
                        <span className="font-bold text-lg">
                          {activity.note.toFixed(1)}
                          <span className="text-sm text-gray-500">/20</span>
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
