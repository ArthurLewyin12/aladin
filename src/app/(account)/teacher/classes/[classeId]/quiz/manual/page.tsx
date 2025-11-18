"use client";

import { useMemo } from "react";
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
import { useCreateManualQuiz } from "@/services/hooks/professeur/useCreateManualQuiz";

import { ArrowLeft, PlusIcon, Trash2 } from "lucide-react";

const answerSchema = z.object({
  texte: z.string().min(1, "La réponse ne peut pas être vide."),
  correct: z.boolean(),
});

const questionSchema = z
  .object({
    question: z.string().min(1, "La question ne peut pas être vide."),
    reponses: z
      .array(answerSchema)
      .min(2, "Ajoutez au moins deux réponses.")
      .refine(
        (answers) => answers.filter((answer) => answer.correct).length === 1,
        "Sélectionnez exactement une bonne réponse.",
      ),
  })
  .refine(
    (val) => {
      const uniqueAnswers = new Set(
        val.reponses.map((answer) => answer.texte.trim().toLowerCase()),
      );
      return uniqueAnswers.size === val.reponses.length;
    },
    {
      message: "Les réponses doivent être uniques.",
      path: ["reponses"],
    },
  );

const approfondissementSchema = z.object({
  question: z.string().min(1, "La question est requise."),
  reponse: z.string().min(1, "La réponse est requise."),
});

const manualQuizSchema = z.object({
  titre: z.string().min(1, "Le titre est requis."),
  difficulte: z.enum(["Facile", "Moyen", "Difficile"]),
  temps: z.string().min(1, "Le temps est requis."),
  matiere_id: z.string().min(1, "La matière est requise."),
  chapitres_ids: z.array(z.string()).min(1, "Choisissez au moins un chapitre."),
  qcm: z.array(questionSchema).min(1, "Ajoutez au moins une question."),
  questions_approfondissement: z.array(approfondissementSchema),
});

type ManualQuizFormValues = z.infer<typeof manualQuizSchema>;

const difficulties = [
  { label: "Facile", value: "Facile" },
  { label: "Moyen", value: "Moyen" },
  { label: "Difficile", value: "Difficile" },
];

