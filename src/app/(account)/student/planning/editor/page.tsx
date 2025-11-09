"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { ArrowLeft, Trash2 } from "lucide-react";

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
import { useSession } from "@/services/hooks/auth/useSession";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import { useStudyPlans } from "@/services/hooks/study-plan/useStudyPlans";
import { useCreateStudyPlan } from "@/services/hooks/study-plan/useCreateStudyPlan";
import { useUpdateStudyPlan } from "@/services/hooks/study-plan/useUpdateStudyPlan";
import { useDeleteStudyPlan } from "@/services/hooks/study-plan/useDeleteStudyPlan";
import { usePlanningEditor } from "@/stores/usePlanningEditor";

const planSchema = z
  .object({
    matiere_id: z.string().min(1, "La matière est requise."),
    chapitre_ids: z
      .array(z.string())
      .min(1, "Au moins un chapitre est requis."),
    start_time: z
      .string()
      .min(1, "L'heure de début est requise.")
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide"),
    end_time: z
      .string()
      .min(1, "L'heure de fin est requise.")
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide"),
    weekday: z.number(),
  })
  .refine(
    (data) => {
      if (data.start_time && data.end_time) {
        return data.end_time > data.start_time;
      }
      return true;
    },
    {
      message: "L'heure de fin doit être après l'heure de début",
      path: ["end_time"],
    },
  );

type PlanFormValues = z.infer<typeof planSchema>;

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

// Utility function to ensure time is in HH:mm format without seconds
const formatTimeToHHMM = (time: string | null | undefined): string => {
  if (!time) return "";
  // Remove seconds if present (HH:mm:ss -> HH:mm)
  return time.substring(0, 5);
};

export default function PlanningEditorPage() {
  const router = useRouter();

  const [params] = useQueryStates({
    id: parseAsInteger,
    day: parseAsInteger,
    time: parseAsString,
  });

  const { id: planId, day, time } = params;
  const isEditMode = !!planId;
  const { user } = useSession();

  const { editingPlan, clearEditingPlan } = usePlanningEditor();
  const { data: plansData } = useStudyPlans();
  const { data: matieresData, isLoading: isLoadingMatieres } =
    useMatieresByNiveau(user?.niveau?.id || 0);
  const createPlanMutation = useCreateStudyPlan();
  const updatePlanMutation = useUpdateStudyPlan();
  const deletePlanMutation = useDeleteStudyPlan();

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      matiere_id: "",
      chapitre_ids: [],
      start_time: "",
      end_time: "",
      weekday: 1,
    },
  });

  const watchedMatiereId = form.watch("matiere_id");
  const { data: chapitresData, isLoading: isLoadingChapitres } =
    useChapitresByMatiere(Number(watchedMatiereId));

  React.useEffect(() => {
    // En mode édition, utiliser le plan du store en priorité
    if (isEditMode && matieresData) {
      const plan = editingPlan || plansData?.plans.find((p) => p.id === planId);

      console.log("=== DEBUG PLAN EDITOR ===");
      console.log("planId:", planId);
      console.log("editingPlan depuis store:", editingPlan);
      console.log("plan utilisé:", plan);

      if (plan) {
        // Extraire l'ID de la matière - peut être plan.matiere.id ou plan.matiere_id
        const matiereId =
          (plan.matiere as any)?.id || (plan as any).matiere_id || "";

        // Extraire les IDs des chapitres
        const chapitreIds = plan.chapitre_ids
          ? plan.chapitre_ids.map(String)
          : plan.chapitres?.map((ch: any) => String(ch.id)) || [];

        console.log("matiereId extrait:", matiereId);
        console.log("chapitreIds extraits:", chapitreIds);

        form.reset({
          matiere_id: String(matiereId),
          chapitre_ids: chapitreIds,
          start_time: formatTimeToHHMM(plan.start_time),
          end_time: formatTimeToHHMM(plan.end_time),
          weekday: plan.weekday,
        });
      }
    } else if (day && time) {
      // Mode création
      form.reset({
        matiere_id: "",
        chapitre_ids: [],
        start_time: formatTimeToHHMM(time),
        end_time: "",
        weekday: day,
      });
    }
  }, [
    isEditMode,
    planId,
    editingPlan,
    plansData,
    day,
    time,
    form,
    matieresData,
  ]);

  const onSubmit = (values: PlanFormValues) => {
    // Format times to ensure HH:mm format
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    };

    const payload = {
      ...values,
      matiere_id: Number(values.matiere_id),
      chapitre_ids: values.chapitre_ids.map(Number),
      start_time: formatTime(values.start_time),
      end_time: formatTime(values.end_time),
    };

    if (isEditMode && planId) {
      updatePlanMutation.mutate(
        { id: planId, payload },
        {
          onSuccess: () => {
            clearEditingPlan();
            router.push("/student/planning");
          },
        },
      );
    } else {
      createPlanMutation.mutate(payload, {
        onSuccess: () => {
          clearEditingPlan();
          router.push("/student/planning");
        },
      });
    }
  };

  const handleDelete = () => {
    if (planId) {
      deletePlanMutation.mutate(planId, {
        onSuccess: () => {
          clearEditingPlan();
          router.push("/student/planning");
        },
      });
    }
  };

  const handleBack = () => {
    clearEditingPlan();
    router.push("/student/planning");
  };

  const weekday = form.watch("weekday");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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
              {isEditMode ? "Modifier le créneau" : "Nouveau créneau"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {weekday !== undefined && DAYS[weekday - 1]}
            </p>
          </div>
        </div>

        {/* Form */}
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                        <FormLabel>Chapitres</FormLabel>
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

              {/* Horaires Card */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure de début</FormLabel>
                        <FormControl>
                          <Input type="time" step="60" {...field} />
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
                          <Input type="time" step="60" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {isEditMode && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    className="sm:mr-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                )}
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
                    disabled={
                      createPlanMutation.isPending ||
                      updatePlanMutation.isPending
                    }
                  >
                    {createPlanMutation.isPending ||
                    updatePlanMutation.isPending
                      ? "Enregistrement..."
                      : "Enregistrer"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
