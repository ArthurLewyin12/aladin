"use client";

import { useMemo } from "react";
import { useSession } from "@/services/hooks/auth/useSession";
import { useEleveDashboard } from "@/services/hooks/stats/useEleveDashboard";
import { useNoteClasseStats } from "@/services/hooks/notes-classe";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { TrendingUp, GitCompare, BarChart3 } from "lucide-react";
import { NotesComparisonBarChart } from "./charts/notes-comparison-bar-chart";
import { NotesEvolutionLineChart } from "./charts/notes-evolution-line-chart";
import { ComparisonTable } from "./comparison-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { convertScoreToNote } from "@/lib/quiz-score";
import {
  NoteQuiz,
  NoteClasse,
} from "@/services/controllers/types/common/stats.type";

export function ComparisonTab() {
  const { user } = useSession();
  const { data: aladinData, isLoading: aladinLoading } = useEleveDashboard(
    user?.id || 0,
    "year",
  );
  const { data: classeStatsData, isLoading: classeLoading } =
    useNoteClasseStats();

  // Préparer les données pour le bar chart (comparaison par matière)
  const comparisonByMatiere = useMemo(() => {
    if (
      !aladinData?.all_notes ||
      !classeStatsData?.data?.moyennes_par_matiere
    ) {
      return [];
    }

    // Calculer les moyennes Aladin par matière en convertissant les scores en notes sur 20
    const aladinByMatiere = new Map<string, number[]>();

    aladinData.all_notes.forEach((note) => {
      if (note.matiere === null) {
        // Filter out notes with null matiere
        return;
      }

      let noteSur20: number;
      if (note.type_note === "quiz") {
        // Ensure it's a NoteQuiz and handle nombre_questions
        const quizNote = note as NoteQuiz;
        if (quizNote.nombre_questions === 0) {
          return; // Avoid division by zero
        }
        noteSur20 = convertScoreToNote(
          quizNote.note,
          quizNote.nombre_questions,
        );
      } else {
        // It's a NoteClasse, note is already a string on 20
        const classNote = note as NoteClasse;
        noteSur20 = parseFloat(classNote.note);
      }

      if (!aladinByMatiere.has(note.matiere)) {
        aladinByMatiere.set(note.matiere, []);
      }
      aladinByMatiere.get(note.matiere)!.push(noteSur20);
    });

    // Calculer la moyenne par matière pour Aladin
    const aladinMoyennes = new Map<string, number>();
    aladinByMatiere.forEach((notes, matiere) => {
      const moyenne = notes.reduce((acc, n) => acc + n, 0) / notes.length;
      // Arrondir à 1 décimale pour éviter les décimales trop longues
      aladinMoyennes.set(matiere, Math.round(moyenne * 10) / 10);
    });

    const classeByMatiere = new Map(
      classeStatsData.data.moyennes_par_matiere.map((item) => [
        item.matiere.libelle,
        typeof item.moyenne === "number"
          ? item.moyenne
          : parseFloat(String(item.moyenne)),
      ]),
    );

    // Fusionner les deux sources
    const allMatieres = new Set([
      ...aladinMoyennes.keys(),
      ...classeByMatiere.keys(),
    ]);

    const result = Array.from(allMatieres).map((matiere) => ({
      matiere,
      note_aladin: aladinMoyennes.get(matiere) ?? null, // Changed || 0 to ?? null
      note_classe: classeByMatiere.get(matiere) ?? null, // Changed || 0 to ?? null
    }));

    return result;
  }, [aladinData, classeStatsData]);

  // Préparer les données pour le line chart (évolution temporelle par matière)
  const evolutionData = useMemo(() => {
    if (!aladinData?.all_notes || aladinData.all_notes.length === 0) {
      return [];
    }

    if (!classeStatsData?.data?.evolution_notes) {
      return [];
    }

    // Filter aladinData.all_notes to get only NoteQuiz objects
    const aladinQuizNotes = aladinData.all_notes.filter(
      (note) => note.type_note === "quiz",
    ) as NoteQuiz[];

    // Trier les notes Aladin par date
    const sortedAladinNotes = [...aladinQuizNotes] // Use filtered notes
      .filter(
        (note) => note.matiere && note.date && note.nombre_questions !== 0,
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sortedAladinNotes.length === 0) return [];

    // Grouper les notes par date pour éviter les doublons sur le graphique
    const notesByDate = new Map<string, NoteQuiz[]>();
    sortedAladinNotes.forEach((note) => {
      if (!notesByDate.has(note.date)) {
        notesByDate.set(note.date, []);
      }
      notesByDate.get(note.date)!.push(note);
    });

    // Construire l'évolution cumulative par matière pour Aladin
    const aladinMatieresCumulatives = new Map<string, number[]>();
    const dataPoints: Array<{ date: string; [key: string]: string | number }> =
      [];

    // Parcourir les dates uniques
    Array.from(notesByDate.keys()).forEach((date) => {
      const notesForDate = notesByDate.get(date)!;

      // Traiter toutes les notes de cette date
      notesForDate.forEach((note) => {
        const noteSur20 = convertScoreToNote(note.note, note.nombre_questions);

        // Initialiser le tableau pour cette matière si nécessaire
        if (!aladinMatieresCumulatives.has(note.matiere!)) {
          aladinMatieresCumulatives.set(note.matiere!, []);
        }

        // Ajouter la note à l'historique de cette matière
        aladinMatieresCumulatives.get(note.matiere!)!.push(noteSur20);
      });

      // Créer UN SEUL point de données pour cette date
      const dataPoint: { date: string; [key: string]: string | number } = {
        date: date,
      };

      // Calculer la moyenne cumulative pour chaque matière Aladin
      aladinMatieresCumulatives.forEach((notes, matiere) => {
        const moyenne = notes.reduce((a, b) => a + b, 0) / notes.length;
        dataPoint[`${matiere} (Aladin)`] = Math.round(moyenne * 10) / 10;
      });

      dataPoints.push(dataPoint);
    });

    // Ajouter les moyennes de classe par matière (données statiques)
    const classeMoyennesParMatiere = new Map(
      classeStatsData.data.moyennes_par_matiere?.map((item) => [
        item.matiere.libelle,
        item.moyenne,
      ]) || [],
    );

    // Ajouter les moyennes de classe à chaque point de données
    dataPoints.forEach((point) => {
      aladinMatieresCumulatives.forEach((_, matiere) => {
        const moyenneClasse = classeMoyennesParMatiere.get(matiere);
        if (moyenneClasse !== undefined && moyenneClasse !== null) {
          const actualMoyenneClasse: number =
            typeof moyenneClasse === "number"
              ? moyenneClasse
              : parseFloat(String(moyenneClasse));
          point[`${matiere} (Classe)`] =
            Math.round(actualMoyenneClasse * 10) / 10;
        }
        // Ne pas ajouter la clé si pas de moyenne de classe pour éviter d'afficher 0 sur le graphe
      });
    });

    // Garder les 15 derniers points pour avoir plus de visibilité
    return dataPoints.slice(-15);
  }, [aladinData, classeStatsData]);

  // Stats globales
  const globalStats = useMemo(() => {
    const aladinNotes = aladinData?.all_notes || [];

    // Filter to get only NoteQuiz objects
    const aladinQuizNotes = aladinNotes.filter(
      (n) => n.type_note === "quiz",
    ) as NoteQuiz[];

    // Convertir tous les scores Aladin en notes sur 20
    const aladinNotesSur20 = aladinQuizNotes.map((n) =>
      convertScoreToNote(n.note, n.nombre_questions),
    );

    const moyenneAladin =
      aladinNotesSur20.length > 0
        ? aladinNotesSur20.reduce((acc, n) => acc + n, 0) /
          aladinNotesSur20.length
        : 0;

    const moyenneClasse = classeStatsData?.data?.moyenne_generale || 0;

    const ecart = moyenneAladin - moyenneClasse;

    const stats = {
      moyenneAladin: Math.round(moyenneAladin * 10) / 10,
      moyenneClasse: Math.round(moyenneClasse * 10) / 10,
      ecart: Math.round(ecart * 10) / 10,
      meilleurPlateforme: moyenneAladin > moyenneClasse ? "Aladin" : "Classe",
    };

    return stats;
  }, [aladinData, classeStatsData]);

  if (aladinLoading || classeLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (
    (!aladinData?.all_notes || aladinData.all_notes.length === 0) &&
    (!classeStatsData?.data?.nombre_total_notes ||
      classeStatsData.data.nombre_total_notes === 0)
  ) {
    return (
      <div className="px-4 sm:px-0">
        <EmptyState
          title="Pas encore de comparaison possible"
          description="Commence à passer des quiz Aladin et à ajouter tes notes de classe pour voir une comparaison !"
          icons={[
            <GitCompare key="1" size={20} />,
            <BarChart3 key="2" size={20} />,
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
      {/* Stats globales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne Aladin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {globalStats.moyenneAladin}/20
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne Classe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {globalStats.moyenneClasse}/20
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Écart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div
                className={`text-2xl font-bold ${
                  globalStats.ecart >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {globalStats.ecart > 0 ? "+" : ""}
                {globalStats.ecart}
              </div>
              <Badge
                variant={globalStats.ecart >= 0 ? "default" : "destructive"}
              >
                {globalStats.meilleurPlateforme}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotesComparisonBarChart data={comparisonByMatiere} />
        <NotesEvolutionLineChart data={evolutionData} />
      </div>

      {/* Table de comparaison */}
      <ComparisonTable data={comparisonByMatiere} />
    </div>
  );
}
