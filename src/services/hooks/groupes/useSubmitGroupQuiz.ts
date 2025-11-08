import { useMutation } from "@tanstack/react-query";
import { submitGroupQuiz } from "@/services/controllers/groupe.controller";
import { QuizSubmitPayload } from "@/services/controllers/types/common";

/**
 * Hook de mutation pour soumettre les réponses d'un quiz de groupe.
 */
export const useSubmitGroupQuiz = () => {
  return useMutation({
    mutationFn: ({
      groupeId,
      quizId,
      payload,
    }: {
      groupeId: number;
      quizId: number;
      payload: QuizSubmitPayload;
    }) => submitGroupQuiz({ groupeId, quizId, payload }),
  });
};
