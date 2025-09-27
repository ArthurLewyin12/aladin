import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getQuizHistory,
  startQuiz,
  getQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizNotes,
  generateQuiz,
} from "@/services/controllers/quiz.controller";
import {
  QuizSubmitPayload,
  QuizGeneratePayload,
} from "@/services/controllers/types/common";

export const useQuizHistory = () => {
  return useQuery({
    queryKey: ["quizHistory"],
    queryFn: getQuizHistory,
  });
};

export const useGenerateQuiz = () => {
  return useMutation({
    mutationFn: (payload: QuizGeneratePayload) => generateQuiz(payload),
  });
};

export const useStartQuiz = () => {
  return useMutation({
    mutationFn: (quizId: number) => startQuiz(quizId),
  });
};

export const useQuiz = (quizId: number) => {
  return useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuiz(quizId),
    enabled: !!quizId,
  });
};

export const useDeleteQuiz = () => {
  return useMutation({
    mutationFn: (quizId: number) => deleteQuiz(quizId),
  });
};

export const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: ({
      quizId,
      payload,
    }: {
      quizId: number;
      payload: QuizSubmitPayload;
    }) => submitQuiz(quizId, payload),
  });
};

export const useQuizNotes = (quizId: number) => {
  return useQuery({
    queryKey: ["quizNotes", quizId],
    queryFn: () => getQuizNotes(quizId),
    enabled: !!quizId,
  });
};
