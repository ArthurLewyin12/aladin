import { useMutation } from "@tanstack/react-query";
import { submitGroupQuiz } from "@/services/controllers/groupe.controller";
import { QuizSubmitPayload } from "@/services/controllers/types/common";

/**
 * Hook de mutation pour soumettre les réponses d'un quiz de groupe.
 */
export const useSubmitGroupQuiz = () => {
  return useMutation({
    mutationFn: ({
      quizId,
      payload,
    }: {
      quizId: number;
      payload: QuizSubmitPayload;
    }) => submitGroupQuiz({ quizId, payload }),
  });
};
