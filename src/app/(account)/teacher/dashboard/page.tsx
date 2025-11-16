"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/pages/dashboard/stat-card";
import { useDashboard } from "@/services/hooks/professeur/useDashboard";
import { useSubjects } from "@/services/hooks/professeur/useSubjects";
import { Spinner } from "@/components/ui/spinner";
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
  ChevronLeft,
  ChevronRight,
  Award,
} from "lucide-react";

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
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

// Type pour les moyennes des élèves
type StudentAverage = {
  eleve: string;
  classe: string;
  moyenneGenerale: number;
  mathematiques: number;
  physique: number;
  chimie: number;
  quizRealises: number;
};

const columnHelper = createColumnHelper<StudentAverage>();

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
      "Seconde A": 12.8,
      "Seconde B": 11.9,
    },
    {
      jour: "Mar",
      "Terminale S1": 14.8,
      "Terminale S2": 13.1,
      "Première S": 15.3,
      "Seconde A": 13.2,
      "Seconde B": 12.1,
    },
    {
      jour: "Mer",
      "Terminale S1": 14.5,
      "Terminale S2": 13.8,
      "Première S": 15.9,
      "Seconde A": 13.5,
      "Seconde B": 12.4,
    },
    {
      jour: "Jeu",
      "Terminale S1": 15.1,
      "Terminale S2": 14.2,
      "Première S": 15.5,
      "Seconde A": 13.8,
      "Seconde B": 12.7,
    },
    {
      jour: "Ven",
      "Terminale S1": 14.9,
      "Terminale S2": 13.9,
      "Première S": 15.2,
      "Seconde A": 13.3,
      "Seconde B": 12.2,
    },
  ],
  studentAverages: [
    {
      eleve: "Konan Yao",
      classe: "Terminale S1",
      moyenneGenerale: 15.8,
      mathematiques: 16.2,
      physique: 15.5,
      chimie: 15.9,
      quizRealises: 12,
    },
    {
      eleve: "Aya Kouassi",
      classe: "Première S",
      moyenneGenerale: 17.2,
      mathematiques: 17.8,
      physique: 18.0,
      chimie: 16.8,
      quizRealises: 15,
    },
    {
      eleve: "Ibrahim Traoré",
      classe: "Terminale S2",
      moyenneGenerale: 14.1,
      mathematiques: 13.5,
      physique: 14.8,
      chimie: 14.5,
      quizRealises: 10,
    },
    {
      eleve: "Fatou Diallo",
      classe: "Seconde A",
      moyenneGenerale: 13.9,
      mathematiques: 14.2,
      physique: 13.5,
      chimie: 14.0,
      quizRealises: 8,
    },
    {
      eleve: "Mamadou Coulibaly",
      classe: "Terminale S1",
      moyenneGenerale: 12.8,
      mathematiques: 13.0,
      physique: 12.5,
      chimie: 12.9,
      quizRealises: 9,
    },
    {
      eleve: "Aminata Bamba",
      classe: "Première S",
      moyenneGenerale: 16.5,
      mathematiques: 16.8,
      physique: 17.5,
      chimie: 15.2,
      quizRealises: 14,
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
  const { data: dashboardData, isLoading, error } = useDashboard();
  const { data: subjectsData } = useSubjects();

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

  // Transformer les données de l'API pour les graphiques
  const statsData = useMemo(() => {
    if (!dashboardData) return STATIC_DATA.stats;
    return {
      totalClasses: dashboardData.statistiques_generales.nombre_classes,
      totalStudents: dashboardData.statistiques_generales.nombre_eleves,
      totalCourses: dashboardData.statistiques_generales.nombre_cours,
      totalQuizzes: dashboardData.statistiques_generales.nombre_quiz,
    };
  }, [dashboardData]);

  // Répartition des quiz
  const quizDistribution = useMemo(() => {
    if (!dashboardData) return STATIC_DATA.quizTypeDistribution;
    return [
      { name: "Quiz Manuel", value: dashboardData.repartition_quiz.manuel, color: "#8884d8" },
      { name: "Quiz IA", value: dashboardData.repartition_quiz.genere, color: "#82ca9d" },
      { name: "Quiz Document", value: dashboardData.repartition_quiz.document, color: "#ffc658" },
    ];
  }, [dashboardData]);

  // Activité des classes (total des activités du dernier mois pour chaque classe)
  const classActivityData = useMemo(() => {
    if (!dashboardData) return STATIC_DATA.classActivity;

    return dashboardData.evolution_activites_par_classe.map((classe) => {
      // Prendre le dernier mois avec des données
      const dernierMois = classe.evolution[classe.evolution.length - 1];

      // Trouver les moyennes correspondantes
      const moyennesClasse = dashboardData.evolution_moyennes_par_classe.find(
        (m) => m.classe_id === classe.classe_id
      );
      const moyenneDernierMois = moyennesClasse?.evolution[moyennesClasse.evolution.length - 1];

      return {
        classe: classe.classe_nom,
        quiz_termines: dernierMois.details.quiz,
        moyenne: moyenneDernierMois?.moyenne_generale || 0,
      };
    });
  }, [dashboardData]);

  // Évolution des performances par mois (toutes les classes)
  const performanceEvolutionData = useMemo(() => {
    if (!dashboardData) return STATIC_DATA.performanceEvolution;

    // Récupérer tous les mois uniques
    const allMonths = dashboardData.evolution_moyennes_par_classe[0]?.evolution.map((e) => e.mois) || [];

    // Préparer les données pour le graphique
    return allMonths.map((mois, index) => {
      const dataPoint: any = { mois };

      // Pour chaque classe, ajouter sa moyenne pour ce mois
      dashboardData.evolution_moyennes_par_classe.forEach((classe) => {
        const moyenneMois = classe.evolution[index];
        dataPoint[classe.classe_nom] = moyenneMois?.moyenne_generale || null;
      });

      return dataPoint;
    });
  }, [dashboardData]);

  // Récupérer les matières enseignées par le prof
  const teacherSubjects = useMemo(() => {
    if (!subjectsData) return [];
    return Array.isArray(subjectsData.libelles)
      ? subjectsData.libelles.filter((item) => typeof item === "string")
      : [];
  }, [subjectsData]);

  // Transformer les notes élèves pour le tableau
  const studentNotesData = useMemo(() => {
    if (!dashboardData) return STATIC_DATA.studentAverages;

    // Grouper les notes par élève et par matière
    const elevesMap = new Map<number, any>();

    dashboardData.tableau_notes_eleves.forEach((note) => {
      if (!elevesMap.has(note.eleve_id)) {
        elevesMap.set(note.eleve_id, {
          eleve: `${note.eleve_nom} ${note.eleve_prenom}`,
          classe: note.classe_nom,
          notesByMatiere: new Map<string, number[]>(),
          quizRealises: 0,
        });
      }
      const eleve = elevesMap.get(note.eleve_id);

      // Grouper les notes par matière
      const matiere = note.matiere_libelle;
      if (!eleve.notesByMatiere.has(matiere)) {
        eleve.notesByMatiere.set(matiere, []);
      }
      eleve.notesByMatiere.get(matiere).push(note.note);

      if (note.type === "evaluation") {
        eleve.quizRealises++;
      }
    });

    // Calculer les moyennes
    return Array.from(elevesMap.values()).map((eleve) => {
      const result: any = {
        eleve: eleve.eleve,
        classe: eleve.classe,
        quizRealises: eleve.quizRealises,
      };

      // Calculer la moyenne par matière enseignée
      let totalNotes = 0;
      let countNotes = 0;

      teacherSubjects.forEach((matiere) => {
        const notesMatiere = eleve.notesByMatiere.get(matiere);
        if (notesMatiere && notesMatiere.length > 0) {
          const moyenne = notesMatiere.reduce((sum: number, n: number) => sum + n, 0) / notesMatiere.length;
          result[matiere] = moyenne;
          totalNotes += moyenne;
          countNotes++;
        } else {
          result[matiere] = null; // Pas de note pour cette matière
        }
      });

      // Calculer la moyenne générale
      result.moyenneGenerale = countNotes > 0 ? totalNotes / countNotes : null;

      return result;
    });
  }, [dashboardData, teacherSubjects]);

  // Colonnes pour le tableau des moyennes (dynamiques selon les matières)
  const studentAverageColumns = useMemo(
    () => {
      const columns: any[] = [
        columnHelper.accessor("eleve", {
          header: "Élève",
          cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor("classe", {
          header: "Classe",
          cell: (info) => <Badge variant="outline">{info.getValue()}</Badge>,
        }),
        columnHelper.accessor("moyenneGenerale", {
          header: "Moyenne Générale",
          cell: (info) => {
            const note = info.getValue();
            if (note === null || note === undefined) {
              return <span className="text-gray-400 text-center block">-</span>;
            }
            return (
              <div className="flex items-center justify-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${getNoteBadgeColor(note)}`}
                />
                <span className="font-bold text-lg">
                  {note.toFixed(1)}
                  <span className="text-sm text-gray-500">/20</span>
                </span>
              </div>
            );
          },
        }),
      ];

      // Ajouter une colonne pour chaque matière enseignée
      teacherSubjects.forEach((matiere) => {
        columns.push(
          columnHelper.accessor(matiere as any, {
            header: matiere,
            cell: (info: any) => {
              const note = info.getValue();
              if (note === null || note === undefined) {
                return <span className="text-gray-400 text-center block">-</span>;
              }
              return (
                <span className="font-semibold text-center block">
                  {note.toFixed(1)}
                </span>
              );
            },
          })
        );
      });

      // Ajouter la colonne Quiz Réalisés
      columns.push(
        columnHelper.accessor("quizRealises", {
          header: "Quiz Réalisés",
          cell: (info) => (
            <span className="font-semibold text-blue-600 text-center block">
              {info.getValue()}
            </span>
          ),
        })
      );

      return columns;
    },
    [teacherSubjects],
  );

  // Table avec pagination
  const studentAverageTable = useReactTable({
    data: studentNotesData,
    columns: studentAverageColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-lg font-medium text-gray-700">
            Chargement du dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold text-red-600 mb-2">
            Erreur lors du chargement du dashboard
          </p>
          <p className="text-sm text-red-500 mb-6">{(error as any)?.message}</p>
          <Button onClick={handleBack} className="bg-red-600 hover:bg-red-700 text-white">
            Retour
          </Button>
        </div>
      </div>
    );
  }

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
              value={statsData.totalClasses.toString()}
              subtitle="Classes actives"
              icon={<Users className="h-16 w-16" />}
              bgColor="bg-[#D4F4DD]"
              iconColor="text-green-600"
            />
            <StatCard
              title="Mes élèves"
              value={statsData.totalStudents.toString()}
              subtitle="Élèves inscrits"
              icon={<GraduationCap className="h-16 w-16" />}
              bgColor="bg-[#E8F8E8]"
              iconColor="text-green-500"
            />
            <StatCard
              title="Cours créés"
              value={statsData.totalCourses.toString()}
              subtitle="Cours publiés"
              icon={<BookOpen className="h-16 w-16" />}
              bgColor="bg-[#C8E6C9]"
              iconColor="text-green-700"
            />
            <StatCard
              title="Quiz créés"
              value={statsData.totalQuizzes.toString()}
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
              <BarChart data={classActivityData}>
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
                  data={quizDistribution}
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
                  {quizDistribution.map((entry, index) => (
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
              Évolution des performances (Toutes les classes)
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceEvolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis domain={[0, 20]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {dashboardData?.evolution_moyennes_par_classe.map((classe, index) => {
                const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4", "#84cc16"];
                return (
                  <Line
                    key={classe.classe_id}
                    type="monotone"
                    dataKey={classe.classe_nom}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Moyennes des élèves */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-blue-100">
              <Award className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Performance des élèves
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 overflow-x-auto">
              <Table>
                <TableHeader>
                  {studentAverageTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-gray-50">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="font-semibold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {studentAverageTable.getRowModel().rows?.length ? (
                    studentAverageTable.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={studentAverageColumns.length}
                        className="h-24 text-center"
                      >
                        Aucun élève trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {studentAverageTable.getState().pagination.pageIndex + 1}{" "}
                sur {studentAverageTable.getPageCount()}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => studentAverageTable.previousPage()}
                  disabled={!studentAverageTable.getCanPreviousPage()}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => studentAverageTable.nextPage()}
                  disabled={!studentAverageTable.getCanNextPage()}
                  className="rounded-full"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
