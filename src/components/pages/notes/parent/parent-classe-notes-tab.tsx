"use client";

import { useMemo, useState } from "react";
import { useParentNotesClasse } from "@/services/hooks/notes-classe";
import { useEnfants } from "@/services/hooks/parent";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText, TrendingUp, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ParentNotesTable } from "./parent-notes-table";
import { AddNoteModal } from "../add-note-modal";

interface ParentClasseNotesTabProps {
  enfantId: number;
}

export function ParentClasseNotesTab({ enfantId }: ParentClasseNotesTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: enfantsData } = useEnfants();

  const enfantSelectionne = useMemo(() => {
    if (!enfantsData?.enfants) return null;
    return enfantsData.enfants.find((e) => e.id === enfantId);
  }, [enfantsData, enfantId]);

  const isManuel = enfantSelectionne?.type === "manuel";
  const { data: notesData, isLoading } = useParentNotesClasse({
    eleve_id: enfantId,
  });

  const notes = useMemo(() => {
    if (!notesData?.data) return [];
    if (Array.isArray(notesData.data)) {
      return notesData.data;
    }
    return notesData.data.data || [];
  }, [notesData]);

  const stats = useMemo(() => {
    if (!notes || notes.length === 0) return null;

    const moyenne =
      notes.reduce((acc, n) => acc + parseFloat(n.note), 0) / notes.length;

    return {
      totalNotes: notes.length,
      moyenneGenerale: Math.round(moyenne * 10) / 10,
      meilleureNote: Math.max(...notes.map((n) => parseFloat(n.note))),
    };
  }, [notes]);

  const pagination = useMemo(() => {
    if (!notesData?.data || Array.isArray(notesData.data)) {
      return undefined;
    }
    return notesData.data;
  }, [notesData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
          <div className="relative w-full max-w-2xl">
            <EmptyState
              title="Aucune note de classe"
              description={
                isManuel
                  ? `Commencez à ajouter les notes de classe de ${enfantSelectionne?.prenom} ici pour suivre sa progression !`
                  : "Cet enfant n'a pas encore de notes de classe enregistrées."
              }
              icons={[
                <FileText key="1" size={20} />,
                <Plus key="2" size={20} />,
                <TrendingUp key="3" size={20} />,
              ]}
              size="default"
              theme="light"
              variant="default"
              className="mx-auto max-w-[50rem]"
            />
          </div>

          {isManuel && (
            <div className="text-center px-4">
              <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
                Cliquez ci-dessous pour ajouter la première note de classe !
              </p>

              <Button
                size="lg"
                onClick={() => setIsAddModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-lg transition-all hover:shadow-xl w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Ajouter une note
              </Button>
            </div>
          )}
        </div>

        {isManuel && (
          <AddNoteModal
            isOpen={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
          />
        )}
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
              Total de Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats?.totalNotes}</div>
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
              {stats?.moyenneGenerale}/20
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
              {stats?.meilleureNote.toFixed(1)}/20
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Titre et table des notes */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Notes de Classe
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {stats?.totalNotes} note
              {(stats?.totalNotes || 0) > 1 ? "s" : ""} enregistrée
              {(stats?.totalNotes || 0) > 1 ? "s" : ""}
            </p>
          </div>
          {isManuel && (
            <Button
              size="lg"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Ajouter une note</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          )}
        </div>

        {/* Table des notes */}
        <ParentNotesTable
          notes={notes}
          pagination={pagination || { current_page: 1, per_page: 10, total: notes.length }}
          page={1}
          setPage={() => {}}
        />
      </div>

      {isManuel && (
        <AddNoteModal
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
        />
      )}
    </div>
  );
}
