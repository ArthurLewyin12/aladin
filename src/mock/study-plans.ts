import { StudyPlan } from "@/services/controllers/types/common/study-plan.types";

export const MOCK_STUDY_PLANS: StudyPlan[] = [
  {
    id: 1,
    weekday: 1, // Monday
    start_time: "09:00",
    end_time: "10:00",
    matiere: { id: 1, libelle: "Mathématiques" },
    chapitre_ids: [101],
    chapitres: [{ id: 101, libelle: "Algèbre Linéaire" }],
  },
  {
    id: 2,
    weekday: 1, // Monday
    start_time: "10:30",
    end_time: "11:30",
    matiere: { id: 2, libelle: "Physique" },
    chapitre_ids: [201],
    chapitres: [{ id: 201, libelle: "Mécanique Classique" }],
  },
  {
    id: 3,
    weekday: 3, // Wednesday
    start_time: "14:00",
    end_time: "15:30",
    matiere: { id: 1, libelle: "Mathématiques" },
    chapitre_ids: [102],
    chapitres: [{ id: 102, libelle: "Calcul Différentiel" }],
  },
  {
    id: 4,
    weekday: 5, // Friday
    start_time: "16:00",
    end_time: "17:00",
    matiere: { id: 3, libelle: "Histoire" },
    chapitre_ids: [301],
    chapitres: [{ id: 301, libelle: "La Révolution Française" }],
  },
];
