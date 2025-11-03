"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useMediaQuery } from "@/services/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { StudyPlan } from "@/services/controllers/types/common";
import { useSession } from "@/services/hooks/auth/useSession";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { MultipleSelect, TTag } from "@/components/ui/multiple-selects";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
const planSchema = z.object({
  matiere_id: z.string().min(1, "La matière est requise."),
  chapitre_ids: z.array(z.string()).min(1, "Au moins un chapitre est requis."),
  start_time: z.string().min(1, "L\'heure de début est requise."),
  end_time: z.string().min(1, "L\'heure de fin est requise."),
  weekday: z.number(),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface PlanEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: StudyPlan | null;
  slotInfo?: { day: number; time: string } | null;
  onCreate: (data: any) => void;
  onUpdate: (data: any) => void;
  onDelete: (id: number) => void;
}

export function PlanEditor({
  open,
  onOpenChange,
  plan,
  slotInfo,
  onCreate,
  onUpdate,
  onDelete,
}: PlanEditorProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isEditMode = !!plan;

  const { user } = useSession();
  const { data: matieresData, isLoading: isLoadingMatieres } =
    useMatieresByNiveau(user?.niveau?.id || 0);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      chapitre_ids: [],
    },
  });

  const watchedMatiereId = form.watch("matiere_id");
  const { data: chapitresData, isLoading: isLoadingChapitres } =
    useChapitresByMatiere(Number(watchedMatiereId));

  React.useEffect(() => {
    if (plan) {
      // Edit mode
      form.reset({
        matiere_id: String(plan.matiere.id),
        chapitre_ids: plan.chapitre_ids.map(String),
        start_time: plan.start_time.substring(0, 5),
        end_time: plan.end_time.substring(0, 5),
        weekday: plan.weekday,
      });
    } else if (slotInfo) {
      // Create mode
      form.reset({
        matiere_id: "",
        chapitre_ids: [],
        start_time: slotInfo.time,
        end_time: "",
        weekday: slotInfo.day,
      });
    }
  }, [plan, slotInfo, form]);

  const onSubmit = (values: PlanFormValues) => {
    const payload = {
      ...values,
      matiere_id: Number(values.matiere_id),
      chapitre_ids: values.chapitre_ids.map(Number),
    };

    if (isEditMode) {
      onUpdate({ id: plan.id, payload });
    } else {
      onCreate(payload);
    }
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (plan) {
      onDelete(plan.id);
      onOpenChange(false);
    }
  };

  const formFields = (
    <Form {...form}>
      <form
        id="plan-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 px-4 sm:px-0"
      >
        <FormField
          control={form.control}
          name="matiere_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matière</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("chapitre_ids", []); // Reset chapters on subject change
                }}
                value={field.value || undefined}
                disabled={isLoadingMatieres}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingMatieres
                          ? "Chargement..."
                          : "Sélectionner une matière"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {matieresData?.matieres.map((matiere) => (
                    <SelectItem key={matiere.id} value={String(matiere.id)}>
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
                <FormLabel>Chapitres</FormLabel>
                <div className="text-xs text-blue-500 mb-2">
                  Debug: {isLoadingChapitres ? 'Loading' : 'Not loading'} |
                  Matiere: {watchedMatiereId || 'none'} |
                  Chapters: {chapterTags.length}
                </div>
                {!watchedMatiereId ? (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-600">
                    Veuillez sélectionner une matière d'abord.
                  </div>
                ) : isLoadingChapitres ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-gray-600">
                    Chargement des chapitres...
                  </div>
                ) : chapterTags.length === 0 ? (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
                    Aucun chapitre trouvé pour cette matière.
                  </div>
                ) : (
                  <div className="border-2 border-green-500 p-2">
                    <div className="text-xs text-green-600 mb-2">MultipleSelect should appear below:</div>
                    <MultipleSelect
                      key={`${watchedMatiereId}-${selectedTags.map(t => t.key).join(',')}`}
                      tags={chapterTags}
                      defaultValue={selectedTags}
                      onChange={(tags) => {
                        field.onChange(tags.map((tag) => tag.key));
                      }}
                      showLabel={false}
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de début</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de fin</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Modifier le créneau" : "Ajouter un créneau"}
            </DialogTitle>
            <DialogDescription>
              Organisez votre semaine d'étude pour rester au top.
            </DialogDescription>
          </DialogHeader>
          {formFields}
          <DialogFooter>
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto"
              >
                Supprimer
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              form="plan-form"
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {isEditMode ? "Modifier le créneau" : "Ajouter un créneau"}
          </DrawerTitle>
          <DrawerDescription>
            Organisez votre semaine d'étude pour rester au top.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{formFields}</div>
        <DrawerFooter>
          {isEditMode && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="mr-auto"
            >
              Supprimer
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 hover:bg-gray-50"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            form="plan-form"
            className="bg-[#2C3E50] hover:bg-[#1a252f] text-white"
          >
            Enregistrer
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
