import { useQuery } from "@tanstack/react-query";
import { getEvaluationNotes } from "@/services/controllers/professeur.controller";
import { GetEvaluationNotesResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

export const useGetEvaluationNotes = (classeId: number, evaluationId: number) => {
  return useQuery<GetEvaluationNotesResponse>({
    queryKey: createQueryKey("professeur", "classes", classeId.toString(), "evaluations", evaluationId.toString(), "notes"),
    queryFn: () => getEvaluationNotes(classeId, evaluationId),
    enabled: !!classeId && !!evaluationId,
  });
};
