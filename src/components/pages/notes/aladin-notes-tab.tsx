"use client";

import { useMemo } from "react";
import { useSession } from "@/services/hooks/auth/useSession";
import { useEleveDashboard } from "@/services/hooks/stats/useEleveDashboard";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen, TrendingUp, Award } from "lucide-react";
import { AladinNotesTable } from "./aladin-notes-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertScoreToNote } from "@/lib/quiz-score";
import { NoteQuiz } from "@/services/controllers/types/common/stats.type";

export function AladinNotesTab() {
  const { user } = useSession();
  const { data: dashboardData, isLoading } = useEleveDashboard(
    user?.id || 0,
    "year",
  );
  console.log("AladinNotesTab: Full dashboardData:", dashboardData);

  const stats = useMemo(() => {
    if (!dashboardData?.all_notes) return null;

    // Filter to get only Aladin quiz notes with a defined matiere
    const aladinQuizNotes = dashboardData.all_notes.filter(
      (note) => note.type_note === "quiz" && note.matiere !== null, // Added matiere filter
    ) as NoteQuiz[];

    console.log("AladinNotesTab: Filtered Aladin quiz notes:", aladinQuizNotes);

    const notesSur20 = aladinQuizNotes
      .filter((n) => n.nombre_questions !== null && n.nombre_questions !== 0)
      .map((n) => {
        console.log(
          "AladinNotesTab: Processing note:",
          n.note,
          "nombre_questions:",
          n.nombre_questions,
        );
        return convertScoreToNote(n.note, n.nombre_questions);
      });

    const averageNote =
      notesSur20.length > 0
        ? notesSur20.reduce((acc, n) => acc + n, 0) / notesSur20.length
        : 0;

    const finalStats = {
      totalNotes: aladinQuizNotes.length, // Corrected here
      moyenneGenerale: Math.round(averageNote * 10) / 10,
      meilleureNote: notesSur20.length > 0 ? Math.max(...notesSur20) : 0,
    };
    console.log("AladinNotesTab: Final calculated stats:", finalStats);
    return finalStats;
  }, [dashboardData]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!dashboardData?.all_notes || dashboardData.all_notes.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        <EmptyState
          title="Aucune note de quiz"
          description="Commence à passer des quiz sur Aladin pour voir tes notes ici !"
          icons={[
            <BookOpen key="1" size={20} />,
            <Award key="2" size={20} />,
            <TrendingUp key="3" size={20} />,
          ]}
          size="default"
          theme="light"
          variant="default"
          className="mx-auto max-w-[50rem]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques en haut */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalNotes || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne Générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.moyenneGenerale || 0}/20
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meilleure Note
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.meilleureNote || 0}/20
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des notes */}
      <AladinNotesTable
        notes={
          dashboardData.all_notes.filter(
            (note) => note.type_note === "quiz",
          ) as NoteQuiz[]
        }
      />
    </div>
  );
}
