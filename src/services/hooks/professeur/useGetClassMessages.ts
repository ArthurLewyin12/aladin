import { useQuery } from "@tanstack/react-query";
import { getClassMessages } from "@/services/controllers/professeur.controller";
import { GetClassMessagesResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

export const useGetClassMessages = (classeId: number) => {
  return useQuery<GetClassMessagesResponse>({
    queryKey: createQueryKey("professeur", "classes", classeId.toString(), "messages"),
    queryFn: () => getClassMessages(classeId),
    enabled: !!classeId,
  });
};
