import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
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
import { createQueryKey } from "@/lib/request";

/**
 * Hook de requête pour récupérer l'historique des quiz de l'utilisateur.
 */
export const useQuizHistory = () => {
  return useQuery({
    queryKey: createQueryKey("quizHistory"),
    queryFn: getQuizHistory,
  });
};

/**
 * Hook de mutation pour générer un nouveau quiz.
 * Inclut une logique de retry intelligente pour gérer l'instabilité de l'API :
 * - 5 tentatives au total (1 initiale + 4 retries).
 * - Le délai entre les tentatives est exponentiel (1s, 2s, 4s...).
 * - Les tentatives s'arrêtent si l'API retourne une erreur 429 (Too Many Requests).
 */
export const useGenerateQuiz = () => {
  return useMutation({
    mutationFn: (payload: QuizGeneratePayload) => generateQuiz(payload),

    // Nouvelle stratégie de retry
    retry: (failureCount, error) => {
      // Si l'erreur est un 429, on arrête les tentatives.
      if ((error as AxiosError)?.response?.status === 429) {
        return false;
      }
      // Sinon, on continue jusqu'à 4 retries (5 tentatives au total).
      return failureCount < 4;
    },

    // Délai exponentiel entre les tentatives (ex: 1s, 2s, 4s, 8s)
    retryDelay: (attemptIndex) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook de mutation pour démarrer une session de quiz.
 */
export const useStartQuiz = () => {
  return useMutation({
    mutationFn: (quizId: number) => startQuiz(quizId),
  });
};

/**
 * Hook de requête pour récupérer les détails d'un quiz spécifique.
 * @param {number} quizId - L'ID du quiz à récupérer.
 */
export const useQuiz = (quizId: number) => {
  return useQuery({
    queryKey: createQueryKey("quiz", quizId),
    queryFn: () => getQuiz(quizId),
    enabled: !!quizId, // La requête ne s'exécute que si quizId est fourni.
  });
};

/**
 * Hook de mutation pour supprimer un quiz.
 */
export const useDeleteQuiz = () => {
  return useMutation({
    mutationFn: (quizId: number) => deleteQuiz(quizId),
  });
};

/**
 * Hook de mutation pour soumettre les réponses d'un quiz.
 */
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

/**
 * Hook de requête pour récupérer les notes et résultats d'un quiz.
 * @param {number} quizId - L'ID du quiz concerné.
 */
export const useQuizNotes = (quizId: number) => {
  return useQuery({
    queryKey: createQueryKey("quizNotes", quizId),
    queryFn: () => getQuizNotes(quizId),
    enabled: !!quizId, // La requête ne s'exécute que si quizId est fourni.
  });
};