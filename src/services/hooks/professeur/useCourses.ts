import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";

// Types pour les cours
export interface Course {
  id: number;
  titre: string;
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
      // TODO: Remplacer par l'appel API réel
      // const response = await request.get<CoursesResponse>(`/prof/courses`, { params: filters });

      // Données mockées pour l'instant
      const mockCourses: Course[] = [
        {
          id: 1,
          titre: "Introduction aux dérivées",
          classe: { id: 1, nom: "Terminale S1" },
          chapitre: { id: 45, libelle: "Dérivées" },
          matiere: { id: 102, libelle: "Mathématiques" },
          is_active: true,
          created_at: "2025-01-15T10:00:00.000000Z",
          updated_at: "2025-01-16T14:30:00.000000Z",
        },
        {
          id: 2,
          titre: "Les forces en physique",
          classe: { id: 2, nom: "Terminale S2" },
          chapitre: { id: 67, libelle: "Mécanique" },
          matiere: { id: 103, libelle: "Physique" },
          is_active: false,
          created_at: "2025-01-14T09:15:00.000000Z",
          updated_at: "2025-01-14T09:15:00.000000Z",
        },
        {
          id: 3,
          titre: "Équations du second degré",
          classe: { id: 1, nom: "Terminale S1" },
          chapitre: { id: 23, libelle: "Équations" },
          matiere: { id: 102, libelle: "Mathématiques" },
          is_active: true,
          created_at: "2025-01-13T16:45:00.000000Z",
          updated_at: "2025-01-15T11:20:00.000000Z",
        },
      ];

      return {
        courses: mockCourses,
        total: mockCourses.length,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer un cours spécifique
export const useCourse = (courseId: number) => {
  return useQuery({
    queryKey: createQueryKey("course", { id: courseId }),
    queryFn: async (): Promise<Course> => {
      // TODO: Remplacer par l'appel API réel
      // const response = await request.get<Course>(`/prof/courses/${courseId}/rich`);

      // Données mockées pour l'instant
      const mockCourse: Course = {
        id: courseId,
        titre: "Introduction aux dérivées",
        classe: { id: 1, nom: "Terminale S1" },
        chapitre: { id: 45, libelle: "Dérivées" },
        matiere: { id: 102, libelle: "Mathématiques" },
        is_active: true,
        created_at: "2025-01-15T10:00:00.000000Z",
        updated_at: "2025-01-16T14:30:00.000000Z",
        content: {
          lexical_state: {},
          plain_text: "Contenu du cours sur les dérivées...",
          metadata: {
            word_count: 1250,
            has_images: true,
            has_tables: false,
          },
        },
      };

      return mockCourse;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};