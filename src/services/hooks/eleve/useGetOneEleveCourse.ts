import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/services/hooks/auth/useSession";
import { getOneEleveCourse } from "@/services/controllers/cours.controller";

export const useGetOneEleveCourse = (courseId: number) => {
  const { user } = useSession();

  return useQuery({
    queryKey: ["eleve-course", user?.id, courseId],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      return getOneEleveCourse(user.id, courseId);
    },
    enabled: !!user?.id && !!courseId,
  });
};