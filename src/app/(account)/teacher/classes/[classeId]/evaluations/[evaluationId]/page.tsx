"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Calendar,
  BookOpen,
  Users,
  TrendingUp,
  Edit,
} from "lucide-react";
import { useGetEvaluationNotes } from "@/services/hooks/professeur/useGetEvaluationNotes";
import { useGetClassMembers } from "@/services/hooks/professeur/useGetClassMembers";
import { useAddGradesToEvaluation } from "@/services/hooks/professeur/useAddGradesToEvaluation";
import { useUpdateAllGrades } from "@/services/hooks/professeur/useUpdateAllGrades";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/lib/toast";

const EvaluationDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const classeId = Number(params.classeId);
  const evaluationId = Number(params.evaluationId);

  const { data: evaluationData, isLoading: isLoadingEvaluation } =
    useGetEvaluationNotes(classeId, evaluationId);
  const { data: membersData, isLoading: isLoadingMembers } =
    useGetClassMembers(classeId);
  const { mutate: addGrades, isPending: isAddingGrades } =
    useAddGradesToEvaluation();
  const { mutate: updateGrades, isPending: isUpdatingGrades } =
    useUpdateAllGrades();

  const [grades, setGrades] = useState<Record<number, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  const handleBack = () => {
    router.back();
  };

  // Préparer les données des élèves avec leurs notes
  const studentsWithGrades = useMemo(() => {
    if (!membersData || !evaluationData) return [];

    const existingGrades = evaluationData.notes || [];
    const students = membersData.eleves || [];

    return students.map((student) => {
      const existingGrade = existingGrades.find(
        (g) => g.eleve_id === student.id,
      );
      return {
        student,
        grade: existingGrade,
      };
    });
  }, [membersData, evaluationData]);

  // Initialiser les grades dans le state
  useMemo(() => {
    if (evaluationData?.notes) {
      const initialGrades: Record<number, string> = {};
      evaluationData.notes.forEach((note) => {
        initialGrades[note.eleve_id] = note.note.toString();
      });
      setGrades(initialGrades);
    }
  }, [evaluationData?.notes]);

  const handleGradeChange = (studentId: number, value: string) => {
    // Valider que c'est un nombre entre 0 et 20
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 20)) {
      setGrades((prev) => ({ ...prev, [studentId]: value }));
    }
  };

  const handleSaveGrades = () => {
    // Séparer les nouvelles notes et les notes à modifier
    const newGrades: Array<{ user_id: number; note: number }> = [];
    const updatedGrades: Array<{ note_classe_id: number; note: number }> = [];

    Object.entries(grades).forEach(([studentIdStr, gradeStr]) => {
      const studentId = Number(studentIdStr);
      const grade = Number(gradeStr);

      if (gradeStr === "" || isNaN(grade)) return;

      const existingGrade = evaluationData?.notes.find(
        (g) => g.eleve_id === studentId,
      );

      if (existingGrade) {
        // Note existante à modifier
        if (existingGrade.note !== grade) {
          updatedGrades.push({
            note_classe_id: existingGrade.id,
            note: grade,
          });
        }
      } else {
        // Nouvelle note
        newGrades.push({
          user_id: studentId,
          note: grade,
        });
      }
    });

    // Valider qu'il y a au moins une note
    if (newGrades.length === 0 && updatedGrades.length === 0) {
      toast({
        variant: "error",
        message: "Aucune modification à sauvegarder.",
      });
      return;
    }

    // Ajouter les nouvelles notes
    if (newGrades.length > 0) {
      addGrades(
        {
          classeId,
          evaluationId,
          payload: { grades: newGrades },
        },
        {
          onSuccess: () => {
            // Si on a aussi des notes à modifier, on les modifie après
            if (updatedGrades.length > 0) {
              updateGrades({
                classeId,
                evaluationId,
                payload: { grades: updatedGrades },
              });
            }
            setIsEditMode(false);
          },
        },
      );
    } else if (updatedGrades.length > 0) {
      // Modifier uniquement les notes existantes
      updateGrades(
        {
          classeId,
          evaluationId,
          payload: { grades: updatedGrades },
        },
        {
          onSuccess: () => {
            setIsEditMode(false);
          },
        },
      );
    }
  };

  if (isLoadingEvaluation || isLoadingMembers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!evaluationData || !membersData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Évaluation non trouvée</p>
      </div>
    );
  }

  const evaluation = evaluationData.evaluation;
  const isPending = isAddingGrades || isUpdatingGrades;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full bg-white hover:bg-gray-50 w-10 h-10 shadow-sm mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-2">
                {evaluation.type_evaluation}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  className={`${evaluation.is_active ? "bg-green-600" : "bg-gray-500"} text-white`}
                >
                  {evaluation.is_active ? "Actif" : "Inactif"}
                </Badge>
                {evaluation.matiere && (
                  <Badge className="bg-[#2C3E50] text-white">
                    {evaluation.matiere.libelle}
                  </Badge>
                )}
              </div>
            </div>

            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              variant="outline"
              className="rounded-3xl border-2"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditMode ? "Annuler" : "Modifier"}
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="rounded-3xl border-2 border-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-bold text-gray-900">
                    {format(new Date(evaluation.date_evaluation), "dd MMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="font-bold text-gray-900">
                    {evaluationData.total_notes} / {studentsWithGrades.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Moyenne</p>
                  <p className="font-bold text-gray-900">
                    {evaluationData.moyenne
                      ? `${evaluationData.moyenne.toFixed(2)}/20`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commentaire */}
        {evaluation.commentaire && (
          <Card className="rounded-3xl border-2 border-white shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Commentaire</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{evaluation.commentaire}</p>
            </CardContent>
          </Card>
        )}

        {/* Liste des élèves et notes */}
        <Card className="rounded-3xl border-2 border-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Notes des élèves
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {studentsWithGrades.map(({ student, grade }) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl border-2 border-white"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {student.nom} {student.prenom}
                    </p>
                    <p className="text-sm text-gray-600">{student.mail}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {isEditMode ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={grades[student.id] || ""}
                          onChange={(e) =>
                            handleGradeChange(student.id, e.target.value)
                          }
                          placeholder="Note"
                          className="w-20 rounded-3xl border-2 text-center"
                        />
                        <span className="text-gray-600">/20</span>
                      </div>
                    ) : (
                      <div className="text-right">
                        {grade ? (
                          <p className="font-bold text-xl text-green-600">
                            {grade.note}/20
                          </p>
                        ) : (
                          <p className="text-gray-400">Non noté</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isEditMode && (
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setIsEditMode(false)}
                  variant="outline"
                  className="flex-1 rounded-3xl border-2"
                  disabled={isPending}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSaveGrades}
                  className="flex-1 bg-[#2C3E50] hover:bg-[#1a252f] text-white rounded-3xl"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Spinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Enregistrer les notes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EvaluationDetailsPage;
