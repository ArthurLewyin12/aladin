import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { toggleClassMessage } from "@/services/controllers/professeur.controller";
import { ToggleClassMessageResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseToggleClassMessageParams {
  classeId: number;
  messageId: number;
}

export const useToggleClassMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<ToggleClassMessageResponse, unknown, UseToggleClassMessageParams>({
    mutationFn: ({ classeId, messageId }) => toggleClassMessage(classeId, messageId),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || `Message ${data.is_active ? "activé" : "désactivé"} avec succès !`,
      });

      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: createQueryKey("professeur", "classes", variables.classeId.toString(), "messages"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors du changement de statut du message.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
