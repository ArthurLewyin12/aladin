import { useQuery } from "@tanstack/react-query";
import { getGroupQuizNotes } from "@/services/controllers/groupe.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer les notes d'un quiz de groupe.
 */
export const useGroupQuizNotes = ({
  groupeId,
  quizId,
}: {
  groupeId: number;
  quizId: number;
}) => {
  return useQuery({
    queryKey: createQueryKey(
      "groupQuizNotes",
      String(groupeId),
      String(quizId),
    ),
    queryFn: () => getGroupQuizNotes({ groupeId, quizId }),
    enabled: !!groupeId && !!quizId, // La requête ne s'exécute que si les IDs sont fournis
  });
};
