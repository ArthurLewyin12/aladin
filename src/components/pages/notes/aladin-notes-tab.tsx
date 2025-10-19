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

export function AladinNotesTab() {
  const { user } = useSession();
  const { data: dashboardData, isLoading } = useEleveDashboard(
    user?.id || 0,
    "year",
  );

  const stats = useMemo(() => {
    if (!dashboardData?.all_notes) return null;

    const notes = dashboardData.all_notes;

    // Convertir les scores (nombre de bonnes réponses) en notes sur 20
    const notesSur20 = notes.map((n) => convertScoreToNote(n.note, n.nombre_questions));

    const averageNote =
      notesSur20.length > 0
        ? notesSur20.reduce((acc, n) => acc + n, 0) / notesSur20.length
        : 0;

    return {
      totalNotes: notes.length,
      moyenneGenerale: Math.round(averageNote * 10) / 10,
      meilleureNote: notesSur20.length > 0 ? Math.max(...notesSur20) : 0,
    };
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
      <AladinNotesTable notes={dashboardData.all_notes} />
    </div>
  );
}
