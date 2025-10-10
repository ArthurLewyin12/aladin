import { getAllUserGeneratedCourses } from "@/services/controllers/cours.controller";
import { useQuery } from "@tanstack/react-query";

/**
 * hook pour récupérer toutes les courses générées par les utilisateurs.
 * @returns  return une queryFn composé des courses
 */

export const useGetAllCourses = () => {
  return useQuery({
    queryKey: ["allCourses"],
    queryFn: getAllUserGeneratedCourses,
  });
};
