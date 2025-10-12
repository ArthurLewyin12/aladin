import { getOneCourse } from "@/services/controllers/cours.controller";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook pour récupérer un cours unique par son ID.
 * @param courseId - L'ID du cours à récupérer
 * @param options - Options pour la query (enabled, etc.)
 * @returns Une query contenant le cours complet
 */
export const useGetOneCourse = (
  courseId: number | null,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["oneCourse", courseId],
    queryFn: () => getOneCourse(courseId!),
    enabled: !!courseId && (options?.enabled ?? true),
  });
};
