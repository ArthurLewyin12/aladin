"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { StatCard } from "@/components/pages/dashboard/stat-card";
import { GenericBarChartVertical } from "@/components/ui/charts/bar-charts";
import { GenericDonutChart } from "@/components/ui/charts/pie-charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Users, Brain, FileText, ArrowLeft } from "lucide-react";
import BestSubjectChart from "@/components/pages/dashboard/score-donut";
import { StudyTimeChart } from "@/components/pages/dashboard/study-time";

export default function DashboardPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/student/home");
  };

  const statsData = [
    {
      title: "Total des cours",
      value: "43",
      subtitle: "Cours",
      icon: <BookOpen className="h-16 w-16" />,
      bgColor: "bg-[#FFF4E6]",
      iconColor: "text-[#F5C27A]",
    },
    {
      title: "Total des groupes",
      value: "23",
      subtitle: "Groupes",
      icon: <Users className="h-16 w-16" />,
      bgColor: "bg-[#D4EBE8]",
      iconColor: "text-[#7EC8BF]",
    },
    {
      title: "Total des quiz",
      value: "123",
      subtitle: "Quiz",
      icon: <Brain className="h-16 w-16" />,
      bgColor: "bg-[#F5D7D7]",
      iconColor: "text-[#E89999]",
    },
    {
      title: "Total de documents",
      value: "223",
      subtitle: "Docs",
      icon: <FileText className="h-16 w-16" />,
      bgColor: "bg-[#D8EDD5]",
      iconColor: "text-[#8FC984]",
    },
  ];
  const weeklyStudyData = [
    { key: "Lun", value: 2 },
    { key: "Mar", value: 3.5 },
    { key: "Mer", value: 4 },
    { key: "Jeu", value: 2.5 },
    { key: "Ven", value: 5 },
    { key: "Sam", value: 6 },
    { key: "Dim", value: 1.5 },
  ];

  const topSubjectsData = [
    { name: "Maths", value: 45 },
    { name: "Physique", value: 25 },
    { name: "Français", value: 15 },
    { name: "Autres", value: 15 },
  ];

  const notesData = [
    {
      id: 1,
      matiere: "Mathématiques",
      chapitre: "Algèbre",
      niveau: "Difficile",
      note: "18/20",
    },
    {
      id: 2,
      matiere: "Physique",
      chapitre: "Mécanique",
      niveau: "Moyen",
      note: "15/20",
    },
    {
      id: 3,
      matiere: "Français",
      chapitre: "Grammaire",
      niveau: "Facile",
      note: "19/20",
    },
    {
      id: 4,
      matiere: "Histoire",
      chapitre: "Antiquité",
      niveau: "Moyen",
      note: "16/20",
    },
  ];

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
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">📊</span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 leading-tight">
              Ton tableau de bord
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Visualise tes progrès, consulte tes statistiques d'étude et garde un
            œil sur tes performances académiques.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsData.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="w-full mx-auto  flex  gap-6 mb-6  ">
          <div className="flex-1 bg-white p-4 rounded-lg shadow ">
            <h2 className="text-lg font-semibold mb-3">
              Temps d'étude cette semaine (heures)
            </h2>
            <StudyTimeChart />
          </div>
          <div className="flex-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">
              Matières les plus révisées
            </h2>
            <BestSubjectChart />
          </div>
        </div>

        {/* Notes Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Dernières notes</h2>
          <div className="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Matière</TableHead>
                  <TableHead>Chapitre</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead className="text-right">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notesData.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">
                      {note.matiere}
                    </TableCell>
                    <TableCell>{note.chapitre}</TableCell>
                    <TableCell>{note.niveau}</TableCell>
                    <TableCell className="text-right">{note.note}</TableCell>
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
