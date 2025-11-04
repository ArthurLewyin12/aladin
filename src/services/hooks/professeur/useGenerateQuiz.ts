import { useMutation } from "@tanstack/react-query";
import { generateQuiz } from "@/services/controllers/professeur.controller";
import { GenerateQuizPayload } from "@/services/controllers/types/common/professeur.types";

interface UseGenerateQuizProps {
  classeId: number;
  payload: GenerateQuizPayload;
}

export const useGenerateQuiz = () => {
  return useMutation({
    mutationFn: ({ classeId, payload }: UseGenerateQuizProps) =>
      generateQuiz(classeId, payload),
  });
};
