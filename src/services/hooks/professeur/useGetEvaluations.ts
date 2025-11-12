import { useQuery } from "@tanstack/react-query";
import { getEvaluations } from "@/services/controllers/professeur.controller";
import { GetEvaluationsResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

export const useGetEvaluations = (classeId: number) => {
  return useQuery<GetEvaluationsResponse>({
    queryKey: createQueryKey("professeur", "classes", classeId.toString(), "evaluations"),
    queryFn: () => getEvaluations(classeId),
    enabled: !!classeId,
  });
};
