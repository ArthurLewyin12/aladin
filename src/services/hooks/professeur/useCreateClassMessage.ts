import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { createClassMessage } from "@/services/controllers/professeur.controller";
import { CreateClassMessagePayload, CreateClassMessageResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

interface UseCreateClassMessageParams {
  classeId: number;
  payload: CreateClassMessagePayload;
}

export const useCreateClassMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateClassMessageResponse, unknown, UseCreateClassMessageParams>({
    mutationFn: ({ classeId, payload }) => createClassMessage(classeId, payload),
    onSuccess: (data, variables) => {
      toast({
        variant: "success",
        message: data.message || "Message créé avec succès !",
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
        "Une erreur est survenue lors de la création du message.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
