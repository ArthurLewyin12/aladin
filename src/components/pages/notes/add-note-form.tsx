"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAddNoteClasse } from "@/services/hooks/notes-classe";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import { useSession } from "@/services/hooks/auth/useSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

const noteSchema = z.object({
  matiere_id: z.number({ message: "La matière est requise" }),
  note: z
    .number({ message: "La note est requise" })
    .min(0, "La note doit être entre 0 et 20")
    .max(20, "La note doit être entre 0 et 20"),
  type_evaluation: z.enum(
    ["Contrôle", "Devoir", "Interrogation", "Examen", "TP", "Autre"],
    {
      message: "Le type d'évaluation est requis",
    },
  ),
  date_evaluation: z.string({ message: "La date est requise" }),
  commentaire: z.string().max(1000).optional(),
  chapitres_ids: z.array(z.number()).optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface AddNoteFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  showScrollArea?: boolean;
}

export function AddNoteForm({
  onSuccess,
  onCancel,
  submitLabel = "Ajouter",
  cancelLabel = "Annuler",
  showScrollArea = false,
}: AddNoteFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useSession();
  const { mutate: addNote, isPending } = useAddNoteClasse();
  const { data: matieresData } = useMatieresByNiveau(user?.niveau?.id || 0);
  const matieres = matieresData?.matieres || [];

  const [selectedMatiereId, setSelectedMatiereId] = useState<number | null>(
    null,
  );
  const { data: chapitresData } = useChapitresByMatiere(selectedMatiereId || 0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  const watchedMatiereId = watch("matiere_id");
  const [selectedChapitres, setSelectedChapitres] = useState<number[]>([]);

  useEffect(() => {
    if (watchedMatiereId) {
      setSelectedMatiereId(watchedMatiereId);
      setSelectedChapitres([]);
      setValue("chapitres_ids", []);
    }
  }, [watchedMatiereId, setValue]);

  useEffect(() => {
    if (date) {
      setValue("date_evaluation", format(date, "yyyy-MM-dd"));
    }
  }, [date, setValue]);

  const onSubmit = (data: NoteFormData) => {
    addNote(
      { ...data, chapitres_ids: selectedChapitres },
      {
        onSuccess: () => {
          reset();
          setSelectedChapitres([]);
          setDate(new Date());
          onSuccess?.();
        },
      },
    );
  };

  const handleChapitreToggle = (chapitreId: number) => {
    setSelectedChapitres((prev) => {
      const newSelection = prev.includes(chapitreId)
        ? prev.filter((id) => id !== chapitreId)
        : [...prev, chapitreId];
      setValue("chapitres_ids", newSelection);
      return newSelection;
    });
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Matière */}
      <div className="space-y-2">
        <Label htmlFor="matiere_id" className="text-sm font-medium text-gray-700">
          Matière <span className="text-rose-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => setValue("matiere_id", parseInt(value))}
        >
          <SelectTrigger
            id="matiere_id"
            className="bg-white border-gray-200 focus:border-[#548C2F] focus:ring-[#548C2F]/20 transition-all"
          >
            <SelectValue placeholder="Sélectionne une matière" />
          </SelectTrigger>
          <SelectContent>
            {matieres.map((matiere) => (
              <SelectItem key={matiere.id} value={matiere.id.toString()}>
                {matiere.libelle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.matiere_id && (
          <p className="text-sm text-rose-500">{errors.matiere_id.message}</p>
        )}
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note" className="text-sm font-medium text-gray-700">
          Note /20 <span className="text-rose-500">*</span>
        </Label>
        <Input
          id="note"
          type="number"
          step="0.25"
          min="0"
          max="20"
          placeholder="Ex: 15.5"
          className="bg-white border-gray-200 focus:border-[#548C2F] focus:ring-[#548C2F]/20 transition-all"
          {...register("note", { valueAsNumber: true })}
        />
        {errors.note && (
          <p className="text-sm text-rose-500">{errors.note.message}</p>
        )}
      </div>

      {/* Type d'évaluation */}
      <div className="space-y-2">
        <Label htmlFor="type_evaluation" className="text-sm font-medium text-gray-700">
          Type d'évaluation <span className="text-rose-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => setValue("type_evaluation", value as any)}
        >
          <SelectTrigger
            id="type_evaluation"
            className="bg-white border-gray-200 focus:border-[#548C2F] focus:ring-[#548C2F]/20 transition-all"
          >
            <SelectValue placeholder="Sélectionne un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Contrôle">Contrôle</SelectItem>
            <SelectItem value="Devoir">Devoir</SelectItem>
            <SelectItem value="Interrogation">Interrogation</SelectItem>
            <SelectItem value="Examen">Examen</SelectItem>
            <SelectItem value="TP">TP</SelectItem>
            <SelectItem value="Autre">Autre</SelectItem>
          </SelectContent>
        </Select>
        {errors.type_evaluation && (
          <p className="text-sm text-rose-500">
            {errors.type_evaluation.message}
          </p>
        )}
      </div>

      {/* Date avec Popover */}
      <div className="space-y-2">
        <Label htmlFor="date_evaluation" className="text-sm font-medium text-gray-700">
          Date de l'évaluation <span className="text-rose-500">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-white border-gray-200 hover:bg-gray-50 transition-all",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "PPP", { locale: fr })
              ) : (
                <span>Choisir une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              captionLayout="dropdown"
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
        {errors.date_evaluation && (
          <p className="text-sm text-rose-500">
            {errors.date_evaluation.message}
          </p>
        )}
      </div>

      {/* Chapitres */}
      {watchedMatiereId && chapitresData && chapitresData.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Chapitres concernés (optionnel)
          </Label>
          <ScrollArea className="h-32 border border-gray-200 rounded-lg p-3 bg-gray-50/50">
            <div className="space-y-2">
              {chapitresData.map((chapitre) => (
                <div key={chapitre.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`chapitre-${chapitre.id}`}
                    checked={selectedChapitres.includes(chapitre.id)}
                    onCheckedChange={() => handleChapitreToggle(chapitre.id)}
                    className="data-[state=checked]:bg-[#548C2F] data-[state=checked]:border-[#548C2F]"
                  />
                  <Label
                    htmlFor={`chapitre-${chapitre.id}`}
                    className="text-sm font-normal cursor-pointer text-gray-700"
                  >
                    {chapitre.libelle}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Commentaire */}
      <div className="space-y-2">
        <Label htmlFor="commentaire" className="text-sm font-medium text-gray-700">
          Commentaire (optionnel)
        </Label>
        <Textarea
          id="commentaire"
          placeholder="Ajoute un commentaire..."
          className="bg-white border-gray-200 focus:border-[#548C2F] focus:ring-[#548C2F]/20 transition-all min-h-[100px]"
          {...register("commentaire")}
          maxLength={1000}
        />
        {errors.commentaire && (
          <p className="text-sm text-rose-500">{errors.commentaire.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="border-gray-200 hover:bg-gray-50"
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#548C2F] hover:bg-[#4a7829] text-white shadow-sm"
        >
          {isPending ? <Spinner size="sm" /> : submitLabel}
        </Button>
      </div>
    </form>
  );

  if (showScrollArea) {
    return <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">{formContent}</ScrollArea>;
  }

  return formContent;
}
