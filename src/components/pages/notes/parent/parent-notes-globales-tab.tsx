"use client";

import { useMemo } from "react";
import { useParentNoteClasseStats } from "@/services/hooks/notes-classe";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ParentNotesGlobalesTab() {
  const { data: statsData, isLoading } = useParentNoteClasseStats();

  const stats = useMemo(() => {
    if (!statsData?.data) return null;

    return {
      moyenneGenerale: statsData.data.moyenne_generale_tous_enfants || 0,
      nombreTotalNotes: statsData.data.nombre_total_notes || 0,
      nombreEnfants: statsData.data.stats_par_enfant?.length || 0,
    };
  }, [statsData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!statsData?.data || statsData.data.nombre_total_notes === 0) {
    return (
      <div className="px-4 sm:px-0">
        <EmptyState
          title="Aucune note enregistrée"
          description="Vos enfants n'ont pas encore ajouté de notes de classe."
          icons={[
            <Users key="1" size={20} />,
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
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nombre d'enfants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.nombreEnfants || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne Générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((stats?.moyenneGenerale || 0) * 10) / 10}/20
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.nombreTotalNotes || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats par enfant */}
      {statsData.data.stats_par_enfant && statsData.data.stats_par_enfant.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Statistiques par enfant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsData.data.stats_par_enfant.map((enfant) => (
                <div
                  key={enfant.eleve_id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {enfant.eleve_prenom} {enfant.eleve_nom}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {enfant.nombre_notes} note{enfant.nombre_notes > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(enfant.moyenne_generale * 10) / 10}/20
                    </p>
                    <p className="text-xs text-muted-foreground">Moyenne</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
