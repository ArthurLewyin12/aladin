import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { activateQuiz } from "@/services/controllers/professeur.controller";
import { ActivateQuizResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseActivateQuizParams {
  classeId: number;
  quizId: number;
}

export const useActivateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<ActivateQuizResponse, unknown, UseActivateQuizParams>({
    mutationFn: ({ classeId, quizId }) => activateQuiz(classeId, quizId),
    onMutate: async ({ classeId, quizId }) => {
      // Annuler les requêtes en cours pour éviter qu'elles écrasent notre mise à jour optimiste
      const queryKey = createQueryKey("professeur", "classes", classeId.toString());
      await queryClient.cancelQueries({ queryKey });

      // Sauvegarder l'ancienne valeur pour rollback en cas d'erreur
      const previousData = queryClient.getQueryData(queryKey);

      // Mise à jour optimiste : modifier l'état du quiz immédiatement
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.quizzes) return old;

        return {
          ...old,
          quizzes: old.quizzes.map((quiz: any) =>
            quiz.id === quizId ? { ...quiz, is_active: true } : quiz
          ),
        };
      });

      // Retourner le contexte pour rollback si nécessaire
      return { previousData, queryKey };
    },
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Quiz activé avec succès !",
      });

      // Invalider les queries pour rafraîchir les données depuis le serveur
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", variables.classeId.toString()),
      });
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", "with-details"),
      });
    },
    onError: (error: any, variables, context: any) => {
      // Rollback en cas d'erreur
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }

      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de l'activation du quiz.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};

