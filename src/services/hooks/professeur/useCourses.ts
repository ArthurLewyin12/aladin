import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";
import { getCourses, getCourse } from "@/services/controllers/professeur.controller";

// Types pour les cours
export interface Course {
  id: number;
  titre: string;
  type?: "manuel" | "genere"; // Type du cours: manuel ou généré par IA
  classe?: {
    id: number;
    nom: string;
  };
  chapitre?: {
    id: number;
    libelle: string;
  };
  matiere?: {
    id: number;
    libelle: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  content?: {
    lexical_state: any;
    plain_text: string;
    metadata: {
      word_count: number;
      has_images: boolean;
      has_tables: boolean;
    };
  };
}

export interface CoursesResponse {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
}

// Hook pour récupérer tous les cours du professeur
export const useCourses = (filters?: {
  classe_id?: number;
  matiere_id?: number;
  is_active?: boolean;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: createQueryKey("courses", filters),
    queryFn: async (): Promise<CoursesResponse> => {
      const response = await getCourses();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer un cours spécifique
export const useCourse = (courseId: number) => {
  return useQuery({
    queryKey: createQueryKey("course", { id: courseId }),
    queryFn: async (): Promise<Course> => {
      const response = await getCourse(courseId);
      return response;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};