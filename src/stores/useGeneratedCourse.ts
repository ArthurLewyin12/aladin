import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GeneratedCourseData {
  selectedClass: string;
  selectedMatiere: string;
  selectedChapter: string;
  generatedCourse: any;
}

interface GeneratedCourseStore {
  generatedCourse: GeneratedCourseData | null;
  setGeneratedCourse: (data: GeneratedCourseData) => void;
  clearGeneratedCourse: () => void;
}

export const useGeneratedCourse = create<GeneratedCourseStore>()(
  persist(
    (set) => ({
      generatedCourse: null,
      setGeneratedCourse: (data: GeneratedCourseData) => {
        set({ generatedCourse: data });
      },
      clearGeneratedCourse: () => {
        set({ generatedCourse: null });
      },
    }),
    {
      name: "generated-course-storage",
    }
  )
);
