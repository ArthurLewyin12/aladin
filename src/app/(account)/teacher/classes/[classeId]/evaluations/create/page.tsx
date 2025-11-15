"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { useClasse } from "@/services/hooks/professeur/useClasse";
import { useCreateEvaluation } from "@/services/hooks/professeur/useCreateEvaluation";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";

const gradeSchema = z.object({
  user_id: z.number(),
  note: z.number().min(0).max(20, "La note doit être entre 0 et 20"),
});

const evaluationSchema = z.object({
  type_evaluation: z.string().min(1, "Le type d'évaluation est requis"),
  matiere_id: z.number().min(1, "La matière est requise"),
  chapitres_ids: z.array(z.number()).optional(),
  date_evaluation: z.string().optional(),
  commentaire: z.string().optional(),
  grades: z.array(gradeSchema).optional(),
});

type EvaluationFormData = z.infer<typeof evaluationSchema>;

const CreateEvaluationPage = () => {
  const params = useParams();
  const router = useRouter();
  const classeId = Number(params.classeId);

  const { data: classeDetails, isLoading: isLoadingClasse } =
    useClasse(classeId);
  const { mutate: createEvaluation, isPending } = useCreateEvaluation();

  const [selectedChapitres, setSelectedChapitres] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [grades, setGrades] = useState<Record<number, number>>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      date_evaluation: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const selectedMatiereId = watch("matiere_id");

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setValue("date_evaluation", format(date, "yyyy-MM-dd"), { shouldValidate: true });
    }
  };

  const handleBack = () => {
    router.back();
  };

  const onSubmit = (data: EvaluationFormData) => {
    // Convertir les grades en array de { user_id, note }
    const gradesArray = Object.entries(grades)
      .filter(([, note]) => note !== undefined && note !== null && note !== "")
      .map(([userId, note]) => ({
        user_id: Number(userId),
        note: Number(note),
      }));

    // Ne pas inclure grades si aucune note saisie
    const payload = {
      ...data,
      chapitres_ids: selectedChapitres.length > 0 ? selectedChapitres : undefined,
    };

    // Ajouter grades seulement s'il y en a
    if (gradesArray.length > 0) {
      (payload as any).grades = gradesArray;
    }

    createEvaluation(
      {
        classeId,
        payload: payload as EvaluationFormData,
      },
      {
        onSuccess: () => {
          router.push(`/teacher/classes/${classeId}`);
        },
      },
    );
  };

  if (isLoadingClasse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!classeDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Classe non trouvée</p>
      </div>
    );
  }

  const evaluationTypes = [
    "Devoir",
    "Contrôle",
    "Interrogation",
    "Composition",
    "Examen",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-2">
            Créer une évaluation
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Classe: {classeDetails.nom}
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="shadow-lg rounded-3xl border-2 border-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Informations de l&apos;évaluation
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Type d'évaluation */}
              <div className="space-y-2">
                <Label htmlFor="type_evaluation" className="text-sm font-medium">
                  Type d&apos;évaluation *
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("type_evaluation", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="rounded-3xl border-2">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-3xl">
                    {evaluationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type_evaluation && (
                  <p className="text-sm text-red-600">
                    {errors.type_evaluation.message}
                  </p>
                )}
              </div>

              {/* Matière */}
              <div className="space-y-2">
                <Label htmlFor="matiere_id" className="text-sm font-medium">
                  Matière *
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("matiere_id", Number(value), {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="rounded-3xl border-2">
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent className="rounded-3xl">
                    {classeDetails.matieres?.map((matiere) => (
                      <SelectItem
                        key={matiere.id}
                        value={matiere.id.toString()}
                      >
                        {matiere.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.matiere_id && (
                  <p className="text-sm text-red-600">
                    {errors.matiere_id.message}
                  </p>
                )}
              </div>

              {/* Date d'évaluation */}
              <div className="space-y-2">
                <Label htmlFor="date_evaluation" className="text-sm font-medium">
                  Date de l&apos;évaluation
                </Label>
                <DatePicker
                  date={selectedDate}
                  onDateChange={handleDateChange}
                  placeholder="Sélectionner la date de l'évaluation"
                />
                {errors.date_evaluation && (
                  <p className="text-sm text-red-600">
                    {errors.date_evaluation.message}
                  </p>
                )}
              </div>

              {/* Commentaire */}
              <div className="space-y-2">
                <Label htmlFor="commentaire" className="text-sm font-medium">
                  Commentaire (optionnel)
                </Label>
                <Textarea
                  id="commentaire"
                  {...register("commentaire")}
                  placeholder="Ajoutez un commentaire sur cette évaluation..."
                  className="rounded-3xl border-2 min-h-[100px]"
                />
                {errors.commentaire && (
                  <p className="text-sm text-red-600">
                    {errors.commentaire.message}
                  </p>
                )}
              </div>

              {/* Notes des élèves */}
              {classeDetails.members && classeDetails.members.length > 0 && (
                <div className="space-y-3 border-t-2 pt-6">
                  <Label className="text-sm font-medium">
                    Notes des élèves (optionnel)
                  </Label>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {classeDetails.members.map((member) => (
                      <div
                        key={member.eleve.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl"
                      >
                        <Label className="flex-1 text-sm font-medium text-gray-700">
                          {member.eleve.prenom} {member.eleve.nom}
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            placeholder="Note"
                            value={grades[member.eleve.id] ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setGrades((prev) => ({
                                ...prev,
                                [member.eleve.id]: value ? Number(value) : undefined,
                              }));
                            }}
                            className="w-20 text-center"
                          />
                          <span className="text-xs text-gray-600">/20</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 rounded-3xl border-2"
                  disabled={isPending}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#2C3E50] hover:bg-[#1a252f] text-white rounded-3xl"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Spinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Créer l&apos;évaluation
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default CreateEvaluationPage;
