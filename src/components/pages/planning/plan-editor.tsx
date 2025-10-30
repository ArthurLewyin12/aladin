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
import { MultipleSelector, Option } from "@/components/ui/multiple-select";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
                value={field.value}
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
            const chapterOptions: Option[] =
              chapitresData?.map((chap) => ({
                value: String(chap.id),
                label: chap.libelle,
              })) || [];

            const selectedOptions = chapterOptions.filter((option) =>
              field.value?.includes(option.value),
            );

            return (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <FormItem>
                      <FormLabel>Chapitres</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          value={selectedOptions}
                          onChange={(options) => {
                            field.onChange(options.map((option) => option.value));
                          }}
                          options={chapterOptions}
                          placeholder={
                            isLoadingChapitres
                              ? "Chargement..."
                              : "Sélectionner un ou plusieurs chapitres"
                          }
                          loadingIndicator={
                            isLoadingChapitres && <p>Chargement...</p>
                          }
                          emptyIndicator={
                            <p>Aucun chapitre trouvé pour cette matière.</p>
                          }
                          disabled={isLoadingChapitres || !watchedMatiereId}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!watchedMatiereId && "Veuillez sélectionner une matière d'abord."}
                    {isLoadingChapitres && "Chargement des chapitres..."}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
              <Button type="button" variant="destructive" className="mr-auto">
                Supprimer
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" form="plan-form">
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
            <Button type="button" variant="destructive" className="mr-auto">
              Supprimer
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button type="submit" form="plan-form">
            Enregistrer
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
