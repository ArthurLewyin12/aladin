"use client";

import { useState, useMemo } from "react";
import { useParentEnfants, useParentNotesClasse } from "@/services/hooks/notes-classe";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParentNotesTable } from "./parent-notes-table";
import { ParentNotesFilters } from "./parent-notes-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";

export function ParentNotesParEnfantTab() {
  const [enfantId, setEnfantId] = useQueryState("eleve_id", parseAsInteger);
  const [matiereId, setMatiereId] = useQueryState("matiere_id", parseAsInteger);
  const [dateDebut, setDateDebut] = useQueryState("date_debut", parseAsString);
  const [dateFin, setDateFin] = useQueryState("date_fin", parseAsString);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const [showFilters, setShowFilters] = useState(false);

  const { data: enfantsData, isLoading: enfantsLoading } = useParentEnfants();

  const { data: notesData, isLoading: notesLoading } = useParentNotesClasse({
    eleve_id: enfantId || undefined,
    matiere_id: matiereId || undefined,
    date_debut: dateDebut || undefined,
    date_fin: dateFin || undefined,
    page: page || 1,
  });

  const notes = useMemo(() => {
    if (!notesData?.data) return [];
    if (Array.isArray(notesData.data)) {
      return notesData.data;
    }
    return notesData.data.data || [];
  }, [notesData]);

  const pagination = useMemo(() => {
    if (notesData?.data && !Array.isArray(notesData.data)) {
      return notesData.data;
    }
    return {
      current_page: 1,
      per_page: notes.length,
      total: notes.length,
    };
  }, [notesData, notes]);

  const enfantSelectionne = useMemo(() => {
    if (!enfantId || !enfantsData?.data) return null;
    return enfantsData.data.find((e) => e.id === enfantId);
  }, [enfantId, enfantsData]);

  const stats = useMemo(() => {
    if (!notes || notes.length === 0) return null;

    const moyenne =
      notes.reduce((acc, n) => acc + parseFloat(n.note), 0) / notes.length;

    return {
      nombreNotes: notes.length,
      moyenne: Math.round(moyenne * 10) / 10,
    };
  }, [notes]);

  if (enfantsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!enfantsData?.data || enfantsData.data.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        <EmptyState
          title="Aucun enfant trouvé"
          description="Vous n'avez pas encore d'enfants enregistrés sur la plateforme."
          icons={[<Users key="1" size={20} />]}
          size="default"
          theme="light"
          variant="default"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sélection de l'enfant */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Sélectionner un enfant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {enfantsData.data.map((enfant) => (
              <Button
                key={enfant.id}
                variant={enfantId === enfant.id ? "default" : "outline"}
                onClick={() => setEnfantId(enfant.id)}
                className="h-auto py-4 flex flex-col items-start gap-1"
              >
                <span className="font-semibold">
                  {enfant.prenom} {enfant.nom}
                </span>
                {enfant.nombre_notes !== undefined && (
                  <span className="text-xs opacity-80">{enfant.nombre_notes} note{enfant.nombre_notes > 1 ? "s" : ""}</span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Si un enfant est sélectionné */}
      {enfantId && enfantSelectionne && (
        <>
          {/* Stats de l'enfant */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Nombre de Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.nombreNotes}
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
                    {stats.moyenne}/20
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filtres et table */}
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Notes de {enfantSelectionne.prenom} {enfantSelectionne.nom}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? "Masquer" : "Afficher"} les filtres
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showFilters && (
                <ParentNotesFilters
                  matiereId={matiereId}
                  setMatiereId={setMatiereId}
                  dateDebut={dateDebut}
                  setDateDebut={setDateDebut}
                  dateFin={dateFin}
                  setDateFin={setDateFin}
                />
              )}

              {notesLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner size="md" />
                </div>
              ) : notes.length === 0 ? (
                <EmptyState
                  title="Aucune note trouvée"
                  description="Cet enfant n'a pas encore ajouté de notes."
                  icons={[<FileText key="1" size={20} />]}
                  size="sm"
                  theme="light"
                  variant="default"
                />
              ) : (
                <ParentNotesTable
                  notes={notes}
                  pagination={pagination}
                  page={page || 1}
                  setPage={setPage}
                />
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Message si aucun enfant sélectionné */}
      {!enfantId && (
        <div className="px-4 sm:px-0">
          <EmptyState
            title="Sélectionnez un enfant"
            description="Choisissez un enfant ci-dessus pour voir ses notes."
            icons={[<Users key="1" size={20} />]}
            size="default"
            theme="light"
            variant="default"
          />
        </div>
      )}
    </div>
  );
}
