import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Enfant,
  ClasseEnfantActif,
} from "@/services/controllers/types/common/parent.types";

interface EnfantActifStore {
  enfantActif: Enfant | null;
  classeEnfantActif: ClasseEnfantActif | null;
  setEnfantActif: (
    enfant: Enfant | null,
    classe: ClasseEnfantActif | null,
  ) => void;
  clearEnfantActif: () => void;
}

/**
 * Store Zustand pour gérer l'enfant actif du parent.
 * Persiste dans le localStorage pour éviter de perdre la sélection au rafraîchissement.
 */
export const useEnfantActif = create<EnfantActifStore>()(
  persist(
    (set) => ({
      enfantActif: null,
      classeEnfantActif: null,

      setEnfantActif: (enfant, classe) => {
        set({ enfantActif: enfant, classeEnfantActif: classe });
      },

      clearEnfantActif: () => {
        set({ enfantActif: null, classeEnfantActif: null });
      },
    }),
    {
      name: "enfant-actif-storage",
    },
  ),
);
