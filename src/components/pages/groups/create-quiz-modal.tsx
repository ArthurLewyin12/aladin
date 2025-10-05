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
import { useCreateGroupQuiz } from "@/services/hooks/groupes/useCreateGroupQuiz";
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

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  matieres: Matiere[];
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

export const CreateQuizModal = ({
  isOpen,
  onClose,
  groupId,
  matieres,
}: CreateQuizModalProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
  const { mutate: createQuiz, isPending } = useCreateGroupQuiz();

  const onSubmit = (data: QuizFormValues) => {
    createQuiz(
      {
        group_id: groupId,
        title: data.title,
        difficulty: data.difficulty,
        nombre_questions: Number(data.nombre_questions),
        temps: Number(data.temps),
        chapter_id: Number(data.chapter_id),
      },
      {
        onSuccess: () => {
          onClose();
          form.reset();
          queryClient.invalidateQueries({
            queryKey: createQueryKey("detailedGroupe", groupId),
          });
        },
      },
    );
  };

  const FormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">Titre du quiz</FormLabel>
              <FormControl>
                <Input {...field} className="mt-1 bg-gray-50 border-gray-200" />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200">
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
                defaultValue={field.value}
                disabled={!watchedMatiere || isLoadingChapitres}
              >
                <FormControl>
                  <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Sélectionner un chapitre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingChapitres ? (
                    <SelectItem value="loading" disabled>
                      Chargement...
                    </SelectItem>
                  ) : (
                    chapitres?.map((chapitre) => (
                      <SelectItem
                        key={chapitre.id}
                        value={chapitre.id.toString()}
                      >
                        {chapitre.libelle}
                      </SelectItem>
                    ))
                  )}
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
              <FormLabel className="text-sm text-gray-600">Difficulté</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200">
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

        <FormField
          control={form.control}
          name="nombre_questions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">Nombre de questions</FormLabel>
              <FormControl>
                <Input type="number" {...field} className="mt-1 bg-gray-50 border-gray-200" />
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
              <FormLabel className="text-sm text-gray-600">Temps (en secondes)</FormLabel>
              <FormControl>
                <Input type="number" {...field} className="mt-1 bg-gray-50 border-gray-200" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="bg-white max-h-[90vh]">
          <GenerationLoadingOverlay isLoading={isPending} messages={quizLoadingMessages} />
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl font-bold text-[#2C3E50]">Créer un Quiz</DrawerTitle>
            <DrawerClose className="absolute right-4 top-4">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DrawerClose>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">{FormContent}</div>
          <DrawerFooter className="flex-row gap-3 justify-end">
             <Button variant="ghost" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="bg-[#2C3E50] hover:bg-[#1a252f] text-white flex-1"
                disabled={isPending}
              >
                Créer
              </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <GenerationLoadingOverlay isLoading={isPending} messages={quizLoadingMessages} />
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#2C3E50]">Créer un Quiz</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{FormContent}</div>
        <div className="flex gap-3 mt-6 justify-end">
          <Button variant="ghost" onClick={onClose} className="px-6">
            Annuler
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-8"
            disabled={isPending}
          >
            Créer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};