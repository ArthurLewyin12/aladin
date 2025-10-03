import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupQuiz } from "@/services/controllers/groupe.controller";
import {
  CreateGroupQuizPayload,
  CreateGroupQuizResponse,
} from "@/services/controllers/types/common";
import { toast } from "sonner";

export const useCreateGroupQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateGroupQuizResponse, Error, CreateGroupQuizPayload>({
    mutationFn: createGroupQuiz,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["group-details"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
