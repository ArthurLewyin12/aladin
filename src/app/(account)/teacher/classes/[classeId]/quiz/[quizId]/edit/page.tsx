"use client";

import { useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  Controller,
  useFormContext,
  type Control,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { MultipleSelect, TTag } from "@/components/ui/multiple-selects";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { useClasse } from "@/services/hooks/professeur/useClasse";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import { useUpdateQuiz } from "@/services/hooks/professeur/useUpdateQuiz";
import { ClasseQuiz } from "@/services/controllers/types/common/professeur.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ArrowLeft, PlusIcon, Trash2 } from "lucide-react";

// Schéma de validation pour la structure avec propositions (a, b, c, d)
const propositionSchema = z.object({
  a: z.string().min(1, "La réponse A ne peut pas être vide."),
  b: z.string().min(1, "La réponse B ne peut pas être vide."),
  c: z.string().min(1, "La réponse C ne peut pas être vide."),
  d: z.string().min(1, "La réponse D ne peut pas être vide."),
});

const questionSchema = z.object({
  question: z.string().min(1, "La question ne peut pas être vide."),
  propositions: propositionSchema,
  bonne_reponse: z.enum(["a", "b", "c", "d"]),
});

const approfondissementSchema = z.object({
  question: z.string().min(1, "La question est requise."),
  reponse: z.string().min(1, "La réponse est requise."),
});

const editQuizSchema = z.object({
  titre: z.string().min(1, "Le titre est requis."),
  temps: z.string().min(1, "Le temps est requis."),
  delai_soumission_jours: z.string().optional(),
  qcm: z.array(questionSchema).min(1, "Ajoutez au least une question."),
  questions_approfondissement: z.array(approfondissementSchema),
});

type EditQuizFormValues = z.infer<typeof editQuizSchema>;

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const classeId = Number(params?.classeId);
  const quizId = Number(params?.quizId);

  const { data: classeDetails, isLoading: isLoadingClasse } =
    useClasse(classeId);
  const updateQuizMutation = useUpdateQuiz();

  // Trouver le quiz dans la classe
  const quiz = useMemo(() => {
    if (!classeDetails?.quizzes) return null;
    return classeDetails.quizzes.find((q) => q.id === quizId);
  }, [classeDetails, quizId]);

  const defaultValues: EditQuizFormValues = useMemo(() => {
    if (!quiz || !quiz.data) {
      return {
        titre: "",
        temps: "30",
        delai_soumission_jours: "1",
        qcm: [
          {
            question: "",
            propositions: { a: "", b: "", c: "", d: "" },
            bonne_reponse: "a",
          },
        ],
        questions_approfondissement: [],
      };
    }

    // Convertir le format du frontend vers le format du formulaire
    const qcmFormatted = quiz.data.qcm.map((q: any) => {
      let propositions: { a: string; b: string; c: string; d: string };
      let bonne_reponse: "a" | "b" | "c" | "d";

      // Vérifier le format : propositions (objet) ou reponses (array)
      if ("propositions" in q && typeof q.propositions === "object") {
        // Format quiz IA : propositions déjà en objet a, b, c, d
        propositions = q.propositions as {
          a: string;
          b: string;
          c: string;
          d: string;
        };
        bonne_reponse = q.bonne_reponse as "a" | "b" | "c" | "d";
      } else if ("reponses" in q && Array.isArray(q.reponses)) {
        // Format quiz manuel : reponses en array
        propositions = {
          a: q.reponses?.[0]?.texte || "",
          b: q.reponses?.[1]?.texte || "",
          c: q.reponses?.[2]?.texte || "",
          d: q.reponses?.[3]?.texte || "",
        };
        const correctIndex = q.reponses?.findIndex((r: any) => r.correct) ?? 0;
        bonne_reponse = ["a", "b", "c", "d"][correctIndex] as
          | "a"
          | "b"
          | "c"
          | "d";
      } else {
        // Format par défaut vide
        propositions = { a: "", b: "", c: "", d: "" };
        bonne_reponse = "a";
      }

      return {
        question: q.question,
        propositions,
        bonne_reponse,
      };
    });

    return {
      titre: quiz.titre,
      temps: quiz.temps?.toString() || "30",
      delai_soumission_jours: "1", // Valeur par défaut
      qcm: qcmFormatted,
      questions_approfondissement: quiz.data.questions_approfondissement || [],
    };
  }, [quiz]);

  const form = useForm<EditQuizFormValues>({
    resolver: zodResolver(editQuizSchema),
    mode: "onBlur",
    defaultValues,
    values: defaultValues,
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "qcm",
  });

  const {
    fields: approfondissementFields,
    append: appendApprofondissement,
    remove: removeApprofondissement,
  } = useFieldArray({
    control: form.control,
    name: "questions_approfondissement",
  });

  const handleGoBack = () => {
    router.back();
  };

  // Vérifier si le quiz peut être modifié (aucun élève n'a soumis)
  const canEditQuiz = (quiz?.nombre_eleves_soumis ?? 0) === 0;

  const handleSubmit = (values: EditQuizFormValues) => {
    if (!classeId || !quizId) return;
    if (!canEditQuiz) {
      alert("Ce quiz ne peut pas être modifié car des élèves ont déjà soumis.");
      return;
    }

    updateQuizMutation.mutate(
      {
        classeId,
        quizId,
        payload: {
          titre: values.titre.trim(),
          temps: Number(values.temps),
          delai_soumission_jours: values.delai_soumission_jours
            ? Number(values.delai_soumission_jours)
            : undefined,
          data: {
            qcm: values.qcm.map((question) => ({
              question: question.question.trim(),
              propositions: {
                a: question.propositions.a.trim(),
                b: question.propositions.b.trim(),
                c: question.propositions.c.trim(),
                d: question.propositions.d.trim(),
              },
              bonne_reponse: question.bonne_reponse,
            })),
            questions_approfondissement: values.questions_approfondissement.map(
              (item) => ({
                question: item.question.trim(),
                reponse: item.reponse.trim(),
              }),
            ),
          },
        },
      },
      {
        onSuccess: () => {
          router.push(`/teacher/classes/${classeId}?tab=Quiz manuel`);
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

  if (!classeDetails || !quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
        <p className="text-lg text-gray-600">Impossible de charger le quiz.</p>
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }

  if (!canEditQuiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
        <Card className="max-w-lg border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">
              Modification impossible
            </CardTitle>
            <CardDescription>
              Ce quiz ne peut pas être modifié car {quiz.nombre_eleves_soumis ?? 0}{" "}
              élève
              {(quiz.nombre_eleves_soumis ?? 0) > 1 ? "s ont" : " a"} déjà soumis
              {(quiz.nombre_eleves_soumis ?? 0) > 1 ? "" : "e"} réponse
              {(quiz.nombre_eleves_soumis ?? 0) > 1 ? "s" : ""}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleGoBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header avec bouton retour et titre */}
          <div
            className="mt-4 w-full mx-auto max-w-[1600px] flex items-center gap-4 px-4 sm:px-6 md:px-10 py-4 mb-8 rounded-2xl"
            style={{
              backgroundImage: `url("/bg-2.png")`,
              backgroundSize: "180px 180px",
            }}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              className="rounded-full bg-white hover:bg-gray-50 w-10 h-10 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 leading-tight">
                Modifier le quiz
              </h1>
            </div>
          </div>

          {/* Sous-titre */}
          <div className="mb-8 px-4">
            <p className="text-gray-600 text-base sm:text-lg">
              Classe : {classeDetails.nom}
            </p>
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Modifiez les réglages du quiz et les questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="titre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre du quiz</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: QCM – Dérivées"
                          className="bg-gray-50 border-gray-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="temps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temps par question (secondes)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30">30 secondes</SelectItem>
                          <SelectItem value="60">60 secondes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delai_soumission_jours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Délai de soumission (jours)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          placeholder="1"
                          className="bg-gray-50 border-gray-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 space-y-6">
            <Card className="shadow-md">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>Questions QCM</CardTitle>
                  <CardDescription>
                    Modifiez les questions et les réponses. Chaque question doit
                    comporter exactement 4 réponses (A, B, C, D) et une réponse
                    correcte.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendQuestion({
                      question: "",
                      propositions: { a: "", b: "", c: "", d: "" },
                      bonne_reponse: "a",
                    })
                  }
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" /> Ajouter une question
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                {questionFields.map((questionField, questionIndex) => (
                  <div
                    key={questionField.id}
                    className="rounded-xl border border-gray-200 bg-white/60 p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <FormField
                        control={form.control}
                        name={`qcm.${questionIndex}.question`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
                              Question {questionIndex + 1}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={3}
                                placeholder="Saisissez l'énoncé de la question"
                                className="bg-gray-50 border-gray-200 resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {questionFields.length > 1 && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>
                              Supprimer la question
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette question
                              ? Cette action est irréversible.
                            </AlertDialogDescription>
                            <div className="flex gap-3">
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => removeQuestion(questionIndex)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>

                    <div className="space-y-3">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Réponses possibles
                      </FormLabel>
                      <QuestionAnswersFields
                        control={form.control}
                        questionIndex={questionIndex}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Questions d'approfondissement (optionnel) */}
            <Card className="shadow-md">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>
                    Questions d'approfondissement (optionnel)
                  </CardTitle>
                  <CardDescription>
                    Ajoutez des questions ouvertes pour aller plus loin avec vos
                    élèves.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendApprofondissement({ question: "", reponse: "" })
                  }
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" /> Ajouter une question
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                {approfondissementFields.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Aucune question d'approfondissement pour l'instant.
                  </p>
                )}

                {approfondissementFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-xl border border-gray-200 bg-white/60 p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <FormField
                        control={form.control}
                        name={`questions_approfondissement.${index}.question`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Question
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={2}
                                placeholder="Saisissez la question"
                                className="bg-gray-50 border-gray-200 resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>
                            Supprimer la question
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette question ?
                          </AlertDialogDescription>
                          <div className="flex gap-3">
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeApprofondissement(index)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <FormField
                      control={form.control}
                      name={`questions_approfondissement.${index}.reponse`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Réponse attendue
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              placeholder="Donnez un exemple de réponse attendue"
                              className="bg-gray-50 border-gray-200 resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Boutons d'action en bas du formulaire */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8 px-4 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoBack}
              disabled={updateQuizMutation.isPending}
              className="sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto"
              disabled={updateQuizMutation.isPending}
            >
              {updateQuizMutation.isPending ? (
                <Spinner size="sm" className="mr-2" />
              ) : null}
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

interface QuestionAnswersFieldsProps {
  control: Control<EditQuizFormValues>;
  questionIndex: number;
}

const QuestionAnswersFields = ({
  control,
  questionIndex,
}: QuestionAnswersFieldsProps) => {
  const { getValues } = useFormContext<EditQuizFormValues>();

  const answerOptions = [
    { label: "A", key: "a" },
    { label: "B", key: "b" },
    { label: "C", key: "c" },
    { label: "D", key: "d" },
  ];

  return (
    <div className="space-y-3">
      {answerOptions.map(({ label, key }) => (
        <FormField
          key={key}
          control={control}
          name={`qcm.${questionIndex}.propositions.${key}` as any}
          render={({ field, fieldState }) => (
            <div
              className={cn(
                "flex flex-col sm:flex-row sm:items-center sm:gap-4 rounded-lg border border-gray-200 bg-white/70 p-3",
                fieldState.error && "border-red-300",
              )}
            >
              <div className="flex-1">
                <Label className="text-xs font-medium text-gray-600">
                  Réponse {label}
                </Label>
                <Input
                  {...field}
                  placeholder={`Saisissez la réponse ${label}`}
                  className="mt-1 bg-gray-50 border-gray-200"
                />
                {fieldState.error && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
              <Controller
                control={control}
                name={`qcm.${questionIndex}.bonne_reponse` as any}
                render={({ field: radioField }) => (
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <input
                      type="radio"
                      id={`question-${questionIndex}-${key}`}
                      name={`question-${questionIndex}-bonne-reponse`}
                      value={key}
                      checked={radioField.value === key}
                      onChange={() => radioField.onChange(key)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label
                      htmlFor={`question-${questionIndex}-${key}`}
                      className="text-xs text-gray-600 cursor-pointer whitespace-nowrap"
                    >
                      Bonne réponse
                    </label>
                  </div>
                )}
              />
            </div>
          )}
        />
      ))}
    </div>
  );
};
