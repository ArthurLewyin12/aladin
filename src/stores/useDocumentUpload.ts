import { create } from "zustand";

interface DocumentUploadStore {
  pendingDocument: File | null;
  setPendingDocument: (file: File | null) => void;
  clearPendingDocument: () => void;
}

/**
 * Store Zustand pour gérer temporairement un document uploadé
 * avant la génération d'un cours ou d'un quiz.
 *
 * Usage:
 * 1. Page de sélection: setPendingDocument(file)
 * 2. Navigation vers la page de génération
 * 3. Page de génération: utilise pendingDocument
 * 4. Après utilisation: clearPendingDocument()
 */
export const useDocumentUpload = create<DocumentUploadStore>((set) => ({
  pendingDocument: null,

  setPendingDocument: (file: File | null) => {
    set({ pendingDocument: file });
  },

  clearPendingDocument: () => {
    set({ pendingDocument: null });
  },
}));
