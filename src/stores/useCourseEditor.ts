import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Type pour représenter un brouillon de cours
 */
export type CourseDraft = {
  id?: number; // ID du cours si c'est une édition
  titre: string;
  chapitre_id: number | null;
  classe_id: number | null;
  lexical_state: any;
  lastSaved: number; // Timestamp
};

/**
 * Interface pour le store de l'éditeur de cours
 */
interface CourseEditorStore {
  // État actuel du brouillon
  draft: CourseDraft | null;

  // Indicateur de modification non sauvegardée
  hasUnsavedChanges: boolean;

  // Actions
  setDraft: (draft: CourseDraft) => void;
  updateDraft: (partial: Partial<CourseDraft>) => void;
  clearDraft: () => void;
  markAsSaved: () => void;
  markAsUnsaved: () => void;
  getDraft: (courseId?: number) => CourseDraft | null;
}

/**
 * Store Zustand pour gérer l'état de l'éditeur de cours.
 * Persiste les brouillons dans le localStorage pour éviter la perte de données.
 *
 * @example
 * // Dans un composant
 * const { draft, setDraft, hasUnsavedChanges } = useCourseEditor();
 *
 * // Sauvegarder un brouillon
 * setDraft({
 *   titre: "Mon cours",
 *   chapitre_id: 1,
 *   classe_id: 1,
 *   lexical_state: editorState.toJSON(),
 *   lastSaved: Date.now()
 * });
 *
 * // Mettre à jour partiellement
 * updateDraft({ titre: "Nouveau titre" });
 *
 * // Nettoyer après sauvegarde réussie
 * clearDraft();
 */
export const useCourseEditor = create<CourseEditorStore>()(
  persist(
    (set, get) => ({
      draft: null,
      hasUnsavedChanges: false,

      setDraft: (draft) =>
        set({
          draft,
          hasUnsavedChanges: false,
        }),

      updateDraft: (partial) =>
        set((state) => ({
          draft: state.draft
            ? { ...state.draft, ...partial, lastSaved: Date.now() }
            : null,
          hasUnsavedChanges: true,
        })),

      clearDraft: () =>
        set({
          draft: null,
          hasUnsavedChanges: false,
        }),

      markAsSaved: () =>
        set((state) => ({
          draft: state.draft
            ? { ...state.draft, lastSaved: Date.now() }
            : null,
          hasUnsavedChanges: false,
        })),

      markAsUnsaved: () =>
        set({
          hasUnsavedChanges: true,
        }),

      getDraft: (courseId) => {
        const { draft } = get();
        if (!courseId) return draft;
        return draft?.id === courseId ? draft : null;
      },
    }),
    {
      name: "course-editor-storage",
      partialize: (state) => ({
        draft: state.draft,
      }),
    },
  ),
);
