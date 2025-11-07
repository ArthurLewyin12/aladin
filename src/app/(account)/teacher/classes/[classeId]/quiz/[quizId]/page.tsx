"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useClasse } from "@/services/hooks/professeur/useClasse";
import { useUpdateQuiz } from "@/services/hooks/professeur/useUpdateQuiz";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Schema de validation Zod
const quizSchema = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  difficulte: z.enum(["Facile", "Moyen", "Difficile"]),
  temps: z.number().min(5, "La durée minimale est de 5 minutes"),
  qcm: z
    .array(
      z.object({
        question: z.string().min(5, "La question doit contenir au moins 5 caractères"),
        reponses: z
          .array(
            z.object({
              texte: z.string().min(1, "La réponse ne peut pas être vide"),
              correct: z.boolean(),
            })
          )
          .min(2, "Au moins 2 réponses sont requises")
          .refine(
            (reponses) => reponses.some((r) => r.correct),
            "Au moins une réponse correcte est requise"
          ),
      })
    )
    .min(1, "Au moins une question QCM est requise"),
  questions_approfondissement: z.array(
    z.object({
      question: z.string().min(5, "La question doit contenir au moins 5 caractères"),
      reponse: z.string().min(5, "La réponse doit contenir au moins 5 caractères"),
    })
  ),
});

type QuizFormValues = z.infer<typeof quizSchema>;

const EditManualQuizPage = () => {
  const params = useParams();
  const router = useRouter();
  const classeId = Number(params.classeId);
  const quizId = Number(params.quizId);

  const { data: classeDetails, isLoading: isLoadingClasse } = useClasse(classeId);
  const { mutate: updateQuiz, isPending: isUpdating } = useUpdateQuiz();

  // Trouver le quiz spécifique
  const quiz = useMemo(() => {
    return classeDetails?.quizzes?.find((q) => q.id === quizId);
  }, [classeDetails, quizId]);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      titre: "",
      difficulte: "Moyen",
      temps: 30,
      qcm: [
        {
          question: "",
          reponses: [
            { texte: "", correct: false },
            { texte: "", correct: false },
          ],
        },
      ],
      questions_approfondissement: [],
    },
  });

  const {
    fields: qcmFields,
    append: appendQcm,
    remove: removeQcm,
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

  // Charger les données du quiz dans le formulaire
  useEffect(() => {
    if (quiz?.data) {
      form.reset({
        titre: quiz.titre,
        difficulte: quiz.difficulte as "Facile" | "Moyen" | "Difficile",
        temps: quiz.temps,
        qcm: quiz.data.qcm || [],
        questions_approfondissement: quiz.data.questions_approfondissement || [],
      });
    }
  }, [quiz, form]);

  const onSubmit = (values: QuizFormValues) => {
    updateQuiz(
      {
        classeId,
        quizId,
        payload: {
          titre: values.titre,
          temps: values.temps,
          data: {
            qcm: values.qcm,
            questions_approfondissement: values.questions_approfondissement,
          },
        },
      },
      {
        onSuccess: () => {
          router.push(`/teacher/classes/${classeId}`);
        },
      }
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoadingClasse) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">Quiz introuvable.</p>
      </div>
    );
  }

  if (quiz.is_active) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full bg-white hover:bg-gray-50 w-10 h-10 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center max-w-2xl mx-auto">
            <p className="text-yellow-800 mb-4">
              Ce quiz est déjà actif. Vous ne pouvez plus le modifier.
            </p>
            <Button onClick={handleBack} variant="outline">
              Retour
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full bg-white hover:bg-gray-50 w-10 h-10 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Titre */}
        <div className="mb-8 px-4">
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 leading-tight">
            Modifier le quiz
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Modifiez les détails de votre quiz manuel
          </p>
        </div>

        {/* Formulaire */}
        <ScrollArea className="h-[calc(100vh-300px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-20">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre du quiz *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Quiz sur les dérivées" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulte"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulté *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Facile">Facile</SelectItem>
                              <SelectItem value="Moyen">Moyen</SelectItem>
                              <SelectItem value="Difficile">Difficile</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="temps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durée (minutes) *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="30" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Questions QCM */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions QCM *</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {qcmFields.map((field, qcmIndex) => (
                    <Card key={field.id} className="border-2">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-lg">Question {qcmIndex + 1}</CardTitle>
                        {qcmFields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeQcm(qcmIndex)}
                          >
                            Supprimer
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`qcm.${qcmIndex}.question`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Entrez votre question"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <FormLabel>Réponses *</FormLabel>
                          {field.reponses.map((_, repIndex) => (
                            <div key={repIndex} className="flex items-start gap-2">
                              <FormField
                                control={form.control}
                                name={`qcm.${qcmIndex}.reponses.${repIndex}.correct`}
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2 space-y-0 pt-2">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`qcm.${qcmIndex}.reponses.${repIndex}.texte`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        placeholder={`Réponse ${repIndex + 1}`}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendQcm({
                        question: "",
                        reponses: [
                          { texte: "", correct: false },
                          { texte: "", correct: false },
                        ],
                      })
                    }
                    className="w-full"
                  >
                    + Ajouter une question QCM
                  </Button>
                </CardContent>
              </Card>

              {/* Questions d'approfondissement */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions d'approfondissement (optionnel)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {approfondissementFields.map((field, index) => (
                    <Card key={field.id} className="border-2">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-lg">
                          Question {index + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeApprofondissement(index)}
                        >
                          Supprimer
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`questions_approfondissement.${index}.question`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Entrez la question"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`questions_approfondissement.${index}.reponse`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Réponse</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Entrez la réponse"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendApprofondissement({
                        question: "",
                        reponse: "",
                      })
                    }
                    className="w-full"
                  >
                    + Ajouter une question d'approfondissement
                  </Button>
                </CardContent>
              </Card>

              {/* Boutons d'action */}
              <div className="flex gap-4 sticky bottom-0 bg-gray-50 py-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  disabled={isUpdating}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#2C3E50] hover:bg-[#1a252f]"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Mise à jour..." : "Mettre à jour le quiz"}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </div>
    </div>
  );
};

export default EditManualQuizPage;

