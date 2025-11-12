import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { updateClassMessage } from "@/services/controllers/professeur.controller";
import { UpdateClassMessagePayload, UpdateClassMessageResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseUpdateClassMessageParams {
  classeId: number;
  messageId: number;
  payload: UpdateClassMessagePayload;
}

export const useUpdateClassMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateClassMessageResponse, unknown, UseUpdateClassMessageParams>({
    mutationFn: ({ classeId, messageId, payload }) =>
      updateClassMessage(classeId, messageId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Message mis à jour avec succès !",
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
        "Une erreur est survenue lors de la mise à jour du message.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
