import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";
import { getCourse } from "@/services/controllers/professeur.controller";

/**
 * Hook pour récupérer un cours spécifique.
 *
 * @param {number | null} coursId - ID du cours à récupérer.
 * @returns Le résultat de la requête TanStack Query.
 *
 * @example
 * const { data: course, isLoading } = useCourse(123);
 */
export const useCourse = (coursId: number | null) => {
  return useQuery({
    queryKey: createQueryKey("professeur", "cours", coursId),
    queryFn: () => getCourse(coursId!),
    enabled: coursId !== null,
  });
};
