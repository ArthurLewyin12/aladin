"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { MultipleSelect, TTag } from "@/components/ui/multiple-selects";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { useClasse } from "@/services/hooks/professeur/useClasse";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import { useGenerateQuiz } from "@/services/hooks/professeur/useGenerateQuiz";
import { GenerationLoadingOverlay } from "@/components/ui/generation-loading-overlay";
import { useQueryClient } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";
import { useState } from "react";

const quizFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  matiere_id: z.string().min(1, "La matière est requise."),
  chapitre_ids: z.array(z.string()).min(1, "Au moins un chapitre est requis."),
  difficulty: z.string().min(1, "La difficulté est requise."),
  nombre_questions: z.string().min(1, "Le nombre de questions est requis."),
  temps: z.string().min(1, "Le temps par question est requis."),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

const quizLoadingMessages = [
  "Génération du quiz en cours...",
  "Construction des questions...",
  "Analyse du chapitre...",
  "Préparation des propositions...",
  "Finalisation...",
];

export default function CreateQuizPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const classeId = Number(params.classeId);

  const [useDocument, setUseDocument] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: classeDetails, isLoading: isLoadingClasse } = useClasse(classeId);
  const { mutate: generateQuiz, isPending } = useGenerateQuiz();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      matiere_id: "",
      chapitre_ids: [],
      difficulty: "",
      nombre_questions: "10",
      temps: "60",
    },
  });

  const watchedMatiereId = form.watch("matiere_id");
  const { data: chapitresData, isLoading: isLoadingChapitres } =
    useChapitresByMatiere(Number(watchedMatiereId));

  const onSubmit = (data: QuizFormValues) => {
    generateQuiz(
      {
        classeId,
        payload: {
          title: data.title,
          difficulty: data.difficulty as "Facile" | "Moyen" | "Difficile",
          nombre_questions: Number(data.nombre_questions),
          temps: Number(data.temps) * Number(data.nombre_questions),
          chapter_id: Number(data.chapitre_ids[0]), // On prend le premier chapitre sélectionné
          document_file: selectedFile || undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: createQueryKey("professeur", "classe", classeId),
          });
          router.push(`/teacher/classes/${classeId}`);
        },
      },
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoadingClasse) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const nombreQuestions = form.watch("nombre_questions");
  const tempsParQuestion = form.watch("temps");
  const durationTotal = Number(tempsParQuestion) * Number(nombreQuestions || 0);
  const minutes = Math.floor(durationTotal / 60);
  const seconds = durationTotal % 60;

  const displayDuration = () => {
    if (durationTotal < 60) {
      return `${durationTotal} sec`;
    } else if (seconds === 0) {
      return `${minutes} min`;
    } else {
      return `${minutes} min ${seconds} sec`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <GenerationLoadingOverlay
        isLoading={isPending}
        messages={quizLoadingMessages}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full bg-white hover:bg-gray-100 w-10 h-10 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Créer un Quiz IA
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {classeDetails?.nom}
            </p>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Titre Card */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du quiz</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Quiz sur les équations" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Matière Card */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <FormField
                control={form.control}
                name="matiere_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matière</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("chapitre_ids", []);
                      }}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner une matière" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classeDetails?.matieres?.map((matiere) => (
                          <SelectItem
                            key={matiere.id}
                            value={String(matiere.id)}
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

            {/* Chapitres Card */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <FormField
                control={form.control}
                name="chapitre_ids"
                render={({ field }) => {
                  const chapterTags: TTag[] =
                    chapitresData?.map((chap) => ({
                      key: String(chap.id),
                      name: chap.libelle,
                    })) || [];

                  const selectedTags = chapterTags.filter((tag) =>
                    field.value?.includes(tag.key),
                  );

                  return (
                    <FormItem>
                      <FormLabel>Chapitre</FormLabel>
                      {!watchedMatiereId ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-600">
                          Veuillez sélectionner une matière d'abord.
                        </div>
                      ) : isLoadingChapitres ? (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-600">
                          Chargement des chapitres...
                        </div>
                      ) : chapterTags.length === 0 ? (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                          Aucun chapitre trouvé pour cette matière.
                        </div>
                      ) : (
                        <MultipleSelect
                          key={`${watchedMatiereId}-${selectedTags.map((t) => t.key).join(",")}`}
                          tags={chapterTags}
                          defaultValue={selectedTags}
                          onChange={(tags) => {
                            // Limiter à 1 seul chapitre
                            if (tags.length <= 1) {
                              field.onChange(tags.map((tag) => tag.key));
                            } else {
                              // Si on essaie d'en ajouter plus, garder seulement le dernier sélectionné
                              field.onChange([tags[tags.length - 1].key]);
                            }
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

            {/* Document Upload Card */}
            {/* <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-start space-x-2 mb-4">
                <Checkbox
                  id="useDocument"
                  checked={useDocument}
                  onCheckedChange={(checked) => {
                    setUseDocument(checked as boolean);
                    if (!checked) {
                      setSelectedFile(null);
                    }
                  }}
                  disabled={!form.watch("chapitre_ids")?.length}
                  className="border-gray-400 data-[state=checked]:bg-[#2C3E50] data-[state=checked]:border-[#2C3E50]"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="useDocument"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Générer depuis un document (optionnel)
                  </label>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, TXT - Maximum 10 MB
                  </p>
                </div>
              </div>

              {useDocument && (
                <FileUpload
                  onChange={setSelectedFile}
                  selectedFile={selectedFile}
                  disabled={isPending}
                  maxSize={10 * 1024 * 1024}
                  acceptedTypes={[".pdf", ".doc", ".docx", ".txt"]}
                  compact
                />
              )}
            </div> */}

            {/* Paramètres du quiz Card */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulté</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Difficulté" />
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
                  name="nombre_questions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nbr. questions</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Nombre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">5 questions</SelectItem>
                          <SelectItem value="10">10 questions</SelectItem>
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
                      <FormLabel>Temps/question</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Durée" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30">30 sec</SelectItem>
                          <SelectItem value="60">60 sec</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {nombreQuestions && tempsParQuestion && durationTotal > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 Durée totale du quiz : <span className="font-semibold">{displayDuration()}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex gap-3 sm:ml-auto w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 sm:flex-none"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 sm:flex-none bg-[#2C3E50] hover:bg-[#1a252f] text-white"
                  disabled={isPending}
                >
                  {isPending ? "Génération..." : "Créer le quiz"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
