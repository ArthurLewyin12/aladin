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
import { useGenerateQuiz } from "@/services/hooks/professeur/useGenerateQuiz";

interface CreateClassQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  classeId: number;
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

export const CreateClassQuizModal = ({
  isOpen,
  onClose,
  classeId,
  matieres,
}: CreateClassQuizModalProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [useDocument, setUseDocument] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
  const { mutate: generateQuiz, isPending } = useGenerateQuiz();

  const onSubmit = (data: QuizFormValues) => {
    generateQuiz(
      {
        classeId,
        payload: {
          title: data.title,
          difficulty: data.difficulty as "Facile" | "Moyen" | "Difficile",
          nombre_questions: Number(data.nombre_questions),
          temps: Number(data.temps),
          chapter_id: Number(data.chapter_id),
          document_file: selectedFile || undefined,
        },
      },
      {
        onSuccess: () => {
          onClose();
          form.reset();
          setUseDocument(false);
          setSelectedFile(null);
          queryClient.invalidateQueries({
            queryKey: createQueryKey("professeur", "classe", classeId),
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
              <FormLabel className="text-sm text-gray-600">
                Titre du quiz
              </FormLabel>
              <FormControl>
                <Input {...field} className="mt-1 bg-gray-50 border-gray-200" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        {/* Checkbox pour activer l'upload de document */}
        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="useDocument"
            checked={useDocument}
            onCheckedChange={(checked) => {
              setUseDocument(checked as boolean);
              if (!checked) {
                setSelectedFile(null);
              }
            }}
            disabled={!form.watch("chapter_id")}
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

        {/* Zone d'upload conditionnelle */}
        {useDocument && (
          <div className="space-y-2">
            <FileUpload
              onChange={setSelectedFile}
              selectedFile={selectedFile}
              disabled={isPending}
              maxSize={10 * 1024 * 1024}
              acceptedTypes={[".pdf", ".doc", ".docx", ".txt"]}
              compact
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  Difficulté
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200">
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
                <FormLabel className="text-sm text-gray-600">
                  Nbr. questions
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="mt-1 bg-gray-50 border-gray-200"
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
                  Temps (sec)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="mt-1 bg-gray-50 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent
          className="bg-white flex flex-col"
          style={{ maxHeight: useDocument ? "90vh" : "auto" }}
        >
          <GenerationLoadingOverlay
            isLoading={isPending}
            messages={quizLoadingMessages}
          />
          <DrawerHeader className="text-left flex-shrink-0">
            <DrawerTitle className="text-2xl font-bold text-[#2C3E50]">
              Créer un Quiz de Classe
            </DrawerTitle>
            <DrawerClose className="absolute right-4 top-4">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DrawerClose>
          </DrawerHeader>
          {useDocument ? (
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="px-4 pb-4">{FormContent}</div>
            </ScrollArea>
          ) : (
            <div className="px-4 pb-4">{FormContent}</div>
          )}
          <DrawerFooter className="flex-row gap-3 justify-end flex-shrink-0 border-t">
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
      <DialogContent
        className={cn(
          "sm:max-w-2xl bg-white flex flex-col",
          useDocument ? "max-h-[90vh]" : "",
        )}
      >
        <GenerationLoadingOverlay
          isLoading={isPending}
          messages={quizLoadingMessages}
        />
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-[#2C3E50]">
            Créer un Quiz de Classe
          </DialogTitle>
        </DialogHeader>
        {useDocument ? (
          <ScrollArea className="flex-1 overflow-y-auto pr-4 -mr-4">
            <div className="mt-4 pb-4">{FormContent}</div>
          </ScrollArea>
        ) : (
          <div className="mt-4">{FormContent}</div>
        )}
        <div className="flex gap-3 mt-6 justify-end flex-shrink-0 border-t pt-4">
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
