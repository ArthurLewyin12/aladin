import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupQuiz } from "@/services/controllers/groupe.controller";
import { GenerateGroupQuizPayload } from "@/services/controllers/types/common/groupe-quiz.types";
import { toast } from "@/lib/toast";
import { AxiosError } from "axios";

/**
 * Hook de mutation pour créer/générer un nouveau quiz pour un groupe.
 * Supporte deux modes:
 * - Sans document: génération basée sur le chapitre
 * - Avec document: génération basée sur le fichier uploadé
 * Inclut une logique de retry pour gérer les erreurs serveur temporaires (500).
 */
export const useCreateGroupQuiz = () => {
  return useMutation({
    mutationFn: (payload: GenerateGroupQuizPayload) => createGroupQuiz(payload),

    // Stratégie de retry
    retry: (failureCount, error) => {
      const axiosError = error as AxiosError;
      // Ne pas réessayer pour les erreurs client (4xx) sauf 429, ou si on a déjà réessayé 4 fois.
      if (axiosError.response) {
        const statusCode = axiosError.response.status;
        // Ne pas retry sur 400 (document invalide), 403 (limite atteinte), 404 (non trouvé)
        if (statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
          return false;
        }
      }
      return failureCount < 4;
    },

    // Délai exponentiel entre les tentatives
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    onSuccess: (data) => {
      if (data.document) {
        toast({
          variant: "success",
          message: "Quiz de groupe généré avec succès à partir du document !",
        });
      } else {
        toast({
          variant: "success",
          message: "Quiz de groupe créé avec succès !",
        });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "La génération du quiz a échoué après plusieurs tentatives.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
