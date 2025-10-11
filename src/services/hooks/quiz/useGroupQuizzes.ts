import { useQuery } from "@tanstack/react-query";
import { getGroupQuizzes } from "@/services/controllers/quiz.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer tous les quiz de groupe de l'utilisateur.
 * Utilise TanStack Query pour gérer la mise en cache, le rechargement et les états de la requête.
 *
 * @returns Le résultat de la requête TanStack Query, incluant `data`, `isLoading`, `isError`, etc.
 */
export const useGroupQuizzes = () => {
  return useQuery({
    queryKey: createQueryKey("group-quizzes"),
    queryFn: async () => getGroupQuizzes(),
  });
};