export default function CreateManualQuizPage() {
  const router = useRouter();
  const params = useParams();
  const classeId = Number(params?.classeId);

  const { data: classeDetails, isLoading: isLoadingClasse } =
    useClasse(classeId);
  const createManualQuizMutation = useCreateManualQuiz();

  const availableMatieres = useMemo(() => {
    if (!classeDetails) return [];
    // Les matières sont déjà incluses dans classeDetails.matieres
    return (
      classeDetails.matieres?.map((matiere) => ({
        id: matiere.id,
        libelle: matiere.libelle,
      })) || []
    );
  }, [classeDetails]);

  const defaultValues: ManualQuizFormValues = {
    titre: "",
    difficulte: "Moyen",
    temps: "30", // 30 secondes par défaut
    matiere_id: "",
    chapitres_ids: [],
    qcm: [
      {
        question: "",
        reponses: [
          { texte: "", correct: true },
          { texte: "", correct: false },
        ],
      },
    ],
    questions_approfondissement: [],
  };

  const form = useForm<ManualQuizFormValues>({
    resolver: zodResolver(manualQuizSchema),
    mode: "onBlur",
    defaultValues,
  });

  const selectedMatiere = form.watch("matiere_id");
  const { data: chapitres, isLoading: isLoadingChapitres } =
    useChapitresByMatiere(Number(selectedMatiere));

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

  const handleSubmit = (values: ManualQuizFormValues) => {
    if (!classeId) return;

    createManualQuizMutation.mutate(
      {
        classeId,
        payload: {
          titre: values.titre.trim(),
          difficulte: values.difficulte,
          temps: Number(values.temps),
          matiere_id: Number(values.matiere_id),
          chapitres_ids: values.chapitres_ids.map((id) => Number(id)),
          data: {
            qcm: values.qcm.map((question) => ({
              question: question.question.trim(),
              reponses: question.reponses.map((reponse) => ({
                texte: reponse.texte.trim(),
                correct: reponse.correct,
              })),
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
          form.reset(defaultValues);
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

  if (!classeDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
        <p className="text-lg text-gray-600">
          Impossible de charger les informations de la classe.
        </p>
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }

  if (availableMatieres.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Pas de matière disponible</CardTitle>
            <CardDescription>
              Définis les matières que tu enseignes et associe-les à cette
              classe avant de créer un quiz manuel.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => router.push("/teacher/classes")}>
              Retour aux classes
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
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 leading-tight">
                Créer un quiz manuel
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
                Configure les réglages de base du quiz avant d’ajouter les
                questions.
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
                      <FormLabel>Temps par question</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                  name="difficulte"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulté</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficulties.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="matiere_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matière</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("chapitres_ids", []);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableMatieres.map((matiere) => (
                            <SelectItem
                              key={matiere.id}
                              value={matiere.id.toString()}
                            >
                              {matiere.libelle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="chapitres_ids"
                  render={({ field }) => {
                    const chapterTags: TTag[] =
                      chapitres?.map((chap) => ({
                        key: String(chap.id),
                        name: chap.libelle,
                      })) || [];

                    const selectedTags = chapterTags.filter((tag) =>
                      field.value?.includes(tag.key),
                    );

                    return (
                      <FormItem>
                        <FormLabel>Chapitres liés</FormLabel>
                        {!selectedMatiere ? (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-600">
                            Veuillez sélectionner une matière d'abord.
                          </div>
                        ) : isLoadingChapitres ? (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-600">
                            <Spinner size="sm" className="mr-2 inline" />
                            Chargement des chapitres...
                          </div>
                        ) : chapterTags.length === 0 ? (
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                            Aucun chapitre trouvé pour cette matière.
                          </div>
                        ) : (
                          <MultipleSelect
                            key={`${selectedMatiere}-${selectedTags.map((t) => t.key).join(",")}`}
                            tags={chapterTags}
                            defaultValue={selectedTags}
                            onChange={(tags) => {
                              field.onChange(tags.map((tag) => tag.key));
                            }}
                            showLabel={false}
                          />
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
                    Ajoutez les questions à choix multiples. Chaque question
                    doit comporter au moins deux réponses et une réponse
                    correcte.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendQuestion({
                      question: "",
                      reponses: [
                        { texte: "", correct: true },
                        { texte: "", correct: false },
                      ],
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
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

            {/*<Card className="shadow-md">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>Questions d'approfondissement (optionnel)</CardTitle>
                <CardDescription>
                  Ajoutez des questions ouvertes pour aller plus loin avec vos élèves.
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeApprofondissement(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
          </Card>*/}

          {/* Boutons d'action en bas du formulaire */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8 px-4 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset(defaultValues)}
              disabled={createManualQuizMutation.isPending}
              className="sm:w-auto"
            >
              Réinitialiser
            </Button>
            <Button
              type="submit"
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white sm:w-auto"
              disabled={createManualQuizMutation.isPending}
            >
              {createManualQuizMutation.isPending ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <PlusIcon className="w-4 h-4 mr-2" />
              )}
              Créer le quiz
            </Button>
          </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

interface QuestionAnswersFieldsProps {
  control: Control<ManualQuizFormValues>;
  questionIndex: number;
}

const QuestionAnswersFields = ({
  control,
  questionIndex,
}: QuestionAnswersFieldsProps) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `qcm.${questionIndex}.reponses` as const,
  });

  const { getValues } = useFormContext<ManualQuizFormValues>();

  // Fonction pour gérer le changement de bonne réponse (une seule à la fois)
  const handleCorrectChange = (answerIndex: number, checked: boolean) => {
    if (checked) {
      // Récupérer les valeurs actuelles du formulaire
      const currentAnswers = getValues(`qcm.${questionIndex}.reponses`);

      // Décocher toutes les autres réponses et cocher celle-ci
      currentAnswers.forEach((answer, index) => {
        update(index, {
          texte: answer.texte, // Préserver le texte actuel
          correct: index === answerIndex,
        });
      });
    }
    // Si on décoche, on ne fait rien (il doit toujours y avoir une bonne réponse)
  };

  return (
    <div className="space-y-3">
      {fields.map((answerField, answerIndex) => (
        <FormField
          key={answerField.id}
          control={control}
          name={`qcm.${questionIndex}.reponses.${answerIndex}.texte` as const}
          render={({ field, fieldState }) => (
            <div
              className={cn(
                "flex flex-col sm:flex-row sm:items-center sm:gap-4 rounded-lg border border-gray-200 bg-white/70 p-3",
                fieldState.error && "border-red-300",
              )}
            >
              <div className="flex-1">
                <Label className="text-xs font-medium text-gray-600">
                  Réponse {answerIndex + 1}
                </Label>
                <Input
                  {...field}
                  placeholder="Saisissez la réponse"
                  className="mt-1 bg-gray-50 border-gray-200"
                />
              </div>
              <div className="flex items-center justify-between sm:w-auto mt-3 sm:mt-0">
                <Controller
                  control={control}
                  name={
                    `qcm.${questionIndex}.reponses.${answerIndex}.correct` as const
                  }
                  render={({ field: switchField }) => (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={switchField.value}
                        onCheckedChange={(checked) => {
                          handleCorrectChange(answerIndex, checked);
                        }}
                      />
                      <span className="text-xs text-gray-600">
                        Bonne réponse
                      </span>
                    </div>
                  )}
                />

                {fields.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(answerIndex)}
                    className="ml-2 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ texte: "", correct: false })}
        disabled={fields.length >= 6}
      >
        <PlusIcon className="w-4 h-4 mr-2" /> Ajouter une réponse
      </Button>
    </div>
  );
};
