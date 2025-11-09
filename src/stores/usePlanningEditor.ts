import { create } from "zustand";
import { StudyPlan } from "@/services/controllers/types/common";

interface PlanningEditorState {
  editingPlan: StudyPlan | null;
  setEditingPlan: (plan: StudyPlan | null) => void;
  clearEditingPlan: () => void;
}

export const usePlanningEditor = create<PlanningEditorState>((set) => ({
  editingPlan: null,
  setEditingPlan: (plan) => set({ editingPlan: plan }),
  clearEditingPlan: () => set({ editingPlan: null }),
}));
