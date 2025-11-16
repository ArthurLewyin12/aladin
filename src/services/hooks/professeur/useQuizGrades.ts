import { useQuery } from "@tanstack/react-query";
import { getQuizNotes } from "@/services/controllers/professeur.controller";
import { GetQuizNotesResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

export const useQuizGrades = (quizId: number) => {
  return useQuery<GetQuizNotesResponse>({
    queryKey: createQueryKey("professeur", "quiz", quizId.toString(), "notes"),
    queryFn: () => getQuizNotes(quizId),
    enabled: !!quizId && quizId > 0,
  });
};
