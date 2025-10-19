"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/services/hooks/use-media-query";
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

interface AddNoteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddNoteModal({ isOpen, onOpenChange }: AddNoteModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
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

  const onSubmit = (data: NoteFormData) => {
    addNote(
      { ...data, chapitres_ids: selectedChapitres },
      {
        onSuccess: () => {
          reset();
          setSelectedChapitres([]);
          onOpenChange(false);
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

  const content = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Matière */}
      <div className="space-y-2">
        <Label htmlFor="matiere_id">
          Matière <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => setValue("matiere_id", parseInt(value))}
        >
          <SelectTrigger id="matiere_id">
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
          <p className="text-sm text-red-500">{errors.matiere_id.message}</p>
        )}
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note">
          Note /20 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="note"
          type="number"
          step="0.25"
          min="0"
          max="20"
          placeholder="Ex: 15.5"
          {...register("note", { valueAsNumber: true })}
        />
        {errors.note && (
          <p className="text-sm text-red-500">{errors.note.message}</p>
        )}
      </div>

      {/* Type d'évaluation */}
      <div className="space-y-2">
        <Label htmlFor="type_evaluation">
          Type d'évaluation <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => setValue("type_evaluation", value as any)}
        >
          <SelectTrigger id="type_evaluation">
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
          <p className="text-sm text-red-500">
            {errors.type_evaluation.message}
          </p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date_evaluation">
          Date de l'évaluation <span className="text-red-500">*</span>
        </Label>
        <Input
          id="date_evaluation"
          type="date"
          {...register("date_evaluation")}
          max={new Date().toISOString().split("T")[0]}
        />
        {errors.date_evaluation && (
          <p className="text-sm text-red-500">
            {errors.date_evaluation.message}
          </p>
        )}
      </div>

      {/* Chapitres */}
      {watchedMatiereId && chapitresData && chapitresData.length > 0 && (
        <div className="space-y-2">
          <Label>Chapitres concernés (optionnel)</Label>
          <ScrollArea className="h-32 border rounded-md p-3">
            <div className="space-y-2">
              {chapitresData.map((chapitre) => (
                <div key={chapitre.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`chapitre-${chapitre.id}`}
                    checked={selectedChapitres.includes(chapitre.id)}
                    onCheckedChange={() => handleChapitreToggle(chapitre.id)}
                  />
                  <Label
                    htmlFor={`chapitre-${chapitre.id}`}
                    className="text-sm font-normal cursor-pointer"
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
        <Label htmlFor="commentaire">Commentaire (optionnel)</Label>
        <Textarea
          id="commentaire"
          placeholder="Ajoute un commentaire..."
          {...register("commentaire")}
          maxLength={1000}
        />
        {errors.commentaire && (
          <p className="text-sm text-red-500">{errors.commentaire.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#2C3E50] hover:bg-[#1a252f]"
        >
          {isPending ? <Spinner size="sm" /> : "Ajouter"}
        </Button>
      </div>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Ajouter une note de classe</DialogTitle>
            <DialogDescription>
              Enregistre une nouvelle note obtenue en classe.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)]">
            {content}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Ajouter une note de classe</DrawerTitle>
          <DrawerDescription>
            Enregistre une nouvelle note obtenue en classe.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="px-4 pb-4 max-h-[80vh]">{content}</ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
