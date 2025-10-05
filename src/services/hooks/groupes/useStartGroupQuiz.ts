import { useMutation } from "@tanstack/react-query";
import { startGroupQuiz } from "@/services/controllers/groupe.controller";

/**
 * Hook de mutation pour démarrer une session de quiz pour un groupe.
 */
export const useStartGroupQuiz = () => {
  return useMutation({
    mutationFn: ({ groupeId, quizId }: { groupeId: number; quizId: number }) =>
      startGroupQuiz({ groupeId, quizId }),
  });
};
