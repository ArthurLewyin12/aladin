import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupQuiz } from "@/services/controllers/groupe.controller";
import { CreateGroupQuizPayload } from "@/services/controllers/types/common";
import { toast } from "sonner";
import { AxiosError } from "axios";

/**
 * Hook de mutation pour créer un nouveau quiz pour un groupe.
 * Inclut une logique de retry pour gérer les erreurs serveur temporaires (500).
 */
export const useCreateGroupQuiz = () => {
  return useMutation({
    mutationFn: (payload: CreateGroupQuizPayload) => createGroupQuiz(payload),
    
    // Stratégie de retry
    retry: (failureCount, error) => {
      const axiosError = error as AxiosError;
      // Ne pas réessayer pour les erreurs client (4xx) sauf 429, ou si on a déjà réessayé 4 fois.
      if (axiosError.response) {
        const statusCode = axiosError.response.status;
        if (statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
          return false;
        }
      }
      return failureCount < 4;
    },

    // Délai exponentiel entre les tentatives
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    onSuccess: () => {
      toast.success("Quiz de groupe créé avec succès !");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "La génération du quiz a échoué après plusieurs tentatives.";
      toast.error(errorMessage);
    },
  });
};
