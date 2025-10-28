"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useGenerateQuiz } from "@/services/hooks/quiz";
import { X } from "lucide-react";
import { Matiere } from "@/services/controllers/types/common";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";
import { GenerationLoadingOverlay } from "@/components/ui/generation-loading-overlay";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { Enfant } from "@/services/controllers/types/common/parent.types";

interface CreateEnfantQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  enfant: Enfant;
  matieres: Matiere[];
  isMobile?: boolean;
}

const quizFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  matiere_id: z.string().min(1, "La matière est requise."),
  chapter_id: z.string().min(1, "Le chapitre est requis."),
  difficulty: z.string().min(1, "La difficulté est requise."),
  nombre_questions: z.string().min(1, "Le nombre de questions est requis."),
  temps: z
    .string()
    .min(1, "Le temps est requis.")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 30, {
      message: "Le temps doit être d'au moins 30 secondes.",
    }),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

const quizLoadingMessages = [
  "Génération du quiz en cours...",
  "Construction des questions...",
  "Analyse du chapitre...",
  "Préparation des propositions...",
  "Finalisation...",
];

export const CreateEnfantQuizModal = ({
  isOpen,
  onClose,
  enfant,
  matieres,
  isMobile = false,
}: CreateEnfantQuizModalProps) => {
  const [useDocument, setUseDocument] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      matiere_id: undefined,
      chapter_id: undefined,
      difficulty: undefined,
      nombre_questions: "10",
      temps: "30",
    },
  });

  const watchedMatiere = form.watch("matiere_id");
  const { data: chapitres, isLoading: isLoadingChapitres } =
    useChapitresByMatiere(Number(watchedMatiere));

  const queryClient = useQueryClient();
  const generateQuizMutation = useGenerateQuiz();

  const onSubmit = (data: QuizFormValues) => {
    if (useDocument && !selectedFile) {
      toast({
        variant: "error",
        message: "Veuillez sélectionner un document.",
      });
      return;
    }

    generateQuizMutation.mutate(
      {
        chapter_id: Number(data.chapter_id),
        difficulty: data.difficulty as "Facile" | "Moyen" | "Difficile",
        document_file: useDocument ? selectedFile || undefined : undefined,
      },
      {
        onSuccess: () => {
          onClose();
          form.reset();
          setUseDocument(false);
          setSelectedFile(null);
          // Invalider les quizzes de l'enfant
          queryClient.invalidateQueries({
            queryKey: createQueryKey("parent", "enfant", "quiz"),
          });
          toast({
            variant: "success",
            message: "Quiz créé avec succès!",
          });
        },
        onError: (error: any) => {
          toast({
            variant: "error",
            message: error?.message || "Erreur lors de la création du quiz",
          });
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      form.reset();
      setUseDocument(false);
      setSelectedFile(null);
    }
  };

  const FormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">
                Titre du quiz
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Titre du quiz"
                  className="bg-gray-50 border-gray-200"
                  disabled={generateQuizMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="matiere_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">Matière</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={generateQuizMutation.isPending}
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {matieres.map((matiere) => (
                    <SelectItem key={matiere.id} value={matiere.id.toString()}>
                      {matiere.libelle}
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
          name="chapter_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">Chapitre</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={
                  !watchedMatiere ||
                  isLoadingChapitres ||
                  generateQuizMutation.isPending
                }
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Sélectionner un chapitre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {chapitres?.map((chapitre) => (
                    <SelectItem
                      key={chapitre.id}
                      value={chapitre.id.toString()}
                    >
                      {chapitre.libelle}
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
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">
                Difficulté
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={generateQuizMutation.isPending}
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Sélectionner une difficulté" />
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nombre_questions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  Nombre de questions
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    className="bg-gray-50 border-gray-200"
                    disabled={generateQuizMutation.isPending}
                    {...field}
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
                <FormLabel className="text-sm text-gray-600">
                  Temps (secondes)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="30"
                    className="bg-gray-50 border-gray-200"
                    disabled={generateQuizMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="useDocument"
            checked={useDocument}
            onCheckedChange={(checked) => setUseDocument(checked as boolean)}
            disabled={generateQuizMutation.isPending}
          />
          <label
            htmlFor="useDocument"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Utiliser un document
          </label>
        </div>

        {useDocument && (
          <FileUpload
            onChange={setSelectedFile}
            selectedFile={selectedFile}
            disabled={generateQuizMutation.isPending}
          />
        )}

        <Button
          type="submit"
          disabled={generateQuizMutation.isPending}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {generateQuizMutation.isPending ? "Génération..." : "Créer le quiz"}
        </Button>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerContent className="bg-white max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl font-bold text-purple-600">
              Créer un quiz pour {enfant.prenom}
            </DrawerTitle>
            <DrawerClose className="absolute right-4 top-4">
              <X className="h-5 w-5" />
            </DrawerClose>
          </DrawerHeader>

          <ScrollArea className="h-[60vh] px-4 pb-4">
            {FormContent}
          </ScrollArea>

          <DrawerFooter className="flex-row gap-3">
            <Button
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              className="flex-1"
            >
              Annuler
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-600">
            Créer un quiz pour {enfant.prenom}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {FormContent}
        </ScrollArea>
      </DialogContent>

      {generateQuizMutation.isPending && (
        <GenerationLoadingOverlay isLoading={generateQuizMutation.isPending} messages={quizLoadingMessages} />
      )}
    </Dialog>
  );
};
