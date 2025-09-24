"use client";
import { StatCard } from "@/components/ui/stat-card";
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
import { BookOpen, Users, Brain, FileText } from "lucide-react";

export default function DashboardPage() {
  // Mock Data
  const statsData = [
    {
      title: "Total des cours",
      value: "12",
      icon: <BookOpen className="h-4 w-4" />,
      colorClassName: "bg-yellow-500",
    },
    {
      title: "Total des groupes",
      value: "3",
      icon: <Users className="h-4 w-4" />,
      colorClassName: "bg-blue-500",
    },
    {
      title: "Total des quiz",
      value: "24",
      icon: <Brain className="h-4 w-4" />,
      colorClassName: "bg-green-500",
    },
    {
      title: "Total des documents",
      value: "48",
      icon: <FileText className="h-4 w-4" />,
      colorClassName: "bg-purple-500",
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
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts Section 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Temps d'étude cette semaine (heures)
          </h2>
          <GenericBarChartVertical
            data={weeklyStudyData}
            height={350}
            singleColor="blue"
          />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Matières les plus révisées
          </h2>
          <GenericDonutChart data={topSubjectsData} singleColor="purple" />
        </div>
      </div>

      {/* Charts Section 2 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Répartition du temps d'étude
        </h2>
        <GenericDonutChart
          data={topSubjectsData}
          singleColor="yellow"
          innerRadiusRatio={1000}
        />
      </div>

      {/* Notes Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Dernières notes</h2>
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
                <TableCell className="font-medium">{note.matiere}</TableCell>
                <TableCell>{note.chapitre}</TableCell>
                <TableCell>{note.niveau}</TableCell>
                <TableCell className="text-right">{note.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
