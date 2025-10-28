"use client";

import { useMemo } from "react";
import { useEleveDashboard } from "@/services/hooks/stats/useEleveDashboard";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen, Award, TrendingUp } from "lucide-react";
import { AladinNotesTable } from "../aladin-notes-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertScoreToNote } from "@/lib/quiz-score";
import { NoteQuiz } from "@/services/controllers/types/common/stats.type";

interface ParentAladinNotesTabProps {
  enfantId: number;
}

export function ParentAladinNotesTab({ enfantId }: ParentAladinNotesTabProps) {
  const { data: dashboardData, isLoading } = useEleveDashboard(
    enfantId,
    "year",
  );

  const stats = useMemo(() => {
    if (!dashboardData?.all_notes) return null;

    // Filter to get only Aladin quiz notes with a defined matiere
    const aladinQuizNotes = dashboardData.all_notes.filter(
      (note) => note.type_note === "quiz" && note.matiere !== null,
    ) as NoteQuiz[];

    const notesSur20 = aladinQuizNotes
      .filter((n) => n.nombre_questions !== null && n.nombre_questions !== 0)
      .map((n) => {
        return convertScoreToNote(n.note, n.nombre_questions);
      });

    const averageNote =
      notesSur20.length > 0
        ? notesSur20.reduce((acc, n) => acc + n, 0) / notesSur20.length
        : 0;

    const finalStats = {
      totalNotes: aladinQuizNotes.length,
      moyenneGenerale: Math.round(averageNote * 10) / 10,
      meilleureNote: notesSur20.length > 0 ? Math.max(...notesSur20) : 0,
    };

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
          description="Cet enfant n'a pas encore passé de quiz sur Aladin."
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
        <Card className="rounded-2xl border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats?.totalNotes || 0}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne Générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats?.moyenneGenerale || 0}/20
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meilleure Note
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats?.meilleureNote || 0}/20
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Titre et table des notes */}
      <div className="space-y-4">
        <div className="backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Notes de Quiz Aladin
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {stats?.totalNotes} quiz
            {(stats?.totalNotes || 0) > 1 ? "s" : ""} passé
            {(stats?.totalNotes || 0) > 1 ? "s" : ""}
          </p>
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
    </div>
  );
}
