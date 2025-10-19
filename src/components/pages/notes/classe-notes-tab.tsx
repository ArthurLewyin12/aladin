"use client";

import { useMemo, useState } from "react";
import { useNotesClasse } from "@/services/hooks/notes-classe";
import { useNoteClasseStats } from "@/services/hooks/notes-classe";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText, Plus, TrendingUp } from "lucide-react";
import { ClasseNotesTable } from "./classe-notes-table";
import { AddNoteModal } from "./add-note-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

export function ClasseNotesTab() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filtres avec nuqs
  const [matiereId] = useQueryState("matiere_id", parseAsInteger);
  const [dateDebut] = useQueryState("date_debut", parseAsString);
  const [dateFin] = useQueryState("date_fin", parseAsString);
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data: notesData, isLoading } = useNotesClasse({
    matiere_id: matiereId || undefined,
    date_debut: dateDebut || undefined,
    date_fin: dateFin || undefined,
    page,
  });

  const { data: statsData } = useNoteClasseStats();

  const notes = notesData?.data?.data || [];
  const pagination = notesData?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notes.length === 0 && !matiereId && !dateDebut && !dateFin) {
    return (
      <div className="px-4 sm:px-0">
        <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
          <div className="relative w-full max-w-2xl">
            <EmptyState
              title="Aucune note de classe"
              description="Commence à enregistrer tes notes de classe pour suivre ta progression !"
              icons={[
                <FileText key="1" size={20} />,
                <Plus key="2" size={20} />,
                <TrendingUp key="3" size={20} />,
              ]}
              size="default"
              theme="light"
              variant="default"
            />
          </div>

          <div className="text-center px-4">
            <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
              Clique ci-dessous pour ajouter ta première note !
            </p>

            <Button
              size="lg"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-lg transition-all hover:shadow-xl w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Ajouter une note
            </Button>
          </div>
        </div>

        <AddNoteModal
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
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
            <div className="text-2xl font-bold">
              {statsData?.data?.nombre_total_notes || 0}
            </div>
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
              {statsData?.data?.moyenne_generale?.toFixed(1) || 0}/20
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
              {statsData?.data?.meilleure_note?.toFixed(1) || 0}/20
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton d'ajout */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#2C3E50] hover:bg-[#1a252f]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une note
        </Button>
      </div>

      {/* Table des notes */}
      <ClasseNotesTable notes={notes} pagination={pagination} />

      <AddNoteModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </div>
  );
}
